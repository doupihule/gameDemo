import FogLogicalControler from "./FogLogicalControler";
import FogInstanceCell from "../instance/FogInstanceCell";
import LogsManager from "../../../framework/manager/LogsManager";
import FogFunc from "../../sys/func/FogFunc";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import GameTools from "../../../utils/GameTools";
import FogModel from "../../sys/model/FogModel";
import FogServer from "../../sys/server/FogServer";
import FogEventTrigger from "../trigger/FogEventTrigger";
import FogConst from "../../sys/consts/FogConst";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import FogPropTrigger from "../trigger/FogPropTrigger";
import FogMistControler from "./FogMistControler";
import StatisticsManager from "../../sys/manager/StatisticsManager";
import TimerManager from "../../../framework/manager/TimerManager";

/**迷雾格子地图控制器 */
export default class FogCellMapControler {

	private fogControler: FogLogicalControler;

	private layer;
	//不能生成格子的y位置
	private delY = [1, 2, 6, 7];
	//不能生成格子的x位置
	private delY2 = [2, 6];

	constructor(fogControler) {
		this.fogControler = fogControler;


	}

	public setData() {
		this.layer = this.fogControler.layer;
		var allCount = FogFunc.row * FogFunc.line;
		//创建格子
		for (var i = 0; i < allCount; i++) {
			var xIndex = i % FogFunc.line + 1;
			var yIndex = FogFunc.row - Math.floor(i / FogFunc.line);
			this.fogControler.createCell({xIndex: xIndex, yIndex: yIndex})
		}

		var cellData = FogModel.instance.getCellInfo();
		//如果没有格子信息 就创建起点和终点
		if (!cellData) {
			this.createStartAndEnd();
			//获取所需敌人数据
			this.getPlayerEnemy(this.freshAllInfo, this);
		} else {
			this.freshAllInfo();
		}
		LogsManager.echo("cell,,,,,,,,,,,,", FogModel.instance.getCellInfo())


	}

	freshAllInfo() {
		if (!this.fogControler) return
		//刷新当前敌人信息
		FogModel.instance.freshEnemyArr();
		this.initCellData();
		this.initBusShow();
	}

	//格子数据显示
	initCellData() {
		//先初始化起始点 因为部分点的初始话要用到起始点的数据
		var start = FogModel.instance.getCellIdByType(FogConst.cellType_Start);
		var end = FogModel.instance.getCellIdByType(FogConst.cellType_End);
		this.fogControler.getCellData(start).initCellData();
		this.fogControler.getCellData(end).initCellData();
		var arr = this.fogControler._cellInstanceArr;
		for (var i = 0; i < arr.length; i++) {
			//跳过起始点的初始话
			if (arr[i].mySign == start || arr[i].mySign == end) continue;
			arr[i].initCellData();
		}
	}

	//车显示
	initBusShow() {
		this.setBusData();
		this.fogControler.myBus = this.fogControler.createBus(null);
	}

