import KariquShareConst from "../consts/KariquShareConst";
import HttpMessage from "../common/HttpMessage";
import UserInfo from "../common/UserInfo";
import LogsManager from "./LogsManager";
import GameConsts from "../../game/sys/consts/GameConsts";
import JumpManager from "./JumpManager";
import JumpConst from "../../game/sys/consts/JumpConst";
import TimerManager from "./TimerManager";
import Global from "../../utils/Global";
import MainModule from "./MainModule";
import TableUtils from "../utils/TableUtils";
import Client from "../common/kakura/Client";
import ShareOrTvManager from "./ShareOrTvManager";
import RandomUtis from "../utils/RandomUtis";
import BannerStyleJumpComp from "../platform/comp/BannerStyleJumpComp";
import GameSwitch from "../common/GameSwitch";
import StatisticsExtendManager from "./StatisticsExtendManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";


//卡日曲分享相关接口
export default class KariqiShareManager {


	static kariqiUserId = 0;
	static kariquConfigValue: string;
	static advParamsArr;
	static onLineTime = 0;
	static isInLine = false;
	static callBack;
	static thisObj;
	static timeCode = 0;

	static defaultShareVedioTag: string = "SCORE_STRATEGY"

	//ui 对应的 style样式map  0表示 banner  1表示jump
	static uiBannerStyleMap: any = {
		// "BattleUI":1
	}

	//卡日曲服务器的配置 ShareFailContent 分享失败文案. BannerAllPageCtl 总开关：0开banner1开导量 .BannerGamePageCtl:游戏页：0开banner1开导量
	static kariquServerConfigMap: any = {}

	static defaultContentParams = {
		contentType: "application/json;charset=UTF-8"
	}

	private static _hasSendTask: boolean = false;

	//
	/**
	 * 分享数据json数组：
		shareId  	int  		分享id
		title		String	分享内容文字描述
		imageurl	String	分享图片地址
	 */
	public static shareOrderData: any[];


	/**登录 */
	static kariquLogin(callback = null, thisObj = null) {
		if (!this.checkIsKariquChannel()) {
			if (!this._hasSendTask) {
				this._hasSendTask = true
				MainModule.instance.changeShowMainTask(-1, MainModule.task_kariquLogin, "kariquLogin");
			}

			callback && callback.call(thisObj);
			return;
		}
		this.callBack = callback;
		this.thisObj = thisObj;
		// openid			String	  	是		openid
		// channel			String		是		来源渠道例如krq_fcqs=001,没有就填空字符串
		// nickname			String		是		昵称，可以传空字符串
		// headicon			String		是		头像，可以传空字符串
		// sourceOpenid		String		是		分享来源玩家openid,非分享来源填空字符串
		var url = KariquShareConst.KARIQU_LOGIN_URL;
		var userinfo = UserInfo.platform.platformUserInfo;
		var name = userinfo && userinfo.name;
		var headUrl = userinfo && userinfo.headImage;
		var channel = this.getChannelValue();
		var params = {
			openid: UserInfo.channelUserId,
			channel: channel || "",
			nickname: name || "",
			headicon: headUrl || "",
			sourceOpenid: UserInfo.platform.shareLinkParams && UserInfo.platform.shareLinkParams.inviterRid || ""
		}

		var loginErrorBack = () => {
			StatisticsExtendManager.onEvent(StatisticsCommonConst.KARIQU_LOGIN_FAIL)
		}
		var loginWebParams = {
			contentType: "application/json;charset=UTF-8",
			errorCall: loginErrorBack
		}

		HttpMessage.instance.sendOtherHttpRequest(url, params, (data) => {
			if (data) {
				LogsManager.echo("kariqu zm.kariquLoginResult------------", data, TableUtils.safelyJsonStringfy(params));
				data = JSON.parse(data)
				KariqiShareManager.kariqiUserId = data && data.data && data.data.userId;
				//拉取分享序列相关数据
				KariqiShareManager.initShareImageInfo(0, null, null);
				KariqiShareManager.initShareVedioMethod();
				//上报登入信息
				KariqiShareManager.postShareLink();
				if (UserInfo.channelUserId) {
					//type1表示服务器登入成功
					StatisticsExtendManager.onEvent(StatisticsCommonConst.KARIQU_LOGIN_SUCESS, {type: 1});
				} else {
					//type2表示服务器登入失败.但是卡日曲登入成功
					StatisticsExtendManager.onEvent(StatisticsCommonConst.KARIQU_LOGIN_SUCESS, {type: 2});
				}
			}
		}, this, "post", loginWebParams)
		//卡日曲两个必须埋点
		var data = [
			{
				"eventId": KariquShareConst.KARIQU_GETOPENID,
				"extraNum": 0
			},
			{
				"eventId": KariquShareConst.KARIQU_GETLAUNCHSCENE,
				"detail": JSON.stringify({
					scene: String(Global.sceneId)
				}),
				"extraNum": 0
			}
		];
		KariqiShareManager.addKariquPoint({list: data});

		//发送在线时长
		TimerManager.instance.add(this.setonLineTime, this, 30000);
		KariqiShareManager.serchConfigInfo(callback, thisObj)

	}

