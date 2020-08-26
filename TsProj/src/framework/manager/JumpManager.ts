import UserInfo, {PlatformIdType} from "../common/UserInfo";
import TimerManager from "./TimerManager";
import JumpConst from "../../game/sys/consts/JumpConst";
import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import Global from "../../utils/Global";
import LogsManager from "./LogsManager";
import GameSwitch from "../common/GameSwitch";
import GameConsts from "../../game/sys/consts/GameConsts";
import HttpMessage from "../common/HttpMessage";
import Client from "../common/kakura/Client";
import WindowManager from "./WindowManager";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import {LoadManager} from "./LoadManager";
import ResultJumpUI from "../../game/sys/view/jump/ResultJumpUI";
import Message from "../common/Message";
import JumpEvent from "../event/JumpEvent";
import {ButtonUtils} from "../utils/ButtonUtils";
import ResourceConst from "../../game/sys/consts/ResourceConst";
import {AdResponse} from "../platform/AdResponse";
import GameUtils from "../../utils/GameUtils";
import {JumpFunc} from "../func/JumpFunc";
import KariqiShareManager from "./KariqiShareManager";
import WindowCommonCfgs from "../consts/WindowCommonCfgs";
import JumpCommonConst from "../consts/JumpCommonConst";
import ResultJumpDoubleUI from "../../game/sys/view/jump/ResultJumpDoubleUI";
import SingleCommonServer from "../server/SingleCommonServer";
import FullJumpFunc from "../func/FullJumpFunc";
import JumpCommonModel from "../model/JumpCommonModel";
import BaseFunc from "../func/BaseFunc";
import TableUtils from "../utils/TableUtils";

/**
 * 互推管理器
 * 获取互推小游戏列表
 * 互推 MOKA SDK打点
 */
export default class JumpManager {
	static data: any[];
	static interData: any[] = [];
	static typeData: any[] = [];
	static callBack;
	static thisObject;
	static callParams;
	/**
	 * 晃动图标实例
	 */
	private static mainJumpItems: any[] = [];
	/**
	 * 是否已经打开瀑布流
	 */
	static isInDrawer: boolean = false;
	private static jumpUIs: any[] = [];
	private static jumpDoubleUIs: any[] = [];

	private static jumpUIName: string = "jumpUI";
	private static jumpDoubleUIName: string = "jumpDoubleUI";
	/**是否为本地web测试 */
	private static isWebTest: boolean = false;

	public static setFrom;

	// 是否是黑名单场景  0表示为初始哈 1 表示是黑名单 2表示正常
	static blackSceneState: number = 0;
	private static interJumpNum = -1;

	/** 互推渠到*/
	static jumpChannel = null;
	public static zhiseData;
	//当前主界面显示的图标组
	static curGroup = [];

	/**用户点击互推次数 */
	public static clickCount = 0;
	static kariquJumpResult;
	/**
	 * 不同类型当前下标。用于顺序展示
	 */
	static jumpIndexTable = {};
	private static currentInterPos;
	//判断平台是否和 配表的名称匹配

	static kariquList;

	static checkIsBlackScene() {

		if (UserInfo.isWeb()) {
			return false;
		}
		//先确认黑名单状态
		if (this.blackSceneState == JumpConst.JUMP_SCENE_STATE_NONE) {
			var platCodeMap = {
				[PlatformIdType.wxgame]: 1,
				[PlatformIdType.tt]: 2,
				[PlatformIdType.qqgame]: 3
			}

			var platCode = platCodeMap[UserInfo.platformId]

			var cfgs = GlobalParamsFunc.instance.getAllCfgData("ElectBlackList", true);
			this.blackSceneState = JumpConst.JUMP_SCENE_STATE_NORMAL;
			for (var i in cfgs) {
				var info = cfgs[i];
				//先判断平台是否相等
				if (info.blackListPlatform == platCode) {
					if (String(info.electBlackListNub) == String(Global.currentSceneId)) {
						this.blackSceneState = JumpConst.JUMP_SCENE_STATE_BLACK;
						LogsManager.echo("jump", "这是一个黑名单的场景值", Global.currentSceneId);
						break;
					}
				}
			}
		}
		if (this.blackSceneState == JumpConst.JUMP_SCENE_STATE_NORMAL) {
			return false;
		}
		return true;
	}


	/**判断是否显示互推功能 */
	static checkShow() {
		if (this.isWebTest) {
			return true;
		}
		if (this.checkIsBlackScene() || this.checkIsKariquBlack()) {
			return false;
		}
		// 各平台实现互推判断
		if (!UserInfo.platform.canUseJump()) {
			return false;
		}

		return true;

	}

	/**设置互推渠道 */
	static setJumpChannel(channel = null) {
		this.jumpChannel = channel;
	}

	/**
	 * 初始化互推数据
	 *
	 * @param {Array<any>|any} mutualType  指定某种类型刷新，null为刷新所有类型
	 */

	static initJumpData(callBack: any, thisObject: any, callParams: any = null, channel = null, mutualType: Array<any> | any = null) {

		if (channel) {
			this.jumpChannel = channel;
		}

		if (!this.jumpChannel) return;
		if (!this.checkShow()) return;
		if (this.data) {
			if (mutualType) {
				this.deleteDataByTypes(mutualType);
			} else {
				callBack && callBack.call(thisObject, callParams);
				return;
			}
		}

		if (this.jumpChannel == JumpConst.JUMP_CHANNEL_FANTASY) {
			this.sendFantasyReq(callBack, thisObject, callParams);
		} else if (this.jumpChannel == JumpConst.JUMP_CHANNEL_MENGJIA) {
			this.sendMokaReq(callBack, thisObject, callParams);
		} else if (this.jumpChannel == JumpConst.JUMP_CHANNEL_ZHISE) {
			this.sendZhiseReq(callBack, thisObject, callParams)
		} else if (KariqiShareManager.checkIsKariquChannel()) {
			if (UserInfo.isTT()) {
				this.sendFantasyReq(callBack, thisObject, callParams);
			} else {
				this.sendKariquReq(callBack, thisObject, callParams, mutualType)
			}

		}
	}

	/**
	 * 删除指定类型的互推数据
	 * @param mutualType
	 */
	static deleteDataByTypes(mutualType: Array<any>) {
		if (mutualType.length) {
			for (var index = this.data.length - 1; index >= 0; index--) {
				var type = this.data[index].MutualType;
				if (mutualType.indexOf(Number(type)) != -1) {
					this.data.splice(index, 1);
				}
			}
		} else {
			for (var index = this.data.length - 1; index >= 0; index--) {
				var type = this.data[index].MutualType;
				if (mutualType == type) {
					this.data.splice(index, 1);
				}
			}
		}
	}

