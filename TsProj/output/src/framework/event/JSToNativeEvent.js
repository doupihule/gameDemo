"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSToNativeEvent {
}
exports.default = JSToNativeEvent;
JSToNativeEvent.TTADSDK_INIT = "TTADSDK_INIT"; //初始化广告sdk{appSid:,appName,isDebug,adVideoId,adBannerId,adMediaType}
JSToNativeEvent.TTADSDK_SHOWVEDIO = "TTADSDK_SHOWVEDIO"; //加载激励视频  {scene:currentWindowName}  展示视频广告的场景
JSToNativeEvent.TTADSDK_BANNER = "TTADSDK_BANNER"; //banner 相关   参数{status:1打开banner,0关闭,2预加载banner,x:0,y:0(banner显示的坐标)  }
JSToNativeEvent.VIEWADAPTER_INIT = "VIEWADAPTER_INIT"; //屏幕适配初始化完成 {width:,height: ,stageWidth,stageHeight, scale, designWidth,designHeight, }
JSToNativeEvent.NATIVE_VIBRATOR = "NATIVE_VIBRATOR"; //设备震动接口 .参数{time:震动时长, style:样式.默认为0 简单震动};后续扩展
JSToNativeEvent.NATIVE_OPENURL = "NATIVE_OPENURL"; //打开url .参数{url:....};
JSToNativeEvent.NATIVE_ACCEL = "NATIVE_ACCEL"; //设备加速计开始监听
JSToNativeEvent.NATIVE_ACCEL_BACK = "NATIVE_ACCEL_BACK"; //设备加速计返回监听
JSToNativeEvent.NATIVE_ACCEL_CLEAR = "NATIVE_ACCEL_CLEAR"; //设备加速计清除缓存
JSToNativeEvent.NATIVE_ACCEL_PAUSE = "NATIVE_ACCEL_PAUSE"; //设备加速计暂停
JSToNativeEvent.NATIVE_PUSH = "NATIVE_PUSH"; //注册推送
JSToNativeEvent.NATIVE_PUSH_CLEAR = "NATIVE_PUSH_CLEAR"; //注销推送
JSToNativeEvent.NATIVE_INAPP_PURCHASE = "NATIVE_INAPP_PURCHASE"; //内购
//# sourceMappingURL=JSToNativeEvent.js.map