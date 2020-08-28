"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const FogConst_1 = require("../../../consts/FogConst");
const LevelFunc_1 = require("../../../func/LevelFunc");
const BattleSceneManager_1 = require("../../../manager/BattleSceneManager");
class FogNpcTalkUI extends layaMaxUI_1.ui.gameui.fog.FogNpcTalkUI {
    constructor() {
        super();
        this.talkIndex = 0;
        this.descArr = [];
        this.params = [];
        this.isFinish = false; //事件是否完成
        this.viewType = FogConst_1.default.VIEW_TYPE_NPC_TACK;
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
    }
    setData(data) {
        this.descArr = [];
        this.talkIndex = 0;
        this.params = [];
        this.isFinish = false;
        this.viewType = FogConst_1.default.VIEW_TYPE_NPC_TACK;
        this.callBack = null;
        this.thisObj = null;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        if (data && data.viewType) {
            this.viewType = data && data.viewType;
        }
        //npc对话
        if (this.viewType == FogConst_1.default.VIEW_TYPE_NPC_TACK) {
            this.events = data.event;
            this.cell = data.cell;
            this.eventId = this.events.eventId;
            this.eventInfo = this.events.cfgData;
            //描述
            this.descArr = this.eventInfo.desc;
            this.params = this.eventInfo.params ? this.eventInfo.params : [];
        }
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_MAIN_LEVEL) {
            //关卡id
            var level = data.level;
            var levelInfo = LevelFunc_1.default.instance.getLevelInfoById(level);
            if (levelInfo.dialogue) {
                //对话角色图,位置,对话文本;对话角色图,位置,对话文本;
                var dialogue = levelInfo.dialogue;
                for (var i = 0; i < dialogue.length; i++) {
                    if (dialogue[i].length == 3) {
                        this.descArr.push(dialogue[i][2]);
                        this.params.push([dialogue[i][0], dialogue[i][1]]);
                    }
                    else {
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
        if (this.viewType == FogConst_1.default.VIEW_TYPE_NPC_TACK) {
            this.text.text = TranslateFunc_1.default.instance.getTranslate(this.descArr[index], "TranslateEvent");
        }
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_MAIN_LEVEL) {
            this.text.text = TranslateFunc_1.default.instance.getTranslate(this.descArr[index], "TranslateLevel");
        }
        //图标显示
        this.panelImg.scaleX = 1;
        this.panelImg.x = 0;
        if (this.params[index] && this.params[index].length != 0) {
            if (this.params[index][1] == FogConst_1.default.FOG_NPC_ROLE_LEFT) {
                this.leftImg.visible = true;
                this.rightImg.visible = false;
                if (this.params[index][0].indexOf("guide") == -1) {
                    this.leftImg.skin = "heroiconbig/heroiconbig/" + this.params[index][0] + ".png";
                }
                else {
                    this.leftImg.skin = "uisource/guide/guide/" + this.params[index][0] + ".png";
                }
                this.panelImg.scaleX = 1;
                this.panelImg.x = 0;
            }
            else if (this.params[index][1] == FogConst_1.default.FOG_NPC_ROLE_RIGHT) {
                this.leftImg.visible = false;
                this.rightImg.visible = true;
                if (this.params[index][0].indexOf("guide") == -1) {
                    this.rightImg.skin = "heroiconbig/heroiconbig/" + this.params[index][0] + ".png";
                }
                else {
                    this.rightImg.skin = "uisource/guide/guide/" + this.params[index][0] + ".png";
                }
                this.panelImg.scaleX = -1;
                this.panelImg.x = 584;
            }
        }
        else {
            this.leftImg.visible = false;
            this.rightImg.visible = false;
        }
    }
    onClickContinue() {
        this.talkIndex++;
        if (this.talkIndex >= this.descArr.length) {
            this.finishCallBack();
        }
        else {
            this.refreshPanel(this.talkIndex);
        }
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogNpcTalkUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
        if (this.viewType == FogConst_1.default.VIEW_TYPE_MAIN_LEVEL) {
            BattleSceneManager_1.default.instance.setGamePlayOrPause(false);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogNpcTalkUI;
//# sourceMappingURL=FogNpcTalkUI.js.map