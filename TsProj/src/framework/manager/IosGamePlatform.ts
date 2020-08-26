import AndroidGamePlatform from "../platform/AndroidGamePlatform";
import MethodCommon from "../common/kakura/MethodCommon";
import LogsManager from "./LogsManager";
import UserInfo from "../common/UserInfo";
import NativeBridge from "../native/NativeBridge";
import JSToNativeEvent from "../event/JSToNativeEvent";

//继承Android
export default class IosGamePlatform extends AndroidGamePlatform {

	public constructor() {
		super();
		// MainModule.showMainTask -= 1;
	}

	//获取global登入method
	protected getGlobalMethod() {
		return MethodCommon.global_Account_loginIosMaster;
	}

	protected checkSignSha1() {
		if (!this._nativeBackData || !this._nativeBackData.boundleId) {
			LogsManager.warn("SignSha1 native boundleId数据还没初始化")
			return;
		}
		if (UserInfo.isTest()) return;
		var rightId: string = this.getPackageName();
		var len: number = rightId.length;
		var targetId: string = this._nativeBackData.boundleId;
		if (targetId.slice(-len) != rightId) {
			LogsManager.errorTag("boundleIdError", "包名不符合.目标包名:" + targetId);
			this.childChannelId = targetId;
		} else {
			LogsManager.echo("这个包是合法的")
		}

	}


	/**
	 * 监听加速度
	 */
	onAccelerometerChange() {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL, {x: 1});
	}


	/**
	 * 重置加速计加速值
	 */
	accelerometerClear(x) {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL_CLEAR, x);
	}


	/**
	 * 暂定加速器监听
	 */
	accelerometerPause() {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL_PAUSE);
	}


	/**
	 * 注册推送
	 */
	pushMessage(delay, id, title?, subTitle?, body?, repeats = false) {
		if (delay < 1) {
			LogsManager.warn("推送延迟小于1秒，注册不执行");
			return;
		}
		if (repeats && delay <= 60) {
			LogsManager.warn("推送需要重发且延迟不大于60秒，注册不执行");
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
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_PUSH, this.tempPushDic);
	}


	/**
	 * 注销推送
	 */
	clearPushMessage(id) {
		this.tempClearPushDic["id"] = id;
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_PUSH_CLEAR, this.tempClearPushDic);
	}

	/**
	 * 支付
	 * @param productId 商品id
	 * @param amount 商品数量（一般为1）
	 * @param orderId 订单id（验证用）
	 * @param callbackUrl 验证用地址
	 */
	inAppPurchase(productId, amount, orderId, callbackUrl) {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_INAPP_PURCHASE, JSON.stringify({
			"product_id": productId,
			"amount": amount,
			"order_id": orderId,
			"callback_uri": callbackUrl,
		}));
	}
}   
