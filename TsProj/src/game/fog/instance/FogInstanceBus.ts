import FogModel from "../../sys/model/FogModel";
import FogFunc from "../../sys/func/FogFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import FogConst from "../../sys/consts/FogConst";
import FogInstanceMove from "./FogInstanceMove";
import BattleConst from "../../sys/consts/BattleConst";
import FogServer from "../../sys/server/FogServer";
import WindowManager from "../../../framework/manager/WindowManager";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import FogEventTrigger from "../trigger/FogEventTrigger";
import TableUtils from "../../../framework/utils/TableUtils";

/**大巴车 */
export default class FogInstanceBus extends FogInstanceMove {

	private _initWidth: number = 128;
	private _initHeight: number = 128;
	//事件ctn，用来展示事件icon
	private eventCtn: ImageExpand;
	//这个item x方向位置
	private xIndex = 1;
	//这个item y方向位置
	private yIndex = 1;
	//我的唯一标识 1_1
	public mySign;
	private pathArr = [];
	private tempPathArr = [];
	//大巴图片
	private myBus: ImageExpand;
	private pathIndex = 0;
	private myRotate = 0;
	//是否是新路径
	private isNewPath = true;
	//下个目标的格子
	private curSign;

	constructor(fogControler) {
		super(fogControler);
		this.width = this._initWidth;
		this.height = this._initHeight;
		this.eventCtn = ViewTools.createImage("");
		this.eventCtn.anchorX = 0.5;
		this.eventCtn.anchorY = 0.5;
		this.eventCtn.x = this._initWidth / 2;
		this.eventCtn.y = this._initHeight / 2;
		this.addChild(this.eventCtn);
		this.classModel = FogConst.model_Bus;
	}

	public setData(data) {
		this.mySign = FogModel.instance.getBusInfo().pos;
		this.curSign = this.mySign;
		this.setBusShow();
		this.setRotate();
		var target = this.fogControler.getCellData(this.mySign)
		this.setPos(target.x, target.y, 0)
		this.initStand();
	}

	//设置车的spine
	setBusShow() {
		if (!this.myBus) {
			this.myBus = ViewTools.createImage();
			this.myBus.anchorX = 0.5;
			this.myBus.anchorY = 0.5;
			this.eventCtn.addChild(this.myBus);
		}
	}

	//设置我的初始角度
	setRotate() {
		var start = FogFunc.fogStartCell
		if (start && start.mySign == this.mySign) {
			//说明我在起点
			this.myRotate = start.myRotate
		} else {
			//默认向上
			this.myRotate = FogConst.FOG_CELL_TURNUP
		}
		this.myBus.skin = FogFunc.instance.getBusImgByRotate(this.myRotate)
	}

