"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../../func/ShareTvOrderFunc");
const FogServer_1 = require("../../../server/FogServer");
const FogModel_1 = require("../../../model/FogModel");
const FogEventTrigger_1 = require("../../../../fog/trigger/FogEventTrigger");
const StatisticsManager_1 = require("../../../manager/StatisticsManager");
class FogObstacleUI extends layaMaxUI_1.ui.gameui.fog.FogObstacleUI {
    constructor() {
        super();
        this.isFinish = false; //事件是否完成
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onclickClose, this);
        new ButtonUtils_1.ButtonUtils(this.costBtn, this.onClickCostBtn, this);
        new ButtonUtils_1.ButtonUtils(this.freeBtn, this.onClickFreeBtn, this);
    }
    setData(data) {
        this.callBack = null;
        this.thisObj = null;
        this.isFinish = false;
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.noPathCallBack = data && data.noPathCallBack;
        this.viewType = this.eventInfo.logicType;
        //障碍物事件
        if (this.viewType == FogEventTrigger_1.default.Event_logical_Obstacle) {
            this.shareTvOrderId = ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_REMOVE_OBSTACLE;
            this.freeLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_obstacle_free_lab");
            this.costLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_obstacle_cost_lab");
        }
        //坏掉的路
        else if (this.viewType == FogEventTrigger_1.default.Event_logical_Brokenroad) {
            this.shareTvOrderId = ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_MEND_ROAD;
            this.freeLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_brokenroad_cost_lab");
            this.costLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_brokenroad_free_lab");
        }
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //事件图片
        this.eventImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";
        //事件消耗的行动力
        this.costAct = this.events.mobilityCost || 0;
        if (this.costAct) {
            this.costNum.text = "-" + this.costAct;
        }
        else {
            this.costNum.visible = false;
            this.costImg.visible = false;
        }
        // 描述
        this.descLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");
        //按钮初始化
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareTvOrderId);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freeBtn.visible = false;
            this.costGroup.x = 280;
        }
        else {
            this.freeBtn.visible = true;
            this.costGroup.x = 156;
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                if (this.viewType == FogEventTrigger_1.default.Event_logical_Obstacle) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REMOVEBLOCK_SHOW);
                }
                //坏掉的路
                else if (this.viewType == FogEventTrigger_1.default.Event_logical_Brokenroad) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BROKENROAD_SHOW);
                }
            }
        }
    }
    //消耗行动力
    onClickCostBtn() {
        //判断行动力是否充足
        if (this.costAct > FogModel_1.default.instance.getActNum()) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        FogServer_1.default.costAct({ "cost": this.costAct }, () => {
            //障碍物消耗行动力默认完成事件，坏掉的路消耗行动力不属于完成事件
            if (this.viewType == FogEventTrigger_1.default.Event_logical_Obstacle) {
                this.isFinish = true;
            }
            this.close();
        }, this);
    }
    //看视频免费
    onClickFreeBtn() {
        if (this.viewType == FogEventTrigger_1.default.Event_logical_Obstacle) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REMOVEBLOCK_CLICK);
        }
        //坏掉的路
        else if (this.viewType == FogEventTrigger_1.default.Event_logical_Brokenroad) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BROKENROAD_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(this.shareTvOrderId, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.finishCallBack, () => { }, this);
    }
    finishCallBack() {
        //看完视频相当于完成事件
        this.isFinish = true;
        if (this.viewType == FogEventTrigger_1.default.Event_logical_Obstacle) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REMOVEBLOCK_FINISH);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_REMOVEBLOCK_FINISH);
            }
        }
        //坏掉的路
        else if (this.viewType == FogEventTrigger_1.default.Event_logical_Brokenroad) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BROKENROAD_FINISH);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_BROKENROAD_FINISH);
            }
        }
        this.close();
    }
    onclickClose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogObstacleUI);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogObstacleUI);
        //事件完成后，再去执行刷新事件回调
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
        else {
            this.noPathCallBack && this.noPathCallBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogObstacleUI;
//# sourceMappingURL=FogObstacleUI.js.map