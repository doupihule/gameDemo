

/**
 * 渠道参数类
 *
 * 新渠道接入需要填写对应参数
 */
export default class ChannelConst {

	private static web = {}

	private static wxgame = {
		adVideoId: 'adunit-8d1631776e7b6007',
		adBannerId: 'adunit-95eefbc9b5fec03d',
		adInterstitialId: 'adunit-200fe04ceb951ff6',
		recommendBannerId: 'PBgAAc_gXjntOKNM',
		recommendPortalId: 'PBgAAc_gXjngbFsw',
	}

	private static tt = {
		adVideoId: 'e2ksbm0389ikg6eeaj',
		adBannerId: '1d50c111ikkb8545am',
		adInterstitialId: "127d9d79397af288r6",  //插屏
	}

	private static qqgame = {
		adVideoId: '',
		adBannerId: '',
		adInterstitialId: '',
	}

	private static oppogame = {
		appId: '',
		adVideoId: '',
		adBannerId: '',
		adInterstitialId: '',
		adOriginalId: '',// 后续修改为数组，重复拉取Banner bu 黄璐骁
	}

	private static baidugame = {
		appSid: 'bd493d8b',
		adVideoId: '6758440',
		adBannerId: '6758441',
	}

	//安卓官网
	public static android_master = {
		appSid: '5077647',
		adVideoId: "945240746",
		adBannerId: "945240734",
		adFullVideoId: "945240737",  //全屏激励视频  可关闭的

	}

	// 穿山甲配置  如果要改回穿山甲 把_tt去掉即可
	public static ios_master_tt = {
		appSid: '5068269',
		adVideoId: "945194626",
		adBannerId: "945194640",
		adFullVideoId: "945240444",  //全屏激励视频  可关闭的
	}

	//广点通配置
	public static ios_master = {
		appSid: '1110681268',                //媒体id
		adVideoId: "5041113969865480",       //激励视频
		adBannerId: "",                      //banner
		adFullVideoId: "7061715989785483",  //全屏激励视频  可关闭的

		actionId: "1110605017",              //广点通行为数据源id
		actionSecret: "5af02f596deff76e6859354f5ad792c2",    //广点通行为数据源密钥
	}


	static getChannelConst(platformId) {
		if (!this[platformId]) {
			LogsManager.errorTag('errorChannelId', 'errorChannelId:' + platformId);
			return {}
		}
		return this[platformId];
	}
}