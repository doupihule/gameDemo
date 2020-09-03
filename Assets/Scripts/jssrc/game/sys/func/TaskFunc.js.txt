"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const TaskConst_1 = require("../consts/TaskConst");
/*
* Description: 任务 模块
*/
class TaskFunc extends BaseFunc_1.default {
    getCfgsPathArr() {
        return [
            { name: "Task_json" },
            { name: "TaskBox_json" },
            { name: "TranslateTask_json" }
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TaskFunc();
            this.initGlobalParams();
        }
        return this._instance;
    }
    //初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
    static initGlobalParams() {
        this.taskBoxDouble = GlobalParamsFunc_1.default.instance.getDataNum("taskBoxDouble");
        this.roleSizeInTask = GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInTask") / 10000;
    }
    getTask() {
        if (!TaskFunc.chatTaskArr) {
            TaskFunc.chatTaskArr = [];
            TaskFunc.dailyTaskArr = [];
            var info = TaskFunc.instance.getAllCfgData("Task");
            var allTask = {};
            TableUtils_1.default.deepCopy(info, allTask);
            for (var key in allTask) {
                var info = allTask[key];
                if (info.type == TaskConst_1.default.Task_type_chat) {
                    TaskFunc.chatTaskArr.push(info);
                }
                else if (info.type == TaskConst_1.default.Task_type_daily) {
                    TaskFunc.dailyTaskArr.push(info);
                }
            }
        }
    }
    /**获取某角色的任务数 */
    getTaskCountByRole(role) {
        if (!TaskFunc.roleTaskCount) {
            TaskFunc.roleTaskCount = {};
            this.getTask();
            var arr = TaskFunc.chatTaskArr;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (!TaskFunc.roleTaskCount[item.role]) {
                    TaskFunc.roleTaskCount[item.role] = [];
                }
                TaskFunc.roleTaskCount[item.role].push(item.id);
            }
        }
        return TaskFunc.roleTaskCount[role];
    }
}
exports.default = TaskFunc;
TaskFunc.taskBoxDouble = 2;
TaskFunc.roleSizeInTask = 1.5;
//# sourceMappingURL=TaskFunc.js.map