	//记录上一次的渠道参数
	private static lastChannelValue: string = "";

	//获取渠道标签名 如果拉取不到渠道. 读取上一次的渠道名 .保证切出去时 渠道不会被刷新
	public static getChannelValue() {
		if (!UserInfo.platform.shareLinkParams) {
			return this.lastChannelValue;
		}
		var rt: string = UserInfo.platform.shareLinkParams[KariquShareConst.KARIQU_CHANNEL_TITLE];
		if (!rt) {
			return this.lastChannelValue;
		}

		rt = KariquShareConst.KARIQU_CHANNEL_TITLE + "=" + rt;
		this.lastChannelValue = rt;
		return rt
	}


	/**记录关卡 */
	static sendNewLevel(data) {
		if (!this.checkIsKariquChannel()) return;
		// userId		int			是			数字id
		// guanqia		int			否			关卡等级
		// compose		int			否			合成等级
		var url = KariquShareConst.KARIQU_SAVELEVEL_URL;
		var params: any = {
			userId: Number(KariqiShareManager.kariqiUserId),
			guanqia: Number(data.guanqia),
		}
		if (data.compose) {
			params["compose"] = Number(data.compose);
			params.data = data.data || ""
		}
		HttpMessage.instance.sendOtherHttpRequest(url, params, (data) => {
			if (data) {
				LogsManager.echo("kariqu zm.kariquNewLevelResult------------", data, params)
			}
		}, this, "post")
	}

	/**查询配置信息 */
	static serchConfigInfo(callback = null, thisObj = null) {
		if (!this.checkIsKariquChannel()) {
			callback && callback.call(thisObj);
			return;
		}
		if (this.kariquConfigValue) {
			callback && callback.call(thisObj);
			return;
		}
		;
		// param	String数组  	是		配置的key值
		// 如果传入的参数不存在，则不会在返回数据的数组里展示该key对应内容。
		var url = KariquShareConst.KARIQU_CONFIG_URL;
		var datas = {
			param: []
		}


		LogsManager.echo("kariqu zm.kariquserchConfig------------", datas);
		var onErrorCall = () => {
			this.kariquConfigValue = null;
			callback && callback.call(thisObj);
			if (!this._hasSendTask) {
				this._hasSendTask = true
				MainModule.instance.changeShowMainTask(-1, MainModule.task_kariquLogin, "kariquLogin");
			}
		}
		var webParams = {
			errorCall: onErrorCall
		}
		HttpMessage.instance.sendOtherHttpRequest(url, datas, (data) => {
			var value;
			if (data) {
				data = TableUtils.safelyJsonParse(data);
				if (data.data) {
					var info = data.data;
					for (var i = 0; i < info.length; i++) {
						//把所有的配置数据转化成 key value的map
						var tempInfo = info[i];
						this.kariquServerConfigMap[tempInfo.key] = tempInfo.value;
						if (tempInfo.key == "MpCheckChannel") {
							value = tempInfo.value;
						} else if (tempInfo.key == "BannerGamePageCtl") {
							if (typeof tempInfo.value == "string") {
								this.uiBannerStyleMap = TableUtils.safelyJsonParse(tempInfo.value);
							}
						}
					}
				}
				LogsManager.echo("kariqu zm.kariquserchConfigResult------------", data)
			}
			this.kariquConfigValue = value;
			callback && callback.call(thisObj);
			if (!this._hasSendTask) {
				this._hasSendTask = true
				MainModule.instance.changeShowMainTask(-1, MainModule.task_kariquLogin, "kariquLogin");
			}
			//初始化bannerstyle样式
			BannerStyleJumpComp.instance.init();

		}, this, "post", webParams)
	}

