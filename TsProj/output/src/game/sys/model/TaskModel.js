"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const UserModel_1 = require("./UserModel");
const TaskConst_1 = require("../consts/TaskConst");
const Message_1 = require("../../../framework/common/Message");
const TaskEvent_1 = require("../event/TaskEvent");
const ChatInfoModel_1 = require("./ChatInfoModel");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
const TaskFunc_1 = require("../func/TaskFunc");
const GameMainEvent_1 = require("../event/GameMainEvent");
const RedPointConst_1 = require("../consts/RedPointConst");
const TaskChatFunc_1 = require("../func/TaskChatFunc");
/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
class TaskModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TaskModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
        Message_1.default.instance.send(TaskEvent_1.default.TASK_EVENT_FRESHTASKBOX);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TASKRED);
    }
    getData() {
        return this._data;
    }
    /**根据任务id获取任务数据 */
    getTaskInfoById(id) {
        var data = this.getData();
        var task = data.task;
        if (task) {
            return task[id];
        }
        return null;
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    /**获取任务是否解锁 */
    getTaskIsUnlock(condition, level) {
        var unlock = true;
        for (var i = 0; i < condition.length; i++) {
            var item = condition[i];
            if (Number(item[0]) == TaskConst_1.default.Task_unlockType_level) {
                if (level < Number(item[1])) {
                    unlock = false;
                    break;
                }
            }
            else if (Number(item[0]) == TaskConst_1.default.Task_unlockType_taskId) {
                var task = this.getTaskInfoById(item[1]);
                if (!task) {
                    unlock = false;
                    break;
                }
                else {
                    //该任务已领取，判断该任务是否有后置对话并已完成
                    var data = TaskFunc_1.default.instance.getCfgDatas("Task", item[1]);
                    if (data.type == TaskConst_1.default.Task_type_chat) {
                        var chatInfo = ChatInfoModel_1.default.instance.getChatInfoById(data.role, data.id);
                        if (data.followChat) {
                            if (!chatInfo.followNum || data.followChat.length > chatInfo.followNum) {
                                //后置对话未读完
                                unlock = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return unlock;
    }
    /**
     * 获取任务进度
     * @param taskType  任务类型：每日/主线
     * @param logicType  逻辑类型
     */
    getTaskProcessByType(taskType, logicType) {
        var data = this.getData();
        return data.taskCount && data.taskCount[taskType] && data.taskCount[taskType][logicType] || 0;
    }
    getTaskPoint() {
        var data = this.getData();
        return data.taskPoint || 0;
    }
    /**获取宝箱是否被领取 */
    getIsReceiveBox(id) {
        var data = this.getData();
        return data.taskBox && data.taskBox[id];
    }
    getIsNeedAnswer(info, contentId) {
        var content = TaskChatFunc_1.default.instance.getCfgDatas("TaskChat", contentId);
        if (content.reply) {
            if (info.answer && info.answer[contentId]) {
                return false;
            }
            return true;
        }
        return false;
    }
    /**通过任务获取主线任务状态 */
    getChatTaskStateById(data) {
        var state;
        var id = data.id;
        var chatInfo = ChatInfoModel_1.default.instance.getChatInfoById(data.role, id);
        //该任务有前置对话，判断是否已读
        if (data.frontChat) {
            if (!chatInfo || data.frontChat.length > chatInfo.frontNum) {
                state = TaskConst_1.default.Chat_state_noRead;
            }
            else {
                //如果最后一条需要回答
                if (this.getIsNeedAnswer(chatInfo, data.frontChat[chatInfo.frontNum - 1])) {
                    state = TaskConst_1.default.Chat_state_noRead;
                    return state;
                }
                //已读了对话,判断是否完成了任务
                var info = TaskConditionTrigger_1.default.checkTaskCondition(data);
                if (info.finish) {
                    //已完成并已领取
                    if (TaskModel.instance.getTaskInfoById(id)) {
                        state = TaskConst_1.default.Chat_state_finish;
                        //如果本任务处于锁定状态，就显示当前的状态
                        if (TaskModel.lockTaskTab[id])
                            return state;
                        //判断是否有后置
                        if (data.followChat) {
                            if (!chatInfo.followNum || data.followChat.length > chatInfo.followNum) {
                                //后置对话未读完
                                state = TaskConst_1.default.Chat_state_noRead;
                            }
                            else {
                                //如果最后一条需要回答
                                if (this.getIsNeedAnswer(chatInfo, data.followChat[chatInfo.followNum - 1])) {
                                    state = TaskConst_1.default.Chat_state_noRead;
                                    return state;
                                }
                                //判断是否是当前角色的最新对话
                                if (this.checkIsHaveState(data.role, chatInfo.index, data.id)) {
                                    state = TaskConst_1.default.Chat_state_read;
                                }
                                else {
                                    state = null;
                                }
                            }
                        }
                        else {
                            //没有后置对话，但也不是该角色的最新对话，也不放到显示列表
                            if (!this.checkIsHaveState(data.role, chatInfo.index, data.id)) {
                                state = null;
                            }
                        }
                    }
                    else {
                        //完成可领取
                        state = TaskConst_1.default.Chat_state_canReceive;
                    }
                }
                else {
                    state = TaskConst_1.default.Chat_state_noFinish;
                }
            }
        }
        return state;
    }
    /**获取是否有可领的每日任务宝箱 */
    getCanReceiveBox() {
        var point = TaskModel.instance.getTaskPoint();
        var boxData = TaskFunc_1.default.instance.getAllCfgData("TaskBox");
        var isCan = false;
        for (var key in boxData) {
            var item = boxData[key];
            if (item.points <= point && !TaskModel.instance.getIsReceiveBox(key)) {
                isCan = true;
                break;
            }
        }
        return isCan;
    }
    /**检测我当前是否有状态 */
    checkIsHaveState(role, index, curId) {
        var task = TaskFunc_1.default.instance.getTaskCountByRole(role);
        //如果当前任务的index等于该角色所有的任务数 直接返回有状态
        if (index == task.length)
            return true;
        var result;
        for (var i = 0; i < task.length; i++) {
            var target = task[i];
            if (target == curId)
                continue;
            //任务已领取 检测下一个
            if (TaskModel.instance.getTaskInfoById(target) && ChatInfoModel_1.default.instance.getChatInfoById(role, target).index < index)
                continue;
            //如果目标任务处于锁定中，直接返回有状态
            if (TaskModel.lockTaskTab[target])
                continue;
            //判断下个任务是否解锁
            var data = TaskFunc_1.default.instance.getCfgDatas("Task", target);
            if (data.condition) {
                //如果下个任务没解锁 还是显示当前的
                if (!this.getTaskIsUnlock(data.condition, UserModel_1.default.instance.getMaxBattleLevel())) {
                    continue;
                }
            }
            result = target;
            break;
        }
        if (result) {
            return false;
        }
        else {
            return true;
        }
    }
    /**获取每日任务红点 */
    getDailyRed() {
        TaskFunc_1.default.instance.getTask();
        var allInfo = TaskFunc_1.default.dailyTaskArr;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var isShow = false;
        for (var i = 0; i < allInfo.length; i++) {
            var item = allInfo[i];
            var condition = item.condition;
            var unlock = false;
            if (condition) {
                if (TaskModel.instance.getTaskIsUnlock(condition, level)) {
                    unlock = true;
                }
            }
            else {
                unlock = true;
            }
            if (unlock) {
                var isReceive = TaskModel.instance.getTaskInfoById(item.id);
                var finish = 0;
                if (!isReceive) {
                    var process = TaskConditionTrigger_1.default.checkTaskCondition(item);
                    finish = process.finish;
                    if (finish) {
                        isShow = true;
                        break;
                    }
                }
            }
        }
        if (!isShow) {
            isShow = TaskModel.instance.getCanReceiveBox();
        }
        return isShow;
    }
    /**设置下一个任务的延迟显示 */
    setNextTaskDelay(role, task) {
        var arr = TaskFunc_1.default.instance.getTaskCountByRole(role);
        var index = arr.indexOf(task);
        var id = arr[index + 1];
        if (id) {
            var data = TaskFunc_1.default.instance.getCfgDatas("Task", id);
            var isunlock = true;
            if (data.condition) {
                //如果下个任务没解锁 还是显示当前的
                if (!this.getTaskIsUnlock(data.condition, UserModel_1.default.instance.getMaxBattleLevel())) {
                    isunlock = false;
                }
            }
            if (isunlock && data.frontChatDelay && !TaskModel.lockTaskTab[id]) {
                TaskModel.lockTaskTab[id] = data.frontChatDelay;
            }
        }
    }
    /**设置我的后置对话延迟 */
    setMyFollowDelay(role, task) {
        var data = TaskFunc_1.default.instance.getCfgDatas("Task", task);
        if (data.followChat && data.followChatDelay && !TaskModel.lockTaskTab[task]) {
            TaskModel.lockTaskTab[task] = data.followChatDelay;
        }
        else {
            //没有后置就判断下个任务
            if (!data.followChat) {
                this.setNextTaskDelay(role, task);
            }
        }
    }
}
exports.default = TaskModel;
TaskModel.lockTaskTab = {};
//# sourceMappingURL=TaskModel.js.map