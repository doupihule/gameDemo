"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
;
const ButtonConst_1 = require("../../../../../framework/consts/ButtonConst");
const TimerManager_1 = require("../../../../../framework/manager/TimerManager");
const FogModel_1 = require("../../../model/FogModel");
const FogServer_1 = require("../../../server/FogServer");
const PoolTools_1 = require("../../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../../consts/PoolCode");
const BattleFunc_1 = require("../../../func/BattleFunc");
const BattleRoleView_1 = require("../../../../battle/view/BattleRoleView");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
const ResourceConst_1 = require("../../../consts/ResourceConst");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../../func/ShareTvOrderFunc");
const StatisticsManager_1 = require("../../../manager/StatisticsManager");
class FogAnswerUI extends layaMaxUI_1.ui.gameui.fog.FogAnswerUI {
    constructor() {
        super();
        this.continueCostArr = []; //继续答题消耗数组
        this.continueCount = 0; //继续答题的次数
        this.isAnswerRight = false; //是否已经回答对
        this.wrongIndexArr = []; //错误答案index数组
        this.txtArr = ["A:", "B:", "C:", "D:"];
        this.answerArr = ["A", "B", "C", "D"];
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        for (var i = 0; i < 4; i++) {
            new ButtonUtils_1.ButtonUtils(this["answer" + i], this.onClickItem, this, null, null, i).setBtnType(ButtonConst_1.default.BUTTON_TYPE_3);
        }
        new ButtonUtils_1.ButtonUtils(this.alertBtn, this.onClickAlert, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    setData(data) {
        this.rightIndex = 0;
        this.continueCostArr = [];
        this.wrongIndexArr = [];
        this.continueCount = 0;
        this.isAnswerRight = false;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        this.rightLab.visible = false;
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        var descArr = this.eventInfo.desc;
        this.answerTitle.text = TranslateFunc_1.default.instance.getTranslate(descArr[0], "TranslateEvent");
        var params = this.eventInfo.params;
        this.rightIndex = Number(params[0]) - 1;
        for (var i = 1; i < 4; i++) {
            this.continueCostArr.push(params[i]);
        }
        //判断事件里面是否有保存的错误答案数据
        if (this.events.eventData && this.events.eventData.wrongIndex && Object.keys(this.events.eventData.wrongIndex).length != 0) {
            for (var index in this.events.eventData.wrongIndex) {
                this.wrongIndexArr.push(this.events.eventData.wrongIndex[index]);
            }
            this.continueCount = Object.keys(this.events.eventData.wrongIndex).length;
        }
        if (this.events.eventData && this.events.eventData.isVideoGetRight) {
            this.rightLab.visible = true;
            this.alertBtn.visible = false;
            this.rightLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_answer_alert", null, [this.answerArr[this.rightIndex]]);
        }
        else {
            //按钮初始化
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_ANSWER_ALERT);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.alertBtn.visible = false;
            }
            else {
                this.alertBtn.visible = true;
                this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
                if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_QUESTION_SHOW);
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            this["resultLab" + i].text = this.txtArr[i] + TranslateFunc_1.default.instance.getTranslate(descArr[i + 1], "TranslateEvent");
            this["answer" + i].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_DEFAULT_DITU;
            if (this.wrongIndexArr.indexOf(i) != -1) {
                //显示×号
                this["resultImg" + i].visible = true;
                this["resultImg" + i].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_CHAHAO;
                //底框显示
                this["answer" + i].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_CLICK_DITU;
            }
            else {
                this["resultImg" + i].visible = false;
                this["answer" + i].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_DEFAULT_DITU;
            }
        }
        if (this.continueCount) {
            this.costGroup.visible = true;
            this.costLab.text = this.continueCostArr[this.continueCount - 1];
        }
        else {
            this.costGroup.visible = false;
        }
        //角色spine
        this.showRoleSpine();
        BannerAdManager_1.default.addBannerQuick(this);
    }
    showRoleSpine() {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }
        if (this.eventInfo.uiSpine) {
            var spine = this.eventInfo.uiSpine;
            var item = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc_1.default.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView_1.default(spine[0], scaleRoleInfo, 0, "FogAnswerUI");
            }
            else {
                this.roleAnim = item;
                item.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);
            //todo:阴影大小
            var shadeScale = BattleFunc_1.default.instance.getShadeScale(100);
            this.roleAnim.setShade(shadeScale);
            this.roleAnim.play(spine[1], true);
        }
    }
    //消耗行动力继续回答
    onClickContinue(index) {
        //判断行动力是否足够
        var cost = this.continueCostArr[this.continueCount - 1];
        //消耗行动力判断
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < Number(cost)) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        //消耗行动力
        FogServer_1.default.continueAnswer({ "cost": cost }, () => {
            this.checkAnswer(index);
        }, this);
    }
    checkAnswer(index) {
        //回答正确index
        if (index == this.rightIndex) {
            this["resultImg" + index].visible = true;
            this["resultImg" + index].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_DUIHAO;
            this.costGroup.visible = false;
            this.isAnswerRight = true;
            //2秒后自动关闭
            TimerManager_1.default.instance.setTimeout(() => {
                this.onClick();
            }, this, 2000);
        }
        //回答错误
        else {
            this["resultImg" + index].visible = true;
            this["resultImg" + index].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_CHAHAO;
            this.continueCount++;
            this.costGroup.visible = true;
            this.costLab.text = this.continueCostArr[this.continueCount - 1];
            //回答错误，记录下数据，便于下次展示
            this.wrongIndexArr.push(index);
            FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, wrongIndexArr: this.wrongIndexArr, id: this.eventId }, null, null);
        }
    }
    onClickItem(index) {
        //判断是否已经回答正确
        if (this.isAnswerRight) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_answer_already_right"));
            return;
        }
        this["answer" + index].skin = ResourceConst_1.default.FOG_EVENT_ANSWER_CLICK_DITU;
        if (index == 0) {
            //判断结果
            this.checkAnswer(index);
        }
        else {
            this.onClickContinue(index);
        }
    }
    //点击提示按钮
    onClickAlert() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_QUESTION_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_ANSWER_ALERT, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, () => { }, this);
    }
    successfull() {
        FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, isVideoGetRight: 1, id: this.eventId }, () => {
            this.alertBtn.visible = false;
            this.rightLab.visible = true;
            this.rightLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_answer_alert", null, [this.answerArr[this.rightIndex]]);
        }, this);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_QUESTION_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_QUESTION_FINISH);
        }
    }
    close() {
        TimerManager_1.default.instance.removeByObject(this);
        this.onClick();
    }
    onClick() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogAnswerUI);
        if (this.isAnswerRight) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogAnswerUI;
//# sourceMappingURL=FogAnswerUI.js.map