	//获取卡日曲发送数据
	static getKariquSendData(kariquList) {
		var data;
		if (kariquList.url == GameConsts['JUMP_KARIQU_REDIRECT_LIST_URL']) {
			// 新版接口
			data = {
				userId: KariqiShareManager.kariqiUserId,
				type: kariquList.type,
			}
		} else {
			// 老板接口
			var isIos = false;
			if ((UserInfo.platform.getSystemInfo() && UserInfo.platform.getSystemInfo().platform == "ios")) {
				isIos = true;
			}
			data = {
				Appid: GameConsts.GAME_APPID,
				Type: kariquList.type,
				IsIOS: isIos
			}
		}


		return data;
	}

	static setKariquList(list) {
		JumpManager.kariquList = list;
	}

	static sendKariquReq(callBack: any, thisObject: any, callParams: any = null, mutualType = null) {
		if (!JumpManager.kariquList) {
			LogsManager.errorTag("noJumpList", "kariquNoJumpList");
			LogsManager.echo("this.data-----------------", this.data)
			this.callBack && this.callBack.call(this.thisObject, this.callParams);
			return;
		}

		var kariquList = [];
		if (mutualType) {
			for (var kariquIndex in JumpManager.kariquList) {
				if (JumpManager.kariquList[kariquIndex].type == mutualType) {
					var kariquInfo = {};
					TableUtils.deepCopy(JumpManager.kariquList[kariquIndex], kariquInfo);
					kariquList.push(kariquInfo);
				}
			}
		} else {
			for (var index in JumpManager.kariquList) {
				var kariquInfo = {};
				TableUtils.deepCopy(JumpManager.kariquList[index], kariquInfo);
				kariquList.push(kariquInfo);
			}
		}

		if (kariquList.length == 0) {
			LogsManager.errorTag("noJumpList", "kariquNoJumpList");
			LogsManager.echo("this.data-----------------", this.data)
			this.callBack && this.callBack.call(this.thisObject, this.callParams);
			return;
		}

		this.callBack = callBack;
		this.thisObject = thisObject;
		this.callParams = callParams;

		kariquInfo = kariquList.pop();
		var url = kariquInfo["url"];
		var params = this.getKariquSendData(kariquInfo);
		HttpMessage.instance.sendOtherHttpRequest(url, params, this.onKariquSuccess, this, "post", null, 1, {
			info: kariquInfo,
			list: kariquList
		})
	}


	static onKariquSuccess(data: any, kariquParams) {
		LogsManager.echo("hlx 卡日曲互推列表返回：", data);
		if (data) {
			data = JSON.parse(data);
		}
		if (data && data.data) {
			if (!this.data) {
				this.data = [];
			}
			AdResponse.changeKariquStruct(data.data, kariquParams.info, this.data);
		}
		var kariquList = kariquParams.list;
		var kariquInfo = kariquList.pop();
		if (kariquInfo) {
			var url = kariquInfo.url;
			var params = this.getKariquSendData(kariquInfo);
			HttpMessage.instance.sendOtherHttpRequest(url, params, this.onKariquSuccess, this, "post", null, 1, {
				info: kariquInfo,
				list: kariquList
			})
		} else {
			LogsManager.echo("this.data-----------------", this.data)
			this.callBack && this.callBack.call(this.thisObject, this.callParams);
		}
	}

	/**
	 * 指色：获取互推数据
	 */
	static sendZhiseReq(callBack: any, thisObject: any, callParams: any = null) {
		LogsManager.echo("拉取指色互推")
		this.callBack = callBack;
		this.thisObject = thisObject;
		this.callParams = callParams;
		if (!this.zhiseData) {
			this.zhiseData = window["zhise"]
		}
		var thisObj = this;
		this.zhiseData.loadAd((data: AdResponse) => {
			if (data) {
				thisObj.data = AdResponse.changeStruct(data);
				for (var i = 0; i < thisObj.data.length; i++) {
					thisObj.data[i].GameIndex = i;
				}
				LogsManager.echo("拉取指色互推Success", thisObj.data);
				thisObj.callBack && thisObj.callBack.call(thisObj.thisObject, thisObj.callParams);
			}

		})
	}


	/**
	 * 奇幻梦想：获取互推数据
	 */
	static sendFantasyReq(callBack: any, thisObject: any, callParams: any = null) {
		this.callBack = callBack;
		this.thisObject = thisObject;
		this.callParams = callParams;


		// 互推数据走配表
		if (this.initDataByFunc()) {
			return;
		}
		var url = GameConsts.JUMP_FANTASY_URL;

		url += "&op=1101";
		url += "&appkey=" + GameConsts.JUMP_FANTASY_APPKEY;
		HttpMessage.instance.sendOtherHttpRequest(url, {}, this.onFantasySuccess, this, "get")
	}

	/**
	 * 奇幻梦想：根据配表初始化互推
	 */
	static initDataByFunc() {
		var data = JumpFunc.instance.getJumpList();
		if (data.length != 0) {
			this.data = [];
			this.interData = [];
			var jumpedAppList = JumpCommonModel.instance.getJumpedList();
			for (var i = 0; i < data.length; i++) {
				if (jumpedAppList[data[i].GameAppId.replace(/\./g, "_")]) {
					continue;
				}
				data[i].GameIndex = i;
				if (data[i].Position > 100) {
					this.interData.push(data[i]);
				} else {
					this.data.push(data[i]);
				}
			}
			LogsManager.echo("ycn fantasyJumpData:", this.data, this.interData, "len:", this.data.length);
			this.callBack && this.callBack.call(this.thisObject, this.callParams);
			return true;
		}
		return false;
	}

	/**
	 * 奇幻梦想：获取互推数据回调
	 */
	static onFantasySuccess(data: any) {
		LogsManager.echo("拉取互推列表 onFantasySuccess", data);
		if (data) {
			try {
				data = JSON.parse(data);
			} catch (e) {
				LogsManager.warn("Fantasyjump", "httpError,onFantasySuccess backData:", data);
				return;
			}
			if (!data[0].result) {
				LogsManager.warn("Fantasyjump", "httpError,onFantasySuccess backData:", data);
				return;
			}
			this.data = data[0].result.data;
			for (var i = 0; i < this.data.length; i++) {
				var jumpedAppList = JumpCommonModel.instance.getJumpedList();
				for (var i = 0; i < data.data.length; i++) {
					if (jumpedAppList[data.data[i].GameAppId.replace(/\./g, "_")]) {
						continue;
					}
					if (data.data[i].Position <= 100) {
						this.data.push(data.data[i]);
					} else if (data.data[i].Position > 100) {
						this.interData.push(data.data[i]);
					}
				}
				this.data[i].GameIndex = i;
			}
			this.callBack && this.callBack.call(this.thisObject, this.callParams);
		}
	}

