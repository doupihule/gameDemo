"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("../manager/LogsManager");
const Message_1 = require("../common/Message");
const TableUtils_1 = require("../utils/TableUtils");
const NativeToJSEvent_1 = require("../event/NativeToJSEvent");
class NativeBridge {
    constructor() {
        this._cacheObj = {};
        //忽略日志的时间
        this._ignoreEventMap = {
            "NATIVE_VIBRATOR": true,
        };
        //缓存的bridges
        this._cacheBridges = {};
        this._emptyTable = {};
        this.bridge = this.createBridge("NativeBridgeExpand", "utils");
        if (!this.bridge) {
            return;
        }
        if (UserInfo_1.default.isSystemIos()) {
            this.bridge.callWithBack(this.onNativeCallBack, "sendMessageToJs:sendParams:", "test", {});
        }
        else {
            this.bridge.callWithBack(this.onNativeCallBack, "sendMessageToJs", "test");
        }
    }
    //创建一个bridge
    createBridge(className, path = "") {
        var bridge;
        if (UserInfo_1.default.isSystemAndroid()) {
            var fullName = path && path + "." + className || className;
            bridge = window["PlatformClass"] && window["PlatformClass"].createClass(fullName);
        }
        else if (UserInfo_1.default.isSystemIos()) {
            bridge = window["PlatformClass"].createClass(className);
        }
        else {
            return null;
        }
        return bridge;
    }
    //获取native 对应的类静态函数的返回值.keys 对应的函数参数
    //示例  callExpandNativeFunc("ViewUtils","utils","checkScreenAdpter","data1","data2"); 
    //调用Java utils.ViewUtils里面的静态函数checkScreenAdpter.并传入参数 data1,data2
    callExpandNativeFunc(className, path, funcName, ...keys) {
        var bridge = this._cacheBridges[className];
        if (!bridge) {
            bridge = this.createBridge(className, path);
            if (!bridge) {
                return null;
            }
        }
        //android 可以直接获取接口的返回值. 但是只能返回 bool string int
        var rt;
        if (UserInfo_1.default.isSystemAndroid()) {
            rt = bridge.call(funcName, ...keys);
        }
        else {
            //ios需要通过事件机制来获取返回值 后续实现 原则上不建议通过这个获取返回值
            /**
             * this.
             *
             *
             */
            bridge.call(funcName, ...keys);
        }
        return rt;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new NativeBridge();
        }
        return this._instance;
    }
    //调用native原生函数 isMainHandle是否是主线程执行. 代表这个接口不能异步执行. 比如屏幕适配需要立马执行.设置属性和参数. 其他情况默认是异步执行
    callNative(eventName, params = null, isMainHandle = false, bridge = null) {
        if (!bridge) {
            bridge = this.bridge;
        }
        this._cacheObj.event = eventName;
        if (isMainHandle == null) {
            isMainHandle = false;
        }
        this._cacheObj.isMainHandle = isMainHandle;
        //为保证格式统一 .必须带参数
        if (!params) {
            params = this._emptyTable;
        }
        this._cacheObj.params = params;
        var strValue = TableUtils_1.default.safelyJsonStringfy(this._cacheObj);
        if (!NativeBridge.instance._ignoreEventMap[eventName]) {
            LogsManager_1.default.echo("callNative", bridge && "has bridge" || "null brigdge", strValue);
        }
        if (!bridge) {
            return;
        }
        if (UserInfo_1.default.isSystemIos()) {
            bridge.call("onMessage:", strValue);
        }
        else {
            bridge.call("onMessage", strValue);
        }
    }
    /**native回调固定格式
     * backData:
     * {
     *  event:
     *  params:
     * }
    */
    onNativeCallBack(backData) {
        var jsonData = JSON.parse(backData);
        var eventName = jsonData.event;
        var params = jsonData.params;
        if (eventName == NativeToJSEvent_1.default.CALL_JSLOGS) {
            if (params.type == "echo") {
                LogsManager_1.default.echo("nativeLogs,", params.message);
            }
            else if (params.type == "warn") {
                LogsManager_1.default.warn("nativeLogs,", params.message);
            }
            else {
                LogsManager_1.default.errorTag(params.tag, params.message);
            }
        }
        else {
            //在这里做所有的native回调.然后由系统负责侦听事件
            if (!NativeBridge.instance._ignoreEventMap[eventName]) {
                LogsManager_1.default.echo("onNativeCallBack:", "backData:", backData);
            }
            //发送事件出去给分系统处理
            Message_1.default.instance.send(eventName, params);
        }
    }
}
exports.default = NativeBridge;
//# sourceMappingURL=NativeBridge.js.map