	/**
	 * 自定义打点接口【同自有打点统一参数】
	 * @param eventId
	 * @param eventData
	 * @param extraNum
	 */
	static onEvent(eventId, eventData = {}, extraNum = 0) {
		var data = {
			list: [
				{
					"eventId": eventId,
					"detail": JSON.stringify(eventData),
					"extraNum": extraNum
				}
			]
		}
		KariqiShareManager.addKariquPoint(data);
	}

	/**日志埋点 */
	static addKariquPoint(data, callback = null, thisObj = null) {
		if (!this.checkIsKariquChannel()) return;
		//         appid		String	是		游戏appid
		// uuid			String	是		玩家openid
		// list			array	是		数组（支持批量事件一次性发送）
		// 	eventId		String		事件ID (长度最多不超过16个汉字或英文或符号)
		// 	detail		String		"{}" json字符串，作为二级事件点 例如”{\“lv\”:\”1\”}”
		// 							没有二级事件的话 该字段可以不传或者默认"{}"
		// 	extraNum	int			额外数值
		var url = KariquShareConst.KARIQU_GAMESTATIC_URL;
		var params = {
			appid: GameConsts.GAME_APPID,
			uuid: UserInfo.channelUserId,
			channel: this.getChannelValue(),
			list: data.list
		}
		// LogsManager.echo("zm.addKariquPoint------------", params)
		HttpMessage.instance.sendOtherHttpRequest(url, params, (data) => {
			if (data) {
				LogsManager.echo("kariqu zm.addKariquPointResult------------", data, params)
				callback && callback.call(thisObj)
			}
		}, this, "post")
	}

	/**添加视频相关的埋点,isSend是否立刻发送 */
	static addAdvPoint(data, isSend = false) {
		if (!this.checkIsKariquChannel()) {
			return;
		}
		var param =
			{
				eventId: data.eventId,
				detail: JSON.stringify({
					"position": data.name
				}),
				extraNum: 0
			}
		if (!this.advParamsArr) {
			this.advParamsArr = [];
		}
		this.advParamsArr.push(param);

		if (isSend) {
			var tempArr = TableUtils.copyOneArr(this.advParamsArr, []);
			this.advParamsArr.length = 0
			this.addKariquPoint({list: tempArr}, () => {
				this.advParamsArr = [];
			}, this);
		}

	}

	/**定时发送在线时长 */
	static setonLineTime() {
		this.onLineTime = 30;
		var params = [{
			eventId: KariquShareConst.KARIQU_ONLINETIME,
			detail: "{}",
			extraNum: this.onLineTime
		}];
		this.addKariquPoint({list: params});
	}


	//判断是否是卡日曲渠道
	static checkIsKariquChannel() {
		if (JumpManager.jumpChannel != JumpConst.JUMP_CHANNEL_KARIQU) {
			return false;
		}
		return true;
	}

	//-----------------------------------分享相关---------------------------------------------------

