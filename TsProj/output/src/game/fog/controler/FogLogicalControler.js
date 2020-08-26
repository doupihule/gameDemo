"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogCellMapControler_1 = require("./FogCellMapControler");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const FogInstanceCell_1 = require("../instance/FogInstanceCell");
const FogCellEventControler_1 = require("./FogCellEventControler");
const FogFunc_1 = require("../../sys/func/FogFunc");
const FogControler_1 = require("./FogControler");
const FogInstanceBus_1 = require("../instance/FogInstanceBus");
const FogFindWayControler_1 = require("./FogFindWayControler");
const FogEventTrigger_1 = require("../trigger/FogEventTrigger");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const FogConst_1 = require("../../sys/consts/FogConst");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const Message_1 = require("../../../framework/common/Message");
const FogEvent_1 = require("../../sys/event/FogEvent");
const FogMistControler_1 = require("./FogMistControler");
const UserModel_1 = require("../../sys/model/UserModel");
const GuideManager_1 = require("../../sys/manager/GuideManager");
const GuideConst_1 = require("../../sys/consts/GuideConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const WindowEvent_1 = require("../../../framework/event/WindowEvent");
/**迷雾控制器 */
class FogLogicalControler extends FogControler_1.default {
    constructor(ctn, ui) {
        super(ctn, ui);
        this.isStop = false;
        this.addEvent();
        this.fogUI = ui;
        this._cellInstanceArr = [];
        this._allCellId = [];
        this._cellMap = {};
        this.cellMapControler = new FogCellMapControler_1.default(this);
        this.fogCellEventControler = new FogCellEventControler_1.default(this);
        this.fogFindWayControler = new FogFindWayControler_1.FogFindWayControler(this);
        this.mistControler = new FogMistControler_1.default(this);
        this.ctn = ctn;
        this.ctn.on(Laya.Event.MOUSE_DOWN, this, this.onClickView);
    }
    addEvent() {
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT, this);
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_BEHINDEVENT, this);
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
    }
    setData(layer) {
        this.isStop = false;
        this.layer = layer;
        this.mistControler.initMistData();
        this.layerCfg = FogFunc_1.default.instance.getCfgDatas("Layer", layer);
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
        var index = this._allCellId.indexOf(id);
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
        var cacheId = PoolCode_1.default.POOL_FOGCELL;
        var cacheItem = this.createInstance(data, cacheId, FogInstanceCell_1.default);
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
        var cacheId = PoolCode_1.default.POOL_FOGBUS;
        var cacheItem = this.createInstance(data, cacheId, FogInstanceBus_1.default);
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
    createInstance(data, cacheId, classModel) {
        var instance = PoolTools_1.default.getItem(cacheId);
        if (instance) {
            //重置 instance的控制器
            instance.fogControler = this;
            instance.setData(data);
        }
        else {
            var view;
            instance = new classModel(this);
            instance.cacheId = cacheId;
            //设置数据
            instance.setData(data);
        }
        return instance;
    }
    //销毁一个实例
    destoryInstance(instance) {
        var cacheId = instance.cacheId;
        var model = instance.classModel;
        TableUtils_1.default.removeValue(this._allInstanceArr, instance);
        //把instance放入缓存.
        PoolTools_1.default.cacheItem(cacheId, instance);
        instance.dispose();
        if (model == FogConst_1.default.model_Cell) {
            TableUtils_1.default.removeValue(this._cellInstanceArr, instance);
        }
        else if (model == FogConst_1.default.model_Bus) {
            TableUtils_1.default.removeValue(this._allMoveInstanceArr, instance);
        }
        //清除这个对象注册的所有回调
        this.clearCallBack(instance);
    }
    //销毁一个数组的实例
    destoryInstanceArr(instanceArr, outRemoveAllArr = false) {
        for (var i = instanceArr.length - 1; i >= 0; i--) {
            if (instanceArr[i]) {
                this.destoryInstance(instanceArr[i]);
            }
        }
    }
    onClickView(event) {
        var stagex = event.stageX;
        var stagey = event.stageY;
        var sign = this.turnStagePosToCellSign(stagex, stagey);
        //获取这个位置的格子
        var item = this.getCellData(sign);
        if (item) {
            item.onClickItem();
        }
    }
    //展示进入战斗的引导
    showGuide_701() {
        if (UserModel_1.default.instance.getMainGuide() == 10) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_7_701, GuideManager_1.default.GuideType.None);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_7_701, this.checkGuide_701_finish, this);
        }
    }
    checkGuide_701_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_7_701, this.showGuide_702, this);
    }
    showGuide_702() {
        var targetCell = this.getCellData("3_2");
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_7_702, GuideManager_1.default.GuideType.Static, targetCell, this.fogUI);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_7_702);
    }
    //显示拾取零件引导
    showGuide_901() {
        if (UserModel_1.default.instance.getMainGuide() == 11) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_9_901, GuideManager_1.default.GuideType.None);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_9_901, this.checkGuide_901_finish, this);
        }
    }
    checkGuide_901_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_9_901, this.showGuide_902, this);
    }
    showGuide_902() {
        var targetCell = this.getCellData("3_2");
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_9_902, GuideManager_1.default.GuideType.Static, targetCell, this.fogUI);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_9_902);
    }
    checkGuide_902_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_9_902, () => {
            this.fogUI.showGuide_1001();
        }, this, true);
    }
    //展示遇到己方角色引导
    showGuide_1201(cell) {
        if (UserModel_1.default.instance.getMainGuide() == 14) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_12_1201, GuideManager_1.default.GuideType.Static, cell, this.fogUI, null, null, null, null, { name: cell.eventData.roleName });
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_12_1201);
        }
    }
    checkGuide_1201_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_12_1201) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_12_1201, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this, true);
        }
    }
    //展示结束己方角色领取引导
    showGuide_1301(name) {
        if (UserModel_1.default.instance.getMainGuide() == 15) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_13_1301, GuideManager_1.default.GuideType.None, null, null, null, null, null, null, { name: name });
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_13_1301, this.checkGuide_1301_finish, this);
        }
    }
    checkGuide_1301_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_13_1301, null, this, true);
    }
    //退出游戏
    exitBattle() {
        this.dispose();
    }
    setRoleAniStop() {
        if (WindowManager_1.default.getCurrentFullWindow() != this.fogUI && this.isStop == false) {
            this.isStop = true;
        }
        else if (WindowManager_1.default.getCurrentFullWindow() == this.fogUI && this.isStop == true) {
            this.isStop = false;
        }
        else {
            return;
        }
        for (var i = 0; i < this._cellInstanceArr.length; i++) {
            var item = this._cellInstanceArr[i];
            if (item.eventData && item.eventData.roleAnim) {
                var role = item.eventData.roleAnim;
                if (this.isStop) {
                    role.stop();
                }
                else {
                    role.resume();
                }
            }
        }
    }
    dispose() {
        BattleLogsManager_1.default.battleEcho("退出迷雾模式----");
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
        FogFunc_1.default.enemyCell = null;
        Message_1.default.instance.removeObjEvents(this);
        super.dispose();
    }
    recvMsg(cmd, data) {
        if (cmd == FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT) {
            FogEventTrigger_1.default.freshCellByType(data);
        }
        else if (cmd == FogEvent_1.default.FOGEVENT_REFRESH_BEHINDEVENT) {
            FogEventTrigger_1.default.showBehindEvent(data);
        }
        if (cmd == WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN) {
            this.setRoleAniStop();
        }
    }
}
exports.default = FogLogicalControler;
//# sourceMappingURL=FogLogicalControler.js.map