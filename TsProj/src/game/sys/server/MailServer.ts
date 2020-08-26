import Client from "../../../framework/common/kakura/Client";
import Method from "../common/kakura/Method";

/* 
对战模块
 */
export default class MailServer {
    /* 
    获取邮件列表
    */
    static getMails(data: any, callBack: any, thisObj: any) {
        Client.instance.send(Method.Mail_getMails, data, callBack, thisObj);
    }
    /* 
    读取邮件
     */
    static readMail(mailId: any, callBack: any, thisObj: any) {
        var data = {
            mailId: mailId,
        }
        Client.instance.send(Method.Mail_readMail, data, callBack, thisObj);
    }
    /* 
    领取单个邮件奖励
    */
    static getMail(mailId: any, callBack: any, thisObj: any) {
        var data = {
            mailId: mailId,
        }
        Client.instance.send(Method.Mail_getMail, data, callBack, thisObj);
    }
    /* 
    一键删除
    */
    static deleteAll(data: any, callBack: any, thisObj: any) {
        Client.instance.send(Method.Mail_deleteAll, data, callBack, thisObj);
    }
    /* 
    一键领取
    */
    static getAll(data: any, callBack: any, thisObj: any) {
        Client.instance.send(Method.Mail_getAll, data, callBack, thisObj);
    }
}