	/**
	 * 发送获取互推小游戏列表的请求 自定义的回调参数.只支持一个参inviteReward数
	 * 后面所有拉取魔卡界面调用的地方应该都通过这个接口处理
	 */
	static sendMokaReq(callBack: any, thisObject: any, callParams: any = null) {
		this.callBack = callBack;
		this.thisObject = thisObject;
		this.callParams = callParams;
		var url = "https://api.mokagm.com/outer/sdk/data/mutual-pos" + "?";
		var timestamp = Client.instance.serverTime;

		var keyStr = GameConsts.JUMP_MENGJIA_APIKEY + timestamp + GameConsts.JUMP_MENGJIA_APISECRET;
		var apisign = Md5.init(keyStr);
		url += "apisign=" + apisign;
		url += "&apikey=" + GameConsts.JUMP_MENGJIA_APIKEY;
		url += "&timestamp=" + timestamp;
		url += "&apiSecret=" + GameConsts.JUMP_MENGJIA_APISECRET;
		url += "&appkey=" + GameConsts.JUMP_MENGJIA_APPKEY;

		HttpMessage.instance.sendOtherHttpRequest(url, {}, this.onMokaSuccess, this, "get")
	}

	/**
	 * 拉取互推信息列表回调
	 */
	static onMokaSuccess(data: any) {
		LogsManager.echo("拉取互推列表 onMokaSuccess", data);
		if (data) {
			try {
				data = JSON.parse(data);
			} catch (e) {
				LogsManager.warn("mokajump", "httpError,onMokaSuccess backData:", data);
				return;
			}
			if (data.code && data.code == "200") {
				this.data = [];
				this.interData = [];
				var jumpedAppList: any[];
				jumpedAppList = JumpCommonModel.instance.getJumpedList();
				for (var i = 0; i < data.data.length; i++) {
					if (jumpedAppList[data.data[i].GameAppId.replace(/\./g, "_")]) {
						continue;
					}
					if (data.data[i].Position <= 100) {
						this.data.push(data.data[i]);
					} else if (data.data[i].Position > 100) {
						this.interData.push(data.data[i]);
					}
				}
				for (var i = 0; i < this.data.length; i++) {
					this.data[i].GameIndex = i;
				}
				this.callBack && this.callBack.call(this.thisObject, this.callParams);
			}
		}
	}

	static onMokaError(data: any) {
		LogsManager.echo("拉取互推列表 失败 onMokaError", data);
	}

	/**获取互推小游戏列表数据 */
	static getMokaData(min = 1, max = 10, sort = 1) {
		min--;
		max--;
		if (!this.data) return;
		var result: any[] = [];
		for (var index in this.data) {
			if (Number(index) >= min && Number(index) <= max) {
				result.push(this.data[index]);
			}
		}
		//按照权重排列 从小到大
		if (sort) {
			result = result.sort((a, b) => {
				if (a.Position > b.Position) {
					return 1;
				} else {
					return -1;
				}
				// return Math.random() < 0.5 ? 1 : -1
			})
		}
		// var length = len;//Math.max(result.length, len);
		// result = result.slice(0, length);
		return result;
	}

	/**根据MutualType获取互推小游戏列表数据 */
	static getMokaDataByType(type: number) {
		if (!this.data) return [];
		var result: any[] = [];
		for (var i = 0; i < this.data.length; i++) {
			var newData = this.data[i];
			if (newData.MutualType && (newData.MutualType == type || newData.MutualType == (type + "") || (newData.MutualType.indexOf(type + "") != -1))) {
				result.push(newData);
			}
		}
		this.typeData[type] = result;
		return this.typeData[type];
	}

	/**抽屉展开 */
	static mtDrawer(data: any[]) {
	}

