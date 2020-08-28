"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WaitManager_1 = require("../manager/WaitManager");
const ErrCodeManager_1 = require("../manager/ErrCodeManager");
const LogsManager_1 = require("../manager/LogsManager");
const TimerManager_1 = require("../manager/TimerManager");
const TranslateFunc_1 = require("../func/TranslateFunc");
const WindowManager_1 = require("../manager/WindowManager");
const ErrorCode_1 = require("../../game/sys/common/kakura/ErrorCode");
const Global_1 = require("../../utils/Global");
const UserInfo_1 = require("./UserInfo");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const Client_1 = require("./kakura/Client");
const PackConfigManager_1 = require("../manager/PackConfigManager");
class HttpMessage {
    constructor() {
        //请求数据队列
        this._connectCacheArr = null;
        //请求数据ID
        this.reqsId = 0;
        //是否请求数据中
        this.isReqs = false;
        //服务器时间
        this.sTime = 0;
        this.reqTime = 0;
        //请求key
        this.key = "";
        this.errCount = 0;
        this._reconnectCount = 0; //失败重连次数.
        this.autoConnectCount = 0; //自动重连次数,目前只自动重连1次
        this._connectCacheArr = [];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new HttpMessage();
        }
        return this._instance;
    }
    /**
     * 发送消息
     * @param url
     * @param params
     * @param callBack
     * @param thisObject
     * @param isParams
     * @param webParams 默认值为空  {
     *      isOrigin:  是否回调的数据 返回原始数据, 默认是json parse过的,
     *      dataFormat: 传输的数据类型,默认HttpMessage.URLLoaderDataFormat.TEXT,               可使用HttpMessage.URLLoaderDataFormat.BINARY,
     *      isCache:  是否 缓存,默认false 针对微信或者头条本地文件系统.
     *      errorCall:网络错误时 也走回调， 并返回error 字段
     * }
     */
    send(url, params, callBack, thisObject, method = "get", webParams = null) {
        url = url;
        if (!webParams) {
            webParams = { dataFormat: HttpMessage.URLLoaderDataFormat.TEXT };
        }
        var connectData = {
            url: url,
            params: params,
            callBack: callBack,
            thisObj: thisObject,
            method: method,
            webParams: webParams
        };
        this._connectCacheArr.push(connectData);
        this.doRequest();
    }
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
        this._currentConn = con;
        // this.requestSocket(con);
        this.sureSend(con);
    }
    /**
     * 发送数据
     * @param data
     */
    sureSend(data) {
        var url = data.url;
        var params = data.params || {};
        var callBack = data.callBack;
        var thisObject = data.thisObj;
        var method = data.method;
        var format = data.webParams.dataFormat;
        //这里必须要取随机 .否则在android下会有浏览器缓存导致post请求没有返回值 卡死.
        // url += "?test="+Client.instance.miniserverTime+  Math.round( Math.random()*100000);
        //@备注:这里需要等待资源加载完毕才能显示这个wait
        // WaitManager.instance.add(url);
        var hr = new Laya.HttpRequest();
        hr.http.time = 60000;
        hr.once(Laya.Event.COMPLETE, this, this.onHttpSuccess);
        hr.once(Laya.Event.ERROR, this, this.onHttpError);
        this._currentHp = hr;
        var targetStrData = params;
        var sendMethod = "";
        if (typeof targetStrData != "string") {
            if (params.method) {
                sendMethod = params.method;
            }
            if (params) {
                //如果已经有了  reqid 那么添加一个标记
                if (params.reqId) {
                    params.reqId = "req_repeat_" + Global_1.default.deviceId + "_" + Client_1.default.instance.miniserverTime + "_" + Math.floor(Math.random() * 100000);
                }
                else {
                    params.reqId = "req" + Global_1.default.deviceId + "_" + Client_1.default.instance.miniserverTime + "_" + Math.floor(Math.random() * 100000);
                }
            }
            targetStrData = JSON.stringify(params);
        }
        var shortSendData = this.turnShortLogs(targetStrData);
        LogsManager_1.default.echo("http send url is :" + url.slice(0, Math.min(200, url.length)) + "   method :" + sendMethod + "  data is : " + shortSendData);
        //记录初始时间
        this.reqTime = Laya.Browser.now();
        var head = null;
        if (UserInfo_1.default.isSystemNative()) {
            head = ["Content-Type", "application/json;charset=utf-8"];
        }
        if (method.indexOf("get") > -1) {
            var dataStr = this.objectToUrlParam(params);
            hr.send(url, dataStr, method, "text", head);
        }
        else if (method.indexOf("post") > -1) {
            hr.send(url, targetStrData, method, "text", head);
        }
    }
    //日志转化
    turnShortLogs(targetStr) {
        //如果是打开了日志调试的 不做转化
        if (LogsManager_1.default.isOpenLogsDebug) {
            return targetStr;
        }
        if (PackConfigManager_1.default.ins.platform.platform == "dev" || PackConfigManager_1.default.ins.platform.platform == "test") {
            return targetStr;
        }
        if (targetStr.length < 1000) {
            return targetStr;
        }
        return targetStr.slice(0, 1000);
    }
    sendOtherHttpRequest(url, params, callBack, thisObject, method = "get", webParams = null, sendCount = 1, addParams = null) {
        var hr = new Laya.HttpRequest();
        hr.http.time = 60000;
        var startTime = Laya.Browser.now();
        var onComplete = (data) => {
            LogsManager_1.default.echo("sendOtherHttpRequest cost time:", Laya.Browser.now() - startTime, "url:", url.slice(0, Math.min(100, url.length)));
            if (callBack) {
                callBack.call(thisObject, data, addParams);
            }
        };
        var onError = (error) => {
            if (sendCount > 1) {
                error = error.slice(0, 100);
                LogsManager_1.default.errorTag(LogsErrorCode_1.default.ALIYUN_SENDERROR, error);
            }
            else {
                if (webParams) {
                    var callback = webParams.errorCall;
                    callback && callback.call(webParams.thisObj);
                }
            }
        };
        hr.once(Laya.Event.COMPLETE, this, onComplete);
        hr.once(Laya.Event.ERROR, this, onError);
        this._currentOtherHttp = hr;
        var head = null;
        if (!UserInfo_1.default.isWeb() && webParams && webParams.contentType) {
            head = ["Content-Type", webParams.contentType];
        }
        else {
            if (UserInfo_1.default.isSystemNative()) {
                head = ["Content-Type", "application/json;charset=UTF-8"];
            }
        }
        // head = ["Content-Type", "application/x-www-form-urlencoded; charset=utf-8"]
        // console.log("http sendOtherHttpRequest url is :" + url.slice(0,Math.min(200,url.length)) + "  data is : " + JSON.stringify(params) + "   method is :" + method)
        //记录初始时间
        // this.reqTime = Laya.Browser.now();
        // url+= "?test="+Client.instance.miniserverTime+  Math.round( Math.random()*100000);
        if (method.indexOf("get") > -1) {
            var dataStr = this.objectToUrlParam(params);
            hr.send(url, dataStr, method, "text", head);
        }
        else if (method.indexOf("post") > -1) {
            hr.send(url, params, method, "text", head);
        }
    }
    //http成功
    onHttpSuccess(data = null) {
        var url = this._currentConn.url;
        WaitManager_1.default.instance.remove(url);
        if (data && (typeof data == "string") && data.indexOf("!DOCTYPE HTML") != -1) {
            LogsManager_1.default.echo("url is off," + url);
            HttpMessage.instance.onHttpError({ error: { code: ErrorCode_1.default.webOffline } });
            return;
        }
        if (!data) {
            HttpMessage.instance.onHttpError({ error: { code: ErrorCode_1.default.webOffline } });
            return;
        }
        //LogsManager.echo(this._currentConn.webParams.isCache, "this._currentConn.webParams.isCache")
        //如果是正常返回的 而且是要缓存数据到本地的
        if (!data) {
            LogsManager_1.default.echo("没有返回数据");
            HttpMessage.instance.onHttpError({ error: { code: ErrorCode_1.default.webOffline } });
            return;
        }
        // LogsManager.echo("HttpMessage sureSend:",data);
        var callBack = this._currentConn.callBack;
        var thisObj = this._currentConn.thisObj;
        //是否是原始数据 ,默认返回的数据结构需要json.parse
        var isOrigin = this._currentConn.webParams.isOrigin;
        var originData = data;
        //错误码提示
        //如果不是需要原始数据的 那么需要把结果解析一下 回调
        if (!isOrigin) {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                LogsManager_1.default.errorTag(null, "httpError,url:", url, "backData:");
                HttpMessage.instance.onHttpError({ error: { code: ErrorCode_1.default.webOffline } });
                return;
            }
            var platforms = data;
            var len = platforms.length;
            for (var i = 0; i < len; i++) {
                if ((!platforms[i].result) || platforms[i].error) {
                    var errs = (platforms[i].error) || { code: ErrorCode_1.default.webOffline };
                    //如果是云存储的 那么直接做失败回调
                    if (Global_1.default.checkUserCloudStorage()) {
                        this.onHttpError({ error: errs });
                        return;
                    }
                    ErrCodeManager_1.default.ins.setErr(errs.code);
                    return;
                }
            }
        }
        this._currentConn = null;
        this._reconnectCount = 0;
        var shortLogs = this.turnShortLogs(originData);
        //test或者dev 打印完整的数据日志
        LogsManager_1.default.echo("http callback,url:" + url.slice(0, Math.min(200, url.length)) + " cosTime:" + (Laya.Browser.now() - this.reqTime), "len:", originData.length, "backData:", shortLogs);
        if (callBack) {
            callBack.call(thisObj, data);
        }
        //接着判断做下一条
        this.doRequest();
    }
    //http失败
    onHttpError(err) {
        if (!this._currentConn) {
            return;
        }
        var url = this._currentConn.url;
        WaitManager_1.default.instance.remove(url);
        LogsManager_1.default.warn("error>>>>>", url, err.type, err);
        this._reconnectCount++;
        if (this._reconnectCount <= this.autoConnectCount) {
            TimerManager_1.default.instance.setTimeout(this.reSendRequest, this, 1000);
        }
        else {
            if (this._currentConn.webParams.errorCall) {
                var coninfo = this._currentConn;
                this._currentConn = null;
                coninfo.webParams.errorCall.call(coninfo.thisObj, err);
                this.doRequest();
                return;
            }
            var errorMessage = TranslateFunc_1.default.instance.getTranslate("#error110");
            //弹窗重连
            WindowManager_1.default.setPopupTip(1, errorMessage, this.reSendRequest, this);
        }
    }
    reSendRequest() {
        this.sureSend(this._currentConn);
    }
    /**
     * 对象转URL参数
     * @param data
     */
    objectToUrlParam(data) {
        var retStr = "";
        if (typeof (data) == "string") {
            return data;
        }
        for (var key in data) {
            var value = data[key];
            if (value != null && value != undefined) {
                if (value.constructor == Array || value.constructor == Object) {
                    retStr += (key) + "=" + (JSON.stringify(value)) + "&";
                }
                else {
                    retStr += (key) + "=" + (value) + "&";
                }
            }
            else {
                retStr += (key) + "=&";
            }
        }
        if (retStr.length > 0) {
            retStr = retStr.substring(0, retStr.length - 1);
        }
        return retStr;
    }
}
exports.default = HttpMessage;
HttpMessage.URLLoaderDataFormat = {
    TEXT: "text",
    TEXTURE: "texture",
    BINARY: "binary"
};
//# sourceMappingURL=HttpMessage.js.map