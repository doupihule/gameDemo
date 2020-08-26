"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectObj = void 0;
const KakuraMessage_1 = require("./KakuraMessage");
const Client_1 = require("./Client");
const LogsManager_1 = require("../../manager/LogsManager");
const WaitManager_1 = require("../../manager/WaitManager");
const MsgCMD_1 = require("../../../game/sys/common/MsgCMD");
const TimerManager_1 = require("../../manager/TimerManager");
const ErrCodeManager_1 = require("../../manager/ErrCodeManager");
const ErrorCode_1 = require("../../../game/sys/common/kakura/ErrorCode");
const WindowManager_1 = require("../../manager/WindowManager");
const Global_1 = require("../../../utils/Global");
const TranslateFunc_1 = require("../../func/TranslateFunc");
const MethodCommon_1 = require("./MethodCommon");
class KakuraClient {
    constructor() {
        this._isInit = false;
        this._aginCon = 0;
        this._timeCode = 0;
        this._timeCount = 0; //超时重连次数. 连上之后这个重置
        this._reconnectCount = 0; //掉线重连次数.
        this.autoConnectCount = 1; //自动重连次数,目前只自动重连1次
        this._defaultAesKey = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";
        this._isoffline = false; //是否被挤掉线了 ,如果是被挤掉线的,那么就不能做自动登入了
        //初始化成功后的回调
        this._callback = null;
        this._thisObj = null;
        this._pushCallback = null;
        this._pushThisObj = null;
        this._webSocketConnet = false;
        this._isServerInit = false;
        this.hasGetUserInfo = false;
        this._hasRegistHeartBeat = false;
        this._requestId = 1; //请求id
        this._hasOnClose = false;
        this._connectCacheArr = [];
        KakuraMessage_1.default.instance.setMessageType(KakuraMessage_1.default.MESSAGE_FIX_ENC_NO_COMPRESS);
    }
    //后面为了扩展  kakuraclient 不能是单例.(如果要做接java服务器 游戏可能同时存在多个client)
    static get instance() {
        if (!this._instance)
            this._instance = new KakuraClient();
        return this._instance;
    }
    //重新连接
    aginConnect() {
        this._hasOnClose = false;
        LogsManager_1.default.echo("kakura _again connect");
        WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
        this.registConnectEvent();
    }
    init(url, ver, caFilePath, pushCallback = null, pushThisObj = null, callback = null, thisObj = null) {
        this._url = url;
        if (pushCallback) {
            this._pushCallback = pushCallback;
        }
        if (pushThisObj) {
            this._pushThisObj = pushThisObj;
        }
        //连接完成回调
        this._callback = callback;
        this._thisObj = thisObj;
        this.registConnectEvent();
    }
    //注册连接事件侦听
    registConnectEvent() {
        this._aesKey = this._defaultAesKey;
        LogsManager_1.default.echo(">>>>>>>>connectByUrl>>>>>>>>>>", this._url);
        this.clearInitRequest();
        this.destorySocket();
        //如果没有获取过用户信息或者 不是单机模式才会显示转菊花. 单机模式第一次获取过用户数据后不需要出菊花了
        if (!this.hasGetUserInfo || !Global_1.default.checkIsSingleMode()) {
            WaitManager_1.default.instance.add(MsgCMD_1.default.ROLL_ANI);
        }
        //每次连接的时候 先关闭套接字
        this._websocket = new Laya.Socket();
        this._websocket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
        this._websocket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this._websocket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this._websocket.on(Laya.Event.ERROR, this, this.onSocketError);
        this._websocket.connectByUrl(this._url);
    }
    //销毁连接
    destorySocket() {
        if (this._websocket) {
            this._websocket.offAll();
            this._websocket.close();
            this._websocket = null;
        }
        this._webSocketConnet = false;
    }
    /**
      * 插入一个请求
      * isWait 是否需要等待loading
      * isInsert 是否是插入一个队列 比如初始化的请求是优先级最高的,一定需要优先处理
      */
    sendRequest(opcode, method, params = null, callback = null, thisObj = null, isWait = true, isInsert = false, addParams = null) {
        if (!this.checkIsInitMethod(method)) {
            if (!this._webSocketConnet) {
                LogsManager_1.default.echo("发送请求的时候还没连上", method);
            }
        }
        //如果已经被挤掉线了 那么 后面发的任何请求都干掉
        if (this._isoffline) {
            return;
        }
        //如果没有连上 那么清理掉本地存储的同样的接口
        if (!this._webSocketConnet) {
            this.clearOneMethod(method);
        }
        var uniuquId = this.getUniqueRequestId();
        var coninfo = this.turnRequestToSave(opcode, method, params, callback, thisObj, isWait, addParams);
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
        if (!this._webSocketConnet) {
            this.aginConnect();
            return;
        }
        this.doRequest();
    }
    requestSocket(con) {
        //添加loading 事件拦截
        if (con.isWait) {
            WaitManager_1.default.instance.add(MsgCMD_1.default.ROLL_ANI);
        }
        var toSendString = con.toSendString();
        var packData = KakuraMessage_1.default.instance.addPackage(con.opcode, con.id, con.uniqueId, toSendString);
        var requestId = con.id;
        var requestBuffer = "";
        requestBuffer = packData.uniqueReqId + packData.sendData;
        var byte = KakuraMessage_1.default.instance.encode(requestBuffer, this._aesKey, packData);
        LogsManager_1.default.echo("kakura,发出数据:", toSendString, con.id);
        this._websocket.send(byte.buffer);
        //心跳请求不添加超时判断
        if (con.method != KakuraClient.method_heartBeat) {
            //添加超时判断 暂定20秒超时
            this._timeCode = TimerManager_1.default.instance.add(this.timerHandler, this, KakuraClient.timeOutMiniSecond, 1);
        }
    }
    //执行一次请求
    doRequest() {
        //如果当前有请求的
        if (this._currentConn) {
            return;
        }
        //如果还没连上 那么直接返回
        if (!this._webSocketConnet) {
            return;
        }
        if (this._connectCacheArr.length == 0) {
            return;
        }
        var con = this._connectCacheArr[0];
        this._connectCacheArr.splice(0, 1);
        //如果这个消息是被重置过的 那么 需要重新设置id或者这个消息不是心跳
        if (con.id == 0 && !this.checkIsHeartBeat(con.method) && !this.checkIsInitMethod(con.method)) {
            this._requestId++;
            con.id = this._requestId;
        }
        if (!this.checkIsHeartBeat(con.method)) {
            if (!con.uniqueId) {
                con.uniqueId = this.getUniqueRequestId();
            }
        }
        //单向请求不需要管id 不等待回调
        this._currentConn = con;
        if (this.checkIsHeartBeat(con.method)) {
            this._currentConn = null;
        }
        this.requestSocket(con);
    }
    //超时后的处理
    timerHandler() {
        TimerManager_1.default.instance.remove(this._timeCode);
        if (this._currentConn) {
            LogsManager_1.default.echo("kakura _>>>>>>>>>>>>request again>>>>>>>>>>>>", this._currentConn.method);
        }
        else {
            LogsManager_1.default.echo(">>>>>>>>>>>>request again>>>>>>>>>>>>", this._timeCount);
        }
        //如果当前是初始化请求失败了 那么手动close.
        if (this._currentConn && this.checkIsInitMethod(this._currentConn.method)) {
            LogsManager_1.default.echo("_初始化请求失败", this._currentConn.method);
            this.destorySocket();
            //移除转菊花功能 弹窗重连弹窗
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
            ErrCodeManager_1.default.ins.setErr(ErrorCode_1.default.webOffline);
            return;
        }
        this._timeCount++;
        //那么重复发送当前请求,只重发1次.
        if (this._timeCount <= KakuraClient.timeOutResendTimes) {
            //一定要在重发的时候才会去移除loading
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
            if (this._currentConn) {
                this.requestSocket(this._currentConn);
            }
        }
        else {
            //否则就销毁当前连接
            //做弹窗重发
            //弹窗重连
            this._timeCount = 0;
            var con = this._currentConn;
            if (!con) {
                return;
            }
            var tempFunc = () => {
                //重发这个请求
                this.requestSocket(con);
            };
            // LogsManager.error("这个请求超时重发两次");
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
            //弹窗重连
            WindowManager_1.default.setPopupTip(1, TranslateFunc_1.default.instance.getTranslate("#error110"), tempFunc, this);
            // ToolTip.instance.setPopupTip(1, game.Translatefunc.instance.getTranslate("#error110"), tempFunc, this);
        }
    }
    resendCurrentConnLater() {
        if (this._currentConn) {
            var currentConn = this._currentConn;
            TimerManager_1.default.instance.setTimeout(() => {
                this.requestSocket(currentConn);
            }, this, 100);
        }
    }
    onReceiveMessage(evt) {
        var that = this;
        //清除超时定时器
        TimerManager_1.default.instance.remove(that._timeCode);
        this._timeCount = 0;
        var byte = new Laya.Byte();
        byte.endian = Laya.Byte.LITTLE_ENDIAN;
        // that._websocket.readBytes(byte);
        byte.clear();
        byte.writeArrayBuffer(evt);
        byte.pos = 0;
        var jsonData = KakuraMessage_1.default.instance.decode(this._aesKey, byte);
        //如果是初始化请求
        if (jsonData.result && jsonData.result.initRequestId) {
            if (jsonData.result.aesKey) {
                that._aesKey = jsonData.result.aesKey;
                KakuraMessage_1.default.instance.setMessageType(KakuraMessage_1.default.MESSAGE_DYNAMIC_ENC_NO_COMPRESS);
            }
            that._token = jsonData.result.token;
            that._isInit = false;
            this._requestId = jsonData.result.initRequestId;
            this._isServerInit = true;
            this._reconnectCount = 0;
            this.checkRequestId();
            WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
        }
        //正常数据返回
        if (jsonData.result) {
            Client_1.default.instance.onResult(jsonData.result);
            if (this._currentConn) {
                if (!jsonData.uniqueId || jsonData.uniqueId == this._currentConn.uniqueId) {
                    this.excuetOneResponce(jsonData.result);
                }
                else {
                    //只有method匹配上了才会做这个处理 否则代表的是 超时第二次重发回来时的回调。 这个时候 不能通过这个匹配 
                    LogsManager_1.default.echo("返回的消息可能是超时重发的-", this._currentConn.method, "_serverback method:", jsonData.method);
                }
            }
        }
        else if (jsonData.error) {
            this.checkServerSysError(jsonData.error.code);
            Client_1.default.instance.onResult(jsonData);
            this.excuetOneResponce(jsonData);
        }
        else if (jsonData.params) { //push数据返回
            Client_1.default.instance.onResult(jsonData.params, true);
            that._pushCallback && that._pushCallback.call(that._pushThisObj, jsonData);
        }
        //请求完毕后需要接着doRequest;  因为可能有队列
        this.doRequest();
    }
    excuetOneResponce(jsonData) {
        if (this._currentConn) {
            //如果是心跳请求 return
            if (jsonData == "success") {
                LogsManager_1.default.echo("_心跳请求返回的时候 正好有请求发送 导致解析失败");
                return;
            }
            //只有匹配到 需要loading请求的时候 才移除 loading动画,否则心跳包的请求可能会提前中断loading
            if (this._currentConn.isWait) {
                WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
            }
            var temp = this._currentConn;
            this._currentConn = null;
            if (temp.callback) {
                temp.callback.call(temp.thisObj, jsonData, temp.addParams);
            }
        }
    }
    //当连接上的时候
    onSocketOpen() {
        //连接成功后就移除
        this._hasOnClose = false;
        WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
        console.log("socket connet success!!!");
        this._webSocketConnet = true;
        //连接上了告诉分系统我连接成功了, 并传递是否获取过用户数据. 如果没获取过.那么应该是重发获取用户数据请求
        if (this.hasGetUserInfo) {
            this._callback && this._callback.call(this._thisObj, false);
        }
        else {
            this._callback && this._callback.call(this._thisObj, true);
        }
        //接着做下一个请求
        this.doRequest();
    }
    onSocketClose(e, isFromError = false) {
        TimerManager_1.default.instance.remove(this._timeCode);
        LogsManager_1.default.echo("socket close!!! is from error:", isFromError);
        if (this._hasOnClose) {
            LogsManager_1.default.echo("刚刚收到close消息,避免和error冲突");
            this._hasOnClose = false;
            return;
        }
        if (!this.hasGetUserInfo) {
            //这里延迟4秒发送错误日志.是希望能看到接下来的行为是否正常
            // TimerManager.instance.add(LogsManager.error, LogsManager, 4000, 1, false, [" kakura xd _掉线的时候还没有成功获取用户数据"]);
        }
        this._webSocketConnet = false;
        if (this._currentConn && !this.checkIsInitMethod(this._currentConn.method)) {
            //这里需要改成插入,否则重连之后顺序会出问题
            this._connectCacheArr.splice(0, 0, this._currentConn);
            this._currentConn = null;
        }
        //如果是被挤掉线的 那么return
        if (this._isoffline) {
            return;
        }
        this.clearInitRequest();
        this._hasOnClose = true;
        //移除心跳请求
        // this.clearOneMethod(kakura.KakuraClient.method_heartBeat);
        this._reconnectCount++;
        if (this._reconnectCount <= this.autoConnectCount) {
            LogsManager_1.default.echo("掉线自动重连:当前次数:", this._reconnectCount);
            // this._websocket.connectByUrl(this._url);
            //自动重连不需要关闭loading
            // 100ms后做重连 防止因为切后台回来立马出现 请求超时情况
            TimerManager_1.default.instance.setTimeout(this.aginConnect, this, 100);
            // this.aginConnect(this._callback,this._thisObj);
            // this.aginConnect(this._callback,this._thisObj);
        }
        else {
            //如果 需要等待的 那么关闭loading
            //只有是联网的游戏才会弹网络弹窗
            if (Global_1.default.gameMode == Global_1.default.gameMode_network || !this.hasGetUserInfo) {
                WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
                ErrCodeManager_1.default.ins.setErr(ErrorCode_1.default.webOffline);
            }
            else {
                WaitManager_1.default.instance.remove(MsgCMD_1.default.ROLL_ANI);
                //单机版本直接清理所有的请求队列 不做缓存也不做回调
                this._connectCacheArr = [];
                this._currentConn = null;
            }
        }
    }
    registHeartBeat() {
        if (this._hasRegistHeartBeat) {
            return;
        }
        if (Global_1.default.checkIsSingleMode()) {
            return;
        }
        this._hasRegistHeartBeat = true;
        //添加心跳
        TimerManager_1.default.instance.add(() => {
            if (Client_1.default.instance.webSocketConnet) {
                Client_1.default.instance.sendHeart("heartBeat", null, null, null, "id_1");
            }
        }, this, Client_1.default.instance.heartBeatInterval * 1000);
    }
    onSocketError() {
        // this._webSocketConnet = false;
        // this._reconnectCount++;
        // if (this._reconnectCount <= this.autoConnectCount) {
        // 	// WindowManager.ShowTip("连线断开，正在尝试重连");
        // 	LogsManager.echo("掉线自动重连:当前次数:", this._reconnectCount);
        // 	this.aginConnect(this._callback, this._thisObj);
        // } else {
        // 	ErrCodeManager.ins.setErr("110");
        // }
        LogsManager_1.default.echo("socket connet error!!!");
        this.onSocketClose(null, true);
    }
    get webSocketConnet() {
        return this._webSocketConnet;
    }
    getUniqueRequestId(requestId = "") {
        var rid = Client_1.default.instance.rid; //用户id
        var timestamp = (new Date()).getTime();
        return "uniqueId_" + rid + "_" + timestamp + "_" + this._requestId;
    }
    turnRequestToSave(opcode, method, params, cb, tobj, isWait, addParams) {
        return new ConnectObj(opcode, method, params, cb, tobj, isWait, addParams);
    }
    //判断是否有某个请求 ,有些请求不需要重复的 比如心跳 或者 init 或者reauth
    checkHasMethod(method) {
        var obj = this.getMethodObj(method);
        if (obj)
            return true;
        else
            return false;
    }
    //通过Method号获取请求对象
    getMethodObj(method) {
        var len = this._connectCacheArr.length;
        if (this._currentConn) {
            if (this._currentConn.method == method) {
                return this._currentConn;
            }
        }
        for (var i = 0; i < len; i++) {
            var con = this._connectCacheArr[i];
            if (con.method == method) {
                return con;
            }
        }
        return null;
    }
    //清除某一个请求
    clearOneMethod(method) {
        var len = this._connectCacheArr.length;
        if (this._currentConn) {
            if (this._currentConn.method == method) {
                this._currentConn = null;
            }
        }
        for (var i = len - 1; i >= 0; i--) {
            var con = this._connectCacheArr[i];
            if (con.method == method) {
                this._connectCacheArr.splice(i, 1);
            }
        }
    }
    //判断是否需要初始化所有的缓存队列id
    checkRequestId() {
        if (this._currentConn) {
            if (this._currentConn.id > this._requestId) {
                this._currentConn.id = 0;
                this._currentConn.uniqueId = null;
            }
        }
        var len = this._connectCacheArr.length;
        for (var i = 0; i < len; i++) {
            var con = this._connectCacheArr[i];
            if (con.id > this._requestId) {
                con.id = 0;
                con.uniqueId = null;
            }
        }
    }
    //清除掉所有的初始请求,防止重复发送,
    clearInitRequest() {
        this.clearOneMethod(MethodCommon_1.default.User_kakuraInit);
        this.clearOneMethod(MethodCommon_1.default.User_kakuraReauth);
        this.clearOneMethod(MethodCommon_1.default.User_relogin);
    }
    //判断是否是初始化menthod
    checkIsInitMethod(method) {
        if (method == MethodCommon_1.default.User_kakuraInit
            || method == MethodCommon_1.default.User_kakuraReauth) {
            return true;
        }
        return false;
    }
    //判断是否是服务器异常 比如挤掉线, 有新版本等 需要回到登入界面的
    checkServerSysError(code) {
        if (code == ErrorCode_1.default.duplicate_login) {
            this._isoffline = true;
            return true;
        }
        return false;
    }
    //判断是否是初始化menthod
    checkIsHeartBeat(method) {
        if (method == KakuraClient.method_heartBeat) {
            return true;
        }
        return false;
    }
    testClose() {
        if (this._websocket) {
            this._websocket.close();
        }
        this._webSocketConnet = false;
    }
}
exports.default = KakuraClient;
KakuraClient.method_heartBeat = "heartBeat";
//超时时间判定为5秒
KakuraClient.timeOutMiniSecond = 5000;
//超时重发时间次数修改为1次
KakuraClient.timeOutResendTimes = 1;
//连接请求对象
class ConnectObj {
    constructor(opcode, method, params, cb, tobj, isWait, addParams, expandParams = null) {
        this.uniqueId = "";
        this.id = 0;
        this.opcode = opcode;
        this.callback = cb;
        this.thisObj = tobj;
        this.method = method;
        this.params = params;
        this.id = 0;
        this.uniqueId = "";
        this.isWait = isWait;
        this.addParams = addParams;
        this.expandParams = expandParams;
    }
    //转化成请求数据
    toSendString() {
        return JSON.stringify({ "method": this.method, "id": this.id, "uniqueId": this.uniqueId, params: this.params, wait: this.isWait });
    }
}
exports.ConnectObj = ConnectObj;
//# sourceMappingURL=KakuraClient.js.map