	/**
	 * 取消互推跳转
	 * 从其他游戏返回1038
	 * 弹出抽屉
	 */
	static showDrawerView(from, extra = null, uiParam: any = {}) {
		if (!uiParam.width) {
			uiParam.width = 350;
		}
		if (!uiParam.height) {
			uiParam.height = 720;
		}
		if (!uiParam.border) {
			uiParam.border = 10;
		}
		if (!uiParam.columns) {
			uiParam.columns = 2;
		}

		// 开关关闭，不显示抽屉
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHOWJUMP_DRAWER_VIEW)) {
			return;
		}
		this.setFrom = from;
		LogsManager.echo("returnGame1----------------", from)
		if (!this.checkShow()) return;
		if (this.isInDrawer) return;
		if (this.data) {
			if (this.jumpChannel == JumpConst.JUMP_CHANNEL_ZHISE) {
				WindowManager.OpenUI(WindowCommonCfgs.JUMPLISTZHISEVIEW, extra);
			} else if (this.jumpChannel == JumpConst.JUMP_CHANNEL_MENGJIA || this.jumpChannel == JumpConst.JUMP_CHANNEL_FANTASY) {
				var windowName;
				if (GameSwitch.getSwitchState(GameSwitch.SWITCH_DRAWER_TYPE) == '1') {
					windowName = 'JumpListUI';
				} else if (GameSwitch.getSwitchState(GameSwitch.SWITCH_DRAWER_TYPE) == '2') {
					windowName = 'JumpExitUI';
				}
				WindowManager.OpenUI(windowName, uiParam);
			}
		}
	}

	/**显示指色主界面互推弹框 */
	static showMainJumpZhise(from) {
		this.setFrom = from;
		LogsManager.echo("returnGame1----------------", from)
		if (!this.checkShow()) return;
		if (this.data) {
			WindowManager.OpenUI(WindowCommonCfgs.MAINJUMPZHISEVIEW);
		}
	}

	/**显示主界面互推弹框 */
	static showMainJumpKariqu(from) {
		this.setFrom = from;
		LogsManager.echo("returnGame1----------------", from)
		if (!this.checkShow()) return;
		if (this.data) {
			WindowManager.OpenUI(WindowCommonCfgs.MainJumpKariquView);
		}
	}

	/**
	 * 添加互推条
	 * extraData = {
	 *  posX:
	 *  posY:
	 *  scale:UI的缩放
	 *  isDouble:是多排还是单排
	 *  from:互推界面
	 * }
	 */
	static addJumpUI(parent: any, extraData: any = {}, param: any = {}) {
		if (!param.uiType) {
			param.uiType = JumpCommonConst.JUMP_LIST_SOFT_UI;
		}
		if (!this.checkShow()) return;
		var jumpData;
		extraData.type = JumpConst.JUMP_TYPE_JIESUAN
		if (param.uiType != JumpCommonConst.JUMP_LIST_SOLID_UI) {
			jumpData = this.getMokaDataByType(JumpConst.JUMP_TYPE_JIESUAN);
		} else {
			jumpData = this.getSolidJumpData();
		}

		if (jumpData.length <= 0) return;

		var cfgs = WindowManager.getWindowCfgs(WindowCommonCfgs.ResultJumpView)
		var res = cfgs.group;
		var subpackage = cfgs.subPackage
		var resAll = [];
		LogsManager.echo("extraData.from---------------", extraData.from)
		var tempFunc = () => {
			this.initJumpUI(parent, jumpData, extraData, param);
		}
		if (extraData.isDouble) {
			var cfgs = WindowManager.getWindowCfgs(WindowCommonCfgs.ResultJumpDoubleView)
			res = res.concat(cfgs.group);
		}

		LoadManager.instance.loadPacgeAndRes(subpackage, res, Laya.Handler.create(this, tempFunc));
	}

	/**获取静互推刷新数据 */
	static getSolidJumpData() {
		if (!this.data) return [];
		this.data.sort(function (a, b) {
			return a.Position - b.Position
		})
		var randNum1 = GameUtils.getRandomInt(2, this.data.length - 1);
		var randNum2 = GameUtils.getRandomInt(2, this.data.length - 1);
		if (randNum2 == randNum1) {
			randNum2 = (randNum1 > 2) ? (randNum1 - 1) : (randNum1 + 1);
		}
		var jumpData = [];
		for (var i = 0; i < this.data.length; i++) {
			if (i == 0 || i == 1 || i == randNum1 || i == randNum2) {
				jumpData.push(this.data[i])
			}
		}
		return jumpData;
	}

	/**初始化结算的互推，四个结算界面都用这个 */
	static initJumpUI(parent, jumpData, extraData, param) {
		var from = extraData.from;
		var jumpUIName = this.jumpUIName;
		if (extraData.isDouble) {
			jumpUIName = this.jumpDoubleUIName;
		}
		LogsManager.echo("extraData.from1---------------", from)
		var jumpUI = this.getJumpUIIns(jumpData, extraData, param);

		parent.addChild(jumpUI);
		jumpUI.name = jumpUIName;
		jumpUI.scaleX = jumpUI.scaleY = (extraData.scale != undefined) ? extraData.scale : 1;
		jumpUI.x = (extraData.posX != undefined) ? extraData.posX : (extraData.isDouble ? 43 : 25);
		jumpUI.y = (extraData.posY != undefined) ? extraData.posY : (120 + ScreenAdapterTools.toolBarWidth);
	}

	/**移除互推UI */
	static removeJumpUI(parent, isDouble: boolean = false) {
		var jumpUIName = this.jumpUIName;
		if (isDouble) {
			jumpUIName = this.jumpDoubleUIName;
		}
		var jumpUI = parent.getChildByName(jumpUIName);
		if (jumpUI) {
			parent.removeChild(jumpUI);
			jumpUI.clearMoveLoop();
			if (isDouble) {
				this.jumpDoubleUIs.push(jumpUI);
			} else {
				this.jumpUIs.push(jumpUI);
			}
		}
	}

	/**获取结算互推UI */
	static getJumpUIIns(data: any, extraData, param) {
		LogsManager.echo("extraData.from2-------------", extraData.from)
		if (extraData.isDouble) {
			if (this.jumpDoubleUIs.length > 0) {
				var item = this.jumpDoubleUIs.shift();
				item.setFrom(extraData.from);
				item.initData(data, false);
				item.setJumpParam && item.setJumpParam(param);
				return item;
			}
			LogsManager.echo("yrc new ResultJumpDoubleUI");
			var ui2 = new ResultJumpDoubleUI(data, 90, false, extraData);
			ui2.initData(data, false);
			return ui2
		} else {
			if (this.jumpUIs.length > 0) {
				var item = this.jumpUIs.shift();
				item.setFrom(extraData.from);
				item.initData(data);
				item.setJumpParam && item.setJumpParam(param);
				return item;
			} else {
				LogsManager.echo("yrc new ResultJumpUI");
				var ui = new ResultJumpUI(data, extraData, param);
				ui.initData(data);
				return ui
			}
		}

	}

	/**停止结算界面的定时器 */
	static stopResultMove() {
		Message.instance.send(JumpEvent.JUMP_RETURN_GAMEMAIN);
	}


	/**获取随机 ,除了主界面外的随机用这个*/
	static getKariquOneRandomJump(type) {
		var jumpData = this.getMokaDataByType(type);
		var length = jumpData.length;
		if (length > 0) {
			//为了排重，按顺序展示
			if (!this.jumpIndexTable[type] || (this.jumpIndexTable[type] && this.jumpIndexTable[type] == length)) {
				this.jumpIndexTable[type] = 0;
			}
			var data = jumpData[this.jumpIndexTable[type]];
			this.jumpIndexTable[type] += 1;
			return data;
		}
	}

	/**获取随机 ,除了主界面外的随机用这个*/
	static getOneRandomJump(type) {
		var jumpData = this.getMokaDataByType(type);
		var length = jumpData.length;
		if (length > 0) {
			//为了排重，按顺序展示
			if (!this.jumpIndexTable[type] || (this.jumpIndexTable[type] && this.jumpIndexTable[type] == length)) {
				this.jumpIndexTable[type] = 0;
			}
			var data = jumpData[this.jumpIndexTable[type]];
			this.jumpIndexTable[type] += 1;
			return data;
		}
	}


	/**获取主界面推荐的随机 */
	static getRandomJump(indexList) {
		var jumpData = this.data;
		if (this.data) {
			var length = jumpData.length;
			if (length > 0) {
				var index = 0;
				index = this.getGroupRandomIndex(indexList);
				// 获取GameIndex
				for (var i = 0; i < length; i++) {
					// 由于data会删除。所以不能记录i。需要记录
					if (jumpData[i].GameIndex == index) {
						return jumpData[i]
					}
				}
			}
		}
		return null;
	}

	/**获取随机到的icon下标 */
	static getGroupRandomIndex(arr = []) {
		if (arr.length == 0) return 1;
		var index = GameUtils.getRandomInt(0, arr.length - 1);
		var result = arr[index];
		for (var i = arr.length - 1; i >= 0; i--) {
			if (i == index) {
				arr.splice(i, 1);
			}
		}
		return result;
	}

	/**
	 * 往界面添加跳转图标,指单个图标
	 * posArr 需要创建几个就传几个格式,x y 分别是图标位置[{x:1,y:1},{x:1,y:1}]
	 * isNeedSign 是否需要红点或者标志
	 * type:展示类型
	 */

	static addMainJump(parent: any, jumpPos: any, posArr = [], isNeedSign = false, isShowBg = false, mutualType = null, isShowName = false, txtSize = 15, txtcolor = "ffffff", isShowLableBg = false, signWidth = 0, signHeight = 0, bgextraWidth = 0, isNeedRemove = true, isNeedOpenJumpUI = false) {
		if (isNeedRemove) {
			//是否需要移除之前的 用于在不同界面加时，初始化另一界面时旧界面的删除
			this.removeMainJump();
			this.mainJumpItems = [];
		}
		if (!this.data) {
			return;
		}
		var length = this.data.length;
		this.curGroup = [];
		for (var i = 0; i < length; i++) {
			// 由于data会删除。所以不能记录i。需要记录
			this.curGroup.push(this.data[i].GameIndex);
		}
		//目前往右上角只添加一个icon
		for (var i = 0; i < posArr.length; i++) {
			var jumpData;
			var posItem = posArr[i];
			var tempMutualType = posItem.mutualType ? posItem.mutualType : mutualType;
			if (KariqiShareManager.checkIsKariquChannel()) {
				jumpData = this.getOneRandomJump(tempMutualType)
			} else {
				jumpData = this.getRandomJump(this.curGroup);
			}
			if (jumpData) {
				posItem.width = posItem.width ? posItem.width : 93;
				var extraData = {from: jumpPos};
				if (isNeedOpenJumpUI) {
					extraData["callBack"] = JumpManager.openJumpListUI;
				}
				var mainJumpItem: Laya.Image = this.createJumpItem(jumpData, posItem.width, posItem.width, extraData, isNeedSign, JumpConst.JUMP_ANI_STYLE_1, isShowName, txtSize, txtcolor, isShowLableBg, signWidth, signHeight, isShowBg, bgextraWidth);
				mainJumpItem.x = posItem.x;
				mainJumpItem.y = posItem.y;
				mainJumpItem.anchorX = 0.5
				mainJumpItem.anchorY = 0.5
				// 互推信息
				mainJumpItem["__jumpData"] = jumpData;
				// 互推类型
				mainJumpItem["__mutualType"] = tempMutualType;
				// 图标添加舞台回调，播放动画
				mainJumpItem["__addStageCallback"] = function () {
					JumpManager.startMainJumpTween(this);
				}
				// 图标移除舞台回调
				mainJumpItem["__removeStageCallback"] = function () {
					JumpManager.stopMainJumpTween(this);
				}
				// 添加事件
				mainJumpItem.on(Laya.Event.DISPLAY, mainJumpItem, mainJumpItem["__addStageCallback"]);
				mainJumpItem.on(Laya.Event.UNDISPLAY, mainJumpItem, mainJumpItem["__removeStageCallback"]);

				parent.addChild(mainJumpItem);
				this.mainJumpItems.push(mainJumpItem);
			}
		}
	}

	/**
	 * 返回当前需要刷新的items
	 */
	static getMainJumpItems() {
		return this.mainJumpItems;
	}

	/**
	 * 开始图标动画
	 */
	static startMainJumpTween(mainJumpItem) {
		mainJumpItem["__tempTimeCode"] = TimerManager.instance.setTimeout(this.scaleShake, this, 3000, mainJumpItem);
	}

	/**
	 * 暂停图标动画
	 */
	static stopMainJumpTween(mainJumpItem) {
		// 重置图标状态
		mainJumpItem.scaleX = 1;
		mainJumpItem.scaleY = 1;
		mainJumpItem.rotation = 0;
		// 移除延迟函数
		if (mainJumpItem["__tempTimeCode"]) {
			TimerManager.instance.remove(mainJumpItem["__tempTimeCode"]);
			mainJumpItem["__tempTimeCode"] = null;
		}
		// 移除对应的tween动画
		Laya.Tween.clearAll(mainJumpItem);
	}

	/**移除主界面的跳转图标 */
	static removeMainJump() {
		for (var i = this.mainJumpItems.length - 1; i >= 0; i--) {
			var mainJumpItem = this.mainJumpItems[i];
			if (mainJumpItem) {
				this.destoreJumpItem(mainJumpItem);
			}
		}
	}

	static refreshMainJumpImg(mainJumpItem: Laya.Image, restart = true) {
		//如果当前是显示在舞台的才执行
		if (mainJumpItem.stage) {
			var img: Laya.Image = mainJumpItem.getChildByName("imageIcon") as Laya.Image;
			var lastIndex = 0;
			var jumpData;
			if (KariqiShareManager.checkIsKariquChannel()) {
				jumpData = this.getOneRandomJump(mainJumpItem["__mutualType"])
			} else {
				for (var i = 0; i < this.data.length; i++) {
					if (this.data[i].Icon == img.skin) {
						lastIndex = this.data[i].GameIndex;
						break;
					}
				}
				if (this.curGroup.indexOf(lastIndex) == -1) {
					this.curGroup.push(lastIndex);
				} else {
					LogsManager.echo("zm.repeat--------------", lastIndex)
				}
				jumpData = this.getRandomJump(this.curGroup);
			}

			for (var i = 0; i < this.mainJumpItems.length; i++) {
				if (this.mainJumpItems[i] && this.mainJumpItems[i] == mainJumpItem) {
					this.mainJumpItems[i]["__jumpData"] = jumpData;
				}
			}

			var txt: Laya.Label = mainJumpItem.getChildByName("imageTxt") as Laya.Label;
			if (txt) {
				txt.text = jumpData.GameName;
			}
			img.skin = jumpData.Icon;
			var lastButtonUtil: ButtonUtils = img["__lastButtonUtils"];
			if (lastButtonUtil) {
				//重置按钮的回调参数
				var addParam = lastButtonUtil._callBackParam
				var newParams = {
					jumpData: jumpData,
					extraData: addParam.extraData
				}
				lastButtonUtil.setCallBackInfo(this.onClickJumpItem, this, newParams);
			}

		}
		if (restart) {
			this.startMainJumpTween(mainJumpItem);
		}
	}

	/**
	 * 晃动图标
	 * @param restart 刷新图标后是否重新开始动画
	 */
	static scaleShake(mainJumpItem: any, restart = true) {
		// 晃动开始 计时器code清除
		mainJumpItem["__tempTimeCode"] = null;
		//向左
		Laya.Tween.to(mainJumpItem, {rotation: -5}, 300, null, Laya.Handler.create(this, () => {
			//向右
			Laya.Tween.to(mainJumpItem, {rotation: 5}, 600, null, Laya.Handler.create(this, () => {
				//恢复
				Laya.Tween.to(mainJumpItem, {rotation: -5}, 600, null, Laya.Handler.create(this, () => {
					//向右
					Laya.Tween.to(mainJumpItem, {rotation: 5}, 600, null, Laya.Handler.create(this, () => {
						//恢复
						Laya.Tween.to(mainJumpItem, {rotation: 0}, 300, null, Laya.Handler.create(this, () => {
							this.refreshMainJumpImg(mainJumpItem, restart);
						}))

					}))
				}))

			}))
		}))
	}

	static openJumpListUI(param = null) {
		if (JumpManager.checkShow() && KariqiShareManager.checkIsKariquChannel()) {
			if (!GameSwitch.checkOnOff(GameSwitch.SWITCH_KARIQU_DISABLE_JUMP_LIST)) {
				WindowManager.OpenUI("JumpListUI", param);
				return;
			}
		}
		if (param) {
			param.callback && param.callback.call(param.thisObj);
		}
	}

	//封装创建一个JumpItem aniStyle 0表示不动 1表示随机原地晃动 并随机换图标 needRedPoint根据渠道，指色是显示new 或热门 梦佳是红点 指色多一点是否显示文字底  isShowBg图片是否有背景，bgextraWidth额外框
	static createJumpItem(itemData, itemWidth, itemHeight, extraData, needRedPoint = null, aniStyle: number = 0, isShowName = true, txtSize = 15, txtcolor = "#ffffff", isShowLableBg = false, signWidth = 0, signHeight = 0, isShowBg = false, bgextraWidth = 0, txtOffestY = 0) {
		var redWidth = 20;
		var redOffset = 3;
		var startY = 7;
		var itemBox: Laya.Image = new Laya.Image();
		itemBox.width = itemWidth + bgextraWidth * 2;
		itemBox.height = itemHeight + bgextraWidth * 2;
		//icon背景
		if (isShowBg) {
			var itemBg: Laya.Image = new Laya.Image(ResourceConst.JUMP_ITEMBG);
			itemBg.sizeGrid = "7,7,7,7";
			itemBg.width = itemWidth + bgextraWidth * 2;
			itemBg.height = itemHeight + bgextraWidth * 2;
			itemBox.addChild(itemBg)
			// itemBg.x = -4;
			// itemBg.y = -4;
		}
		var imgItem: Laya.Image = new Laya.Image(itemData.Icon);
		imgItem.width = itemWidth;
		imgItem.height = itemHeight;
		itemBox.addChild(imgItem);
		imgItem.name = "imageIcon";
		imgItem.x = bgextraWidth;
		imgItem.y = bgextraWidth;
		if (needRedPoint) {
			if (this.jumpChannel == JumpConst.JUMP_CHANNEL_ZHISE || KariqiShareManager.checkIsKariquChannel()) {
				var sign: Laya.Image = new Laya.Image(needRedPoint);
				itemBox.addChild(sign);
				sign.width = signWidth;
				sign.height = signHeight;
				sign.x = itemWidth + bgextraWidth * 2 - signWidth;
				sign.y = 0;
			} else if (this.jumpChannel == JumpConst.JUMP_CHANNEL_MENGJIA || this.jumpChannel == JumpConst.JUMP_CHANNEL_FANTASY) {
				var redImg: Laya.Image = new Laya.Image(ResourceConst.COMMON_REDPOINT);
				itemBox.addChild(redImg);
				redImg.width = redImg.height = redWidth;
				redImg.x = itemWidth + bgextraWidth * 2 - redWidth + redOffset;
				redImg.y = startY - redOffset;
			}
		}
		//显示文字背景
		if (isShowLableBg) {
			if (this.jumpChannel == JumpConst.JUMP_CHANNEL_ZHISE) {
				var labelBg: Laya.Image = new Laya.Image(this.getZhiseLabelBg());
				itemBox.addChild(labelBg);
				labelBg.width = itemWidth + bgextraWidth * 2;
				labelBg.height = (itemWidth + bgextraWidth * 2) / 3.7;
				labelBg.x = 0;
				labelBg.y = itemBox.height;
			} else if (this.jumpChannel == JumpConst.JUMP_CHANNEL_KARIQU) {
				var labelBg: Laya.Image = new Laya.Image(this.getZhiseLabelBg(3));
				itemBox.addChild(labelBg);
				labelBg.width = itemWidth + bgextraWidth * 2;
				labelBg.height = (itemWidth + bgextraWidth * 2) / 3.7;
				labelBg.x = 0;
				labelBg.y = itemBox.height + txtOffestY;
			}
		}
		if (isShowName) {
			var nameTxt: Laya.Label = new Laya.Label(itemData.GameName);
			nameTxt.fontSize = txtSize;
			nameTxt.font = "Microsoft YaHei";
			itemBox.addChild(nameTxt);

			if (labelBg) {
				// 如果有背景，就按背景居中
				nameTxt.y = labelBg.y;
				nameTxt.x = 0;
				nameTxt.height = labelBg.height;
				nameTxt.width = labelBg.width;
				nameTxt.valign = "middle";
			} else {
				// 如果没有背景固定格式
				nameTxt.y = itemBox.height + 10 + txtOffestY;
				nameTxt.x = 3;
				nameTxt.height = 30;
				nameTxt.width = itemWidth + bgextraWidth * 2;
			}

			nameTxt.align = "center";
			nameTxt.name = "imageTxt";
			nameTxt.color = txtcolor;
			nameTxt.overflow = "hidden";
		}

		var sendData = {
			jumpData: itemData,
			extraData: extraData
		}
		var btnUtil = new ButtonUtils(imgItem, this.onClickJumpItem, this, null, null, sendData);
		// 防误触
		btnUtil.setUnEnableTime(1000);
		return itemBox;
	}

	//创建一个随机的跳转item
	/**
	 * @fromWhere 来自哪里 统计用,参考 JumpConst.
	 * needRedPoint 是否显示小红点
	 * aniStyle: 默认为0 表示不晃动
	 */
	static createOneRandomJumpItem(itemWidth, itemHeight, extraData, needRedPoint, aniStyle = 0) {
		var leftIndexArr = []
		for (var i = 0; i < this.data.length; i++) {
			leftIndexArr.push(i);
		}
		var jumpData = this.getRandomJump(leftIndexArr);
		if (!jumpData) {
			return null
		}
		return this.createJumpItem(jumpData, itemWidth, itemHeight, extraData, needRedPoint, aniStyle);
	}

	/**
	 * 随机创建多个不相同的Item，数量不够不补齐
	 */
	static createManyRandomJumpItem(count, itemWidth, itemHeight, extraData, needRedPoint, aniStyle = 0) {
		var itemArray = [];
		if (!this.data) {
			return itemArray;
		}
		var leftIndexArr = []
		for (var i = 0; i < this.data.length; i++) {
			leftIndexArr.push(i);
		}
		var jumpData;
		for (var j = 1; j <= count; j++) {
			jumpData = this.getRandomJump(leftIndexArr);
			if (jumpData) {
				itemArray.push(this.createJumpItem(jumpData, itemWidth, itemHeight, extraData, needRedPoint, aniStyle))
			}
		}
		return itemArray;
	}

	//销毁一个跳转的item
	static destoreJumpItem(itemBox: Laya.Image) {
		// 从parent移除
		if (itemBox.parent) itemBox.parent.removeChild(itemBox);
		// 销毁按钮
		var imageIcon: any = itemBox.getChildByName("imageIcon");
		if (imageIcon.__lastButtonUtils) {
			imageIcon.__lastButtonUtils.destoryButtonUtil();
			delete imageIcon.__lastButtonUtils
		}
		// 停止动画 不需要手动调用。itemBox 注册了移除舞台的事件会停止动画
		// JumpManager.stopMainJumpTween(itemBox);
		// 从实例中删除
		for (var i = 0; i < this.mainJumpItems.length; i++) {
			if (itemBox == this.mainJumpItems[i]) {
				this.mainJumpItems[i] = null;
			}
		}
	}

	//创建热门item
	static createHotJumpItem(itemData, itemWidth, itemHeight, extraData, playNums: number = 1, aniStyle: number = 0) {
		var itemBox = this.createJumpItem(itemData, itemWidth, itemHeight, extraData, true, aniStyle);
		return itemBox
	}


	//点击互推icon
	static onClickJumpItem(data) {
		LogsManager.echo("jumpData----------", data)
		var jumpData = data.jumpData;
		data.appId = jumpData.GameAppId
		data.path = jumpData.PromoteLink
		UserInfo.platform.jumpToMiniProgram(data);
		if (KariqiShareManager.checkIsKariquChannel()) {
			for (var i = 0; i < this.mainJumpItems.length; i++) {
				// if (jumpData == this.mainJumpItems[i]["__jumpData"]) {
				JumpManager.stopMainJumpTween(this.mainJumpItems[i]);
				this.refreshMainJumpImg(this.mainJumpItems[i])
				// }
			}
		}
	}


	/**获取指色文本背景色 */
	static getZhiseLabelBg(index = null) {
		if (!index) {
			index = GameUtils.getRandomInt(1, 9);
		}
		return "uisource/jump/jump/" + index + ".png"
	}

	/**获取两个随机的标index */
	static getTwoRandom(min, max, data) {
		if (data.length == 2) return;
		var item = GameUtils.getRandomInt(min, max);
		if (data.indexOf(item) == -1) {
			data.push(item);
		}
		this.getTwoRandom(min, max, data);
	}

	/**
	 * 随机获取插屏互推
	 * */
	static getRandomInterJumpByPosition(defaultPos, minPos, maxPos) {
		if (!JumpManager.interData) {
			return;
		}
		if (!this.currentInterPos) {
			this.currentInterPos = minPos;
		} else {
			this.currentInterPos += 1
		}
		var randData, defaultData;
		for (var i = 0; i < JumpManager.interData.length; i++) {
			if (JumpManager.interData[i].Position == this.currentInterPos) {
				randData = JumpManager.interData[i];
				break;
			}
			if (JumpManager.interData[i].Position == defaultPos) {
				defaultData = JumpManager.interData[i];
			}
		}
		if (!randData) {
			this.currentInterPos = minPos;
			return defaultData;
		} else {
			return randData;
		}
	}

	/**
	 *  打开插屏互推界面
	 */
	static showInterJump() {
		LogsManager.echo("ycn show inter jump:", this.interData);
		if (this.interData.length > 0) {
			var interJumpArgv = GlobalParamsFunc.instance.getDataArray("advertJumpChance")[0].split(',');
			var jumpData = JumpManager.getRandomInterJumpByPosition(21, 21, 25);
			LogsManager.echo("ycn interJumpRandResult:", jumpData);
			if ((this.interJumpNum == -1 || this.interJumpNum >= interJumpArgv[0]) && jumpData) {

				WindowManager.OpenUI(WindowCommonCfgs.INTERJUMPVIEW, jumpData)
				this.interJumpNum = 0;
			}
			this.interJumpNum += 1;
		}
	}


	/**发送卡日曲互推icon点击成功后请求 */
	static sendKariquJumpClickData(data) {
		//Openid		String	是		玩家游戏Openid
		// Channel		String	是		玩家渠道来源（没有则传””）
		// Appid		String    	是   		游戏Appid
		// Type			int     	 是		游戏内跳转位
		// TargetAppid	String	 是		点击跳转的游戏Appid
		// Path			String	 是		跳转路径Path
		var url = GameConsts.JUMP_KARIQU_SAVEJUMP_URL;
		var params = {
			Openid: UserInfo.channelUserId,
			Channel: KariqiShareManager.getChannelValue(),
			Appid: GameConsts.GAME_APPID,
			Type: Number(data.MutualType),
			TargetAppid: data.GameAppId,
			Path: data.PromoteLink
		}
		HttpMessage.instance.sendOtherHttpRequest(url, params, this.onSendClickSuccess, this, "post")
	}

	static onSendClickSuccess(data) {
		if (data) {
			LogsManager.echo("zm.上报点击成功");
		}

		var url = GameConsts['JUMP_KARIQU_CONFIRM_URL'];
		var params = {
			userId: KariqiShareManager.kariqiUserId,
			appid: GameConsts.GAME_APPID,
		}
		HttpMessage.instance.sendOtherHttpRequest(url, params, () => {
			if (data) {
				LogsManager.echo("hlx.卡日曲导出确认成功", data);
			}
		}, this, "post")
	}

	/**卡日曲黑名单  返回true说明在黑名单*/
	static checkIsKariquBlack() {
		if (this.kariquJumpResult != null) return this.kariquJumpResult;
		if (!KariqiShareManager.checkIsKariquChannel()) {
			this.kariquJumpResult = false;
			return this.kariquJumpResult;
		}
		var curChannel = KariqiShareManager.getChannelValue();
		if (!curChannel) {
			this.kariquJumpResult = false;
			LogsManager.echo("zm.noCurChannel--------------------", curChannel, this.kariquJumpResult)
			return this.kariquJumpResult;
		}
		if (KariqiShareManager.kariquConfigValue && KariqiShareManager.kariquConfigValue.indexOf(curChannel) != -1) {
			this.kariquJumpResult = true;
		} else {
			this.kariquJumpResult = false;
		}
		LogsManager.echo("zm.kariquBlack--------------------", curChannel, this.kariquJumpResult)
		return this.kariquJumpResult;
	}


	/**
	 * 移除已跳转过的appid
	 * @param appid
	 */
	static removeJumpedApp(appid) {
		//如果是卡日曲渠道 不需要移除已经跳转过的app
		if (KariqiShareManager.checkIsShowTopJump()) {
			return
		}
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_REMOVE_JUMPED_APP)) {
			for (var i = this.data.length - 1; i > -1; i--) {
				if (this.data[i].GameAppId == appid) {
					// 注意需要删除curGroup
					TableUtils.removeValue(this.curGroup, this.data[i].GameIndex)
					this.data.splice(i, 1);
				}
			}
			for (var i = this.interData.length - 1; i > -1; i--) {
				if (this.interData[i].GameAppId == appid) {
					this.interData.splice(i, 1);
				}
			}
			var jumpedAppList = JumpCommonModel.instance.getJumpedList();

			jumpedAppList[appid.replace(/\./g, "_")] = appid;
			var expireTime: number = Number(new Date(new Date().setHours(0, 0, 0, 0))) / 1000 + 86400;
			var updateData = {
				"jumpCommon": {
					jumpedList: {
						expireTime: expireTime,
						appList: jumpedAppList,
					}
				}
			};

			Client.instance.doDummyServerBack(null, updateData, null);
			SingleCommonServer.startSaveClientData();
			Message.instance.send("FRESH_JUMP_LIST");
		}
	}

	/**
	 * 根据所在场景打开全屏互推
	 * @param id
	 */
	static openJumpListViewById(id) {
		if (!BaseFunc.globalCfgsHasLoad) {
			return false;
		}
		if (!this.checkShow()) return;
		if (!this.data || this.data.length == 0) return;
		if (FullJumpFunc.instance.canShowFUllJump(id)) {
			WindowManager.OpenUI("JumpListUI");
		}
	}
}
/**
 2.6 跳转其他小程序(小游戏)事件（显示弹框）
 跳转其他小程序 显示跳转提示弹框的时候调用 wx.mtShowJumpMiniProgramEvent('参数') 参数 Json格式对象
 （需要指出目标小程序的 appid，参数名为 toapp） wx.mtShowJumpMiniProgramEvent({ toapp: '123456', //目标小程序的 appid
position_id:'',//icon获取的path参数中截取mt_position_id的值
link_id:'',//icon获取的path参数中截取mt_link_id的值 });
 2.7 跳转其他小程序(小游戏)事件（确认跳转）
 跳转其他小程序 点击确认的时候调用 wx.mtJumpMiniProgramEvent('参数') 参数 可以不填 或者 Json格式对象
 （为对象时需要指出目标小程序的 appid，参数名为 toapp）
 wx.mtJumpMiniProgramEvent({ toapp: '123456', //目标小程序的 appid
position_id:'',//icon获取的path参数中截取mt_position_id的值
link_id:'',//icon获取的path参数中截取mt_link_id的值 });
 2.8 抽屉展开事件
 点击展开抽屉的时候调用（或者积分墙或者互推墙） wx.mtDrawerSpreadEvent('参数') 参数 可以不填 或者
 Json格式对象（为对象时需要指出抽屉中所有小程序的 appid，参数名为 appids）
 // 点击抽屉，将其中的小程序 icon 显示出来时调用 wx.mtDrawerSpreadEvent({
    appids: [ 'wx123456', 'wx654321', 'wx089757' ]
});
 */

