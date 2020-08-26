export default class JSToNativeEvent {

	public static TTADSDK_INIT: string = "TTADSDK_INIT";   //初始化广告sdk{appSid:,appName,isDebug,adVideoId,adBannerId,adMediaType}
	public static TTADSDK_SHOWVEDIO: string = "TTADSDK_SHOWVEDIO";   //加载激励视频  {scene:currentWindowName}  展示视频广告的场景
	public static TTADSDK_BANNER: string = "TTADSDK_BANNER";     //banner 相关   参数{status:1打开banner,0关闭,2预加载banner,x:0,y:0(banner显示的坐标)  }

	public static VIEWADAPTER_INIT: string = "VIEWADAPTER_INIT";   //屏幕适配初始化完成 {width:,height: ,stageWidth,stageHeight, scale, designWidth,designHeight, }

	public static NATIVE_VIBRATOR: string = "NATIVE_VIBRATOR";       //设备震动接口 .参数{time:震动时长, style:样式.默认为0 简单震动};后续扩展

	public static NATIVE_OPENURL: string = "NATIVE_OPENURL";          //打开url .参数{url:....};

	public static NATIVE_ACCEL: string = "NATIVE_ACCEL";       //设备加速计开始监听
	public static NATIVE_ACCEL_BACK: string = "NATIVE_ACCEL_BACK";       //设备加速计返回监听
	public static NATIVE_ACCEL_CLEAR: string = "NATIVE_ACCEL_CLEAR";       //设备加速计清除缓存
	public static NATIVE_ACCEL_PAUSE: string = "NATIVE_ACCEL_PAUSE";       //设备加速计暂停

	public static NATIVE_PUSH: string = "NATIVE_PUSH";       //注册推送
	public static NATIVE_PUSH_CLEAR: string = "NATIVE_PUSH_CLEAR";       //注销推送

	public static NATIVE_INAPP_PURCHASE: string = "NATIVE_INAPP_PURCHASE";       //内购

}
