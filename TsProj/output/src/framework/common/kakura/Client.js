"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KakuraClient_1 = require("./KakuraClient");
const HashMap_1 = require("../../utils/HashMap");
const PackConfigManager_1 = require("../../manager/PackConfigManager");
const Global_1 = require("../../../utils/Global");
const ErrCodeManager_1 = require("../../manager/ErrCodeManager");
const UserModel_1 = require("../../../game/sys/model/UserModel");
const NotifyManager_1 = require("../../manager/NotifyManager");
const ModelToServerMap_1 = require("../../../game/sys/consts/ModelToServerMap");
const GameSwitch_1 = require("../GameSwitch");
const LogsManager_1 = require("../../manager/LogsManager");
const SingleCommonServer_1 = require("../../server/SingleCommonServer");
const HttpMessage_1 = require("../HttpMessage");
const ErrorCode_1 = require("../../../game/sys/common/kakura/ErrorCode");
const UserInfo_1 = require("../UserInfo");
const MethodCommon_1 = require("./MethodCommon");
const GameHttpControler_1 = require("../GameHttpControler");
class Client {
    constructor() {
        this._requestId = 0;
        this._baseUnqiueRequestId = 0;
        this.OPCODE_KAKURA_INIT = 1000;
        this.OPCODE_KAKURA_HEARTBEAT = 1001;
        this.OPCODE_KAKURA_REAUTH = 1014;
        this.OPCODE_BACKEND_REQUEST = 100001;
        this.heartBeatInterval = 60; //秒
        this.PUBLIC_KEY = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";
        this._token = "";
        //global server token
        this._gs_token = "";
        this._url = "";
        this._version = "";
        this._upgrade = "";
        this._hashMap = new HashMap_1.default();
        //是否成功登入
        this.hasLoginComplete = false;
        //重登延迟间隔  默认60秒
        this.RELOGIN_INTVERL_TIME = 60;
        //重登服务器卡关key
        this.SWITCH_RELOGIN_INTVERL_TIME = "SWITCH_RELOGIN_INTVERL_TIME";
        //上一次登入时间
        this.lastLoginTime = 0;
        //登入状态  0是空闲, 1 是登入中 
        this._loginState = 0;
        this._defaultExpandParams = { forceConnect: false };
        this._serverTime = 0;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new Client();
        }
        return this._instance;
    }
    checkConnect() {
        KakuraClient_1.default.instance.aginConnect();
    }
    sendInit(token, userInfo = null, callback = null, thisObj = null, invitedBy = "", shareInfo = "") {
        this._gs_token = token;
        this._callback = callback;
        this._thisObj = thisObj;
        this._url = PackConfigManager_1.default.ins.platform.kakura_url;
        this._version = Global_1.default.version;
        this._upgrade = PackConfigManager_1.default.ins.platform.upgrade_path;
        this._sec = PackConfigManager_1.default.ins.platform.sec;
        this._kakuraInitParams = this.getKakuraInitMsg(userInfo, invitedBy, shareInfo);
        KakuraClient_1.default.instance.init(this._url, this._version, "", this.pushResult, this, this.onConnectBack, this);
    }
    initResult(result) {
        if (result.error) {
            // var err = result.error;
            // ErrCodeManager.ins.setErr(err.code);
            return;
        }
        //标记已经获取过用户信息.
        KakuraClient_1.default.instance.hasGetUserInfo = true;
        this._requestId = result.initRequestId;
        this._token = result.token;
        this._rid = result.rid;
        this._callback && this._callback.call(this._thisObj);
    }
    sendHeart(method = null, param = null, callback = null, thisObj = null, addParam = null) {
        //如果当前有请求了 也不执行
        if (KakuraClient_1.default.instance._currentConn) {
            return;
        }
        KakuraClient_1.default.instance.sendRequest(this.OPCODE_KAKURA_HEARTBEAT, KakuraClient_1.default.method_heartBeat, param, callback, thisObj, false);
    }
    /**
      * 发送消息方法
      * method 方法id
      * param 传参数,JSON对象
      * callback 返回方法，返回JSON对象
      * thisObj 返回方法对象
      * 备注: 所有请求的回调里面 都需要判断 服务器返回的数据里面是否有error 来决定做什么事情.
      * 比如 return 或者 恢复一些ui点击事件
      * if(serverInfoBack.error){
            resumeUIClick()
            return;
            }
        dosomething()...
      */
    send(method, param, callback, thisObj, opcode = this.OPCODE_BACKEND_REQUEST, isWait = true, addParam = null, expandParams = null) {
        //如果是云存储
        if (Global_1.default.checkUserCloudStorage()) {
            this.saveDataToCloud(param, callback, thisObj, addParam, expandParams);
        }
        else {
            if (!opcode) {
                opcode = this.OPCODE_BACKEND_REQUEST;
            }
            if (!param || param == null || param == "") {
                param = {};
            }
            else {
                for (var key in param) {
                    // param[key] = encodeURI(param[key]);
                }
            }
            if (opcode == this.OPCODE_BACKEND_REQUEST) {
                if (Global_1.default.checkIsSingleMode()) {
                    if (!param.clientDirty) {
                        param.clientDirty = SingleCommonServer_1.default.getClientDirtyList();
                    }
                }
            }
            this._curMethod = method;
            // console.log(">>>>>sendData>>>>" +JSON.stringify(sendData));
            KakuraClient_1.default.instance.sendRequest(opcode, method, param, callback, thisObj, isWait, false, addParam);
            //为了测试 只要发请求 就立马发一次心跳
            // if(method != "heartBeat"){
            // 	 Client.instance.sendHeart("heartBeat", null, null, null, "id_1");
            // }
        }
    }
    onResult(result, isPush = false) {
        //遇到dirtyList数据更新
        if (result.data) {
            var rdata = result.data;
            if (rdata.dirtyList) {
                this.onDirtyList(rdata.dirtyList);
            }
            if (isPush) {
                if (rdata.d) {
                    this.deleteBaseData(rdata.d);
                }
                if (rdata.u) {
                    this.updateBaseData(rdata.u);
                }
            }
        }
        else if (result.error) {
            var err = result.error;
            ErrCodeManager_1.default.ins.setErr(err.code);
        }
        if (result.serverInfo) {
            this._reqBackTime = result.serverInfo.serverTime;
            this._serverTime = parseInt(result.serverInfo.serverTime) - Math.floor(Laya.Browser.now());
        }
    }
    //更新底层数据
    onDirtyList(baseData) {
        if (!baseData) {
            return;
        }
        if (baseData.d) {
            this.deleteBaseData(baseData.d);
        }
        if (baseData.u) {
            this.updateBaseData(baseData.u);
        }
    }
    //更新底层数据
    updateBaseData(upData) {
        var mapArr = ModelToServerMap_1.default.modelToServerMap;
        var length = mapArr.length;
        var userChangeData = this.getUserData(upData);
        //更新用户基础数据
        if (userChangeData) {
            UserModel_1.default.instance.updateData(userChangeData);
        }
        for (var i = 0; i < length; i++) {
            var info = mapArr[i];
            var key = info.key;
            var model = info.model;
            if (upData[key]) {
                model.instance.updateData(upData[key]);
            }
        }
    }
    //删除底层数据
    deleteBaseData(delData) {
        var mapArr = ModelToServerMap_1.default.modelToServerMap;
        var length = mapArr.length;
        var userChangeData = this.getUserData(delData);
        //删除用户基础数据
        if (userChangeData) {
            UserModel_1.default.instance.deleteData(userChangeData);
        }
        for (var i = 0; i < length; i++) {
            var info = mapArr[i];
            var key = info.key;
            var model = info.model;
            if (delData[key]) {
                model.instance.deleteData(delData[key]);
            }
        }
    }
    /**获取要更新的user下非模块的数据 */
    getUserData(data) {
        var mapArr = ModelToServerMap_1.default.modelToServerMap;
        var length = mapArr.length;
        var userChangeData;
        for (var i in data) {
            var model = null;
            var value = data[i];
            if (i != "_id") {
                for (var j = 0; j < length; j++) {
                    var info = mapArr[j];
                    //如果匹配上了
                    if (info.key == i) {
                        model = info.model;
                        break;
                    }
                }
                //如果没匹配上说明是userModel的数据
                if (!model && i != "_id") {
                    if (!userChangeData) {
                        userChangeData = {};
                    }
                    userChangeData[i] = value;
                }
            }
        }
        return userChangeData;
    }
    //收到推送
    pushResult(result) {
        if (result.params.dirtyList) {
            this.onDirtyList(result.params.dirtyList);
        }
        NotifyManager_1.default.onServerNotify(result);
    }
    //当服务器连接成功isFirstInit,  true是第一次初始化连接成功, false是重连成功
    onConnectBack(isFirstInit) {
        if (isFirstInit) {
            var params = this._kakuraInitParams;
            KakuraClient_1.default.instance.clearOneMethod(MethodCommon_1.default.User_kakuraInit);
            //初始化请求是需要插入执行的
            KakuraClient_1.default.instance.sendRequest(this.OPCODE_KAKURA_INIT, MethodCommon_1.default.User_kakuraInit, params, this.initResult, this, true, true);
        }
        else {
            var param = { token: this._token };
            param.ver = this._version;
            param.upgrade = this._upgrade;
            param.deviceId = Global_1.default.deviceId;
            KakuraClient_1.default.instance.sendRequest(this.OPCODE_KAKURA_REAUTH, MethodCommon_1.default.User_kakuraReauth, param, this.relogin, this, true, true);
        }
    }
    //手动创建dirtylist
    doDummyServerBack(data = null, u = null, d = null) {
        if (!data) {
            data = {};
        }
        if (u || d) {
            data.dirtyList = {
                u: u,
                d: d,
            };
            Client.temDirtList = data.dirtyList;
            this.onDirtyList(data.dirtyList);
        }
        // var serverInfo:any = {
        // 	result:{
        // 		data:data
        // 	}
        // }
        //少嵌套一层,只返回客户端需要的数据结构 .和现有的结构保持一致
        //LogsManager.echo("data====",data)
        return { data: data };
    }
    relogin() {
        KakuraClient_1.default.instance.sendRequest(this.OPCODE_BACKEND_REQUEST, MethodCommon_1.default.User_relogin, {}, this.reloginBack, this, true, true);
    }
    //重回来
    reloginBack(result) {
        //如果重连有开关 需要立刻同步下开关
        if (result.data && result.data.config && result.data.config.switch) {
            GameSwitch_1.default.coverServerSwitchConditionMap(result.data.config.switchCondition);
            GameSwitch_1.default.coverServerSwitchMap(result.data.config.switch);
        }
    }
    /**
        * 获取系统时间
        */
    get serverTime() {
        return Math.floor((this._serverTime + Math.floor(Laya.Browser.now())) * 0.001);
    }
    get miniserverTime() {
        return this._serverTime + Laya.Browser.now();
    }
    /**
    * 获取系统时间
    */
    get serverTimeMicro() {
        return this._serverTime + Laya.Browser.now();
    }
    /**
        * 上次请求服务器返回时间，秒
        */
    get reqBackTime() {
        return this._reqBackTime * 0.001;
    }
    getRequestId() {
        if (this._requestId >= 0) {
            this._requestId++;
        }
        return this._requestId;
    }
    getUniqueRequestId(requestId = "") {
        this._baseUnqiueRequestId = this._baseUnqiueRequestId + 1;
        var rid = 1; //用户id
        var timestamp = (new Date()).getTime();
        return "h5_" + rid + "_" + timestamp + "_" + this._baseUnqiueRequestId + "_";
    }
    getKakuraInitMsg(userInfo = null, invitedBy = "", shareInfo = "") {
        var params = {
            "ver": this._version,
            "account_name": "1",
            "upgrade": this._upgrade,
            "gs_token": this._gs_token,
            "sec": this._sec,
            "account_id": "1",
            "deviceId": Global_1.default.deviceId
        };
        if (invitedBy != "" && shareInfo != "") {
            params["invitedBy"] = invitedBy;
            params["shareInfo"] = shareInfo;
        }
        if (userInfo != null) {
            params["userInfo"] = userInfo;
        }
        return params;
    }
    get rid() {
        return this._rid;
    }
    get webSocketConnet() {
        return KakuraClient_1.default.instance.webSocketConnet;
    }
    testClose() {
        KakuraClient_1.default.instance.testClose();
    }
    /**
     * 云存储数据
     * @param params
     * @param callback
     * @param thisObj
     * @param addParam
     */
    saveDataToCloud(params, callback, thisObj, addParam = null, expandParams = null) {
        var token = this.globalLoginBackData.loginToken || "";
        if (!params.token) {
            params.token = token;
        }
        LogsManager_1.default.echo("krma. cloud authenticate token=" + token + "body=" + JSON.stringify(params.clientDirty) + "sendTime=" + params.sendTime);
        this.startRequestCloud(MethodCommon_1.default.cloudStorage_setByUser, params, callback, thisObj, addParam, expandParams);
    }
    /**
     * 获取云存储全局数据
     * @param params { 需要查询的字段
      *  query:["user","user.userExt",...],
      *  id:必带的id
      * }
     * @param callback
     * @param thisObj
     * @param addParam 额外附带的回调参数
     */
    getCloudGlobalData(params, callback = null, thisObj = null, addParam = null) {
        if (!this.hasLoginComplete) {
            callback && callback.call(thisObj, { error: { code: ErrorCode_1.default.nologin } }, addParam);
            return;
        }
        var token = this.globalLoginBackData.loginToken;
        if (!token) {
            callback && callback.call(thisObj, { error: { code: ErrorCode_1.default.nologin } }, addParam);
            return;
        }
        if (!params.token) {
            params.token = token;
        }
        this.startRequestCloud(MethodCommon_1.default.cloudStorage_getGlobalData, params, callback, thisObj, addParam);
    }
    /**
     * 存储订阅消息
     * @param params
     * @param callback
     * @param thisObj
     * @param addParam
     */
    sendSubscribeMessage(params, callback = null, thisObj = null, addParam = null) {
        this.startRequestCloud(MethodCommon_1.default.saveSubscribeMsg, params, callback, thisObj, addParam);
    }
    /**
     * 设置云储存全局数据
     * @param params {
      * 	clientDirty: {u:...,d:...},
      *  id:  必带的值
      * }
     * @param callback
     * @param thisObj
     * @param addParam
     */
    setCloudGlobalData(params, callback = null, thisObj = null, addParam = null) {
        var token = this.globalLoginBackData.loginToken || "";
        if (!params.token) {
            params.token = token;
        }
        this.startRequestCloud(MethodCommon_1.default.cloudStorage_setGlobalData, params, callback, thisObj, addParam);
    }
    //开始请求云储存
    startRequestCloud(method, params, callback = null, thisObj = null, addParam = null, expandParams = null) {
        //如果没有token 说明还没连上
        if (!this.hasLoginComplete) {
            this.startRelogin();
            callback && callback.call(thisObj, { error: { code: ErrorCode_1.default.nologin } }, addParam);
            return;
        }
        expandParams = expandParams || this._defaultExpandParams;
        var url = Global_1.default.global_url;
        params.sendTime = this.serverTime;
        var thisValue = this;
        var onErrorBack = (errorInfo) => {
            errorInfo = errorInfo || {};
            var error = errorInfo && errorInfo.error || errorInfo;
            if (typeof error == "object" && error.code) {
                var errorCode = String(error.code);
                //如果token过期或者token错误 那么重新走一次登入流程
                if (errorCode == "10038" || errorCode == "10003") {
                    //走一次重登流程
                    //重置登入状态
                    thisValue._loginState = 0;
                    thisValue.hasLoginComplete = false;
                    thisValue.startRelogin();
                }
            }
            LogsManager_1.default.echo("_errorBack;", error && error.code);
            if (callback) {
                callback.call(thisObj, error, addParam);
            }
            Client.instance.lastLoginTime = Client.instance.serverTime;
        };
        //http回调成功
        var onHttpBack = (backData) => {
            //如果返回数据是数组 那么降低层级结构
            if (backData[0]) {
                backData = backData[0];
            }
            //每次请求同步下服务器时间
            if (backData.result && backData.result.serverInfo && backData.result.serverInfo.serverTime) {
                this.updateServerTime(backData.result.serverInfo.serverTime);
            }
            //如果有错误
            if (backData.error) {
                onErrorBack({ error: backData.error });
                return;
            }
            if (callback) {
                callback.call(thisObj, backData, addParam);
            }
            Client.instance.lastLoginTime = Client.instance.serverTime;
        };
        var sendData = {
            method: method,
            params: params,
        };
        var webParams = {
            errorCall: onErrorBack,
        };
        //如果走强制连接的请求 需要走GameHttpControler
        if (UserInfo_1.default.isUseHttpServer && expandParams.forceConnect) {
            webParams.url = url;
            expandParams.url = Global_1.default.global_url;
            GameHttpControler_1.default.instance.sendRequest(method, params, callback, thisObj, true, false, addParam, expandParams);
        }
        else {
            HttpMessage_1.default.instance.send(url, sendData, onHttpBack, this, "post", webParams);
        }
    }
    updateServerTime(value) {
        this._reqBackTime = value;
        this._serverTime = this._reqBackTime - Laya.Browser.now();
    }
    //开始重新登入
    startRelogin() {
        if (!this.checkCanRelogin()) {
            return;
        }
        //如果已经在登入状态中了return
        if (this._loginState != 0) {
            return;
        }
        LogsManager_1.default.echo("xd_ 开始重登-");
        this._loginState = 1;
        this.hasLoginComplete = false;
        UserInfo_1.default.platform.getWxInfo();
    }
    //重登回来
    onReloginBack(data, isError = false) {
        this._loginState = 0;
        LogsManager_1.default.echo("xd_重登回来,重置状态");
    }
    //判断是否需要重新登入
    checkCanRelogin() {
        if (this.serverTime - this.lastLoginTime < this.getReloginIntverlTime()) {
            return false;
        }
        return true;
    }
    //获取重登间隔
    getReloginIntverlTime() {
        var state = GameSwitch_1.default.getSwitchState(this.SWITCH_RELOGIN_INTVERL_TIME);
        if (!state) {
            state = this.RELOGIN_INTVERL_TIME;
        }
        return state;
    }
}
exports.default = Client;
//需要更新的数据dirtlist
Client.temDirtList = {};
//# sourceMappingURL=Client.js.map