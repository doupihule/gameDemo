"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogInstanceBasic_1 = require("./FogInstanceBasic");
const FogModel_1 = require("../../sys/model/FogModel");
const FogFunc_1 = require("../../sys/func/FogFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const FogEventData_1 = require("../data/FogEventData");
const FogEventTrigger_1 = require("../trigger/FogEventTrigger");
const FogServer_1 = require("../../sys/server/FogServer");
const FogConst_1 = require("../../sys/consts/FogConst");
const GuideManager_1 = require("../../sys/manager/GuideManager");
const GuideConst_1 = require("../../sys/consts/GuideConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const UserModel_1 = require("../../sys/model/UserModel");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
/**迷雾格子 */
class FogInstanceCell extends FogInstanceBasic_1.default {
    constructor(fogControler) {
        super(fogControler);
        //这个item x方向位置
        this.xIndex = 1;
        //这个item y方向位置
        this.yIndex = 1;
        //G是当前点到起始点的值
        this.G = 0;
        this.width = FogFunc_1.default.itemWidth;
        this.height = FogFunc_1.default.itemHeight;
        this.classModel = FogConst_1.default.model_Cell;
    }
    addCtn() {
        this.eventCtn = new Laya.Image("");
        this.eventCtn.anchorX = 0.5;
        this.eventCtn.anchorY = 0.5;
        this.fogControler.fogLayerControler.a23.addChild(this.eventCtn);
        this.maskCtn = new Laya.Image("");
        this.maskCtn.anchorX = 0.5;
        this.maskCtn.anchorY = 0.5;
        this.fogControler.fogLayerControler.a24.addChild(this.maskCtn);
        this.maskImg = this.createImage();
        this.lastMaskImg = this.createImage();
        this.maskCtn.addChild(this.maskImg);
        this.maskCtn.addChild(this.lastMaskImg);
        this.signCtn = new Laya.Image("uisource/expedition/expedition/expedition_image_chahao.png");
        this.signCtn.anchorX = 0.5;
        this.signCtn.anchorY = 0.5;
        this.maskCtn.addChild(this.signCtn);
        this.normalIndex = this.fogControler.fogLayerControler.a23.getChildIndex(this.eventCtn);
    }
    createImage(url = null) {
        var img = new Laya.Image(url);
        img.anchorX = 0.5;
        img.anchorY = 0.5;
        img.scale(130 / 128, 130 / 128, true);
        return img;
    }
    setData(data) {
        this.addCtn();
        this.resetPathData();
        // this.maskImg.visible = true;
        this.signCtn.visible = false;
        this.xIndex = data.xIndex;
        this.yIndex = data.yIndex;
        this.fogName = FogFunc_1.default.instance.getMaskImgFrontBySign(this.xIndex, this.yIndex);
        // this.maskImg.skin = this.fogName + "_01.png";
        this.mySign = this.xIndex + "_" + this.yIndex;
        this.x = this.xIndex * FogFunc_1.default.itemWidth - FogFunc_1.default.itemWidth / 2;
        this.y = FogFunc_1.default.mapHeight - (this.yIndex * FogFunc_1.default.itemHeight) + FogFunc_1.default.itemHeight / 2;
        this.eventCtn.x = this.x;
        this.eventCtn.y = this.y;
        this.maskCtn.x = this.x;
        this.maskCtn.y = this.y;
        this.fogControler.saveCellData(this.mySign, this);
        this.skin = FogFunc_1.default.instance.getMapImgBySign(this.fogControler.layerCfg.scene, this.xIndex, this.yIndex);
        this.refreshFogMist(true);
    }
    //重置寻路信息
    resetPathData() {
        this.G = 0;
        this.tmpCell = null;
    }
    //初始化
    initCellData() {
        this.myRotate = null;
        this.myData = null;
        this.myData = FogModel_1.default.instance.getCellInfoById(this.mySign);
        this.eventCtn.skin = "";
        if (this.myData) {
            if (Number(this.myData.type) == FogConst_1.default.cellType_Start) {
                FogFunc_1.default.fogStartCell = this;
                this.initMyRotate();
            }
            else if (Number(this.myData.type) == FogConst_1.default.cellType_End) {
                this.initMyRotate();
                this.eventCtn.skin = FogFunc_1.default.instance.getExitImgByRotate(this.myRotate);
                FogFunc_1.default.fogEndCell = this;
                FogFunc_1.default.fogEndCellSign = this.mySign;
            }
            else if (Number(this.myData.type) == FogConst_1.default.cellType_StartAround) {
                if (!FogFunc_1.default.fogStartCell) {
                    LogsManager_1.default.errorTag("", "起始点还未初始化");
                }
                this.myRotate = FogFunc_1.default.fogStartCell.myRotate;
            }
            else if (Number(this.myData.type) == FogConst_1.default.cellType_EndAround) {
                if (!FogFunc_1.default.fogEndCell) {
                    LogsManager_1.default.errorTag("", "终点还未初始化");
                }
                this.myRotate = FogFunc_1.default.fogEndCell.myRotate;
            }
            this.freshEventShow();
            this.freshMyState();
            this.checkRoleGuide_1201();
        }
        else {
            this.eventData = null;
        }
    }
    //重登检测己方角色引导
    checkRoleGuide_1201() {
        if (this.myData.ste == FogConst_1.default.FOG_CELLSTATE_OPEN && this.eventData && this.eventData.roleId && GuideManager_1.default.ins.nowGuideId != GuideConst_1.default.GUIDE_12_1201) {
            this.fogControler.showGuide_1201(this);
        }
    }
    /**刷新我的状态 */
    freshMyState() {
        this.myData = FogModel_1.default.instance.getCellInfoById(this.mySign);
        //已解锁
        if (this.checkfreshFog()) {
            if (this.eventData) {
                this.addRole();
            }
        }
        //格子被锁定了
        if (this.myData.lock) {
            this.signCtn.visible = true;
        }
        else {
            this.signCtn.visible = false;
        }
    }
    /**刷新迷雾图片的状态 */
    checkfreshFog() {
        var ste = this.myData && this.myData.ste;
        if (ste) {
            if (Number(ste) == FogConst_1.default.FOG_CELLSTATE_HALFOPEN) {
                // this.maskImg.skin = this.fogName + ".png";
                return false;
            }
            else if (Number(ste) == FogConst_1.default.FOG_CELLSTATE_OPEN) {
                // this.maskImg.visible = false;
                return true;
            }
        }
        return false;
    }
    /**刷新迷雾图标 */
    refreshFogMist(isInit = false) {
        this.fogControler.mistControler.turnOneCellView(this.maskImg, this.lastMaskImg, this.xIndex, this.yIndex, isInit);
    }
    /**添加己方角色 */
    addRole() {
        //解锁以后，如果我的事件类型是己方角色,安排一个角色
        if (this.eventData.logicType == FogEventTrigger_1.default.Event_logical_Role && !this.eventData.roleId) {
            var id = FogFunc_1.default.instance.getOneRoleId();
            if (id) {
                this.addEventData(this.eventData.eventId, id);
                //检测己方角色引导
                this.fogControler.showGuide_1201(this);
            }
            else {
                //没有多余的角色了，直接把这个事件删除
                this.delEventData();
            }
        }
    }
    /**设置我的旋转 起点和终点 */
    initMyRotate() {
        if (this.xIndex == 1) {
            //向右
            this.myRotate = FogConst_1.default.FOG_CELL_TURNRIGHT;
        }
        else if (this.xIndex == FogFunc_1.default.line) {
            //向左
            this.myRotate = FogConst_1.default.FOG_CELL_TURNLEFT;
        }
        else if (this.yIndex == 1) {
            //向上
            this.myRotate = FogConst_1.default.FOG_CELL_TURNUP;
        }
        else if (this.yIndex == FogFunc_1.default.row) {
            //向下
            this.myRotate = FogConst_1.default.FOG_CELL_TURNDOWN;
        }
    }
    /**刷新事件显示 */
    freshEventShow() {
        this.myData = FogModel_1.default.instance.getCellInfoById(this.mySign);
        var event = this.myData.evt;
        if (event) {
            if (!this.eventData) {
                this.eventData = new FogEventData_1.default(this);
            }
            this.eventData.upDateEvent(this.myData.evt, this.eventCtn);
        }
        else {
            this.eventData = null;
        }
    }
    /**获取周围的格子 */
    getAroundCell(pos) {
        var xIndex = this.xIndex;
        var yIndex = this.yIndex;
        if (pos == "left") {
            xIndex -= 1;
        }
        else if (pos == "right") {
            xIndex += 1;
        }
        else if (pos == "up") {
            yIndex += 1;
        }
        else if (pos == "down") {
            yIndex -= 1;
        }
        return xIndex + "_" + yIndex;
    }
    /**获取固定偏移的格子id  主要对于出入口 不同的位置相对的x y 不同*/
    getOffestCellId(xOffest = 0, yOffest = 0) {
        var xIndex = this.xIndex;
        var yIndex = this.yIndex;
        this.myData = FogModel_1.default.instance.getCellInfoById(this.mySign);
        if (Number(this.myData.type) == FogConst_1.default.cellType_Start || Number(this.myData.type) == FogConst_1.default.cellType_End) {
            if (this.xIndex == 1) {
                //位于左边
                yIndex -= xOffest;
                xIndex += yOffest;
            }
            else if (this.xIndex == FogFunc_1.default.line) {
                //位于右边
                yIndex += xOffest;
                xIndex -= yOffest;
            }
            if (this.yIndex == 1) {
                //位于下边
                yIndex += yOffest;
                xIndex += xOffest;
            }
            else if (this.yIndex == FogFunc_1.default.row) {
                //位于上边
                yIndex -= yOffest;
                xIndex -= xOffest;
            }
        }
        else {
            xIndex += xOffest;
            yIndex += yOffest;
        }
        if (xIndex < 1 || yIndex < 1) {
            LogsManager_1.default.errorTag("无效的偏移，不存在此格子", "无效的偏移，不存在此格子,偏移" + xOffest + "_" + yOffest);
            return;
        }
        return xIndex + "_" + yIndex;
    }
    /**获取是否可作为寻路点 */
    getIsCanPath() {
        //已解锁并且可通行 起点终点解锁后默认可通行
        if (this.myData && this.myData.ste) {
            if (Number(this.myData.type) == FogConst_1.default.cellType_Start || Number(this.myData.type) == FogConst_1.default.cellType_End)
                return true;
            //半开放的格子不可寻路
            if (Number(this.myData.ste) == FogConst_1.default.FOG_CELLSTATE_HALFOPEN)
                return false;
            if (!this.eventData || this.eventData.pass)
                return true;
        }
        return false;
    }
    /**点击格子 */
    onClickItem() {
        if (!this.mySign || !this.fogControler || !this.fogControler.myBus)
            return;
        LogsManager_1.default.echo("点击格子", this.mySign);
        //完成第一次引导点击格子
        if (this.mySign == "3_2" && GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_6_603) {
            //先关闭引导界面，但不认为引导完成，等当前事件完成后再认为引导完成
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }
        else if (this.mySign == "3_2" && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_9_901) {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }
        //未解锁的格子，不可点击
        if (this.myData && !this.myData.ste) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_click_deep_cell"));
            return;
        }
        //格子被锁定了
        if (this.myData && this.myData.lock) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_click_lock_cell"));
            return;
        }
        //已经完全驱散雾的的格子是空事件，并且不可通行 也不可点
        if (this.eventData && Number(this.myData.ste) == FogConst_1.default.FOG_CELLSTATE_OPEN && !this.eventData.pass && this.eventData.logicType == FogEventTrigger_1.default.Event_logical_None)
            return;
        //如果车已经在当前格子了，不可点击
        if (this.fogControler.myBus.mySign == this.mySign) {
            if (this.mySign == "3_2" && UserModel_1.default.instance.getMainGuide() == 11) {
                FogEventTrigger_1.default.checkEventTriggerOnInstance(FogEventTrigger_1.default.FogEvent_trigger_EnterCell, this.fogControler.getCellData(this.mySign));
            }
            return;
        }
        //如果触发了立即执行的事件
        if (FogEventTrigger_1.default.checkEventTriggerOnInstance(FogEventTrigger_1.default.FogEvent_trigger_Quick, this.fogControler.getCellData(this.mySign)))
            return;
        this.fogControler.myBus.moveToTargetPos(this);
        LogsManager_1.default.echo("小汽车准备寻路", this.mySign);
    }
    /**刪除格子事件 */
    delEventData() {
        FogServer_1.default.delCellEvent({ id: this.mySign }, () => {
            this.eventData && this.eventData.removeLastEvent();
            this.eventData = null;
        }, this);
    }
    /**添加格子事件 */
    addEventData(evtId, role = null) {
        FogServer_1.default.addCellEvent({ cellId: this.mySign, id: evtId, role: role }, () => {
            this.freshEventShow();
        }, this);
    }
    /**设置格子的层级 */
    setOrder(order) {
        this.eventCtn.zOrder = order;
        if (order == 0) {
            this.fogControler.fogLayerControler.a23.setChildIndex(this.eventCtn, this.normalIndex);
        }
    }
    //销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
    dispose() {
        this.removeSelf();
        this.fogControler = null;
        if (this.eventData) {
            this.eventData.removeLastEvent();
            this.eventData = null;
        }
        this.eventCtn.removeSelf();
        this.eventCtn = null;
        this.maskCtn.removeSelf();
        this.maskCtn = null;
    }
    //从舞台移除
    onSetToCache() {
        this.removeSelf();
    }
}
exports.default = FogInstanceCell;
//# sourceMappingURL=FogInstanceCell.js.map