"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
/*
* Description: 任务对话 模块
*/
class TaskChatFunc extends BaseFunc_1.default {
    getCfgsPathArr() {
        return [
            { name: "TaskRole_json" },
            { name: "TaskChat_json" }
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TaskChatFunc();
        }
        return this._instance;
    }
}
exports.default = TaskChatFunc;
//# sourceMappingURL=TaskChatFunc.js.map