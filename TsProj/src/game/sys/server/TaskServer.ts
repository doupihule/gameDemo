import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserExtModel from "../model/UserExtModel";
import GameUtils from "../../../utils/GameUtils";
import CountsModel from "../model/CountsModel";
import TaskModel from "../model/TaskModel";
import TaskConst from "../consts/TaskConst";
import TaskConditionTrigger from "../trigger/TaskConditionTrigger";
import TaskFunc from "../func/TaskFunc";



export default class TaskServer {
    /**更新任务进度 */
    static updateTaskProcess(data, callBack = null, thisObj = null, isAsyc = true) {
        var upData = {};
        var task = {};
        var taskCount = {};
        //如果指定了任务类型 就只对改任务类型计数
        if (data.type) {
            taskCount[data.type] = {};
            taskCount[data.type][data.logicType] = data.count || TaskModel.instance.getTaskProcessByType(data.type, data.logicType) + 1;
        } else {
            //如果未指定，就把每日和主线都加次数
            taskCount[TaskConst.Task_type_chat] = {};
            taskCount[TaskConst.Task_type_chat][data.logicType] = data.count || TaskModel.instance.getTaskProcessByType(TaskConst.Task_type_chat, data.logicType) + 1;
            taskCount[TaskConst.Task_type_daily] = {};
            taskCount[TaskConst.Task_type_daily][data.logicType] = data.count || TaskModel.instance.getTaskProcessByType(TaskConst.Task_type_daily, data.logicType) + 1;
        }
        task["taskCount"] = taskCount;
        upData["tasks"] = task;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer.startSaveClientData();
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
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (data.type == TaskConst.Task_type_daily) {
            TaskServer.updateTaskProcess({ logicType: TaskConditionTrigger.taskCondition_dailyTaskCount }, null, null, false)
        }
        SingleCommonServer.startSaveClientData();
    }
    /**更新任务宝箱 */
    static updateTaskBox(data, callBack = null, thisObj = null) {
        var upData = {};
        var tasks = {};
        var taskBox = {};
        taskBox[data.id] = 1;
        tasks["taskBox"] = taskBox;
        upData["tasks"] = tasks;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
    /**更新任务活跃度 */
    static updateTaskPoint(data, callBack = null, thisObj = null, isAsyc = false) {
        var upData = {};
        var tasks = {};
        tasks = {
            taskPoint: TaskModel.instance.getTaskPoint() + Number(data.point)
        }
        upData["tasks"] = tasks;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        if (isAsyc) {
            SingleCommonServer.startSaveClientData();
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
        }
        var data = TaskModel.instance.getData();
        var count = data.taskCount;
        //清除完成次数
        if (count && count[TaskConst.Task_type_daily]) {
            tasks["taskCount"] = {};
            tasks["taskCount"][TaskConst.Task_type_daily] = 1;
        }
        var receive = data.task;
        //清除领取状态
        if (receive) {
            var task = {};
            for (var id in receive) {
                var type = TaskFunc.instance.getCfgDatasByKey("Task", id, "type");
                if (type == TaskConst.Task_type_daily) {
                    task[id] = 1;
                }
            }
            tasks["task"] = task
        }
        deData["tasks"] = tasks;
        var backData = Client.instance.doDummyServerBack(null, upData, deData);
    }
}