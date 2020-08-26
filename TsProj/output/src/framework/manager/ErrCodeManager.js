"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TranslateFunc_1 = require("../func/TranslateFunc");
const LogsManager_1 = require("./LogsManager");
const ErrorCode_1 = require("../../game/sys/common/kakura/ErrorCode");
const Message_1 = require("../common/Message");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const UserInfo_1 = require("../common/UserInfo");
const Client_1 = require("../common/kakura/Client");
const WindowManager_1 = require("./WindowManager");
const KakuraClient_1 = require("../common/kakura/KakuraClient");
const Global_1 = require("../../utils/Global");
class ErrCodeManager {
    constructor() {
        //没有处理的errorcode状态
        this.ERROR_STATE_NOHANDLE = 0;
        //处理了错误日志但是要发送到错误日志平台
        this.ERROR_STATE_HADNLE_SENDERROR = 1;
        /*不需要发送错误日志平台的状态*/
        this.ERROR_STATE_HANDLE_NOSEND = 2;
        this.popupErrs = [10053, 10054, 10071, 10072]; //需要弹窗提示
        this._configData = {};
    }
    static get ins() {
        if (!this._ins) {
            this._ins = new ErrCodeManager();
        }
        return this._ins;
    }
    initConfig() {
        // this._configData = RES.getRes("TranslateError_json");
        //通用的表单独插入
        TranslateFunc_1.default.instance.insertOneCfgs("TranslateError_json");
        this.checkErrCode();
    }
    setErr(errCode) {
        // if (this._currCode == "999722") return ;
        var warningList = [];
        var resendList = [];
        var hasSendError = false;
        LogsManager_1.default.warn(">>>>>>>>>>>>errCode>>>>>>>>>>>>", errCode);
        var errerMessage = TranslateFunc_1.default.instance.getTranslate("#error" + errCode);
        if (errCode == ErrorCode_1.default.duplicate_login) { //重复登陆
            // {"error":{"code":999722,"message":"duplicate login"}}
            WindowManager_1.default.setPopupTip(1, errerMessage, this.sureCallback, this);
        }
        else if (errCode == ErrorCode_1.default.sys_error) { //系统错误
            WindowManager_1.default.setPopupTip(1, errerMessage, this.sureCallback, this);
        }
        else if (this.popupErrs.indexOf(parseInt(errCode)) > -1) {
            WindowManager_1.default.setPopupTip(1, errerMessage, this.sureCallback, this);
        }
        else if (errCode == ErrorCode_1.default.kakura_needClientUpdate || errCode == ErrorCode_1.default.kakura_server_error || errCode == ErrorCode_1.default.sec_no_open || this._currCode == ErrorCode_1.default.sec_maintain ||
            this._currCode == ErrorCode_1.default.kakura_needClientUpdate || this._currCode == ErrorCode_1.default.kakura_server_error) {
            WindowManager_1.default.setPopupTip(1, errerMessage, this.sureCallback, this);
        }
        else if (errCode == ErrorCode_1.default.need_client_relogin) { //需要重启请求Global
            WindowManager_1.default.setPopupTip(1, errerMessage, () => {
                Message_1.default.instance.send(MsgCMD_1.default.REQ_GLOBAL);
            }, this);
        }
        else if (errCode == ErrorCode_1.default.webOffline) {
            WindowManager_1.default.setPopupTip(1, errerMessage, this.reauthHandler, this);
        }
        else if (String(errCode) == ErrorCode_1.default.account_data_error) {
            //后端反作弊系统报错，数据错误
            WindowManager_1.default.setPopupTip(1, errerMessage, this.sureCallback, this);
            // SingleCommonServer.errorSave();
        }
        else {
            var flag = true;
            for (var warning of warningList) {
                // LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode + " ?");
                if (Number(errCode) == warning.errCode) {
                    // LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode);
                    if (warning.sendMethod) {
                        if (KakuraClient_1.default.instance._currentConn && Number(KakuraClient_1.default.instance._currentConn.method) == warning.sendMethod) {
                            flag = false;
                            LogsManager_1.default.echo("krma. _currentConn.method " + Number(KakuraClient_1.default.instance._currentConn.method) + " " + warning.sendMethod);
                        }
                    }
                    else {
                        flag = false;
                    }
                    break;
                }
            }
            if (errCode == ErrorCode_1.default.server_error_test_210101 && flag) {
                LogsManager_1.default.sendErrorToPlatform("210101_sign_login_step_error", LogsManager_1.default.errorTage_serverError);
                hasSendError = true;
            }
            if (flag) { //弹出tip意味是意料外情况，可能需要上传日志
                if (Global_1.default.checkIsSingleMode()) { //单机模式不显示tip
                    WindowManager_1.default.ShowTip(errerMessage);
                }
            }
        }
        for (var warning of resendList) {
            // LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode + " ?");
            if (Number(errCode) == warning.errCode) {
                // LogsManager.echo("krma. warning " + Number(errCode) + " = " + warning.errCode);
                KakuraClient_1.default.instance.resendCurrentConnLater();
            }
        }
        if (!hasSendError) {
            var needError = this.checkNeedSendError(errCode);
            LogsManager_1.default.echo("_错误码:", errCode, "是否需要发送错误:", needError);
            if (needError) {
                //发送错误日志平台 拉取最近200行的日志
                LogsManager_1.default.sendErrorToPlatform("code:" + errCode + "," + errerMessage, LogsManager_1.default.errorTage_serverError, 200);
            }
        }
        this._currCode = errCode;
    }
    sureCallback() {
        UserInfo_1.default.platform.loginOut();
    }
    checkErrCode() {
        //"#error10000": {"hid": "#error10000", "zh_CN": "NotOk message \u672a\u5b9a\u4e49"}
        var config = TranslateFunc_1.default.instance.getAllCfgData("TranslateError_json");
        for (var i in config) {
            var msg = config[i].zh_CN;
            var state = config[i].state;
            var content = "";
            if (msg == undefined) {
                content += "zh_CN";
            }
            if (state == undefined || parseInt(state) == 0) {
                content += "  state";
            }
            if (content != "") {
                content = "<" + config[i].hid + "> " + content;
                LogsManager_1.default.warn("ErrorCode Id :", content);
            }
        }
    }
    //判断是否需要把服务器返回的错误发送日志平台
    checkNeedSendError(errorCode) {
        var config;
        var configArr = ["TranslateError", "localErrorCodeMap"];
        var key = "#error" + errorCode;
        for (var i = 0; i < configArr.length; i++) {
            config = TranslateFunc_1.default.instance.getAllCfgData(configArr[i], true);
            var info = config[key];
            if (info) {
                var state = info.state;
                if (state != this.ERROR_STATE_HANDLE_NOSEND) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }
    reauthHandler() {
        Client_1.default.instance.checkConnect();
    }
    logoutHandler() {
        // Message.instance.send(MsgCMD.MODULE_SHOW, { windowName: WindowCfgs.LOGIN, data: 1 });
    }
}
exports.default = ErrCodeManager;
//# sourceMappingURL=ErrCodeManager.js.map