import BaseModel from "./BaseModel";
import Message from "../../../framework/common/Message";
import UserInfo from "../../../framework/common/UserInfo";
import Client from "../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import CacheManager from "../../../framework/manager/CacheManager";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import GameMainEvent from "../event/GameMainEvent";
import UserGlobalModel from "../../../framework/model/UserGlobalModel";
import SceneReference from "../../../framework/consts/SceneReference";
import WhiteListFunc from "../../../framework/func/WhiteListFunc";

export default class UserModel extends BaseModel {
	private static _instance: UserModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new UserModel()
		}
		return this._instance;
	}
	incomeCoin = {};

	//获取用户的rid
	getUserRid() {
		if (!this._data) {
			return "nologin"
		}
		return this._data.uid;
	}

	getRidMark() {
		return this._data.ridMark || 123456;
	}

	initData(d: any) {
		super.initData(d);
		UserInfo.platform.initChannelUserId(this.getUserRid())
		this.setGuideCache();
		SingleCommonServer.initData();
	}

	updateData(d: any) {

		super.updateData(d);
		//根据需要发送事件通知ui刷新
		/**刷新主界面钱 */
		if (d.coin || d.coin == 0 || d.giftGold || d.giftGold == 0 || d.gold || d.gold == 0) {
			Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY);
		}

		this.setGuideCache();
	}


	deleteData(d: any) {
		super.deleteData(d);
		//根据需要发送事件通知ui刷新
	}

	//获取名字
	getUserName() {
		// console.log("my name is. :", this._data.maxScore);
		return this._data.name;
	}


	/**获取真正的头像str */
	getUserHead() {
		return this._data.userInfo.headImage;
	}
	/**临时处理后续删除 */
	setNameAndImg(userInfo: any) {
		if (userInfo["name"]) {
			this._data.name = userInfo["name"];
		}
		if (userInfo["avatarUrl"]) {
			this._data.userInfo.headImage = userInfo["avatarUrl"];
		}
	}


	//获取用户的金币数
	getCoin() {
		return Math.floor(Number(this._data.coin)) || 0;
	}

	//获取用户的显示金币数
	getDisplayCoin() {
		var totalIncomeCoin = 0;
		for (var index in this.incomeCoin) {
			totalIncomeCoin += this.incomeCoin[index];
		}
		return Math.floor(this.getCoin() + totalIncomeCoin);
	}

	//获取用户逻辑金币数
	getLogicCoin() {
		var coinNum = 0;
		return Math.floor(this.getCoin() + coinNum);
	}

	//获取用户逻辑金币数
	getCoinWithIncomeById(id) {
		var coinNum = 0;
		return Math.floor(this.getCoin() + coinNum);
	}

	//获取用户的钻石数
	getGold() {
		return (Number(this._data.gold) || 0) + (Number(this._data.giftGold) || 0); //
	}
	getGiftGold() {
		return Number(this._data.giftGold) || 0;
	}

	/**钻石，返回剩余值[giftGold,chargeGold] */
	costGold(num: number) {
		var giftGold = this._data.giftGold || 0;
		var chargeGold = this._data.gold || 0;
		if (giftGold + chargeGold < num) {
			return;
		}
		giftGold -= num;
		if (giftGold < 0) {
			chargeGold += giftGold;
			giftGold = 0;
		}
		return [giftGold, chargeGold];
	}

	//获取用户的等级
	getLevel() {
		return this.getMaxLevel();//TODO
		// if (this._data.level) {
		// 	var curlevel = this._data.level <= 30 ? this._data.level : 30;
		// 	return curlevel;
		// }
		// return 1;
	}

	//获取合成单位的最高等级
	getMaxLevel() {
		if (this._data.userExt && this._data.userExt.goodsMaxLevel) {
			// return (this._data.userExt.goodsMaxLevel;
			return Number(this._data.userExt.goodsMaxLevel);
		}
		return 1;
	}

	//获取最高关卡等级
	getMaxBattleLevel() {
		if (this._data.userExt && this._data.userExt.maxStage) {
			return this._data.userExt.maxStage;
		}
		return 0;
		// if (this._data.battleLevel) {
		// 	var battleLevel = this._data.battleLevel;
		// 	var maxLevel = 1;
		// 	for (var index in battleLevel) {
		// 		if (Number(index) > maxLevel) {
		// 			maxLevel = Number(index);
		// 		}
		// 	}
		// 	maxLevel++;
		// 	var curlevel = maxLevel <= 30 ? maxLevel : 30;
		// 	return curlevel;
		// }
		// return 1;
	}


	getstageRank(stageId) {
		if (this._data.userExt && this._data.userExt.stageRank && this._data.userExt.stageRank[stageId]) {
			return this._data.userExt.stageRank[stageId]
		}
		return 0;
		// if (this._data.battleLevel) {
		// 	var battleLevel = this._data.battleLevel;
		// 	var maxLevel = 1;
		// 	for (var index in battleLevel) {
		// 		if (Number(index) > maxLevel) {
		// 			maxLevel = Number(index);
		// 		}
		// 	}
		// 	maxLevel++;
		// 	var curlevel = maxLevel <= 30 ? maxLevel : 30;
		// 	return curlevel;
		// }
		// return 1;
	}

	getRoleBuyInfo(id, type) {
		if (this._data.market) {
			var info = this._data.market[id];
			if (info && info[type + "PurchaseTime"]) {
				return info[type + "PurchaseTime"];
			}
		}
		return 0;
	}

	//获取当前车
	getRole() {
		if (this._data.userExt && this._data.userExt.equipedGoods) {
			return this._data.userExt.equipedGoods;
		}
		return "1";
	}

	//获取关卡情况
	getBattleLevelById(id) {
		if (this._data.battleLevel && this._data.battleLevel[id]) {
			return this._data.battleLevel[id];
		}
		return {};
	}

	getGoodsAccumuStartTime() {
		if (this._data.userExt && this._data.userExt.goodsAccumuStartTime) {
			return this._data.userExt.goodsAccumuStartTime;
		}
		return 0;
	}

	//获取用户的经验
	getExp() {
		return this._data.exp || 0;
	}

	//获取用户的体力
	getSp() {
		var humanLevel = UserModel.instance.getLevel() || 1;
		// var maxPower = GameData.getExpNeed(humanLevel).power;
		var maxPower = 10;
		var sp = this._data.userExt.sp;
		if (sp > maxPower)
			return sp;
		else {
			var time = (this._data.userExt.upSpTime || 0) + GlobalParamsFunc.instance.getGlobalCfgDatas("SpRestoreTime").num;
			var curT = Client.instance.serverTime;
			time = time - curT;
			while (time < 0) {
				time += GlobalParamsFunc.instance.getGlobalCfgDatas("SpRestoreTime").num;
				sp++;
			}
			if (sp > maxPower)
				return maxPower;
			else
				return sp;
		}
	}

	//判断是否为老用户
	checkIsOld() {
		return (this._data && this._data.userExt && this._data.userExt.isNew) || 0;//isNew认为是老玩家
	}

	//获取用户的新手引导标志
	getMainGuide() {
		//暂时关闭引导 返回一个很大的数
		// return 999999;
		return (this._data && this._data.userExt && this._data.userExt.newGuide && Number(this._data.userExt.newGuide)) || 0;
	}

	//获取用户打点类型（新用户/老用户）
	checkIsNew() {
		return (this._data && this._data.userExt && this._data.userExt.newGuide) || 0;
	}

	//获取用户的邮件列表
	getMails() {
		return this._data.mails;
	}

	//获取间接引导
	getSubGuide() {
		return this._data.guide || {};
	}


	/*
	获取体力更新的剩余时间
	*/
	getUpSpTime() {
		var time = (this._data.userExt.upSpTime || 0) + GlobalParamsFunc.instance.getGlobalCfgDatas("SpRestoreTime").num;
		var curT = Client.instance.serverTime;
		time = time - curT;
		while (time < 0)
			time += GlobalParamsFunc.instance.getGlobalCfgDatas("SpRestoreTime").num;
		return time;
	}


	/**获取授权状态 */
	get isAuthorized(): any {
		return this._data.isAuthorized;
	}


	private refuseAuth: string = "refuseWxAuth";
	/**记录是否已经拒绝授权 */
	setRefuseAuth() {
		CacheManager.instance.setLocalCache(this.refuseAuth, true);
	}

	/**
	 * 获取是否已经拒绝过授权
	 * true为已经拒绝过
	 */
	getRefuseAuth() {
		var authSta = CacheManager.instance.getLocalCache(this.refuseAuth);
		return authSta != "0";
	}

	/**根据用户数据记载是否已经授权 */
	setGuideCache() {
	}

	getUserExt() {
		return this._data.userExt;
	}

	getIsNewAccount() {
		return this._data.isNewAccount
	}

	getSimulateLand() {
		var simulateUnlock = GlobalParamsFunc.instance.getGlobalCfgDatas("runSiteUnlock").arr;
		var num = 0;
		for (var index in simulateUnlock) {
			if (Number(UserModel.instance.getLevel()) >= Number(simulateUnlock[index])) {
				num++;
			}
		}
		return num;
	}

	getIncomeTime() {
		return this._data && this._data.userExt && this._data.userExt.upCoinTime || 0;
	}
	/**
	 * 根据id在裂变顺序表中取操作类型
	 */
	getShareTvOrder(id) {
		return this._data.leadShare && this._data.leadShare[id] || 0;
	}

	login() {
		// 判断是否跨天
		if (this.checkIsNewDay()) {
			// 次日首次登陆，分享计数增加
			var signAddShareNum = GlobalParamsFunc.instance.getDataNum("shareDayNmb");
			UserGlobalModel.instance.setShareNum(signAddShareNum);
		}

		var upData = {
			"userExt":{
				loginTime: Date.parse((new Date()).toString())
			}
		};
		// 如果没有设置过黑名单，并且
		if(!this._data.sceneBlack && !SceneReference.checkWhiteSceneId(GlobalData.currentSceneId, WhiteListFunc.TYPE_LOGIN))
		{
			upData["sceneBlack"] = 1;
		}
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		SingleCommonServer.startSaveClientData();
	}
	getLogoutTime() {
		return this._data.userExt.logoutTime;
	}
	private checkIsNewDay() {
		if (!this._data.userExt.loginTime) {
			// 小红点
			// this._data.userExt.everydayInvite = 0;
			// this._data.userExt.everydayLotto = 0;
			return true;
		}
		var now_time = Date.parse((new Date()).toString());
		var newDayTime = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime()+4*60*60*1000)).toString());
		if (now_time > newDayTime && this._data.userExt.loginTime < newDayTime) {
			// this._data.userExt.everydayInvite = 0;
			// this._data.userExt.everydayLotto = 0;
			return true;
		}
		return false;
	}
	/** 返回banner序列 */
	getBannerOrder() {
		return this._data.leadBanner || 0;
	}
	isSceneBlack()
	{
		return this._data.sceneBlack ? this._data.sceneBlack : 0;
	}
}
