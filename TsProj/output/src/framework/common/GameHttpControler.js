"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KakuraClient_1 = require("./kakura/KakuraClient");
const LogsManager_1 = require("../manager/LogsManager");
const Client_1 = require("./kakura/Client");
const UserModel_1 = require("../../game/sys/model/UserModel");
const WaitManager_1 = require("../manager/WaitManager");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const HttpMessage_1 = require("./HttpMessage");
const WindowManager_1 = require("../manager/WindowManager");
const TranslateFunc_1 = require("../func/TranslateFunc");
const UserInfo_1 = require("./UserInfo");
const PackConfigManager_1 = require("../manager/PackConfigManager");
const Global_1 = require("../../utils/Global");
const TableUtils_1 = require("../utils/TableUtils");
// import LogsManager from '../manager/LogsManager';
class GameHttpControler {
    constructor() {
        this._connectCacheArr = []; //链接队列
        this._requestId = 0; //请求id
        this.httpServerUrl = "https://cloud-dev.fantasyfancy.com:8600/?mod=jsonrpc"; //http服务器url
        //临时参数. 防止重复创建没必要的对象
        this._tempParams = {};
        this._tempWebParams = {};
        this._lastSendTime = 0;
        /**
         *
         * @param method  method 游戏协议
         * @param params  请求参数
         * @param callback  回调
         * @param thisObj
         * @param isWait 是否loading
         * @param isInsert  属否插入请求队列.表示提高优先级
         * @param addParams  返回自带参数,示例callBack.call(thisObj,serverBackData,addParams)
         * @param expandParams 扩展参数  {url:如果有代表走自己的url,forceConnect:true,是否强制走失败重连,默认true,  }
         * 主要针对云存储相关接口. 因为云存储不是所有的接口都需要强制失败重连. 只有同步战力以及同步用户信息需要强制重连. 其他的为false.
         * 云存储的url 和 游戏服务器相关的url不是同一个地址 所以需要动态传入
         */
        this.defaultExpandParams = { url: null, forceConnect: true };
        this._tempWebParams.errorCall = this.onHttpError;
        this._tempWebParams.isOrigin = true;
        if (PackConfigManager_1.default.ins.platform.backend_url) {
            this.httpServerUrl = PackConfigManager_1.default.ins.platform.backend_url;
        }
        else {
            LogsManager_1.default.warn("backendUrlError", "httpserver Platform没有设置backend_url");
        }
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new GameHttpControler();
        }
        return this._instance;
    }
    //获取serverurl
    getServerUrl() {
        var version = Global_1.default.version;
        if (Global_1.default.version == "1" && PackConfigManager_1.default.ins.platform.platform == "test") {
            version = "100000000";
        }
        return this.httpServerUrl + "&ver=" + version + "&upgrade_path=" + PackConfigManager_1.default.ins.platform.upgrade_path;
    }
    sendRequest(method, params = null, callback = null, thisObj = null, isWait = true, isInsert = false, addParams = null, expandParams = null) {
        this._lastSendTime = Client_1.default.instance.miniserverTime;
        var uniuquId = this.getUniqueRequestId();
        if (!expandParams) {
            expandParams = this.defaultExpandParams;
        }
        var coninfo = new KakuraClient_1.ConnectObj(1, method, params, callback, thisObj, isWait, addParams, expandParams);
        if (isInsert) {
            this._connectCacheArr.splice(0, 0, coninfo);
        }
        else {
            this._connectCacheArr.push(coninfo);
        }
        if (this._currentConn) {
            LogsManager_1.default.echo(this._currentConn.method + "请求正在处理中...缓存:." + coninfo.method);
            return;
        }
        //如果这个时候是没有连上的
        if (!this.loginToken) {
            this.initRequest();
            return;
        }
        this.doRequest();
    }
    //初始化连接
    initRequest() {
        if (this._currentConn && this._currentConn.isWait) {
            WaitManager_1.default.instance.add(MsgCMD_1.default.ROLL_ANI);
        }
        UserInfo_1.default.platform.reRequestGlobal(this.onLoginBack, this);
    }
    //登入回来
    onLoginBack(data) {
        var isWait = false;
        if (this._currentConn) {
            isWait = this._currentConn.isWait;
            if (isWait) {
                WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
            }
            LogsManager_1.default.echo("gamehttp _____resend---", this.loginToken);
            this.resendConn();
        }
        else {
            this.doRequest();
        }
    }
    //执行一次请求
    doRequest() {
        //如果当前有请求的
        if (this._currentConn) {
            return;
        }
        if (this._connectCacheArr.length == 0) {
            return;
        }
        var con = this._connectCacheArr[0];
        this._connectCacheArr.splice(0, 1);
        if (!con.uniqueId) {
            con.uniqueId = this.getUniqueRequestId();
        }
        //单向请求不需要管id 不等待回调
        this._currentConn = con;
        this.requestServer(con);
    }
    //请求连接
    requestServer(con) {
        //添加loading 事件拦截
        if (con.isWait) {
            WaitManager_1.default.instance.add(MsgCMD_1.default.ROLL_ANI);
        }
        var params = this._tempParams;
        this._tempParams.reqId = null;
        params.method = con.method;
        params.id = con.id;
        params.uniqueId = con.uniqueId;
        params.params = con.params;
        //@xd_test 强制测试失败
        // if(con.id == 0){
        //     this._requestId+=1;
        //     con.id += 1;
        //     this.loginToken += "1"
        // }
        con.params.token = this.loginToken;
        var url;
        if (con.expandParams.url) {
            url = con.expandParams.url;
        }
        else {
            url = this.getServerUrl();
        }
        // LogsManager.echo("gameHttpSend,method:"+ con.method)
        HttpMessage_1.default.instance.send(url, params, this.onHttpCallBack, this, "post", this._tempWebParams);
    }
    //http返回 
    onHttpCallBack(backData) {
        if (!this._currentConn) {
            LogsManager_1.default.echo("httpserver 当前没有连接.确返回数据了--");
            return;
        }
        if (this._currentConn.isWait) {
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
        }
        var data;
        try {
            data = JSON.parse(backData);
        }
        catch (e) {
            //解析失败这里需要重新登入
            LogsManager_1.default.echo("gamehttp 返回的数据不是json,走重新登入", backData);
            this.loginToken = null;
            // this.initRequest();
            WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_net_error"), this.initRequest, this);
            return;
        }
        if (!data || typeof (data) == "string" || !data[0]) {
            //这里需要重新登入
            this.loginToken = null;
            LogsManager_1.default.echo("gamehttp 返回的数据格式不对", backData);
            // this.initRequest();
            WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_net_error"), this.initRequest, this);
            return;
        }
        data = data[0];
        if (data.error) {
            //token过期
            var errorCode = data.error.code;
            if (errorCode == GameHttpControler.tokenErrorCode) {
                this.loginToken = null;
                LogsManager_1.default.echo("gamehttp token 过期", backData);
                WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_net_error"), this.initRequest, this);
                return;
            }
            //飘字处理
            var transLateError = TranslateFunc_1.default.instance.getTranslate("#error" + errorCode);
            WindowManager_1.default.ShowTip(transLateError);
        }
        else {
            //修正空数组
            TableUtils_1.default.adjustEmptyArr(data.result);
            //同步服务器时间和dirtyList
            Client_1.default.instance.onResult(data.result, false);
        }
        var temp = this._currentConn;
        this._currentConn = null;
        this.doRequest();
        //所有的服务器回调里面都必须判断是否 有result.error
        if (temp.callback) {
            temp.callback.call(temp.thisObj, data.result || data, temp.addParams);
        }
    }
    //判断是否有对应的method
    checkHasMethod(method) {
        if (this._currentConn) {
            if (this._currentConn.method == method) {
                return true;
            }
        }
        for (var i = 0; i < this._connectCacheArr.length; i++) {
            var con = this._connectCacheArr[i];
            if (con.method == method) {
                return true;
            }
        }
        return false;
    }
    /**http返回error.一般是网络异常 */
    onHttpError(e = null) {
        if (!this._currentConn) {
            LogsManager_1.default.echo("httpserver 当前没有连接.确返回错误了--");
            return;
        }
        if (this._currentConn.isWait) {
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
        }
        //httpserver底层做了自动重连机制
        WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#tid_net_error"), this.resendConn, this);
    }
    //重新发送当前请求
    resendConn() {
        this.requestServer(this._currentConn);
    }
    getUniqueRequestId(requestId = "") {
        var rid = UserModel_1.default.instance.getUserRid(); //用户id
        var timestamp = (new Date()).getTime();
        return "uniqueId_" + rid + "_" + timestamp + "_" + this._requestId;
    }
}
exports.default = GameHttpControler;
GameHttpControler.tokenErrorCode = "10038";
//# sourceMappingURL=GameHttpControler.js.map