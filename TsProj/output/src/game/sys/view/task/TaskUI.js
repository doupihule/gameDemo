"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const TaskFunc_1 = require("../../func/TaskFunc");
const TaskConst_1 = require("../../consts/TaskConst");
const DailyTaskUI_1 = require("./DailyTaskUI");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const TaskGuideTrigger_1 = require("../../trigger/TaskGuideTrigger");
const TaskServer_1 = require("../../server/TaskServer");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const FogServer_1 = require("../../server/FogServer");
const ChatTaskUI_1 = require("./ChatTaskUI");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const RedPointConst_1 = require("../../consts/RedPointConst");
const UserModel_1 = require("../../model/UserModel");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TaskModel_1 = require("../../model/TaskModel");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const MainJumpReturnComp_1 = require("../../../../framework/platform/comp/MainJumpReturnComp");
class TaskUI extends layaMaxUI_1.ui.gameui.task.TaskUI {
    constructor() {
        super();
        this.curTab = 0;
        //每日任务列表
        this.dailyTaskArr = [];
        //主线任务列表
        this.chatTaskArr = [];
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.onCloseBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.chatTaskBtn, this.onClickChat, this);
        new ButtonUtils_1.ButtonUtils(this.dailyTaskBtn, this.onClickDaily, this);
        this.addTask();
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        ScreenAdapterTools_1.default.alignNotch(this.group_ctn, ScreenAdapterTools_1.default.Align_MiddleTop);
    }
    /**添加事件监听 */
    addEvent() {
    }
    addTask() {
        TaskFunc_1.default.instance.getTask();
        this.chatTaskArr = TaskFunc_1.default.chatTaskArr;
        this.dailyTaskArr = TaskFunc_1.default.dailyTaskArr;
    }
    setData(data) {
        this.curTab = data && data.tab || 0;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc_1.default.instance.getDataNum("dailyTaskUnlock")) {
            this.dailyTaskBtn.visible = false;
        }
        else {
            this.dailyTaskBtn.visible = true;
            this.freshDailyRed();
        }
        this.onClickTab(this.curTab);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.TASK_OPEN);
        MainJumpReturnComp_1.default.instance.showJumpReturnBtn(this);
    }
    freshDailyRed() {
        this.dailyRed.visible = TaskModel_1.default.instance.getDailyRed();
    }
    onClickTab(index) {
        this.chatTaskBtn.skin = (index == 0) ? "uisource/task/task/task_bt_lianxiren2.png" : "uisource/task/task/task_bt_lianxiren1.png";
        this.dailyTaskBtn.skin = (index == 1) ? "uisource/task/task/task_bt_richeng2.png" : "uisource/task/task/task_bt_richeng1.png";
        if (index == 0) {
            this.setChatGroup();
        }
        else {
            this.setDailyGroup();
        }
    }
    //联系人
    setChatGroup() {
        if (!this.chatGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.ChatTaskUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.chatGroup = new ChatTaskUI_1.default(this);
                this.group_ctn.addChild(this.chatGroup);
                this.chatGroup.setData();
            }));
        }
        else {
            this.chatGroup.visible = true;
            this.chatGroup.setData();
        }
        if (this.dailyGroup) {
            this.dailyGroup.visible = false;
        }
    }
    //每日任务
    setDailyGroup() {
        if (!this.dailyGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.DailyTaskUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.dailyGroup = new DailyTaskUI_1.default(this);
                this.group_ctn.addChild(this.dailyGroup);
                this.dailyGroup.setData();
            }));
        }
        else {
            this.dailyGroup.visible = true;
            this.dailyGroup.setData();
        }
        if (this.chatGroup) {
            this.chatGroup.visible = false;
        }
    }
    /**时间到了刷新主线 */
    freshChatGroup() {
        this.chatGroup && this.chatGroup.setData();
    }
    onClickChat() {
        if (this.curTab == 0)
            return;
        this.curTab = 0;
        this.onClickTab(this.curTab);
    }
    onClickDaily() {
        if (this.curTab == 1)
            return;
        this.curTab = 1;
        this.onClickTab(this.curTab);
    }
    onCloseBtnClick() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TASKRED);
        this.dailyGroup && this.dailyGroup.close();
        this.chatGroup && this.chatGroup.close();
    }
    /**点击继续 */
    onClickGo(data) {
        TaskGuideTrigger_1.default.clickGoOn(data);
    }
    onClickReceive(data) {
        var item = data.data;
        TaskServer_1.default.updateTaskReceive({ id: item.id, type: item.type }, () => {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TaskDoubleRewardUI, { shareName: ShareTvOrderFunc_1.default.SHARELINE_TASK_DOUBLEREWARD, reward: item.reward, succCall: this.successMoneyCall.bind(this, item.reward), thisObj: this, params: { taskId: item.id } });
            this.successReceiveCall(item.reward);
            if (item.type == TaskConst_1.default.Task_type_daily) {
                this.freshDailyRed();
            }
            else {
                TaskModel_1.default.instance.setMyFollowDelay(item.role, item.id);
            }
            data.callBack && data.callBack.call(data.thisObj);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.TASK_GETREWARD, { taskId: item.id });
        }, this);
    }
    close() {
    }
    successReceiveCall(reward) {
        FogServer_1.default.getReward({ reward: reward });
    }
    successMoneyCall(reward) {
        var result = [];
        for (var i = 0; i < reward.length; i++) {
            if (reward[i][0] == DataResourceFunc_1.DataResourceType.TASKPOINT)
                continue;
            result.push(reward[i]);
        }
        FogServer_1.default.getReward({ reward: result });
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = TaskUI;
//# sourceMappingURL=TaskUI.js.map