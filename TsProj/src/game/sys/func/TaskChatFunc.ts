import BaseFunc from "../../../framework/func/BaseFunc";

/*
* Description: 任务对话 模块
*/
export default class TaskChatFunc extends BaseFunc {

    getCfgsPathArr() {
        return [
            { name: "TaskRole_json" },
            { name: "TaskChat_json"}
        ];
    }
    static _instance: TaskChatFunc;
    static get instance() {
        if (!this._instance) {
            this._instance = new TaskChatFunc();
        }
        return this._instance;
    }
  
}