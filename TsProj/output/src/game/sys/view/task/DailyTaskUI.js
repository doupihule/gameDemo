"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const TaskModel_1 = require("../../model/TaskModel");
const UserModel_1 = require("../../model/UserModel");
const TaskConditionTrigger_1 = require("../../trigger/TaskConditionTrigger");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogFunc_1 = require("../../func/FogFunc");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const TaskFunc_1 = require("../../func/TaskFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const Message_1 = require("../../../../framework/common/Message");
const TaskEvent_1 = require("../../event/TaskEvent");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const TaskServer_1 = require("../../server/TaskServer");
const ChapterConst_1 = require("../../consts/ChapterConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class DailyTaskUI extends layaMaxUI_1.ui.gameui.task.DailyTaskUI {
    constructor(task) {
        super();
        this.timeCode = 0;
        this.stateTab = {};
        this.addEvent();
        this.task = task;
        this.allInfo = this.task.dailyTaskArr;
        this.boxData = TaskFunc_1.default.instance.getAllCfgData("TaskBox");
        for (var id in this.boxData) {
            var info = this.boxData[id];
            new ButtonUtils_1.ButtonUtils(this["taskBox" + id], this.onClickBox, this, null, null, [info]);
        }
        this.m_list.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
    }
    /**添加事件监听 */
    addEvent() {
        Message_1.default.instance.add(TaskEvent_1.default.TASK_EVENT_FRESHTASKBOX, this);
    }
    setData(data) {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.TASKDAILY_OPEN);
        this.initData();
        this.initList();
        this.initBox();
    }
    initData() {
        this.listData = [];
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
                var isReceive = TaskModel_1.default.instance.getTaskInfoById(item.id);
                isReceive = isReceive ? 1 : 0;
                var finish = 0;
                if (!isReceive) {
                    var process = TaskConditionTrigger_1.default.checkTaskCondition(item);
                    finish = process.finish;
                    item.state = process;
                }
                item.isReceive = isReceive;
                item.finish = finish;
                this.listData.push(item);
            }
        }
        //排序：已完成可领取>未完成>已领取
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
    //活跃度宝箱
    initBox() {
        var point = TaskModel_1.default.instance.getTaskPoint();
        this.pointTxt.text = point + "";
        var width = point * this.pro_boxDi.width / 100;
        this.pro_boxImg.width = width > this.pro_boxDi.width ? this.pro_boxDi.width : width;
        for (var id in this.boxData) {
            var info = this.boxData[id];
            this["taskBox" + id].x = info.points * this.pro_boxDi.width / 100;
            var isReceive = TaskModel_1.default.instance.getIsReceiveBox(id);
            this.stateTab[id] = ChapterConst_1.default.Chapter_boxState_lock;
            Laya.Tween.clearAll(this["img_box" + id]);
            if (isReceive) {
                this["img_box" + id].skin = "uisource/task/task/task_icon_baoxiang" + id + "_2.png";
                this.stateTab[id] = ChapterConst_1.default.Chapter_boxState_receive;
            }
            else {
                this["img_box" + id].skin = "uisource/task/task/task_icon_baoxiang" + id + "_1.png";
                if (info.points <= point) {
                    TweenAniManager_1.default.instance.scaleQipaoAni(this["img_box" + id], 1.2, null, null);
                    this.stateTab[id] = ChapterConst_1.default.Chapter_boxState_unlock;
                }
            }
            this["lbl_point" + id].text = info.points + "";
        }
    }
    onListRender(cell, index) {
        var data = this.m_list.array[index];
        var lbl_title = cell.getChildByName("lbl_title");
        var lbl_progress = cell.getChildByName("lbl_progress");
        var lbl_receive = cell.getChildByName("lbl_receive");
        var lbl_desc = cell.getChildByName("lbl_desc");
        var reward1 = cell.getChildByName("reward1");
        var reward2 = cell.getChildByName("reward2");
        var btn_receive = cell.getChildByName("btn_receive");
        var img_icon1 = reward1.getChildByName("img_icon1");
        var lbl_num1 = reward1.getChildByName("lbl_num1");
        var img_icon2 = reward2.getChildByName("img_icon2");
        var lbl_num2 = reward2.getChildByName("lbl_num2");
        var btn_goOn = cell.getChildByName("btn_goOn");
        var receive = data.isReceive;
        btn_receive.visible = false;
        btn_goOn.visible = false;
        lbl_receive.visible = false;
        if (receive) {
            lbl_receive.visible = true;
            lbl_progress.visible = false;
        }
        else {
            //没领取看下是否完成
            if (data.finish) {
                btn_receive.visible = true;
            }
            else {
                btn_goOn.visible = true;
            }
            lbl_progress.visible = true;
            lbl_progress.text = data.state.cur + "/" + data.state.target;
        }
        lbl_title.text = TranslateFunc_1.default.instance.getTranslate(data.name);
        lbl_desc.text = TranslateFunc_1.default.instance.getTranslate(data.desc);
        img_icon1.scale(1, 1);
        img_icon2.scale(1, 1);
        reward1.visible = false;
        reward2.visible = false;
        var reward = data.reward;
        if (reward[0]) {
            reward1.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[0]);
            img_icon1.skin = result.icon;
            lbl_num1.text = result.num;
            if (Number(reward[0][0]) == DataResourceFunc_1.DataResourceType.TASKPOINT) {
                img_icon1.scale(0.6, 0.6);
            }
        }
        if (reward[1]) {
            reward2.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[1]);
            img_icon2.skin = result.icon;
            lbl_num2.text = result.num + "";
            if (Number(reward[1][0]) == DataResourceFunc_1.DataResourceType.TASKPOINT) {
                img_icon1.scale(0.6, 0.6);
            }
        }
        new ButtonUtils_1.ButtonUtils(btn_goOn, this.onClickGo, this, null, null, [data]);
        new ButtonUtils_1.ButtonUtils(btn_receive, this.onClickReceive, this, null, null, [data]);
    }
    //点击前往
    onClickGo(data) {
        this.task.onClickGo(data[0]);
    }
    //点击领取
    onClickReceive(data) {
        var info = {
            data: data[0],
            callBack: this.freshData,
            thisObj: this
        };
        this.task.onClickReceive(info);
    }
    sortTask(a, b) {
        var big = a.isReceive - b.isReceive;
        if (big == 0) {
            big = b.finish - a.finish;
        }
        if (big == 0) {
            big = a.id - b.id;
        }
        return big;
    }
    onClickBox(data) {
        var info = data[0];
        var desc = TranslateFunc_1.default.instance.getTranslate("#tid_taskBox_point", null, info.points);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterBoxRewardUI, { shareName: ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD, doubleRate: TaskFunc_1.default.taskBoxDouble, type: this.stateTab[info.id], desc: desc, reward: info.reward, thisObj: this, callBack: this.receiveReward.bind(this, info.id), params: { boxId: info.id } });
    }
    receiveReward(id) {
        TaskServer_1.default.updateTaskBox({ id: id }, this.initBox, this);
    }
    recvMsg(cmd, data) {
        if (cmd == TaskEvent_1.default.TASK_EVENT_FRESHTASKBOX) {
            this.initBox();
            this.task && this.task.freshDailyRed();
        }
    }
    close() {
        Laya.Tween.clearAll(this.img_box1);
        Laya.Tween.clearAll(this.img_box2);
        Laya.Tween.clearAll(this.img_box3);
    }
}
exports.default = DailyTaskUI;
//# sourceMappingURL=DailyTaskUI.js.map