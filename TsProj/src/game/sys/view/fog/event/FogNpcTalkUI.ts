import { ui } from "../../../../../ui/layaMaxUI";
import IMessage from "../../../interfaces/IMessage";
import WindowManager from "../../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../../consts/WindowCfgs";
import TranslateFunc from "../../../../../framework/func/TranslateFunc";
import FogEventData from "../../../../fog/data/FogEventData";
import FogInstanceCell from "../../../../fog/instance/FogInstanceCell";
import FogConst from "../../../consts/FogConst";
import LevelFunc from "../../../func/LevelFunc";
import UserModel from "../../../model/UserModel";
import BattleSceneManager from "../../../manager/BattleSceneManager";



export default class FogNpcTalkUI extends ui.gameui.fog.FogNpcTalkUI implements IMessage {

    private eventId;//事件id
    private eventInfo;//事件cfg
    private talkIndex = 0;
    private descArr = [];
    private params = [];

    private callBack;
    private thisObj;
    private isFinish = false;//事件是否完成

    //格子事件
    private events: FogEventData;
    //格子
    private cell: FogInstanceCell;

    private viewType = FogConst.VIEW_TYPE_NPC_TACK;

    constructor() {
        super();
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
    }

    public setData(data) {
        this.descArr = [];
        this.talkIndex = 0;
        this.params = [];
        this.isFinish = false;
        this.viewType = FogConst.VIEW_TYPE_NPC_TACK;
        this.callBack = null;
        this.thisObj = null;


        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        if (data && data.viewType) {
            this.viewType = data && data.viewType;
        }


        //npc对话
        if (this.viewType == FogConst.VIEW_TYPE_NPC_TACK) {
            this.events = data.event;
            this.cell = data.cell;
            this.eventId = this.events.eventId;
            this.eventInfo = this.events.cfgData;
            //描述
            this.descArr = this.eventInfo.desc;
            this.params = this.eventInfo.params ? this.eventInfo.params : [];
        }
        else if (this.viewType == FogConst.VIEW_TYPE_MAIN_LEVEL) {
            //关卡id
            var level = data.level;
            var levelInfo = LevelFunc.instance.getLevelInfoById(level);
            if (levelInfo.dialogue) {
                //对话角色图,位置,对话文本;对话角色图,位置,对话文本;
                var dialogue = levelInfo.dialogue;
                for (var i = 0; i < dialogue.length; i++) {
                    if (dialogue[i].length == 3) {
                        this.descArr.push(dialogue[i][2]);
                        this.params.push([dialogue[i][0], dialogue[i][1]]);
                    } else {
                        this.descArr.push(dialogue[i][0]);
                        this.params.push([]);
                    }

                }
            }
        }


        //初始化界面
        this.refreshPanel(this.talkIndex);

    }
    refreshPanel(index) {
        //对话显示
        //npc对话
        if (this.viewType == FogConst.VIEW_TYPE_NPC_TACK) {
            this.text.text = TranslateFunc.instance.getTranslate(this.descArr[index], "TranslateEvent");
        }
        else if (this.viewType == FogConst.VIEW_TYPE_MAIN_LEVEL) {
            this.text.text = TranslateFunc.instance.getTranslate(this.descArr[index], "TranslateLevel");
        }


        //图标显示
        this.panelImg.scaleX = 1;
        this.panelImg.x = 0;
        if (this.params[index] && this.params[index].length != 0) {
            if (this.params[index][1] == FogConst.FOG_NPC_ROLE_LEFT) {
                this.leftImg.visible = true;
                this.rightImg.visible = false;
                if (this.params[index][0].indexOf("guide") == -1) {
                    this.leftImg.skin = "heroiconbig/heroiconbig/" + this.params[index][0] + ".png";
                } else {
                    this.leftImg.skin = "uisource/guide/guide/" + this.params[index][0] + ".png";
                }
                this.panelImg.scaleX = 1;
                this.panelImg.x = 0;

            } else if (this.params[index][1] == FogConst.FOG_NPC_ROLE_RIGHT) {
                this.leftImg.visible = false;
                this.rightImg.visible = true;
                if (this.params[index][0].indexOf("guide") == -1) {
                    this.rightImg.skin = "heroiconbig/heroiconbig/" + this.params[index][0] + ".png";
                } else {
                    this.rightImg.skin = "uisource/guide/guide/" + this.params[index][0] + ".png";
                }
                this.panelImg.scaleX = -1;
                this.panelImg.x = 584;
            }
        } else {
            this.leftImg.visible = false;
            this.rightImg.visible = false;
        }
    }

    onClickContinue() {
        this.talkIndex++;
        if (this.talkIndex >= this.descArr.length) {
            this.finishCallBack();
        } else {
            this.refreshPanel(this.talkIndex);
        }
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogNpcTalkUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
        if (this.viewType == FogConst.VIEW_TYPE_MAIN_LEVEL) {
            BattleSceneManager.instance.setGamePlayOrPause(false);
        }
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}