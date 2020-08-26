export default class StatisticsCommonConst {
	// -----------------------------------------------------视频相关----------------------------------------------------
	static VIDEO_TOTAL_SHOW = {groupId: "I_AdShow", sortId: 1, name: "video_total_show"}//展示视频按钮的总用户数/次数
	static VIDEO_TOTAL_CLICK = {groupId: "I_AdShow", sortId: 2, name: "video_total_click"}//点击视频按钮的总用户数/次数
	static VIDEO_TOTAL_CLICKSUCCESS = {groupId: "I_AdShow", sortId: 3, name: "video_total_clickSuccess"}//点击视频按钮并看完的总用户数/次数
	static VIDEO_TOTAL_FAIL = {groupId: "I_AdShow", sortId: 4, name: "video_total_fail"}//广告拉取失败总用户数/次数

	static NORMAL_VIDEO_AD = {groupId: "I_AdShow", sortId: 1, name: "videoAd"};
	//看广告成功 (播放完成)
	static NORMAL_VIDEO_SUCCESS = {groupId: "I_AdShow", sortId: 2, name: "videoSuccess"};
	//拉取广告失败
	static NORMAL_VIDEO_AD_FAIL = {groupId: "I_AdShow", sortId: 3, name: "videoAdFail"};

	static NORMAL_VIDEO_AD_ECPM = {groupId: "I_AdShow", sortId: 3, name: "videoAdEcpm"};	//广告的ecpm
	// -----------------------------------------------------分享相关----------------------------------------------------
	static SHARE_TOTAL_SHOW = {groupId: "H_Share", sortId: 1, name: "share_total_show", isAld: true}//展示分享按钮的总用户数/次数
	static SHARE_TOTAL_CLICK = {groupId: "H_Share", sortId: 2, name: "share_total_click", isAld: true}//点击分享按钮的总用户数/次数
	static SHARE_TOTAL_CLICKSUCCESS = {groupId: "H_Share", sortId: 3, name: "share_total_clickSuccess", isAld: true}//点击分享按钮并成功分享的总用户数/次数
	static SHARE_CLICK_ENTER = {groupId: "H_Share", sortId: 4, name: "share_click_enter", isAld: true}//点击分享卡片进入游戏的玩家
	static SHARE_ENTER_GAME = {groupId: "H_Share", sortId: 1, name: "ShareClickCardEnterGame", isAld: true}; //通过分享进入游戏

	//尝试分享
	static NORMAL_SHARE = {groupId: "H_Share", sortId: 4, name: "share"};
	//分享成功
	static NORMAL_SHARE_SUCCESS = {groupId: "H_Share", sortId: 5, name: "share_success"};

	static SHARE_VIDEO_CLICK = {groupId: 'S_ShareVideo', sortId: 1, name: "share_video_click"}//点击分享按钮并成功分享的总用户数/次数
	static SHARE_VIDEO_SUCCESS = {groupId: 'S_ShareVideo', sortId: 2, name: "share_video_success"}//点击分享按钮并成功分享的总用户数/次数
	static SHARE_VIDEO_FAIL = {groupId: 'S_ShareVideo', sortId: 3, name: "share_video_fail"}//点击分享按钮并成功分享的总用户数/次数
	static AUTO_RECORD_CLICK = {groupId: "S_ShareVideo", sortId: 4, name: "auto_record_click"};//头条手动录屏开始
	static AUTO_RECORD_RELEASE = {groupId: "S_ShareVideo", sortId: 5, name: "auto_record_release"};//头条手动录屏分享

	// -----------------------------------------------------Banner----------------------------------------------------

	static BANNER_PULLNUM = {groupId: 'S_banner', sortId: 1, name: "bannerPullNmb", isAld: true}; //拉取次数
	static BANNER_PULLSUCCESS = {groupId: 'S_banner', sortId: 2, name: "bannerPullSuccessfulNmb", isAld: true}; //拉取成功次数
	static BANNER_PULLFAILED = {groupId: 'S_banner', sortId: 3, name: "bannerPullDefeatNmb", isAld: true}; //banner拉取失败
	static BANNER_EXPOSURENUM = {groupId: 'S_banner', sortId: 4, name: "bannerExposureNmb", isAld: true};  //曝光次数

	// -----------------------------------------------------在线相关----------------------------------------------------
	static ON_SHOW = {groupId: 'A_ONLINE', sortId: 1, name: "on_show"}//点击分享按钮并成功分享的总用户数/次数
	static ON_HIDE = {groupId: 'A_ONLINE', sortId: 2, name: "on_hide"}//点击分享按钮并成功分享的总用户数/次数

	// -----------------------------------------------------互推Banner----------------------------------------------------
	static RECOMMEND_BANNER_PULLNUM = {groupId: 'S_recommend', sortId: 1, name: "recommendBannerPullNmb", isAld: true}; //拉取次数
	static RECOMMEND_BANNER_PULLSUCCESS = {
		groupId: 'S_recommend',
		sortId: 2,
		name: "recommendBannerPullSuccessfulNmb",
		isAld: true
	}; //拉取成功次数
	static RECOMMEND_BANNER_EXPOSURENUM = {
		groupId: 'S_recommend',
		sortId: 3,
		name: "recommendBannerExposureNmb",
		isAld: true
	};  //曝光次数
	static RECOMMEND_BANNER_PULLFAILED = {
		groupId: 'S_recommend',
		sortId: 6,
		name: "recommendBannerPullDefeatNmb",
		isAld: true
	}; //banner拉取失败

	static BANNER_JUMPOTHERGAME = {groupId: "L_jump", sortId: 5, name: "arrayJumpOtherGame", isAld: true};  //互推点击允许，即互推跳转成功
	static JUMP_TO_OTHER_GAME_SUCCESS = {groupId: "L_jump", sortId: 3, name: "jump_to_other_game_success", isAld: true}; //成功跳转到其他游戏
	static JUMP_OTHERGAMESUCCESS = {groupId: "J_Jump", sortId: 4, name: "arrayJump_OtherGame", isAld: true} //互推跳转成

	// -----------------------------------------------------添加桌面相关----------------------------------------------------
	static ADD_DESKTOP_SUCCESS = {groupId: 'S_ADD_DESKTOP', sortId: 1, name: "addDesktopSuccess", isAld: true}; //添加桌面成功
	static ADD_DESKTOP_FAIL = {groupId: 'S_ADD_DESKTOP', sortId: 2, name: "addDesktopfail", isAld: true}; //添加桌面失败
	static ADD_MYGAME_SUCCESS = {groupId: 'S_ADD_DESKTOP', sortId: 3, name: "addMygameSuccess", isAld: true}; //添加我的小程序成功
	static ADD_MYGAME_FAIL = {groupId: 'S_ADD_DESKTOP', sortId: 4, name: "adMygamefail", isAld: true}; //添加我的小程序失败

	// -----------------------------------------------------原生广告相关----------------------------------------------------
	static ORIGINAL_SHOW = {groupId: 'S_ORIGINAL', sortId: 1, name: "original_show"}; //原生广告展示
	static ORIGINAL_CLICK = {groupId: 'S_ORIGINAL', sortId: 1, name: "original_click"}; //原生广告点击
	static ORIGINAL_AUTO_CLICK = {groupId: 'S_ORIGINAL', sortId: 1, name: "original_auto_click"}; //原生广告自动点击

	//-----------------神秘礼包相关-----------------------
	static SECRETBOX_SHOW = {groupId: 'P_movebanner', sortId: 3, name: "secretbox_show"}; // 神秘礼包展示
	static SECRETBOX_REWARD = {groupId: 'P_movebanner', sortId: 4, name: "secretbox_reward"}; // 神秘礼包获得奖励
	static SECRETBOX_ON_HIDE = {groupId: 'P_movebanner', sortId: 5, name: "secretbox_on_hide"}; // 神秘礼包离开游戏
	static SECRETBOX_ON_SHOW = {groupId: 'P_movebanner', sortId: 6, name: "secretbox_on_show"}; // 神秘礼包回到游戏
	static SECRETBOX_AD_FAIL = {groupId: 'P_movebanner', sortId: 7, name: "secretbox_ad_fail"}; // 神秘礼包回到游

	//-----------------黑名单相关-----------------------
	static WHITE_LIST_LOAD_IP_FAIL = {groupId: 'P_white_list', sortId: 1, name: "loadIpFail"}; // 神秘礼包展示

	// -----------------------------------------------------Loading相关----------------------------------------------------
	//loading打点
	static LOADING_1 = {groupId: 'B_Loading', sortId: 1, name: "loading_1"};  // 老用户请求vms
	static LOADING_2 = {groupId: 'B_Loading', sortId: 2, name: "loading_2"}; // 老用户进入主界面

	//新用户loading打点
	static NEW_LOADING_1 = {groupId: 'A_NewLoading', sortId: 1, name: "new_loading_1"};	// 新用户请求vms
	static NEW_LOADING_2 = {groupId: 'A_NewLoading', sortId: 2, name: "new_loading_2"};  // 新用户进入主界面（成功后，将玩家置为老用户)


	static SUBSCRIBE_SHOW = {groupId: 'Q_subscribe', sortId: 1, name: "subscribe_show"} // 游戏内显示订阅消息界面
	static SUBSCRIBE_SUCCESS = {groupId: 'Q_subscribe', sortId: 2, name: "subscribe_success"} // 玩家订阅成功
	static SUBSCRIBE_FAIL = {groupId: 'Q_subscribe', sortId: 3, name: "subscribe_fail"} // 玩家订阅失败
	static SUBSCRIBE_JOIN_GAME = {groupId: 'Q_subscribe', sortId: 4, name: "subscribe_join_game"} // 通过订阅消息进入游戏
	// -----------------------------------------------------客户端打点----------------------------------------------------
	static WX_SYSTEMINFOSYNC_COSTTIME = {groupId: 'Z_Client', sortId: 1, name: "WxSystemInfoCostTime"};//wx同步获取系统信息接口耗时打点
	static CLIENT_UPDATE = {groupId: 'Z_Client', sortId: 2, name: "ClientUpdate"};//wx、qq平台获取到新版本功
	static CLIENT_UNZIPFAILAll = {groupId: 'Z_Client', sortId: 4, name: "ClientUnZipFailAll"};//zip解压3次失败
	static CLIENT_UNZIPFAIL = {groupId: 'Z_Client', sortId: 3, name: "ClientUnZipFail"};//zip解压失败
	static CLIENT_RELOADCFG = {groupId: 'Z_Client', sortId: 5, name: "ClientReloadCfg"};//重新下载globalCfgs.json
	static CLIENT_UPDATE_CALLBACK = {groupId: 'Z_Client', sortId: 6, name: "ClientUpdateCallback"};//QQ/头条版本更新回调
	static CLIENT_SUBPACK_ERROR = {groupId: 'Z_Client', sortId: 7, name: "ClientSubpackError"};//分包加载失败
	static CLIENT_SUBPACK_TIMEOUT = {groupId: 'Z_Client', sortId: 8, name: "ClientSubpackTimeOut"};//分包加载超时

	//卡日曲相关
	static KARIQU_LOGIN_SUCESS = {groupId: "Z_Client", sortId: 1, name: "kariqu_login_sucess"};	//卡日曲登入成功
	static KARIQU_LOGIN_FAIL = {groupId: "Z_Client", sortId: 1, name: "kariqu_login_fail"};	//卡日曲登入成功

}