/**
 *
 接口返回的小游戏数据格式
 GameAppId: "wx9ed733fd2eeabc72"
 GameName: "街头乱斗"
 Icon: "https://sdk-weixin-smallgames.oss-cn-hangzhou.aliyuncs.com/1563189280983155-144.png"
 JumpType: 1
 MutualType: "1"
 Position: 1
 PromoteLink: "?ald_media_id=16302&ald_link_key=dd5b64cdc12db34e&ald_position_id=0"
 QRCode: ""
 Remark: ""
 */

/**
 接口调用请求说明
 1.https请求方式: GET
 2.https://api.mokagm.com/outer/sdk/data/mutual-pos
 参数	默认值
 apiKey	61b59ba885d90188169f17dbacd29d74 (固定为该值)
 timestamp	"" (该值为每次请求时实时获取的Unix时间戳)
 apiSecret	0ceaf4f01e84e726c6603b9f9575a7d5 (固定为该值)
 appKey	由梦嘉工作人员提供  3a905fbeda5806119d5334013f807cf6

 参数	是否必填	参数说明
 apisign 	Y 	接口授权签名，唯一，生成方式：将apiKey、timestamp、apiSecret按顺序进行字符串拼接后使用md5加密 32位,例如:apiSecret=123,apisign = MD5(apiKey+timestamp+apiSecret)=MD5(1234561555411740123)=d607d5bfd5a0b071be67d1f0062579aa
 apikey 	Y 	接口授权apiKey，唯一，由接口方分配 (同时分配用于生成签名的apiSecret)
 timestamp 	Y	当前时间戳
 appkey 	Y	对接sdk统计平台时由梦嘉工作人员提供的appkey，于打点上报时获取，唯一
 */
