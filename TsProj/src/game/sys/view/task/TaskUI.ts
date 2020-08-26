import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ui } from "../../../../ui/layaMaxUI";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import TaskFunc from "../../func/TaskFunc";
import TaskConst from "../../consts/TaskConst";
import DailyTaskUI from "./DailyTaskUI";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import TaskGuideTrigger from "../../trigger/TaskGuideTrigger";
import TaskServer from "../../server/TaskServer";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import FogServer from "../../server/FogServer";
import ChatTaskUI from "./ChatTaskUI";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import RedPointConst from "../../consts/RedPointConst";
import UserModel from "../../model/UserModel";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TaskModel from "../../model/TaskModel";
import { DataResourceType } from "../../func/DataResourceFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import MainJumpReturnComp from "../../../../framework/platform/comp/MainJumpReturnComp";


export default class TaskUI extends ui.gameui.task.TaskUI implements IMessage {

    private chatGroup;
    private dailyGroup;
    private curTab = 0;
    //每日任务列表
    public dailyTaskArr: any[] = [];
    //主线任务列表
    public chatTaskArr: any[] = [];
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils(this.btn_close, this.onCloseBtnClick, this);
        new ButtonUtils(this.chatTaskBtn, this.onClickChat, this);
        new ButtonUtils(this.dailyTaskBtn, this.onClickDaily, this);
        this.addTask();
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.group_ctn, ScreenAdapterTools.Align_MiddleTop);
    }
    /**添加事件监听 */
    addEvent() {
    }
    addTask() {
        TaskFunc.instance.getTask();
        this.chatTaskArr = TaskFunc.chatTaskArr;
        this.dailyTaskArr = TaskFunc.dailyTaskArr;
    }
    public setData(data): void {
        this.curTab = data && data.tab || 0;
        var level = UserModel.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc.instance.getDataNum("dailyTaskUnlock")) {
            this.dailyTaskBtn.visible = false;
        } else {
            this.dailyTaskBtn.visible = true;
            this.freshDailyRed();
        }
        this.onClickTab(this.curTab);
        StatisticsManager.ins.onEvent(StatisticsManager.TASK_OPEN)
        MainJumpReturnComp.instance.showJumpReturnBtn(this);
    }
    freshDailyRed() {
        this.dailyRed.visible = TaskModel.instance.getDailyRed();
    }
    private onClickTab(index) {
        this.chatTaskBtn.skin = (index == 0) ? "uisource/task/task/task_bt_lianxiren2.png" : "uisource/task/task/task_bt_lianxiren1.png";
        this.dailyTaskBtn.skin = (index == 1) ? "uisource/task/task/task_bt_richeng2.png" : "uisource/task/task/task_bt_richeng1.png";
        if (index == 0) {
            this.setChatGroup();
        } else {
            this.setDailyGroup();

        }
    }
    //联系人
    setChatGroup() {
        if (!this.chatGroup) {
            var res = WindowManager.getUILoadGroup(WindowCfgs.ChatTaskUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.chatGroup = new ChatTaskUI(this);
                this.group_ctn.addChild(this.chatGroup);
                this.chatGroup.setData();
            }));
        } else {
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
            var res = WindowManager.getUILoadGroup(WindowCfgs.DailyTaskUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.dailyGroup = new DailyTaskUI(this);
                this.group_ctn.addChild(this.dailyGroup);
                this.dailyGroup.setData();
            }));
        } else {
            this.dailyGroup.visible = true;
            this.dailyGroup.setData();
        }
        if (this.chatGroup) {
            this.chatGroup.visible = false;
        }
    }
    /**时间到了刷新主线 */
    freshChatGroup(){
        this.chatGroup&&this.chatGroup.setData();
    }
    onClickChat() {
        if (this.curTab == 0) return;
        this.curTab = 0;
        this.onClickTab(this.curTab)
    }
    onClickDaily() {
        if (this.curTab == 1) return;
        this.curTab = 1;
        this.onClickTab(this.curTab)
    }
    onCloseBtnClick() {
        WindowManager.CloseUI(WindowCfgs.TaskUI);
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TASKRED)
        this.dailyGroup && this.dailyGroup.close();
        this.chatGroup && this.chatGroup.close();
    }
    /**点击继续 */
    onClickGo(data) {
        TaskGuideTrigger.clickGoOn(data);
    }
    onClickReceive(data) {
        var item = data.data;
        TaskServer.updateTaskReceive({ id: item.id, type: item.type }, () => {
            WindowManager.OpenUI(WindowCfgs.TaskDoubleRewardUI, { shareName: ShareTvOrderFunc.SHARELINE_TASK_DOUBLEREWARD, reward: item.reward, succCall: this.successMoneyCall.bind(this, item.reward), thisObj: this, params: { taskId: item.id } })
            this.successReceiveCall(item.reward);
            if (item.type == TaskConst.Task_type_daily) {
                this.freshDailyRed();
            } else {
                TaskModel.instance.setMyFollowDelay(item.role, item.id)
            }
            data.callBack && data.callBack.call(data.thisObj)
            StatisticsManager.ins.onEvent(StatisticsManager.TASK_GETREWARD, { taskId: item.id })
        }, this)
    }
    close() {

    }
    successReceiveCall(reward) {
        FogServer.getReward({ reward: reward })
    }
    successMoneyCall(reward) {
        var result = [];
        for (var i = 0; i < reward.length; i++) {
            if (reward[i][0] == DataResourceType.TASKPOINT) continue;
            result.push(reward[i])
        }
        FogServer.getReward({ reward: result })
    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }

    }
}


