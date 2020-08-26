"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../common/Message");
const NotifyEvent_1 = require("../event/NotifyEvent");
//通知管理器
class NotifyManager {
    constructor() {
    }
    //收到服务器推送消息 并把服务器返回的数据发出去
    /**
      * 服务器推送数据格式
      * {
      * 	method:101,
      * 	params:{...},对应的参数
      * }
      */
    static onServerNotify(serverInfo) {
        console.log("=================get server push info ==========================", serverInfo);
        var method = serverInfo.method;
        Message_1.default.instance.send(NotifyEvent_1.default.methodToEventMap[String(method)], serverInfo);
        NotifyManager.notifyFlag = false;
    }
}
exports.default = NotifyManager;
NotifyManager.notifyFlag = false;
//# sourceMappingURL=NotifyManager.js.map