	//获取分享图信息
	static initShareImageInfo(type: number = 0, callBack: any = null, thisObj: any = null) {
		var params = {
			Appid: GameConsts.GAME_APPID,
			type: 0
		}

		var onShareCall = (data: any) => {

			data = TableUtils.safelyJsonParse(data);
			if (data && data.code == 0) {
				KariqiShareManager.shareOrderData = [];
				//这里把数据做一次转化
				for (var i = 0; i < data.data.length; i++) {
					var shareData = data.data[i];
					var tempObj = {
						desc: shareData.title,
						imgUrl: shareData.imageurl,
						shareId: shareData.shareid,        //注意大小写
					}
					KariqiShareManager.shareOrderData.push(tempObj);
				}
				LogsManager.echo("kariqu xd initShareImageInfo:", data, TableUtils.safelyJsonStringfy(KariqiShareManager.shareOrderData));
				callBack && callBack.call(thisObj, data);
			}

		}
		HttpMessage.instance.sendOtherHttpRequest(KariquShareConst.KARIQU_SHAREIMAGEINFO_URL, params, onShareCall, this, "post", this.defaultContentParams);
	}

	//当前的分享序号
	private static _currentShareIndex: number = -1;
	private static _currentShareData: any;

	//随机获取一个分享信息. 暂定是按照顺序获取
	static getOneRandomShareInfo() {
		if (!this.checkIsKariquChannel()) {
			return null;
		}
		if (!this.shareOrderData || this.shareOrderData.length == 0) {
			return null;
		}
		this._currentShareIndex++;
		if (this._currentShareIndex >= this.shareOrderData.length) {
			this._currentShareIndex = 0;
		}
		var shareData = this.shareOrderData[this._currentShareIndex];
		this._currentShareData = shareData;
		//给分享链接带上扩展参数
		shareData.extraData = {
			sourceOpenid: UserInfo.channelUserId,
			shareId: shareData.shareId,
			ShareTm: Client.instance.miniserverTime,

		}
		//设置分享来源渠道为001
		shareData.extraData[KariquShareConst.KARIQU_CHANNEL_TITLE] = "001";
		LogsManager.echo("kariqu getOneRandomShareInfo", TableUtils.safelyJsonStringfy(shareData));
		return shareData
	}


	//上报分享记录
	static saveShareRecord() {
		if (!this.checkIsKariquChannel()) {
			return;
		}
		if (!this._currentShareData) {
			LogsManager.warn("没有分享数据,可能是网络原因没有获取到")
			return;
		}
		var params = {
			Openid: UserInfo.channelUserId,
			ShareId: this._currentShareData.extraData.shareId,
			ShareTm: this._currentShareData.extraData.ShareTm,
		}

		var onShareCall = (data: any) => {
			//上报分享成功什么也不执行
			LogsManager.echo("kariqu xd saveShareRecord:", data, "params:", TableUtils.safelyJsonStringfy(params));
		}


		HttpMessage.instance.sendOtherHttpRequest(KariquShareConst.KARIQU_SHAREBEGIN_URL, params, onShareCall, this, "post", this.defaultContentParams);
	}

	//登入之后上报从分享链接进来请求
	private static postShareLink() {
		if (!this.checkIsKariquChannel()) {
			return;
		}
		var sharelink = UserInfo.platform.shareLinkParams;
		if (!sharelink || !sharelink.sourceOpenid) {
			return;
		}
		var params = {
			openid: UserInfo.channelUserId,
			shareId: sharelink.shareId || "",
			shareTm: sharelink.ShareTm || "",
			sourceOpenid: sharelink.sourceOpenid || "",
		}

		var onShareCall = (data: any) => {
			//上报分享成功什么也不执行
			LogsManager.echo("kariqu  postShareLink:", data, "params:", TableUtils.safelyJsonStringfy(params));
		}

		HttpMessage.instance.sendOtherHttpRequest(KariquShareConst.KARIQU_POSTENTERGAME_URL, params, onShareCall, this, "post", this.defaultContentParams);
	}


	//------------------------------分享视频策略相关-------------------------------------------
	public static defaultRuleData: any;
	public static allRuleDatasArr: any[] = [];

