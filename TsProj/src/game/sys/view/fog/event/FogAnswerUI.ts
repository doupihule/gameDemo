import { ui } from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../../framework/utils/ButtonUtils";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";;
import ButtonConst from "../../../../../framework/consts/ButtonConst";
import TimerManager from "../../../../../framework/manager/TimerManager";
import FogModel from "../../../model/FogModel";
import FogServer from "../../../server/FogServer";
import PoolTools from "../../../../../framework/utils/PoolTools";
import PoolCode from "../../../consts/PoolCode";
import BattleFunc from "../../../func/BattleFunc";
import BattleRoleView from "../../../../battle/view/BattleRoleView";
import BannerAdManager from "../../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import ResourceConst from "../../../consts/ResourceConst";
import ShareOrTvManager from "../../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../../func/ShareTvOrderFunc";
import StatisticsManager from "../../../manager/StatisticsManager";



export default class FogAnswerUI extends ui.gameui.fog.FogAnswerUI implements IMessage {

    private eventId;//事件id
    private eventInfo;//事件cfg
    private rightIndex;//正确答案index;
    private continueCostArr = [];//继续答题消耗数组
    private continueCount = 0; //继续答题的次数
    private isAnswerRight = false;//是否已经回答对
    private roleAnim: BattleRoleView;
    private wrongIndexArr = [];//错误答案index数组

    private callBack;
    private thisObj;

    //格子事件
    private events: FogEventData;
    //格子
    private cell: FogInstanceCell;

    private freeType: number;//视频广告类型

    private txtArr = ["A:", "B:", "C:", "D:"];
    private answerArr = ["A", "B", "C", "D"];

    constructor() {
        super();
        new ButtonUtils(this.btn_close, this.close, this);
        for (var i = 0; i < 4; i++) {
            new ButtonUtils(this["answer" + i], this.onClickItem, this, null, null, i).setBtnType(ButtonConst.BUTTON_TYPE_3);
        }
        new ButtonUtils(this.alertBtn, this.onClickAlert, this).setBtnType(ButtonConst.BUTTON_TYPE_4);

    }

    public setData(data) {
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
        this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        var descArr = this.eventInfo.desc;
        this.answerTitle.text = TranslateFunc.instance.getTranslate(descArr[0], "TranslateEvent");
        
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
            this.rightLab.text = TranslateFunc.instance.getTranslate("#tid_fog_answer_alert", null, [this.answerArr[this.rightIndex]]);

        } else {
            //按钮初始化
            this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_ANSWER_ALERT);
            if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
                this.alertBtn.visible = false;
            } else {
                this.alertBtn.visible = true;
                this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
                if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                    StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_QUESTION_SHOW);
                } 
            }

        }
        for (var i = 0; i < 4; i++) {
            this["resultLab" + i].text = this.txtArr[i] + TranslateFunc.instance.getTranslate(descArr[i + 1], "TranslateEvent");

            this["answer" + i].skin = ResourceConst.FOG_EVENT_ANSWER_DEFAULT_DITU;
            if (this.wrongIndexArr.indexOf(i) != -1) {
                //显示×号
                this["resultImg" + i].visible = true;
                this["resultImg" + i].skin = ResourceConst.FOG_EVENT_ANSWER_CHAHAO;
                //底框显示
                this["answer" + i].skin = ResourceConst.FOG_EVENT_ANSWER_CLICK_DITU;
            } else {
                this["resultImg" + i].visible = false;
                this["answer" + i].skin = ResourceConst.FOG_EVENT_ANSWER_DEFAULT_DITU;
            }
        }

       
        if (this.continueCount) {
            this.costGroup.visible = true;
            this.costLab.text = this.continueCostArr[this.continueCount - 1];
        } else {
            this.costGroup.visible = false;
        }

        //角色spine
        this.showRoleSpine();



        BannerAdManager.addBannerQuick(this);

    }
    showRoleSpine() {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }

        if (this.eventInfo.uiSpine) {
            var spine = this.eventInfo.uiSpine;

            var item = PoolTools.getItem(PoolCode.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView(spine[0], scaleRoleInfo, 0,"FogAnswerUI");
            } else {
                this.roleAnim = item;
                item.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);

            //todo:阴影大小
            var shadeScale = BattleFunc.instance.getShadeScale(100);
            this.roleAnim.setShade(shadeScale);
            this.roleAnim.play(spine[1], true);
        }
    }
    //消耗行动力继续回答
    onClickContinue(index) {
        //判断行动力是否足够
        var cost = this.continueCostArr[this.continueCount - 1];
        //消耗行动力判断
        var userActNum = FogModel.instance.getActNum()
        if (userActNum < Number(cost)) {
            FogModel.instance.checkFreeAct();
            return;
        }

        //消耗行动力
        FogServer.continueAnswer({ "cost": cost }, () => {
            this.checkAnswer(index);
        }, this);

    }
    checkAnswer(index) {
        //回答正确index
        if (index == this.rightIndex) {
            this["resultImg" + index].visible = true;
            this["resultImg" + index].skin = ResourceConst.FOG_EVENT_ANSWER_DUIHAO;

            this.costGroup.visible = false;
            this.isAnswerRight = true;

            //2秒后自动关闭
            TimerManager.instance.setTimeout(() => {
                this.onClick();
            }, this, 2000);
        }
        //回答错误
        else {
            this["resultImg" + index].visible = true;
            this["resultImg" + index].skin = ResourceConst.FOG_EVENT_ANSWER_CHAHAO;

            this.continueCount++;
            this.costGroup.visible = true;
            this.costLab.text = this.continueCostArr[this.continueCount - 1];

            //回答错误，记录下数据，便于下次展示
            this.wrongIndexArr.push(index);
            FogServer.addCellEvent({ cellId: this.cell.mySign, wrongIndexArr: this.wrongIndexArr, id: this.eventId }, null, null);
        }
    }
    onClickItem(index) {
        //判断是否已经回答正确
        if (this.isAnswerRight) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_answer_already_right"));
            return;
        }

        this["answer" + index].skin = ResourceConst.FOG_EVENT_ANSWER_CLICK_DITU;
        if (index == 0) {
            //判断结果
            this.checkAnswer(index);
        } else {
            this.onClickContinue(index);
        }

    }
    //点击提示按钮
    onClickAlert() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_QUESTION_CLICK);
        } 
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_ANSWER_ALERT, ShareOrTvManager.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, () => { }, this);
    }
    successfull() {
        FogServer.addCellEvent({ cellId: this.cell.mySign, isVideoGetRight: 1, id: this.eventId }, () => {
            this.alertBtn.visible = false;
            this.rightLab.visible = true;
            this.rightLab.text = TranslateFunc.instance.getTranslate("#tid_fog_answer_alert", null, [this.answerArr[this.rightIndex]]);
        }, this);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_QUESTION_FINISH);
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_QUESTION_FINISH);
        } 
    }
    close() {
        TimerManager.instance.removeByObject(this);
        this.onClick();
    }
    onClick() {
        WindowManager.CloseUI(WindowCfgs.FogAnswerUI);
        if (this.isAnswerRight) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}