import BaseFunc from "../../../framework/func/BaseFunc";
import GlobalParamsFunc from "./GlobalParamsFunc";
import TableUtils from "../../../framework/utils/TableUtils";
import TaskConst from "../consts/TaskConst";

/*
* Description: 任务 模块
*/
export default class TaskFunc extends BaseFunc {

	getCfgsPathArr() {
		return [
			{name: "Task_json"},
			{name: "TaskBox_json"},
			{name: "TranslateTask_json"}
		];
	}

	static _instance: TaskFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new TaskFunc();
			this.initGlobalParams();
		}
		return this._instance;
	}

	static chatTaskArr: any[];
	static dailyTaskArr: any[];
	static taskBoxDouble = 2;
	static roleSizeInTask = 1.5;
	static roleTaskCount;

	//初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
	public static initGlobalParams() {
		this.taskBoxDouble = GlobalParamsFunc.instance.getDataNum("taskBoxDouble");
		this.roleSizeInTask = GlobalParamsFunc.instance.getDataNum("roleSizeInTask") / 10000;

	}

	getTask() {
		if (!TaskFunc.chatTaskArr) {
			TaskFunc.chatTaskArr = [];
			TaskFunc.dailyTaskArr = [];
			var info = TaskFunc.instance.getAllCfgData("Task");
			var allTask = {};
			TableUtils.deepCopy(info, allTask)
			for (var key in allTask) {
				var info = allTask[key];
				if (info.type == TaskConst.Task_type_chat) {
					TaskFunc.chatTaskArr.push(info);
				} else if (info.type == TaskConst.Task_type_daily) {
					TaskFunc.dailyTaskArr.push(info);
				}
			}
		}
	}

	/**获取某角色的任务数 */
	getTaskCountByRole(role) {
		if (!TaskFunc.roleTaskCount) {
			TaskFunc.roleTaskCount = {}
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
		return TaskFunc.roleTaskCount[role]
	}

}