	//获取分享策略
	static initShareVedioMethod() {
		if (!this.kariqiUserId) {
			return;
		}
		var params = {
			userId: this.kariqiUserId
		}
		var onCallBack = (data: any) => {
			LogsManager.echo("kariqu initShareVedioMethod", data, TableUtils.safelyJsonStringfy(params));
			data = TableUtils.safelyJsonParse(data);
			if (data && data.code == 0) {
				var ruleDatas = data.data;

				/**
				 * @xdtest 测试数据
				 * 针对一个比如加速收益界面的tag,第一次是视频. 第二次是分享.分享成功率是100%, 第三次是分享,分享成功率是20%, 然后循环 .后面的分享是间隔3秒时间才算分享成功.
				 *
				 */
				// ruleDatas = [
				//     {"tag":"SCORE_STRATEGY","mode":7,"rule":[
				//         {"count":1,"type":"video"},
				//         {"count":2,"type":"share"},
				//     ],"shareRate":[100,20,0],"shareTime":[3]}
				// ]

				for (var i = 0; i < ruleDatas.length; i++) {
					var tempInfo = ruleDatas[i];
					if (tempInfo.tag == this.defaultShareVedioTag) {
						this.defaultRuleData = tempInfo;
						LogsManager.echo("kariqu defaultRuleData init")
					}
					var totalCount = 0;
					for (var s = 0; s < tempInfo.rule.length; s++) {

						totalCount += tempInfo.rule[s].count;
					}
					//记录这个规则的总count
					tempInfo.totalCount = totalCount;
					this.allRuleDatasArr[tempInfo.tag] = tempInfo;
				}
			}
		}

		HttpMessage.instance.sendOtherHttpRequest(KariquShareConst.KARIQU_SHAREMETHOD_URL, params, onCallBack, this, "post", this.defaultContentParams);
	}

	//缓存的所有策略 {tag:rules,...}
	private static _cacheShareVedioMethod: any = {}

	//获取默认的分享策略count  次数
	static getShareVedioMethod(tag: string = null) {
		if (!this.checkIsKariquChannel()) {
			return null;
		}
		if (!this.defaultRuleData) {
			LogsManager.echo("kariqu 分享序列_数据还没有初始化完毕")
			return null;
		}
		tag = String(tag);
		if (!this._cacheShareVedioMethod[tag]) {
			//先从原始数据里面拿
			var rt = this.allRuleDatasArr[tag];
			if (!rt) {
				this._cacheShareVedioMethod[tag] = TableUtils.deepCopy(this.defaultRuleData, {});
			} else {
				this._cacheShareVedioMethod[tag] = TableUtils.deepCopy(rt, {});
			}
		}

		return this._cacheShareVedioMethod[tag]
	}


	/**
	 * 获取分享或者视频策略数据
	 * {tag:{count:{type:1,rule:..}} }
	 */
	private static _shareTvResultMap: any = {};
	//记录当前的分享视频策略  {id:,index:}
	public static currentShareVedioMethod: any = null;

	static getShareOrTvType(tag: string = null, count: number = 0) {
		if (!this.checkIsKariquChannel()) {
			return null;
		}
		var data = this.getShareVedioMethod(tag);
		if (!data) {
			LogsManager.echo("kariqu 没有找到分享视频序列数据,tag", tag);
			return null;
		}

		if (!this._shareTvResultMap[tag]) {
			this._shareTvResultMap[tag] = {}
		}
		var tempObj = this._shareTvResultMap[tag][count]
		if (!tempObj) {
			tempObj = {}
			this._shareTvResultMap[tag][count] = tempObj
		} else {
			this.currentShareVedioMethod = tempObj;
			return tempObj
		}
		var firstRules
		var rules: any[] = data.rule;
		var totalCount = data.totalCount;
		var yushu = count % totalCount;
		var currentCount = 0;
		var endCount: number = 0;
		var ruleIndex: number = 0;
		for (var i = 0; i < rules.length; i++) {
			firstRules = rules[i];

			endCount = currentCount + firstRules.count;
			ruleIndex = i;
			//算头不算尾巴
			if (yushu >= currentCount && yushu < endCount) {
				break;
			}
			currentCount = endCount;
		}


		//如果是第一轮的开始
		if (yushu == 0 || !data.__tempShareRate) {
			data.__tempShareRate = TableUtils.copyOneArr(data.shareRate, [])
			data.__tempShareTime = TableUtils.copyOneArr(data.shareTime, [])
		}
		//取的是临时的分享序列. 只有当每轮第一次的时候 才重置取分享的次数
		var shareRate: any[] = data.__tempShareRate
		var shareTime = data.__tempShareTime;

		if (firstRules.type == "share") {
			tempObj.type = ShareOrTvManager.TYPE_SHARE
		} else {
			tempObj.type = ShareOrTvManager.TYPE_ADV
		}
		tempObj.shareRateArr = shareRate
		tempObj.shareTimeArr = shareTime

		LogsManager.echo("kariqu getShareOrTvType,tag:", tag, "count:", count, "ruleIndex:", ruleIndex, TableUtils.safelyJsonStringfy(tempObj));
		LogsManager.echo("kariqu getShareOrTvType,tagRuleData:", TableUtils.safelyJsonStringfy(data));
		this.currentShareVedioMethod = tempObj;
		return tempObj
	}

