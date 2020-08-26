import FogMainUI from "../../sys/view/fog/FogMainUI";
import FogCellMapControler from "./FogCellMapControler";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import FogInstanceCell from "../instance/FogInstanceCell";
import FogCellEventControler from "./FogCellEventControler";
import FogFunc from "../../sys/func/FogFunc";
import FogControler from "./FogControler";
import FogInstanceBus from "../instance/FogInstanceBus";
import {FogFindWayControler} from "./FogFindWayControler";
import FogEventTrigger from "../trigger/FogEventTrigger";
import FogInstanceBasic from "../instance/FogInstanceBasic";
import TableUtils from "../../../framework/utils/TableUtils";
import FogConst from "../../sys/consts/FogConst";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import Message from "../../../framework/common/Message";
import FogEvent from "../../sys/event/FogEvent";
import IMessage from "../../sys/interfaces/IMessage";
import FogMistControler from "./FogMistControler";
import UserModel from "../../sys/model/UserModel";
import GuideManager from "../../sys/manager/GuideManager";
import GuideConst from "../../sys/consts/GuideConst";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import WindowEvent from "../../../framework/event/WindowEvent";

/**迷雾控制器 */
export default class FogLogicalControler extends FogControler implements IMessage {

	public fogUI: FogMainUI;
	public cellMapControler: FogCellMapControler;

	public fogCellEventControler: FogCellEventControler;
	public fogFindWayControler: FogFindWayControler;
	/**所有的格子 */
	public _cellInstanceArr;
	public _cellMap;
	//当前所在层数
	public layer;
	//当前可随机事件的id组
	public _allCellId;
	public layerCfg;
	//当前的车
	public myBus: FogInstanceBus;
	public mistControler: FogMistControler;
	private isStop = false;

	private ctn

	constructor(ctn, ui) {
		super(ctn, ui)
		this.addEvent();
		this.fogUI = ui;
		this._cellInstanceArr = [];
		this._allCellId = [];
		this._cellMap = {};
		this.cellMapControler = new FogCellMapControler(this);
		this.fogCellEventControler = new FogCellEventControler(this);
		this.fogFindWayControler = new FogFindWayControler(this);
		this.mistControler = new FogMistControler(this);
		this.ctn = ctn;
		this.ctn.on(Laya.Event.MOUSE_DOWN, this, this.onClickView)


	}

