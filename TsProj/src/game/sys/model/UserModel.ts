import BaseModel from "./BaseModel";
import Message from "../../../framework/common/Message";
import UserInfo from "../../../framework/common/UserInfo";
import Client from "../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import GameTools from "../../../utils/GameTools";
import CacheManager from "../../../framework/manager/CacheManager";
import StorageCode from "../consts/StorageCode";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import GameMainEvent from "../event/GameMainEvent";
import GlobalData from "../../../framework/utils/GlobalData";
import RolesFunc from "../func/RolesFunc";
import UserGlobalModel from "../../../framework/model/UserGlobalModel";
import BigNumUtils from "../../../framework/utils/BigNumUtils";

import LevelFunc from "../func/LevelFunc";
import SceneReference from "../../../framework/consts/SceneReference";
import WhiteListFunc from "../../../framework/func/WhiteListFunc";
import UserEvent from "../event/UserEvent";
import FogEvent from "../event/FogEvent";
import UserExtModel from "./UserExtModel";

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
		var coinFlag = false;
		if (d.coin) {
			if (BigNumUtils.compare(d.coin, UserModel.instance.getLogicCoin())) {
				var oldNum = UserModel.instance.getLogicCoin();
				coinFlag = true;
			}
		}
		super.updateData(d);
		//根据需要发送事件通知ui刷新
		/**刷新主界面钱 */
		if (d.coin || d.coin == 0 || d.giftGold || d.giftGold == 0 || d.gold || d.gold == 0) {
			Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY);
			if (coinFlag) {
				Message.instance.send(UserEvent.USER_EVET_COIN_CHANGE_TWEEN, {oldNum: oldNum})
			}
		}
		if (d.fogCoin || d.fogCoin == 0) {
			Message.instance.send(FogEvent.FOGEVENT_REFRESH_FOGCOIN);
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

	getHeadImage() {
		// console.log("my headImg is :", this._data.headImage);
		var newPath = GameTools.getHeadImg(this._data.userInfo.headImage);
		if (newPath) {
			return newPath;
		} else {
			return this._data.userInfo.headImage;
		}
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
		return this._data.coin || "0";
	}


	//获取用户逻辑金币数
	getLogicCoin() {
		return "1"
	}

	//获取用户的钻石数
	getGold() {
		return BigNumUtils.sum((this._data.gold || "0"), (this._data.giftGold || "0"));
	}

	getGiftGold() {
		return this._data.giftGold || "0";
	}

	/**钻石，返回剩余值[giftGold,chargeGold] */
	costGold(num) {
		var giftGold = this._data.giftGold || "0";
		var chargeGold = this._data.gold || "0";
		if (!BigNumUtils.compare(BigNumUtils.sum(giftGold, chargeGold), String(num), true)) {
			return ["0", "0"];
		}
		giftGold = BigNumUtils.substract(giftGold, num);
		if (!BigNumUtils.compare(giftGold, 0)) {
			chargeGold = BigNumUtils.sum(chargeGold, giftGold)
			giftGold = "0";
		}
		return [giftGold, chargeGold];
	}

	getVideo() {
		if (this._data.userExt && this._data.userExt.video) {
			return this._data.userExt.video;
		}
		return 0;
	}

	getShopVideo(id) {
		if (this._data.userExt && this._data.userExt.shopVideo && this._data.userExt.shopVideo[id]) {
			return this._data.userExt.shopVideo[id];
		}
		return 0;
	}

	//获取用户的等级
	getLevel() {
		return this.getMaxBattleLevel();//TODO
		// if (this._data.level) {
		// 	var curlevel = this._data.level <= 30 ? this._data.level : 30;
		// 	return curlevel;
		// }
		// return 1;
	}

	//获取合成单位的最高等级
	getMaxLevel(id) {
		if (this._data.userExt && this._data.userExt.goodsMaxLevel && this._data.userExt.goodsMaxLevel[id]) {
			// return (this._data.userExt.goodsMaxLevel;
			return Number(this._data.userExt.goodsMaxLevel[id]);
		}
		return 0;
	}

	//获取最高关卡等级
	getMaxBattleLevel() {
		if (this._data.userExt && this._data.userExt.maxStage) {
			return this._data.userExt.maxStage;
		}
		return 0;
	}

	/**获取迷雾最大层数 */
	getMaxFogLayer() {
		if (this._data.userExt && this._data.userExt.maxFogLayer) {
			return this._data.userExt.maxFogLayer;
		}
		return 0;
	}

	getRoleBuyInfo(type, roleId = null) {
		var time = 0;
		if (this._data.market) {
			if (roleId) {
				var info = this._data.market[roleId];
				if (info && info[type + "PurchaseTime"]) {
					time += Number(info[type + "PurchaseTime"]);
				}
			} else {
				for (var id in this._data.market) {
					var info = this._data.market[id];
					if (info && info[type + "PurchaseTime"]) {
						time += Number(info[type + "PurchaseTime"]);
					}
				}
			}
		}
		return time;
	}

	getRoleBuyTimes() {
		if (this._data.userExt && this._data.userExt.buyTimes) {
			return this._data.userExt.buyTimes;
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

	//判断当前关卡是否已经能复活过
	isLandDeathRevive(levelId): boolean {
		if (this._data && this._data.levels && this._data.levels[levelId] && this._data.levels[levelId].deathRevive && this._data.levels[levelId].expireTime > Client.instance.serverTime) {
			return true;
		}
		return false;
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

	getSpeedUpTime() {
		return (this._data && this._data.userExt && this._data.userExt.speedUpTime) || 0;
	}

	getSupplyBoxId() {
		return (this._data && this._data.userExt && this._data.userExt.supplyBoxId) || 0;
	}

	getSupplyBoxTime() {
		return (this._data && this._data.userExt && this._data.userExt.supplyBoxTime) || 0;
	}

	getTurnable() {
		return (this._data && this._data.userExt && this._data.userExt.turnable) || 0;
	}

	//判断是否为老用户
	checkIsOld() {
		return (this._data && this._data.userExt && this._data.userExt.isNew) || 0;//isNew认为是老玩家
	}

	//获取用户的新手引导标志
	getMainGuide() {
		var guide = Number((this._data && this._data.userExt && this._data.userExt.newGuide && Number(this._data.userExt.newGuide))) || 0;
		//兼容线上已经进入过迷雾街区并且存储的引导id小于9 默认引导结束
		if (UserExtModel.instance.getEnterFogFlag() && guide < 9) return 17;
		var level = this.getMaxBattleLevel();
		//兼容线上已经错过首个碎片引导的玩家 默认已经完成所有引导
		if (level >= GlobalParamsFunc.instance.getDataNum("equipUnlock") && guide < 6) return 8;
		if (guide == 0) {
			//兼容老用户
			if (level >= 1) {
				return 2;
			}
		}
		return guide;
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

	getSubGuideById(id) {
		var guide = this.getSubGuide();
		return guide[id] || 0;
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
		// var guideNum = Number(this.getGuide());
		// if (guideNum >= 1) {

		// }
		//因为没有引导 所以登入后就判定为老用户
		// CacheManager.instance.setFileStorageCache(StorageCode.storage_wxGuide, true);
		if (GlobalData.isNew()) {
			CacheManager.instance.setFileStorageCache(StorageCode.storage_isOldPlayer, true);
		}

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
		var upData = {};
		var upUserExtData = {};
		upUserExtData["loginTime"] = Date.parse((new Date()).toString());

		//登陆修改下宝箱累计时间
		if (this.getGoodsAccumuStartTime()) {
			if (this._data && this._data.sendTime && (Number(this._data.sendTime) * 1000 > this.getGoodsAccumuStartTime())) {
				LogsManager.echo("登陆修改宝箱累计时间，原累计时间：" + this.getGoodsAccumuStartTime());
				LogsManager.echo("最后一次同步数据时间：" + this._data.sendTime);
				var newGoodsAccumuStartTime = Client.instance.serverTimeMicro - (Number(this._data.sendTime) * 1000 - this.getGoodsAccumuStartTime());
				LogsManager.echo("新宝箱累计时间：" + newGoodsAccumuStartTime);
				upUserExtData["goodsAccumuStartTime"] = newGoodsAccumuStartTime;
			}
		}
		// 如果没有设置过黑名单，并且
		if (!this._data.sceneBlack && !SceneReference.checkWhiteSceneId(GlobalData.currentSceneId, WhiteListFunc.TYPE_LOGIN)) {
			upData["sceneBlack"] = 1;
		}
		upData["userExt"] = upUserExtData;
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
		var newDayTime = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 4 * 60 * 60 * 1000)).toString());
		if (now_time > newDayTime && this._data.userExt.loginTime < newDayTime) {
			// this._data.userExt.everydayInvite = 0;
			// this._data.userExt.everydayLotto = 0;
			return true;
		}
		return false;
	}

	//获取关卡要求的最低车等级
	getLevelMinRoleLevel(levelId) {
		var levelInfo = LevelFunc.instance.getCfgDatas("Level", levelId);
		return levelInfo.minCar || 1;

	}

	/** 返回banner序列 */
	getBannerOrder() {
		return this._data.leadBanner || 0;
	}

	isSceneBlack() {
		return this._data.sceneBlack ? this._data.sceneBlack : 0;
	}

	getRecycleTime() {
		return this._data.getRecycleTime ? Number(this._data.getRecycleTime) : 0;
	}

	getLand() {
		var roleInfo = RolesFunc.instance.getAllRole();
		var landNum = 0;
		for (var id in roleInfo) {
			var maxLevel = UserModel.instance.getMaxLevel(id);
			for (var level in roleInfo[id]) {
				if (Number(level) <= Number(maxLevel)) {
					if (roleInfo[id][level].land) {
						landNum++;
					}
				}
			}
		}
		return landNum;
	}

	getLastSendTime() {
		return this._data.lastSendTime * 1000;
	}

	//获取邀请奖励领取状态
	getInviteRewardStatus(id) {
		if (!this._data.inviteReward || !this._data.inviteReward[id]) {
			return false;
		}
		return this._data.inviteReward[id];
	}


	//获取局外商店列表
	getFogShopGoodsList() {
		var goodLsit = [];
		var data = this.getData();
		if (!data || !data.fogOuterShop || !Object.keys(data.fogOuterShop.goods).length) {
			return goodLsit;
		}

		//判断是否过期
		var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameTools.getNextRefreshTByTime(4);
		if (expireTime < Client.instance.serverTime) {
			return goodLsit;
		}

		var goods = data.fogOuterShop.goods;
		for (var i = 0; i < Object.keys(goods).length; i++) {
			goodLsit.push(goods[i + 1].id);
		}
		return goodLsit;
	}

	//获取局外商店的过期时间
	getFogShopExpireTime() {
		var data = this.getData();
		if (!data || !data.fogOuterShop || !Object.keys(data.fogOuterShop.goods).length) {
			return GameTools.getNextRefreshTByTime(4);
		}

		var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameTools.getNextRefreshTByTime(4);
		return expireTime;
	}

	//获取迷雾商店种商品得状态
	getFogShopStatus(index) {
		var data = this.getData();
		if (!data || !data.fogOuterShop || !data.fogOuterShop.goods || !data.fogOuterShop.goods[index] || !data.fogOuterShop.goods[index].status) {
			return 0;
		}

		var expireTime = data.fogOuterShop.expireTime ? data.fogOuterShop.expireTime : GameTools.getNextRefreshTByTime(4);
		if (expireTime < Client.instance.serverTime) {
			LogsManager.echo("whn outshop 已经过期");
			return false;
		}
		return data.fogOuterShop.goods[index].status;
	}

	//获取局外商店
	getFogShopGoods() {
		var goodLsit = [];
		var data = this.getData();
		if (!data || !data.fogOuterShop || !data.fogOuterShop.goods) {
			return {};
		}

		return data.fogOuterShop.goods;
	}

	/**获取迷雾币数 */
	getFogCoinNum() {
		var data = this.getData();
		return Number(data && data.fogCoin) || 0;
	}
}