	/**创建起点和终点 */
	createStartAndEnd() {
		var lastEnd = FogFunc.fogEndCellSign;
		var start;
		var endx;
		var endy;
		if (lastEnd) {
			lastEnd = lastEnd.split("_")
			var startX = Number(lastEnd[0]);
			var startY = Number(lastEnd[1]);
			if (Number(lastEnd[0]) == 1) {
				startX = FogFunc.line;
			} else if (Number(lastEnd[0]) == FogFunc.line) {
				startX = 1;
			} else if (Number(lastEnd[1]) == 1) {
				startY = FogFunc.row;
			} else if (Number(lastEnd[1]) == FogFunc.row) {
				startY = 1;
			}
			start = startX + "_" + startY;
		} else {
			var startInfo = GlobalParamsFunc.instance.getDataArray("startEnter");
			start = startInfo[0] + "_" + startInfo[1];
		}
		var startStr = start.split("_");
		var x = Number(startStr[0]);
		var y = Number(startStr[1]);
		var xArr = [];
		for (var i = 1; i <= FogFunc.line; i++) {
			xArr.push(i);
		}
		var yArr = [];
		for (var i = 1; i <= FogFunc.row; i++) {
			yArr.push(i);
		}
		if (x == 1 || x == FogFunc.line) {
			//不能和起点同列  起点处于左右两端
			var index = xArr.indexOf(x);
			xArr.splice(index, 1);
			//上下两端的出口只能在中心位置
			endx = 3;
			// //如果在第一列或在最后一列，得去掉不可生成出口的行数
			// if (endx == 1 || endx == FogFunc.line) {
			//     for (var i = yArr.length; i >= 0; i--) {
			//         if (this.delY.indexOf(yArr[i]) != -1) {
			//             yArr.splice(i, 1);
			//         }
			//     }
			//     endy = GameTools.getRandomInArr(yArr).result;
			// } else {
			//     //在中间列，y只能是第一行或者是最后一行
			endy = GameTools.getRandomInArr([1, FogFunc.row]).result;
			// }
		} else if (y == 1 || y == FogFunc.row) {
			//不能和起点同行 起点处于上下
			var index = yArr.indexOf(y);
			yArr.splice(index, 1);
			//去掉不可生成的行数
			for (var i = yArr.length; i >= 0; i--) {
				if (this.delY2.indexOf(yArr[i]) != -1) {
					yArr.splice(i, 1);
				}
			}
			endy = GameTools.getRandomInArr(yArr).result;
			//如果出口的y在第一行或者最后一行，固定在第三列
			if (endy == 1 || endy == FogFunc.row) {
				endx = 3;
			} else {
				endx = GameTools.getRandomInArr([1, FogFunc.line]).result;
			}
		}
		var end = endx + "_" + endy;
		LogsManager.echo("start-------------", start)
		LogsManager.echo("end-------------", end)
		this.fogControler.delCellId(start)
		this.fogControler.delCellId(end)
		FogServer.initCellInfo({id: start, type: FogConst.cellType_Start, ste: 2}, () => {
			var temp = {};
			temp[start] = {ste: 2}
			this.freshTargetCell(temp)
		}, this);
		FogServer.initCellInfo({id: end, type: FogConst.cellType_End}, this.createStartAround, this, true);

	}

	//开启起点上，下，左，右的点
	createStartAround() {
		var start = FogModel.instance.getCellIdByType(FogConst.cellType_Start);
		this.createAround(start, false)
		//初始化所有事件
		this.fogControler.fogCellEventControler.initEvent();
	}

	//初始化大巴车信息
	setBusData() {
		var start = FogModel.instance.getCellIdByType(FogConst.cellType_Start);
		var bus = FogModel.instance.getBusInfo();
		if (!bus || !bus.pos) {
			//放到起点
			FogServer.setBusPos({pos: start})
		}
	}

	/**
	 * 开启四周点
	 * @param id 参照格子id
	 * @param freshState 是否刷新格子ui
	 * @param isAsyc 是否同步
	 * @param ste 格子状态
	 */
	createAround(id, freshState = false, ste = 1) {
		var item = this.fogControler.getCellData(id);
		var tempOpen = {};
		this.openAroundCell(item, "left", tempOpen);
		this.openAroundCell(item, "right", tempOpen);
		this.openAroundCell(item, "up", tempOpen);
		this.openAroundCell(item, "down", tempOpen);
		//有数据变化
		if (Object.keys(tempOpen).length > 0) {

			FogServer.openCell({cell: tempOpen}, () => {
				if (freshState) {
					this.freshTargetCell(tempOpen);
				}
			}, this, false)
		}
	}

	/**刷新指定格子的状态 */
	freshTargetCell(tempOpen) {
		for (var id in tempOpen) {
			var item: FogInstanceCell = this.fogControler.getCellData(id);
			item.freshMyState();
			var state = tempOpen[id];
			if (state) {
				if (state.ste == FogConst.FOG_CELLSTATE_OPEN) {
					this.fogControler.mistControler.onLockOneCell(item.xIndex, item.yIndex);
					//遍历这个item
					item.refreshFogMist();
					var nearPosArr = FogMistControler.rectNearPoints;
					for (var i = 0; i < nearPosArr.length; i++) {
						var tempPos = nearPosArr[i];
						var targetX = item.xIndex + tempPos[0];
						var targetY = item.yIndex + tempPos[1];
						var key = FogFunc.instance.getKeyByPos(targetX, targetY);
						var nearItem: FogInstanceCell = this.fogControler.getCellData(key);

						if (nearItem) {
							nearItem.refreshFogMist();
						}
					}
				}


			}
		}
	}

	/**开启点 */
	openAroundCell(item, pos, tempOpen, ste = 1) {
		var id = item.getAroundCell(pos);
		if (this.fogControler.getCellData(id)) {
			var data = FogModel.instance.getCellInfoById(id);
			if (!data || !data.ste) {
				tempOpen[id] = {ste: ste};
			}
		}
	}

