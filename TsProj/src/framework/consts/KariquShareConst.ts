/**
 * 卡日曲分享相关常量
 */
export default class KariquShareConst {
	//登录链接
	static KARIQU_LOGIN_URL = "https://wxxyx.17tcw.com:7851/fcqs/login/reqLogin";
	//保存关卡
	static KARIQU_SAVELEVEL_URL = "https://wxxyx.17tcw.com:7851/fcqs/game/reqSaveUser";
	//查询配置信息
	static KARIQU_CONFIG_URL = "https://wxxyx.17tcw.com:7851/fcqs/lobby/reqConfig";
	//游戏埋点
	static KARIQU_GAMESTATIC_URL = "https://conglin.17tcw.com:8082/collect/pushEvents";
	//分享图片信息
	static KARIQU_SHAREIMAGEINFO_URL = "https://xyx.17tcw.com:5267/xyx/basic/reqFenxiang"

	static KARIQU_SHAREBEGIN_URL = "https://xyx.17tcw.com:5201/xyx/statis/reqBeginShare";

	//分享策略配置
	static KARIQU_SHAREMETHOD_URL = "https://wxxyx.17tcw.com:8500/zzzw/game/getShareStrategy";
	//上报分享链接
	static KARIQU_POSTENTERGAME_URL = "https://wxxyx.17tcw.com:8500/zzzw/game/clickShare"
	//
	//卡日曲渠道标签  比如战争之王是 krq_zzzw, 飞车枪神是 krq_fcqs
	static KARIQU_CHANNEL_TITLE: string = "krq_zzzw"


	//埋点内容
	//获取openId
	static KARIQU_GETOPENID = "GotOpenId";
	//获取场景值
	static KARIQU_GETLAUNCHSCENE = "LaunchScene";
	//首页开始游戏
	static KARIQU_GAMEMAIN = "HomeStartGame";
	//结算
	static KARIQU_RESULT = "GameEnd";
	//开始战斗
	static KARIQU_STARTGAME = "PlayGame";
	//通关成功 . extraNum 传关卡值
	static KARIQU_LEVELSTART = "GameStart";
	//通关成功    detail 传{"时长":"20"}数值单位秒，extraNum 传关卡值
	static KARIQU_GAMESUCESS = "GameSuccess";
	//通关失败 detail 传{"时长":"20"}数值单位秒，extraNum 传关卡值
	static KARIQU_GAMEFAIL = "GameFailed";

	//尝试播放
	static KARIQU_TRYADV = "TryPlayVideoAd";
	//播放成功
	static KARIQU_SHOWADV_SUCC = "VideoAdSuccess";
	//播放失败
	static KARIQU_SHOWADV_FAIL = "VideoAdFailed";
	//中途退出
	static KARIQU_CENTER_EXIT = "VideoAdClosed";
	//看完退出
	static KARIQU_END = "VideoAdEnded";
	//在线时长
	static KARIQU_ONLINETIME = "onlinetime";


	//是否开启banner样式的互推 默认不开启.根据需要配置.
	//在GameConst.kariquUrlMap里面配置isOpenBannerStyleJump即可. 会把GameConst.kariquUrlMap里面的所有属性全部覆盖到 KariquShareConst里
	static isOpenBannerStyleJump: boolean = false;


	/**
	 *  初始化卡日曲url
	 * @param map 里面的key 和 上面的静态变量名一致. 做覆盖逻辑
	 * {
	 *    KARIQU_LOGIN_URL:...
	 *    KARIQU_SAVELEVEL_URL:...
	 *
	 * }
	 */
	static initKariquUrl(map: any) {
		for (var i in map) {
			this[i] = map[i];
		}
	}

}