	//判断分享结果 -1 表示走原生的. 0表示失败 ,1表示成功
	public static checkShareResult(distime: number) {
		if (!this.checkIsKariquChannel()) {
			return -1;
		}
		if (!this.currentShareVedioMethod) {
			return -1;
		}
		if (this.currentShareVedioMethod.type == ShareOrTvManager.TYPE_ADV) {
			return -1;
		}
		var shareRateArr = this.currentShareVedioMethod.shareRateArr
		var shareTimeArr = this.currentShareVedioMethod.shareTimeArr
		var shareRate;
		var shareTime;
		if (shareRateArr.length > 0) {
			shareRate = shareRateArr.shift();
			if (shareRate == 0) {
				if (shareTimeArr.length > 0) {
					shareTime = shareTimeArr.shift();
				} else {
					//-1表示走原生的自己的分享策略
					shareTime = -1
				}
			}
		} else {
			if (shareTimeArr.length > 0) {
				shareTime = shareTimeArr.shift();
				shareRate = 0;
			} else {
				//-1表示走原生的自己的分享策略
				shareTime = -1
				//-1表示数组取完了走默认概率
				shareRate = -1;
			}

		}

		LogsManager.echo("kariqu checkShareResult", "shareRate", shareRate, "shareTime", shareTime);
		//如果概率为-1 表示走原生的
		if (shareRate == -1 || shareTime == -1) {
			return -1
		} else if (shareRate == 0) {
			if (distime > shareTime * 1000) {
				return 1;
			} else {
				return 0;
			}
		} else {
			var random = RandomUtis.getOneRandomInt(100, 0, 99);
			//如果没有满足概率  那么直接返回 分享失败
			if (random < shareRate) {
				return 1;
			}
			return 0;
		}


	}

	//获取某个界面的banner和jump状态开关
	public static getOneUIBannerJumpState(uiName: string) {
		//如果是没有开启banner样式的 返回空
		if (!KariquShareConst.isOpenBannerStyleJump) {
			return null;
		}
		// 开关关闭，不显示
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHOWJUMP)) {
			return;
		}
		var rt = this.uiBannerStyleMap[uiName]
		if (rt != null) {
			return Number(rt)
		}
		rt = this.kariquServerConfigMap["BannerAllPageCtl"];
		if (rt != null) {
			return Number(rt);
		}
		return rt
	}

	//获取分享失败文案
	public static getShareFailStr() {
		return this.kariquServerConfigMap.ShareFailContent;
	}

	//获取分享title
	public static getShareTileStr() {
		return this.kariquServerConfigMap.ShareTitle;
	}

	//获取顶部导量条开关
	public static checkIsShowTopJump() {
		var rt = this.kariquServerConfigMap["RedirectTopPageCtl"];
		if (rt == null) {
			return false;
		}
		if (Number(rt) == 0) {
			return false;
		}
		return true
	}


}
