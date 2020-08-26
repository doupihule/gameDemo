import BaseModel from "./BaseModel";
import TaskChatFunc from "../func/TaskChatFunc";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import TaskModel from "./TaskModel";

/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
export default class ChatInfoModel extends BaseModel {
	public constructor() {
		super();
	}

	private static _instance: ChatInfoModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new ChatInfoModel()
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
	}

	getData() {
		return this._data;
	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);
	}

	/**获取对话信息 */
	getChatInfoById(roleId, taskId): SCChatItemData {
		var data = this.getData();
		return data[roleId] && data[roleId][taskId]
	}

	getAllChatByRole(role) {
		var data = this.getData();
		return data[role]
	}

	getDialogByIndex(role, index) {
		var data = this.getData();
		var info = data[role];
		var result;
		if (info) {
			for (var key in info) {
				var item = info[key];
				if (item.index == index) {
					result = key;
					break;
				}
			}
		}
		return result;
	}

	/**获取当前对话内容 */
	getDialogById(taskData) {
		var data = this.getChatInfoById(taskData.role, taskData.id);
		var front = data && data.frontNum || 0;
		var follow = data && data.followNum || 0;
		var index = 0;
		//有后置信息就显示后置
		if (follow) {
			follow -= 1;
			if (follow != 0) {
				index = data.answer && data.answer[taskData.followChat[follow - 1]] || 0;
				index = index - 1 >= 0 ? index - 1 : 0;
			}
			var content = TaskChatFunc.instance.getCfgDatasByKey("TaskChat", taskData.followChat[follow], "content");
			return TranslateFunc.instance.getTranslate(content[index])
		} else {
			//判断前置是否结束
			var isOver = false;
			if (front == taskData.frontChat.length && !TaskModel.instance.getIsNeedAnswer(data, taskData.frontChat[front - 1])) {
				isOver = true;
			}
			//前置结束了显示后置的第一条
			if (isOver) {
				var content = TaskChatFunc.instance.getCfgDatasByKey("TaskChat", taskData.followChat[0], "content");
				return TranslateFunc.instance.getTranslate(content[index])
			} else {
				//前置未结束 显示前置
				front = front - 1 > 0 ? front - 1 : 0;
				if (front != 0) {
					index = data.answer && data.answer[taskData.frontChat[front - 1]] || 0;
					index = index - 1 >= 0 ? index - 1 : 0;
				}
				var content = TaskChatFunc.instance.getCfgDatasByKey("TaskChat", taskData.frontChat[front], "content");
				return TranslateFunc.instance.getTranslate(content[index])
			}
		}
	}


}
