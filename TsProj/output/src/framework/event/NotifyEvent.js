"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotifyEvent {
    //服务器的推送时间map
    constructor() {
    }
}
exports.default = NotifyEvent;
//当收到服务器推送的时候 会发送对应的消息.
NotifyEvent.methodToEventMap = {
    ["10000"]: "CLIENT_SEND_LOG",
};
//# sourceMappingURL=NotifyEvent.js.map