"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const TaskModel_1 = require("../model/TaskModel");
const TaskConst_1 = require("../consts/TaskConst");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
const TaskFunc_1 = require("../func/TaskFunc");
class TaskServer {
    /**更新任务进度 */
    static updateTaskProcess(data, callBack = null, thisObj = null, isAsyc = true) {
        var upData = {};
        var task = {};
        var taskCount = {};
        //如果指定了任务类型 就只对改任务类型计数
        if (data.type) {
            taskCount[data.type] = {};
            taskCount[data.type][data.logicType] = data.count || TaskModel_1.default.instance.getTaskProcessByType(data.type, data.logicType) + 1;
        }
        else {
            //如果未指定，就把每日和主线都加次数
            taskCount[TaskConst_1.default.Task_type_chat] = {};
            taskCount[TaskConst_1.default.Task_type_chat][data.logicType] = data.count || TaskModel_1.default.instance.getTaskProcessByType(TaskConst_1.default.Task_type_chat, data.logicType) + 1;
            taskCount[TaskConst_1.default.Task_type_daily] = {};
            taskCount[TaskConst_1.default.Task_type_daily][data.logicType] = data.count || TaskModel_1.default.instance.getTaskProcessByType(TaskConst_1.default.Task_type_daily, data.logicType) + 1;
        }
        task["taskCount"] = taskCount;
        upData["tasks"] = task;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**更新任务领取 */
    static updateTaskReceive(data, callBack = null, thisObj = null) {
        var upData = {};
        var tasks = {};
        var task = {};
        task[data.id] = 1;
        tasks["task"] = task;
        upData["tasks"] = tasks;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (data.type == TaskConst_1.default.Task_type_daily) {
            TaskServer.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_dailyTaskCount }, null, null, false);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**更新任务宝箱 */
    static updateTaskBox(data, callBack = null, thisObj = null) {
        var upData = {};
        var tasks = {};
        var taskBox = {};
        taskBox[data.id] = 1;
        tasks["taskBox"] = taskBox;
        upData["tasks"] = tasks;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**更新任务活跃度 */
    static updateTaskPoint(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var tasks = {};
        tasks = {
            taskPoint: TaskModel_1.default.instance.getTaskPoint() + Number(data.point)
        };
        upData["tasks"] = tasks;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer_1.default.startSaveClientData();
        }
    }
    /**清除每日任务 */
    static delDailyTask() {
        var upData = {};
        var deData = {};
        var tasks = {};
        //清除宝箱和活跃度
        tasks = {
            taskPoint: 1,
            taskBox: 1
        };
        var data = TaskModel_1.default.instance.getData();
        var count = data.taskCount;
        //清除完成次数
        if (count && count[TaskConst_1.default.Task_type_daily]) {
            tasks["taskCount"] = {};
            tasks["taskCount"][TaskConst_1.default.Task_type_daily] = 1;
        }
        var receive = data.task;
        //清除领取状态
        if (receive) {
            var task = {};
            for (var id in receive) {
                var type = TaskFunc_1.default.instance.getCfgDatasByKey("Task", id, "type");
                if (type == TaskConst_1.default.Task_type_daily) {
                    task[id] = 1;
                }
            }
            tasks["task"] = task;
        }
        deData["tasks"] = tasks;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
    }
}
exports.default = TaskServer;
//# sourceMappingURL=TaskServer.js.map