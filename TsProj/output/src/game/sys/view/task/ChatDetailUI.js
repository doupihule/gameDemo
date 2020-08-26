"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const TaskChatFunc_1 = require("../../func/TaskChatFunc");
const TaskModel_1 = require("../../model/TaskModel");
const TaskConditionTrigger_1 = require("../../trigger/TaskConditionTrigger");
const TaskConst_1 = require("../../consts/TaskConst");
const FogFunc_1 = require("../../func/FogFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
class ChatDetailUI extends layaMaxUI_1.ui.gameui.task.ChatDetailUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.goOnBtn, this.onClickGo, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickClose, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.cfgData = data.cfg;
        this.taskUI = data.task;
        this.chatUI = data.chat;
        this.dialog = data.dialog;
        var roleChatData = TaskChatFunc_1.default.instance.getCfgDatas("TaskRole", this.cfgData.role);
        var name = TranslateFunc_1.default.instance.getTranslate(roleChatData.name);
        this.titleTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_task_chat_title", null, name);
        var info = TaskConditionTrigger_1.default.checkTaskCondition(this.cfgData);
        this.nameTxt.text = TranslateFunc_1.default.instance.getTranslate(this.cfgData.name);
        if (!info.noProcess) {
            this.nameTxt.text += "(" + info.cur + "/" + info.target + ")";
        }
        else {
            if (info.finish) {
                this.nameTxt.text += "(1/1)";
            }
            else {
                this.nameTxt.text += "(0/1)";
            }
        }
        this.descTxt.text = TranslateFunc_1.default.instance.getTranslate(this.cfgData.desc);
        var width = info.cur * this.processDi.width / info.target;
        this.processImg.width = width > this.processDi.width ? this.processDi.width : width;
        this.rewardGroup1.visible = false;
        this.rewardGroup2.visible = false;
        var reward = this.cfgData.reward;
        if (reward[0]) {
            this.rewardGroup1.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[0]);
            this.rewardImg1.skin = result.icon;
            this.rewardTxt1.text = result.num;
        }
        if (reward[1]) {
            this.rewardGroup2.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[1]);
            this.rewardImg2.skin = result.icon;
            this.rewardTxt2.text = result.num + "";
        }
        if (reward.length == 1) {
            this.rewardGroup1.x = 71;
        }
        else {
            this.rewardGroup1.x = -3;
        }
        this.receiveBtn.visible = false;
        this.goOnBtn.visible = false;
        this.hasReceiveTxt.visible = false;
        var type = TaskModel_1.default.instance.getChatTaskStateById(this.cfgData);
        if (type == TaskConst_1.default.Chat_state_canReceive) {
            this.receiveBtn.visible = true;
        }
        else if (type == TaskConst_1.default.Chat_state_finish) {
            this.hasReceiveTxt.visible = true;
        }
        else if (type == TaskConst_1.default.Chat_state_noFinish) {
            this.goOnBtn.visible = true;
        }
    }
    onClickGo() {
        this.onClickClose();
        this.dialog && this.dialog.onClickClose();
        this.taskUI.onClickGo(this.cfgData);
    }
    onClickReceive() {
        this.onClickClose();
        this.dialog && this.dialog.onClickClose();
        this.chatUI.onClickReceive([this.cfgData]);
    }
    onClickClose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.ChatDetailUI);
    }
    recvMsg(cmd, data) {
    }
    close() {
    }
}
exports.default = ChatDetailUI;
//# sourceMappingURL=ChatDetailUI.js.map