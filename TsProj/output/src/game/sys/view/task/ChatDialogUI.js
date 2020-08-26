"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const TaskChatFunc_1 = require("../../func/TaskChatFunc");
const TaskFunc_1 = require("../../func/TaskFunc");
const TaskModel_1 = require("../../model/TaskModel");
const ChatInfoModel_1 = require("../../model/ChatInfoModel");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const ChatItemUI_1 = require("./ChatItemUI");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const ChatInfoServer_1 = require("../../server/ChatInfoServer");
class ChatDialogUI extends layaMaxUI_1.ui.gameui.task.ChatDialogUI {
    constructor() {
        super();
        this.infoArr = [];
        this.uiArr = [];
        this.allHeight = 0;
        //对话类型 1是前置对话 2是后置对话
        this.showType = 1;
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        ScreenAdapterTools_1.default.alignNotch(this.group_ctn, ScreenAdapterTools_1.default.Align_MiddleTop);
        this.group_ctn.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
        for (var i = 1; i < 4; i++) {
            new ButtonUtils_1.ButtonUtils(this["myDialog" + i], this.onClickChoose, this, null, null, i);
        }
        this.group_ctn.vScrollBarSkin = "";
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onClickClose, this);
        new ButtonUtils_1.ButtonUtils(this.watchBtn, this.onClickWatch, this);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickClose, this);
    }
    setData(data) {
        this.cfgData = data.cfg;
        this.taskUI = data.task;
        this.chatUI = data.chat;
        this.chooseGroup.visible = false;
        this.inPutGroup.visible = false;
        this.levelGroup.visible = false;
        this.infoArr = [];
        this.allHeight = 0;
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.ChatItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.init));
    }
    init() {
        this.initChatData();
        this.showChatInfo();
        this.setNowDialog();
    }
    /**初始化已有的数据 */
    initChatData() {
        var role = this.cfgData.role;
        var chatInfo = ChatInfoModel_1.default.instance.getAllChatByRole(role);
        if (chatInfo) {
            var allLength = Object.keys(chatInfo).length;
            if (allLength > 0) {
                for (var i = 1; i <= allLength; i++) {
                    var key = ChatInfoModel_1.default.instance.getDialogByIndex(role, i);
                    var cfg = TaskFunc_1.default.instance.getCfgDatas("Task", key);
                    var info = ChatInfoModel_1.default.instance.getChatInfoById(role, key);
                    if (info) {
                        var front = info.frontNum || 0;
                        if (front) {
                            var content = cfg.frontChat;
                            this.getResultByChat(front, content, info);
                        }
                        var back = info.followNum || 0;
                        if (back) {
                            var content = cfg.followChat;
                            this.getResultByChat(back, content, info);
                        }
                    }
                }
            }
        }
    }
    /**把当前已有的文本加进去 */
    getResultByChat(front, content, info) {
        for (var j = 0; j < front; j++) {
            var index = 0;
            var chatId = content[j];
            if (j != 0) {
                //判断本条的上一条有没有回答，根据回答选择当前的文本
                index = info.answer && info.answer[content[j - 1]] || 0;
                if (index) {
                    //如果有回答，当前的下标为选项-1
                    index -= 1;
                }
            }
            var result = TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", chatId);
            this.infoArr.push({ type: 1, info: TranslateFunc_1.default.instance.getTranslate(result.content[index]) });
            //如果本条有回答，把回答加进去
            if (info.answer && info.answer[chatId]) {
                this.infoArr.push({ type: 2, info: TranslateFunc_1.default.instance.getTranslate(result.reply[info.answer[chatId] - 1]) });
            }
        }
    }
    /**显示已有对话ui */
    showChatInfo() {
        this.allHeight = 0;
        for (var i = 0; i < this.infoArr.length; i++) {
            var item = this.infoArr[i];
            this.addUI(item, false);
        }
        this.group_ctn.vScrollBar.setScroll(0, this.allHeight + 4000, this.allHeight);
    }
    /**设置当前的文本 */
    setNowDialog() {
        var info = ChatInfoModel_1.default.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var isOver = true;
        if (!info || info.frontNum < this.cfgData.frontChat.length) {
            this.showType = 1;
            this.showTxt(info && info.frontNum || 0, info);
            isOver = false;
        }
        else {
            var contentId = this.cfgData.frontChat[info.frontNum - 1];
            if (TaskModel_1.default.instance.getIsNeedAnswer(info, contentId)) {
                this.showAnswerTip(TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", contentId));
                return;
            }
            this.showType = 2;
            var isReceive = TaskModel_1.default.instance.getTaskInfoById(this.cfgData.id);
            //如果该奖励已领取并且有后置对话
            if (isReceive && this.cfgData.followChat) {
                var num = info.followNum || 0;
                //当前后置对话总数小于配置数量  就显示后置对话
                if (num < this.cfgData.followChat.length) {
                    this.showTxt(num, info);
                    isOver = false;
                }
                else {
                    contentId = this.cfgData.followChat[info.followNum - 1];
                    if (TaskModel_1.default.instance.getIsNeedAnswer(info, contentId)) {
                        this.showAnswerTip(TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", contentId));
                        return;
                    }
                }
            }
        }
        if (isOver) {
            this.checkIsOverDialog();
        }
    }
    /**确定要展示的文本 */
    showTxt(index, info, checkNext = false) {
        var content;
        if (this.showType == 1) {
            content = this.cfgData.frontChat;
        }
        else if (this.showType == 2) {
            content = this.cfgData.followChat;
        }
        this.chooseGroup.visible = false;
        this.inPutGroup.visible = true;
        this.levelGroup.visible = false;
        var id = content[index];
        if (!id) {
            this.checkIsOverDialog(checkNext);
            return;
        }
        var chatInfo = TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", id);
        var lblIndex = 0;
        if (index != 0) {
            //判断本条的上一条有没有回答，根据回答选择当前的文本
            lblIndex = info.answer && info.answer[content[index - 1]] || 0;
            var lastDialog = TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", content[index - 1]);
            if (!lblIndex && lastDialog.reply) {
                //如果上一条需要回答但还没有数据,先显示回答
                this.showAnswerTip(lastDialog);
                return;
            }
            if (lblIndex) {
                //如果有回答，当前的下标为选项-1
                lblIndex -= 1;
            }
        }
        TimerManager_1.default.instance.setTimeout(this.showTxtUI, this, chatInfo.deleyTime, [{ info: info, chatInfo: chatInfo, index: index, content, txt: TranslateFunc_1.default.instance.getTranslate(chatInfo.content[lblIndex]) }]);
    }
    /**显示文本ui */
    showTxtUI(data) {
        var info = data[0];
        var chatInfo = info.chatInfo;
        var index = info.index + 1;
        var content = info.content;
        this.addUI({ info: info.txt, type: 1 });
        ChatInfoServer_1.default.upDateChatInfo({ role: this.cfgData.role, taskId: this.cfgData.id, type: this.showType });
        //如果本条对话需要回复
        if (chatInfo.reply) {
            this.showAnswerTip(chatInfo);
        }
        else {
            if (content[index]) {
                this.showTxt(index, info.info);
            }
            else {
                this.checkIsOverDialog(true);
            }
        }
    }
    /**检测是否已经结束对话 */
    checkIsOverDialog(checkNext = false) {
        var info = ChatInfoModel_1.default.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var isOver = false;
        if (this.showType == 1) {
            if (info && info.frontNum == this.cfgData.frontChat.length) {
                isOver = true;
            }
        }
        else if (this.showType == 2) {
            if (info && info.followNum == this.cfgData.followChat.length) {
                isOver = true;
            }
        }
        if (isOver) {
            this.levelGroup.visible = true;
            this.inPutGroup.visible = false;
            this.chooseGroup.visible = false;
            if (this.showType == 1) {
                this.watchBtn.visible = true;
                this.returnBtn.visible = false;
            }
            else {
                this.watchBtn.visible = false;
                this.returnBtn.visible = true;
                //某个任务的后置对话完了，判断下个任务是否解锁并且是否有延迟
                if (checkNext) {
                    TaskModel_1.default.instance.setNextTaskDelay(this.cfgData.role, this.cfgData.id);
                }
            }
        }
    }
    addUI(item, scroll = true) {
        var ui;
        if (this.uiArr.length > 0) {
            ui = this.uiArr[0];
            this.uiArr.splice(0, 1);
        }
        else {
            ui = new ChatItemUI_1.default();
        }
        ui.setData({ info: item, roleId: this.cfgData.role });
        this.group_ctn.addChild(ui);
        ui.y = this.allHeight;
        this.allHeight += ui.height;
        if (scroll) {
            this.group_ctn.vScrollBar.setScroll(0, this.allHeight + 4000, this.allHeight);
        }
    }
    /**显示回答 */
    showAnswerTip(chatInfo) {
        this.chooseGroup.visible = true;
        this.inPutGroup.visible = false;
        this.levelGroup.visible = false;
        var reply = chatInfo.reply;
        this.myDialog1.visible = false;
        this.myDialog2.visible = false;
        this.myDialog3.visible = false;
        this.nowContentId = chatInfo.id;
        for (var i = 0; i < reply.length; i++) {
            this["myDialog" + (i + 1)].visible = true;
            this["dialogTxt" + (i + 1)].text = TranslateFunc_1.default.instance.getTranslate(reply[i]);
        }
        if (reply.length == 1) {
            this.myDialog1.y = 85;
        }
        else if (reply.length == 2) {
            this.myDialog1.y = 38;
            this.myDialog2.y = 128;
        }
        else {
            this.myDialog1.y = 12;
            this.myDialog2.y = 85;
        }
    }
    onClickClose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.ChatDialoglUI);
        TimerManager_1.default.instance.removeByObject(this);
        //刷新任务界面列表
        this.chatUI && this.chatUI.freshData();
        //缓存UI
        for (var i = this.group_ctn.numChildren - 1; i >= 0; i--) {
            var item = this.group_ctn.getChildAt(i);
            this.uiArr.push(item);
            item.removeSelf();
        }
    }
    onClickWatch() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChatDetailUI, { cfg: this.cfgData, task: this.taskUI, chat: this.chatUI, dialog: this });
    }
    onClickChoose(index) {
        this.addUI({ info: this["dialogTxt" + index].text, type: 2 });
        this.chooseGroup.visible = false;
        var answer = {};
        answer[this.nowContentId] = index;
        ChatInfoServer_1.default.upDateChatInfo({ role: this.cfgData.role, taskId: this.cfgData.id, answer: answer }, this.continueShowTxt, this, true);
    }
    continueShowTxt() {
        var info = ChatInfoModel_1.default.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var num = this.showType == 1 ? info.frontNum : info.followNum;
        this.showTxt(num, info, true);
    }
    recvMsg(cmd, data) {
    }
    close() {
    }
}
exports.default = ChatDialogUI;
//# sourceMappingURL=ChatDialogUI.js.map