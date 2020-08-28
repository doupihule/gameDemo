"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const UserModel_1 = require("../../model/UserModel");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleRoleView_1 = require("../../../battle/view/BattleRoleView");
const BattleFunc_1 = require("../../func/BattleFunc");
const TaskChatFunc_1 = require("../../func/TaskChatFunc");
const TaskFunc_1 = require("../../func/TaskFunc");
const TaskModel_1 = require("../../model/TaskModel");
const TaskConditionTrigger_1 = require("../../trigger/TaskConditionTrigger");
const TaskConst_1 = require("../../consts/TaskConst");
const ChatInfoModel_1 = require("../../model/ChatInfoModel");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
class ChatTaskUI extends layaMaxUI_1.ui.gameui.task.ChatTaskUI {
    constructor(task) {
        super();
        this.timeCode = 0;
        this.stateTab = {};
        this.roleArr = [];
        this.addEvent();
        this.task = task;
        this.allInfo = this.task.chatTaskArr;
        this.m_list.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.initData();
        this.initList();
    }
    initData() {
        this.listData = [];
        this.roleArr = [];
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        for (var i = 0; i < this.allInfo.length; i++) {
            var item = this.allInfo[i];
            var condition = item.condition;
            var unlock = false;
            if (condition) {
                if (TaskModel_1.default.instance.getTaskIsUnlock(condition, level)) {
                    unlock = true;
                }
            }
            else {
                unlock = true;
            }
            if (unlock) {
                if (this.roleArr.indexOf(item.role) == -1) {
                    var state = TaskModel_1.default.instance.getChatTaskStateById(item);
                    if (state) {
                        item.state = state;
                        this.listData.push(item);
                        this.roleArr.push(item.role);
                    }
                }
            }
        }
        //排序
        this.listData.sort(this.sortTask);
    }
    //任务列表
    initList() {
        this.m_list.array = this.listData;
        this.m_list.renderHandler = new Laya.Handler(this, this.onListRender);
        this.m_list.scrollTo(0);
    }
    freshData() {
        this.initData();
        this.initList();
    }
    onListRender(cell, index) {
        var data = this.m_list.array[index];
        var bgImg = cell.getChildByName("bgImg");
        var lbl_title = bgImg.getChildByName("lbl_title");
        var lbl_receive = bgImg.getChildByName("lbl_receive");
        var lbl_desc = bgImg.getChildByName("lbl_desc");
        var lbl_noread = bgImg.getChildByName("lbl_noread");
        var lbl_read = bgImg.getChildByName("lbl_read");
        var btn_receive = cell.getChildByName("btn_receive");
        var btn_goOn = cell.getChildByName("btn_goOn");
        var roleSpine = bgImg.getChildByName("roleSpine");
        var roleChatData = TaskChatFunc_1.default.instance.getCfgDatas("TaskRole", data.role);
        btn_receive.visible = false;
        btn_goOn.visible = false;
        lbl_receive.visible = false;
        lbl_noread.visible = false;
        lbl_read.visible = false;
        if (roleSpine.numChildren > 0) {
            var item = roleSpine.getChildAt(0);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + "_" + roleSpine["roleId"], item);
            roleSpine.removeChildren();
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + "_" + data.role);
        var scale = TaskFunc_1.default.roleSizeInTask || 1.5;
        var showScale = scale * BattleFunc_1.default.defaultScale * (roleChatData.size / 10000);
        if (!cacheItem) {
            cacheItem = new BattleRoleView_1.default(roleChatData.spine, showScale, 0, "ChatTaskUI");
        }
        else {
            cacheItem.setItemViewScale(showScale);
        }
        cacheItem.play("idle", true);
        roleSpine.addChild(cacheItem);
        roleSpine["roleId"] = data.role;
        var state = data.state;
        if (state == TaskConst_1.default.Chat_state_noRead) {
            lbl_noread.visible = true;
        }
        else if (state == TaskConst_1.default.Chat_state_read) {
            lbl_read.visible = true;
        }
        else if (state == TaskConst_1.default.Chat_state_canReceive) {
            btn_receive.visible = true;
        }
        else if (state == TaskConst_1.default.Chat_state_finish) {
            lbl_receive.visible = true;
        }
        else if (state == TaskConst_1.default.Chat_state_noFinish) {
            btn_goOn.visible = true;
        }
        var name = TranslateFunc_1.default.instance.getTranslate(roleChatData.name);
        if (state == TaskConst_1.default.Chat_state_noRead || state == TaskConst_1.default.Chat_state_read) {
            lbl_title.text = name;
            lbl_desc.text = ChatInfoModel_1.default.instance.getDialogById(data);
        }
        else {
            var info = TaskConditionTrigger_1.default.checkTaskCondition(data);
            lbl_title.text = TranslateFunc_1.default.instance.getTranslate("#tid_task_chat_title", null, name);
            lbl_desc.text = TranslateFunc_1.default.instance.getTranslate(data.name);
            if (!info.noProcess) {
                lbl_desc.text += "(" + info.cur + "/" + info.target + ")";
            }
            else {
                if (info.finish) {
                    lbl_desc.text += "(1/1)";
                }
                else {
                    lbl_desc.text += "(0/1)";
                }
            }
        }
        new ButtonUtils_1.ButtonUtils(bgImg, this.onClickItem, this, null, null, [data]);
        new ButtonUtils_1.ButtonUtils(btn_goOn, this.onClickGo, this, null, null, [data]);
        new ButtonUtils_1.ButtonUtils(btn_receive, this.onClickReceive, this, null, null, [data]);
    }
    onClickGo(data) {
        this.task.onClickGo(data[0]);
    }
    onClickReceive(data) {
        var info = {
            data: data[0],
            callBack: this.freshData,
            thisObj: this
        };
        this.task.onClickReceive(info);
    }
    onClickItem(data) {
        data = data[0];
        if (data.state == TaskConst_1.default.Chat_state_noRead || data.state == TaskConst_1.default.Chat_state_read) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChatDialoglUI, { cfg: data, task: this.task, chat: this });
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChatDetailUI, { cfg: data, task: this.task, chat: this });
        }
    }
    sortTask(a, b) {
        var big = a.state - b.state;
        if (big == 0) {
            big = a.id - b.id;
        }
        return big;
    }
    recvMsg(cmd, data) {
    }
    close() {
    }
}
exports.default = ChatTaskUI;
//# sourceMappingURL=ChatTaskUI.js.map