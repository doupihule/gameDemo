"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AndroidGamePlatform_1 = require("../platform/AndroidGamePlatform");
const MethodCommon_1 = require("../common/kakura/MethodCommon");
const LogsManager_1 = require("./LogsManager");
const UserInfo_1 = require("../common/UserInfo");
const NativeBridge_1 = require("../native/NativeBridge");
const JSToNativeEvent_1 = require("../event/JSToNativeEvent");
//继承Android
class IosGamePlatform extends AndroidGamePlatform_1.default {
    constructor() {
        super();
        // MainModule.showMainTask -= 1;
    }
    //获取global登入method
    getGlobalMethod() {
        return MethodCommon_1.default.global_Account_loginIosMaster;
    }
    checkSignSha1() {
        if (!this._nativeBackData || !this._nativeBackData.boundleId) {
            LogsManager_1.default.warn("SignSha1 native boundleId数据还没初始化");
            return;
        }
        if (UserInfo_1.default.isTest())
            return;
        var rightId = this.getPackageName();
        var len = rightId.length;
        var targetId = this._nativeBackData.boundleId;
        if (targetId.slice(-len) != rightId) {
            LogsManager_1.default.errorTag("boundleIdError", "包名不符合.目标包名:" + targetId);
            this.childChannelId = targetId;
        }
        else {
            LogsManager_1.default.echo("这个包是合法的");
        }
    }
    /**
     * 监听加速度
     */
    onAccelerometerChange() {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL, { x: 1 });
    }
    /**
     * 重置加速计加速值
     */
    accelerometerClear(x) {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL_CLEAR, x);
    }
    /**
     * 暂定加速器监听
     */
    accelerometerPause() {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_ACCEL_PAUSE);
    }
    /**
     * 注册推送
     */
    pushMessage(delay, id, title, subTitle, body, repeats = false) {
        if (delay < 1) {
            LogsManager_1.default.warn("推送延迟小于1秒，注册不执行");
            return;
        }
        if (repeats && delay <= 60) {
            LogsManager_1.default.warn("推送需要重发且延迟不大于60秒，注册不执行");
            return;
        }
        if (this.tempPushDic["title"]) {
            delete this.tempPushDic["title"];
        }
        if (this.tempPushDic["subtitle"]) {
            delete this.tempPushDic["subtitle"];
        }
        if (this.tempPushDic["body"]) {
            delete this.tempPushDic["body"];
        }
        this.tempPushDic["delay"] = delay;
        this.tempPushDic["id"] = id;
        this.tempPushDic["repeats"] = repeats;
        if (title) {
            this.tempPushDic["title"] = title;
        }
        if (subTitle) {
            this.tempPushDic["subtitle"] = subTitle;
        }
        if (body) {
            this.tempPushDic["body"] = body;
        }
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_PUSH, this.tempPushDic);
    }
    /**
     * 注销推送
     */
    clearPushMessage(id) {
        this.tempClearPushDic["id"] = id;
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_PUSH_CLEAR, this.tempClearPushDic);
    }
    /**
     * 支付
     * @param productId 商品id
     * @param amount 商品数量（一般为1）
     * @param orderId 订单id（验证用）
     * @param callbackUrl 验证用地址
     */
    inAppPurchase(productId, amount, orderId, callbackUrl) {
        NativeBridge_1.default.instance.callNative(JSToNativeEvent_1.default.NATIVE_INAPP_PURCHASE, JSON.stringify({
            "product_id": productId,
            "amount": amount,
            "order_id": orderId,
            "callback_uri": callbackUrl,
        }));
    }
}
exports.default = IosGamePlatform;
//# sourceMappingURL=IosGamePlatform.js.map