	/**移动到指定的点 */
	moveToTargetPos(target) {
		var curCell = this.fogControler.getCellData(this.curSign);
		var arr = this.fogControler.fogFindWayControler.findPath(curCell, target)
		if (arr.length == 0) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_click_deep_cell"))
			return;
		}
		LogsManager.echo("path-----------", arr.length)
		this.pathIndex = 0;
		//不是移动状态就直接开始移动
		if (this._myState != BattleConst.state_move) {
			TableUtils.copyOneArr(arr, this.pathArr)
			this.moveToOnePos();
		} else {
			this.isNewPath = true;
			TableUtils.copyOneArr(arr, this.tempPathArr)
		}
	}

	moveToOnePos() {
		this.isNewPath = false;
		if (this.pathArr.length == 0) {
			LogsManager.echo("item-----------------")
		}
		if (this.pathArr.length == 0) return;
		var item = this.pathArr[this.pathIndex];
		this.checkRotate();
		//使用这个点来作为下次寻路的起点，防止起点重合
		this.curSign = item.mySign
		this.moveToOnePoint(item.x, item.y, 0, FogFunc.fogBusSpeed, this.onArriveOne, this);
	}

	onArriveOne(type) {
		var item = this.pathArr[this.pathIndex];
		// if (!item) return;
		if (type == "side") {
			LogsManager.echo("到达边缘--------------------");
			//到达下个格子边缘 先完全照亮格子
			if (this.fogControler.cellMapControler.openTargetCell(item.mySign)) {
				//本次是新解锁的格子
				//被检测的格子事件不立即执行
				if (item.eventData && !item.eventData.cfgData.immediatelyTrigger) {
					this.resetMoveState();
					this.curSign = this.mySign
					return;
				}
			}
			//检测下个格子的边缘触发事件
			if (FogEventTrigger.checkEventTriggerOnInstance(FogEventTrigger.FogEvent_trigger_Previous, this.fogControler.getCellData(item.mySign))) {
				this.resetMoveState();
				this.curSign = this.mySign
				return;
			}

		} else {
			this.mySign = this.curSign;
			//到出口了 不在继续运动
			if (this.onArriveOneBack()) return;
			if (this.pathIndex >= this.pathArr.length - 1) {
				//到终点了
				LogsManager.echo("到终点了")
				this.onArriveEnd();
			}
			//如果触发了进入当前格子的事件 停止运动
			if (FogEventTrigger.checkEventTriggerOnInstance(FogEventTrigger.FogEvent_trigger_EnterCell, this.fogControler.getCellData(this.mySign))) {
				this.resetMoveState();
				return;
			}
			//当移动到一个点后有了新的路径，直接开始新的
			if (this.isNewPath) {
				LogsManager.echo("newpath2-----------", this.tempPathArr)
				TableUtils.copyOneArr(this.tempPathArr, this.pathArr)
				this.moveToOnePos();
				return;
			}
			if (this.pathIndex < this.pathArr.length - 1) {
				//移动到下一个点
				this.pathIndex += 1;
				LogsManager.echo("去下一个点")
				this.moveToOnePos();
			}

		}
	}

	//继续旧的路径
	continePath() {
		var item = this.pathArr[this.pathIndex];
		if (item) {
			if (this.curSign != item.mySign) {
				this.moveToOnePos();
			}
		}
	}

	//检测转向
	checkRotate() {
		var myPos = this.mySign.split("_");
		var xIndex = Number(myPos[0])
		var yIndex = Number(myPos[1])
		var item = this.pathArr[this.pathIndex];
		var lastRotate = this.myRotate;
		if (item.xIndex < xIndex && this.myRotate != FogConst.FOG_CELL_TURNLEFT) {
			//左拐了
			this.myRotate = FogConst.FOG_CELL_TURNLEFT
		}
		if (item.xIndex > xIndex && this.myRotate != FogConst.FOG_CELL_TURNRIGHT) {
			//右拐了
			this.myRotate = FogConst.FOG_CELL_TURNRIGHT
		}
		if (item.yIndex > yIndex && this.myRotate != FogConst.FOG_CELL_TURNUP) {
			//上走了
			this.myRotate = FogConst.FOG_CELL_TURNUP
		}
		if (item.yIndex < yIndex && this.myRotate != FogConst.FOG_CELL_TURNDOWN) {
			//下走了
			this.myRotate = FogConst.FOG_CELL_TURNDOWN
		}
		if (lastRotate != this.myRotate) {
			this.myBus.skin = FogFunc.instance.getBusImgByRotate(this.myRotate)
		}

	}

	//当到达终点
	onArriveEnd() {
		//设置位置时同步一次数据
		FogServer.setBusPos({pos: this.mySign})

	}

	//到达一个点的callback
	onArriveOneBack() {
		//开启我旁边的点
		this.fogControler.cellMapControler.createAround(this.mySign, true);
		var item = this.fogControler.getCellData(this.mySign);
		//如果运动到的点是出口
		if (item.myData && Number(item.myData.type) == FogConst.cellType_End) {
			//停止运动
			this.resetMoveState();
			this.fogControler.cellMapControler.showExit();
			return true;
		}
		return false;
	}

	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.removeSelf();
	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}