import IMessage from "../../interfaces/IMessage";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import UserModel from "../../model/UserModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleFunc from "../../func/BattleFunc";
import TaskChatFunc from "../../func/TaskChatFunc";
import TaskFunc from "../../func/TaskFunc";
import TaskUI from "./TaskUI";
import TaskModel from "../../model/TaskModel";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TaskConst from "../../consts/TaskConst";
import { stat } from "fs";
import ChatInfoModel from "../../model/ChatInfoModel";
import FogFunc from "../../func/FogFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { FORMERR } from "dns";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import ChatItemUI from "./ChatItemUI";
import TimerManager from "../../../../framework/manager/TimerManager";
import ChatInfoServer from "../../server/ChatInfoServer";
import ChatTaskUI from "./ChatTaskUI";


export default class ChatDialogUI extends ui.gameui.task.ChatDialogUI implements IMessage {


    private cfgData;
    private taskUI: TaskUI;
    private infoArr = [];
    private uiArr = [];
    private allHeight = 0;
    private nowContentId;
    //对话类型 1是前置对话 2是后置对话
    private showType = 1;
    private chatUI: ChatTaskUI;

    constructor() {
        super();
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.group_ctn, ScreenAdapterTools.Align_MiddleTop);
        this.group_ctn.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth;
        for (var i = 1; i < 4; i++) {
            new ButtonUtils(this["myDialog" + i], this.onClickChoose, this, null, null, i)
        }
        this.group_ctn.vScrollBarSkin = ""
        new ButtonUtils(this.btn_close, this.onClickClose, this)
        new ButtonUtils(this.watchBtn, this.onClickWatch, this)
        new ButtonUtils(this.returnBtn, this.onClickClose, this)

    }

    public setData(data): void {
        this.cfgData = data.cfg;
        this.taskUI = data.task;
        this.chatUI = data.chat;
        this.chooseGroup.visible = false;
        this.inPutGroup.visible = false;
        this.levelGroup.visible = false;
        this.infoArr = [];
        this.allHeight = 0;
        var res = WindowManager.getUILoadGroup(WindowCfgs.ChatItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.init));
    }
    init() {
        this.initChatData();
        this.showChatInfo();
        this.setNowDialog();
    }
    /**初始化已有的数据 */
    initChatData() {
        var role = this.cfgData.role;
        var chatInfo = ChatInfoModel.instance.getAllChatByRole(role);
        if (chatInfo) {
            var allLength = Object.keys(chatInfo).length;
            if (allLength > 0) {
                for (var i = 1; i <= allLength; i++) {
                    var key: SCChatItemData = ChatInfoModel.instance.getDialogByIndex(role, i);
                    var cfg = TaskFunc.instance.getCfgDatas("Task", key)
                    var info = ChatInfoModel.instance.getChatInfoById(role, key)
                    if (info) {
                        var front = info.frontNum || 0;
                        if (front) {
                            var content = cfg.frontChat;
                            this.getResultByChat(front, content, info)
                        }
                        var back = info.followNum || 0;
                        if (back) {
                            var content = cfg.followChat;
                            this.getResultByChat(back, content, info)
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
            var result = TaskChatFunc.instance.getCfgDatas("TaskChat", chatId);
            this.infoArr.push({ type: 1, info: TranslateFunc.instance.getTranslate(result.content[index]) });
            //如果本条有回答，把回答加进去
            if (info.answer && info.answer[chatId]) {
                this.infoArr.push({ type: 2, info: TranslateFunc.instance.getTranslate(result.reply[info.answer[chatId] - 1]) });
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
        var info = ChatInfoModel.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var isOver = true;
        if (!info || info.frontNum < this.cfgData.frontChat.length) {
            this.showType = 1;
            this.showTxt(info && info.frontNum || 0, info);
            isOver = false;
        } else {
            var contentId = this.cfgData.frontChat[info.frontNum - 1]
            if (TaskModel.instance.getIsNeedAnswer(info, contentId)) {
                this.showAnswerTip(TaskChatFunc.instance.getCfgDatas("TaskChat", contentId))
                return;
            }
            this.showType = 2;
            var isReceive = TaskModel.instance.getTaskInfoById(this.cfgData.id);
            //如果该奖励已领取并且有后置对话
            if (isReceive && this.cfgData.followChat) {
                var num = info.followNum || 0
                //当前后置对话总数小于配置数量  就显示后置对话
                if (num < this.cfgData.followChat.length) {
                    this.showTxt(num, info);
                    isOver = false;
                } else {
                    contentId = this.cfgData.followChat[info.followNum - 1]
                    if (TaskModel.instance.getIsNeedAnswer(info, contentId)) {
                        this.showAnswerTip(TaskChatFunc.instance.getCfgDatas("TaskChat", contentId))
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
            content = this.cfgData.frontChat
        } else if (this.showType == 2) {
            content = this.cfgData.followChat

        }
        this.chooseGroup.visible = false;
        this.inPutGroup.visible = true;
        this.levelGroup.visible = false;
        var id = content[index];
        if (!id) {
            this.checkIsOverDialog(checkNext);
            return;
        }
        var chatInfo = TaskChatFunc.instance.getCfgDatas("TaskChat", id);
        var lblIndex = 0;
        if (index != 0) {
            //判断本条的上一条有没有回答，根据回答选择当前的文本
            lblIndex = info.answer && info.answer[content[index - 1]] || 0;
            var lastDialog = TaskChatFunc.instance.getCfgDatas("TaskChat", content[index - 1])
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
        TimerManager.instance.setTimeout(this.showTxtUI, this, chatInfo.deleyTime, [{ info: info, chatInfo: chatInfo, index: index, content, txt: TranslateFunc.instance.getTranslate(chatInfo.content[lblIndex]) }])

    }
    /**显示文本ui */
    showTxtUI(data) {
        var info = data[0];
        var chatInfo = info.chatInfo;
        var index = info.index + 1;
        var content = info.content;
        this.addUI({ info: info.txt, type: 1 })
        ChatInfoServer.upDateChatInfo({ role: this.cfgData.role, taskId: this.cfgData.id, type: this.showType })
        //如果本条对话需要回复
        if (chatInfo.reply) {
            this.showAnswerTip(chatInfo);
        } else {
            if (content[index]) {
                this.showTxt(index, info.info)
            } else {
                this.checkIsOverDialog(true);
            }
        }

    }
    /**检测是否已经结束对话 */
    checkIsOverDialog(checkNext = false) {
        var info = ChatInfoModel.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var isOver = false;
        if (this.showType == 1) {
            if (info && info.frontNum == this.cfgData.frontChat.length) {
                isOver = true
            }
        } else if (this.showType == 2) {
            if (info && info.followNum == this.cfgData.followChat.length) {
                isOver = true
            }
        }
        if (isOver) {
            this.levelGroup.visible = true;
            this.inPutGroup.visible = false;
            this.chooseGroup.visible = false;
            if (this.showType == 1) {
                this.watchBtn.visible = true;
                this.returnBtn.visible = false;
            } else {
                this.watchBtn.visible = false;
                this.returnBtn.visible = true;
                //某个任务的后置对话完了，判断下个任务是否解锁并且是否有延迟
                if (checkNext) {
                    TaskModel.instance.setNextTaskDelay(this.cfgData.role, this.cfgData.id)
                }
            }
        }
    }
    addUI(item, scroll = true) {
        var ui: ChatItemUI;
        if (this.uiArr.length > 0) {
            ui = this.uiArr[0];
            this.uiArr.splice(0, 1)
        } else {
            ui = new ChatItemUI();

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
        this.myDialog1.visible = false
        this.myDialog2.visible = false
        this.myDialog3.visible = false
        this.nowContentId = chatInfo.id;
        for (var i = 0; i < reply.length; i++) {
            this["myDialog" + (i + 1)].visible = true;
            this["dialogTxt" + (i + 1)].text = TranslateFunc.instance.getTranslate(reply[i])
        }
        if (reply.length == 1) {
            this.myDialog1.y = 85;
        } else if (reply.length == 2) {
            this.myDialog1.y = 38;
            this.myDialog2.y = 128;
        } else {
            this.myDialog1.y = 12;
            this.myDialog2.y = 85;
        }
    }
    onClickClose() {
        WindowManager.CloseUI(WindowCfgs.ChatDialoglUI);
        TimerManager.instance.removeByObject(this)
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
        WindowManager.OpenUI(WindowCfgs.ChatDetailUI, { cfg: this.cfgData, task: this.taskUI, chat: this.chatUI, dialog: this })
    }
    onClickChoose(index) {
        this.addUI({ info: this["dialogTxt" + index].text, type: 2 });
        this.chooseGroup.visible = false;
        var answer = {};
        answer[this.nowContentId] = index
        ChatInfoServer.upDateChatInfo({ role: this.cfgData.role, taskId: this.cfgData.id, answer: answer }, this.continueShowTxt, this, true)
    }
    continueShowTxt() {
        var info = ChatInfoModel.instance.getChatInfoById(this.cfgData.role, this.cfgData.id);
        var num = this.showType == 1 ? info.frontNum : info.followNum
        this.showTxt(num, info, true)
    }
    recvMsg(cmd: string, data: any): void {


    }
    close() {

    }
}