	addEvent() {
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_CELLEVENT, this);
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_BEHINDEVENT, this);
		Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);
	}

	public setData(layer) {
		this.isStop = false;
		this.layer = layer;
		this.mistControler.initMistData();
		this.layerCfg = FogFunc.instance.getCfgDatas("Layer", layer);
		this.fogCellEventControler.setData();
		this.cellMapControler.setData();
		Laya.timer.frameLoop(1, this, this.onceUpdateFrame);
	}

	/**
	 * 存贮格子数据
	 * @param id 格子id 1_1
	 * @param obj instance
	 */
	saveCellData(id, obj) {
		if (!this._cellMap[id]) {
			this._cellMap[id] = obj;
			if (this._allCellId.indexOf(id) == -1) {
				this._allCellId.push(id);
			}
		}
	}

	delCellId(id) {
		var index = this._allCellId.indexOf(id)
		if (index != -1) {
			this._allCellId.splice(index, 1);
		}
	}

	/**
	 * 获取格子数据
	 * @param id
	 */
	getCellData(id) {
		if (this._cellMap[id]) {
			return this._cellMap[id];
		}
		return null;
	}

	/**
	 * 创建格子
	 */
	createCell(data) {
		var cacheId = PoolCode.POOL_FOGCELL;
		var cacheItem: FogInstanceCell = this.createInstance(data, cacheId, FogInstanceCell);
		this.fogLayerControler.a22.addChild(cacheItem);
		this._cellInstanceArr.push(cacheItem);
		this._allInstanceArr.push(cacheItem);
		return cacheItem;
	}

	/**
	 * 创建车
	 * @param data
	 */
	createBus(data) {
		var cacheId = PoolCode.POOL_FOGBUS;
		var cacheItem: FogInstanceBus = this.createInstance(data, cacheId, FogInstanceBus);
		this.fogLayerControler.a3.addChild(cacheItem);
		this._allMoveInstanceArr.push(cacheItem);
		this._allInstanceArr.push(cacheItem);
		return cacheItem;
	}

	/**
	 *
	 * @param data instance的数据
	 * @param cacheId 缓存id
	 * @param model 属于哪个模块
	 * @param classModel 调用哪个类
	 */
	public createInstance(data: any, cacheId: string, classModel) {
		var instance = PoolTools.getItem(cacheId);
		if (instance) {
			//重置 instance的控制器
			instance.fogControler = this;
			instance.setData(data);
		} else {
			var view: any;
			instance = new classModel(this);
			instance.cacheId = cacheId;
			//设置数据
			instance.setData(data);
		}
		return instance;
	}

	//销毁一个实例
	public destoryInstance(instance: FogInstanceBasic) {
		var cacheId = instance.cacheId;
		var model = instance.classModel;
		TableUtils.removeValue(this._allInstanceArr, instance);
		//把instance放入缓存.
		PoolTools.cacheItem(cacheId, instance);
		instance.dispose();
		if (model == FogConst.model_Cell) {
			TableUtils.removeValue(this._cellInstanceArr, instance);
		} else if (model == FogConst.model_Bus) {
			TableUtils.removeValue(this._allMoveInstanceArr, instance);
		}
		//清除这个对象注册的所有回调
		this.clearCallBack(instance);
	}

	//销毁一个数组的实例
	destoryInstanceArr(instanceArr: FogInstanceBasic[], outRemoveAllArr: boolean = false) {
		for (var i = instanceArr.length - 1; i >= 0; i--) {
			if (instanceArr[i]) {
				this.destoryInstance(instanceArr[i]);
			}
		}
	}

	onClickView(event) {
		var stagex = event.stageX;
		var stagey = event.stageY
		var sign = this.turnStagePosToCellSign(stagex, stagey);
		//获取这个位置的格子
		var item = this.getCellData(sign);
		if (item) {
			item.onClickItem();
		}
	}

	//展示进入战斗的引导
	showGuide_701() {
		if (UserModel.instance.getMainGuide() == 10) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_7_701, GuideManager.GuideType.None);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_7_701, this.checkGuide_701_finish, this)
		}
	}

	checkGuide_701_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_7_701, this.showGuide_702, this);
	}

	showGuide_702() {
		var targetCell = this.getCellData("3_2");
		GuideManager.ins.setGuideData(GuideConst.GUIDE_7_702, GuideManager.GuideType.Static, targetCell, this.fogUI);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_7_702);
	}

	//显示拾取零件引导
	showGuide_901() {
		if (UserModel.instance.getMainGuide() == 11) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_9_901, GuideManager.GuideType.None);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_9_901, this.checkGuide_901_finish, this)
		}
	}

	checkGuide_901_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_9_901, this.showGuide_902, this);

	}

	showGuide_902() {
		var targetCell = this.getCellData("3_2");
		GuideManager.ins.setGuideData(GuideConst.GUIDE_9_902, GuideManager.GuideType.Static, targetCell, this.fogUI);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_9_902);
	}

	checkGuide_902_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_9_902, () => {
			this.fogUI.showGuide_1001();
		}, this, true);

	}

	//展示遇到己方角色引导
	showGuide_1201(cell) {
		if (UserModel.instance.getMainGuide() == 14) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_12_1201, GuideManager.GuideType.Static, cell, this.fogUI, null, null, null, null, {name: cell.eventData.roleName});
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_12_1201);
		}
	}

	checkGuide_1201_finish() {
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_12_1201) {
			GuideManager.ins.guideFin(GuideConst.GUIDE_12_1201, () => {
				WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			}, this, true);
		}
	}

	//展示结束己方角色领取引导
	showGuide_1301(name) {
		if (UserModel.instance.getMainGuide() == 15) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_13_1301, GuideManager.GuideType.None, null, null, null, null, null, null, {name: name});
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_13_1301, this.checkGuide_1301_finish, this);
		}
	}

	checkGuide_1301_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_13_1301, null, this, true);
	}

	//退出游戏
	exitBattle() {
		this.dispose()
	}

	private setRoleAniStop() {
		if (WindowManager.getCurrentFullWindow() != this.fogUI && this.isStop == false) {
			this.isStop = true;
		} else if (WindowManager.getCurrentFullWindow() == this.fogUI && this.isStop == true) {
			this.isStop = false;
		} else {
			return;
		}
		for (var i = 0; i < this._cellInstanceArr.length; i++) {
			var item = this._cellInstanceArr[i];
			if (item.eventData && item.eventData.roleAnim) {
				var role = item.eventData.roleAnim;
				if (this.isStop) {
					role.stop();
				} else {
					role.resume();
				}
			}
		}
	}

	dispose() {
		BattleLogsManager.battleEcho("退出迷雾模式----");
		Laya.timer.clear(this, this.onceUpdateFrame);
		this.ctn && this.ctn.offAll(Laya.Event.MOUSE_DOWN);
		this.ctn = null;
		//销毁所有对象
		this.destoryInstanceArr(this._allInstanceArr);
		//清空延迟回调
		this._timeList.length = 0;
		this._allInstanceArr.length = 0;
		this._allMoveInstanceArr.length = 0;
		this._cellInstanceArr.length = 0;
		this._allCellId.length = 0;
		this._cellMap = {};
		this.cellMapControler.dispose();
		this.cellMapControler = null;
		this.fogCellEventControler.dispose();
		this.fogCellEventControler = null;
		this.fogFindWayControler.dispose();
		this.fogFindWayControler = null;
		FogFunc.enemyCell = null;
		Message.instance.removeObjEvents(this);
		super.dispose();
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == FogEvent.FOGEVENT_REFRESH_CELLEVENT) {
			FogEventTrigger.freshCellByType(data);
		} else if (cmd == FogEvent.FOGEVENT_REFRESH_BEHINDEVENT) {
			FogEventTrigger.showBehindEvent(data)
		}
		if (cmd == WindowEvent.WINDOW_EVENT_SWITCHUIFIN) {
			this.setRoleAniStop();
		}
	}

}
