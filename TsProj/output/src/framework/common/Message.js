"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashMap_1 = require("../utils/HashMap");
class Message {
    constructor() {
        this.msgMap = new HashMap_1.default();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new Message();
        }
        return this._instance;
    }
    /**
     * 添加监听
     * @param cmd 消息类型
     * @param msg 监听函数
     */
    add(cmd, msg) {
        var list = this.msgMap.get(cmd);
        if (!list) {
            list = [];
            this.msgMap.put(cmd, list);
        }
        if (list.indexOf(msg) == -1) {
            list.push(msg);
        }
    }
    /**
     * 移除监听
     * @param cmd 消息类型
     * @param msg 监听函数
     */
    remove(cmd, msg) {
        var list = this.msgMap.get(cmd);
        if (list) {
            var len = list.length;
            for (var i = len - 1; i >= 0; i--) {
                if (list[i] == msg) {
                    list.splice(i, 1);
                }
            }
        }
    }
    /**
     * 发送消息
     * @param cmd 消息类型
     * @param data 数据
     */
    send(cmd, data = null) {
        var list = this.msgMap.get(cmd);
        if (list) {
            var len = list.length;
            for (var i = len - 1; i >= 0; i--) {
                list[i].recvMsg.call(list[i], cmd, data);
            }
            if (len <= 0) {
                this.msgMap.remove(cmd);
            }
        }
    }
    /**
    * 移除这个对象注册的所有事件
    */
    removeObjEvents(msg) {
        for (var i in this.msgMap) {
            var list = this.msgMap[i];
            if (list.length > 0) {
                var len = list.length;
                for (var ii = len - 1; ii >= 0; ii--) {
                    if (list[ii] == msg) {
                        list.splice(ii, 1);
                    }
                }
                if (list.length == 0) {
                    delete this.msgMap[i];
                }
            }
        }
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map