	/**完全开启目标格子 */
	openTargetCell(id) {
		var newOpen = false;
		var data = FogModel.instance.getCellInfoById(id);
		var tempOpen = {};
		var cell: FogInstanceCell = this.fogControler.getCellData(id);
		if (data && data.ste && Number(data.ste) != FogConst.FOG_CELLSTATE_OPEN) {
			tempOpen[id] = {ste: 2};
			newOpen = true;
			FogServer.openCell({cell: tempOpen}, () => {
				this.freshTargetCell(tempOpen);


			}, this, false)
			//
			if (FogModel.instance.getIsHavePropByType(FogPropTrigger.Prop_type_RecoverAct)) {
				FogServer.updateFogCount({type: FogConst.FOG_COUNT_OPENCELL}, () => {
					//判断是否恢复行动力
					FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_RecoverAct, this.fogControler.getCellData(id))
				}, this);
			}
		}

		//敌人类型 的格子，添加不能通行标志
		if (cell.eventData && cell.eventData.logicType == FogEventTrigger.Event_logical_Enemy) {
			this.addNoPathSign(cell.xIndex, cell.yIndex)
		}
		return newOpen


	}

	/**获取玩家类型的敌人数据 */
	getPlayerEnemy(callBack, thisObj) {
		//需要在一层结束时，清掉未攻击的敌人，已攻击的敌人留下，用来排重
		var event = FogModel.instance.getCellInfo();
		var battleCount = 0;
		for (var key in event) {
			if (event.hasOwnProperty(key)) {
				var item: SCFogCellData = event[key];
				//这个格子上有事件
				if (item.evt) {
					var eventInfo = FogFunc.instance.getCfgDatas("Event", item.evt.id);
					if (Number(eventInfo.logicType) == FogEventTrigger.Event_logical_Enemy) {
						var id = FogFunc.instance.getCfgDatasByKey("Enemy", eventInfo.params[0], "array");
						//id为1说明是玩家类型的敌人
						if (id == -1) {
							battleCount += 1;
						}
					}
				}
			}
		}
		//需要获取的敌人数量不为0
		if (battleCount != 0) {
			var data = {
				randNum: battleCount,
				uidList: FogModel.instance.getUsedEnemyList()
			}
			var isShow = false;
			//防止两秒内未返回敌人数据，直接刷新格子数据
			var timeCode = TimerManager.instance.setTimeout(() => {
				callBack && callBack.call(thisObj);
				isShow = true;
			}, this, 2000)
			FogServer.getEnemyList(data, (result) => {
				if (result && !result.error) {
					//存储到fogModel数据中
					var list = result.data && result.data.randResult || {};
					FogServer.savePlayerEnemyData(list);
				}
				TimerManager.instance.clearTimeout(timeCode);
				if (!isShow) {
					callBack && callBack.call(thisObj)
				}
			}, this)
		} else {
			callBack && callBack.call(thisObj)
		}
	}

	/**添加标志: 不能通过 or 能通过 */
	addNoPathSign(xIndex, yIndex, add = true) {
		var startX = xIndex - 1 < 1 ? 1 : xIndex - 1;
		var endX = xIndex + 1 > FogFunc.line ? FogFunc.line : xIndex + 1;
		var startY = yIndex - 1 < 1 ? 1 : yIndex - 1;
		var endY = yIndex + 1 > FogFunc.row ? FogFunc.row : yIndex + 1;
		var item;
		var tempOpen = {};
		for (var i = startX; i <= endX; i++) {
			for (var j = startY; j <= endY; j++) {
				if (i == xIndex && j == yIndex) continue;
				item = this.fogControler.getCellData(i + "_" + j);
				if (item && (!item.myData || !item.myData.ste || Number(item.myData.ste) != FogConst.FOG_CELLSTATE_OPEN)) {
					//状态置为锁定
					tempOpen[item.mySign] = {lock: 1}
				}
			}
		}
		if (add) {
			FogServer.openCell({cell: tempOpen}, () => {
				this.freshTargetCell(tempOpen);
			}, this, false)
		} else {
			FogServer.delCellInfo({cell: tempOpen}, () => {
				this.freshTargetCell(tempOpen);
			}, this, false)
		}

	}

	/**显示出口 */
	showExit() {

	}

	//进入下一层
	public enterNextLayer() {
		FogServer.enterNextLayer(null);
		StatisticsManager.ins.onEvent(StatisticsManager.FOG_NEXTLEVEL, {layer: FogModel.instance.getCurLayer() + 1})
		this.fogControler.exitBattle();
	}

	dispose() {
		this.fogControler = null;
		this.layer = null;
		TimerManager.instance.removeByObject(this);
	}

}
