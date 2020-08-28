"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const Method_1 = require("../common/kakura/Method");
/*
对战模块
 */
class MailServer {
    /*
    获取邮件列表
    */
    static getMails(data, callBack, thisObj) {
        Client_1.default.instance.send(Method_1.default.Mail_getMails, data, callBack, thisObj);
    }
    /*
    读取邮件
     */
    static readMail(mailId, callBack, thisObj) {
        var data = {
            mailId: mailId,
        };
        Client_1.default.instance.send(Method_1.default.Mail_readMail, data, callBack, thisObj);
    }
    /*
    领取单个邮件奖励
    */
    static getMail(mailId, callBack, thisObj) {
        var data = {
            mailId: mailId,
        };
        Client_1.default.instance.send(Method_1.default.Mail_getMail, data, callBack, thisObj);
    }
    /*
    一键删除
    */
    static deleteAll(data, callBack, thisObj) {
        Client_1.default.instance.send(Method_1.default.Mail_deleteAll, data, callBack, thisObj);
    }
    /*
    一键领取
    */
    static getAll(data, callBack, thisObj) {
        Client_1.default.instance.send(Method_1.default.Mail_getAll, data, callBack, thisObj);
    }
}
exports.default = MailServer;
//# sourceMappingURL=MailServer.js.map