import BaseModel from "./BaseModel";
import Client from "../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import Message from "../../../framework/common/Message";
import UserEvent from "../event/UserEvent";
import IMessage from "../interfaces/IMessage";
import MsgCMD from "../common/MsgCMD";
import UserExtServer from "../server/UserExtServer";
import GameTools from "../../../utils/GameTools";
import GameMainEvent from "../event/GameMainEvent";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../func/ShareTvOrderFunc";
import LevelFunc from "../func/LevelFunc";
import TalentSkillsModel from "./TalentSkillsModel";
import UserModel from "./UserModel";

export default class UserExtModel extends BaseModel implements IMessage {
	private curSp = 0;
	private upSpTime = 0;

	public constructor() {
		super();
		Message.instance.add(MsgCMD.GAME_ONHIDE, this);
		Message.instance.add(MsgCMD.GAME_ONSHOW, this);

	}

	//单例
	private static _instance: UserExtModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new UserExtModel();
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
		if (d.sp || d.sp == 0 || d.upSpTime || d.upSpTime == 0) {
			Message.instance.send(UserEvent.USER_SP_CHANGE);
		}
		if (d.maxStage || d.maxStage == 0) {
			Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_STAGE);
		}

	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);

	}

	getIsClickInvite() {
		return this._data.shareButtonClick || 0;
	}

	/**判断是否领取了客服奖励 */
	checkIsGotKefuAward() {
		var isGot = false;
		if (this._data && this._data.customReward) {
			isGot = true;
		}
		return isGot
	}

	/**获取当前解锁的最大关卡 */
	getMaxLevel() {
		return Number(this._data.maxStage) || 0;
	}


	/**获取领取宝箱次数 */
	getBoxGetCount(index) {
		return this._data.getBoxCount && this._data.getBoxCount[index];
	}

	getIsBox() {
		return this._data.getBoxCount;
	}

	updateLogoutTime() {
		//更新登出时间
		UserExtServer.updateLogoutTime();
	}


	/*获取本次随机神秘宝箱的概率id */
	getRateId() {
		if (this._data.bannerChanceId) {
			return this._data.bannerChanceId;
		}
		return 1;
	}

	/**获取本次游戏是否出现宝箱 */
	getIsShowGiftInGame() {
		if (!GameTools.canGift) return false;
		var level = this.getMaxLevel();
		if (level < GlobalParamsFunc.instance.getDataNum("secretBagStartPVP")) return false;
		var rate = GlobalParamsFunc.instance.getDataByTwoId("secretBagTouchRound", "arr");
		var num = rate[0].split(",");
		var winTimes = this._data.playCount || 0;
		if (winTimes == 0) return false;
		if (winTimes <= Number(num[1])) {
			return true;
		}
		return false;
	}

	getPlayCount() {
		return this._data.playCount || 0;
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case MsgCMD.GAME_ONHIDE:
				this.updateLogoutTime();
				break;
			case MsgCMD.GAME_ONSHOW:
				break;
		}
	}

	//获取转盘自动弹出次数
	getTurnableOccurCount() {
		return this._data.turnableOccurCount || 0;
	}

	//获取英雄免费进阶的次数
	getFreeAdvanceCount(roleId) {
		if (!this._data || !this._data.freeAdvanceCount || !this._data.freeAdvanceCount[roleId]) {
			return 0;
		}
		return this._data.freeAdvanceCount[roleId];
	}


	/**
	 * 获取上次刷新体力值
	 */
	getLastFreshPower() {
		if (!this._data.sp && this._data.sp != 0) {
			this._data.sp = GlobalParamsFunc.instance.getDataNum('bornSp');
		}
		return this._data.sp || 0;
	}

	/**
	 * 获取上次刷新时间
	 */
	getLastPowerFreshTime() {
		if (!this._data.upSpTime) {
			this._data.upSpTime = Client.instance.serverTime;
		}
		return this._data.upSpTime;
	}

	/**
	 * 改变sp数值
	 * int $num  体力改变数值
	 * int $nstring $comeFrom
	 * stringboolean $lose 减少体力的方式为失去或者消耗
	 */
	changeSp(num, islose = false) {
		this.curSp = this.getLastFreshPower();
		this.upSpTime = this.getLastPowerFreshTime();
		// 更改前计算体力及上次刷新时间
		this.calcSp();
		if (this.curSp + num < 0 && !islose) {
			// throw new \Game\common\GameLogicAlertException('user_sp_not_enough');
			this.curSp = 0;
			return;
		}
		if (this.curSp + num < 0 && islose) {
			num = -this.curSp;
		}
		this.curSp += num;

		// 更改后计算体力及上次刷新时间
		this.calcSp();
	}


	/**
	 * 计算sp恢复
	 */
	calcSp() {
		// 1点体力恢复时间
		var recoveTime = GlobalParamsFunc.instance.getDataNum('spRestoreTime');
		// 计算体力的最大值
		var max = GlobalParamsFunc.instance.getDataNum('maxSp');

		// 如果体力上限未达上限
		if (this.curSp < max) {
			//增加的点数
			var times = Math.floor((Client.instance.serverTime - this.upSpTime) / recoveTime);
			if (times <= 0) {
				return;
			}

			if (this.curSp + times > max) {
				this.curSp = max;
				this.upSpTime = Client.instance.serverTime;
			} else {
				this.curSp += times;
				this.upSpTime += times * recoveTime;
			}

		} else {
			this.upSpTime = Client.instance.serverTime;
		}
	}

	/**
	 * 获取当前体力
	 */
	getNowSp() {
		return this.curSp;
	}

	getUpTime() {
		return this.upSpTime;
	}

	/**
	 * 获取下一点体力恢复的时间
	 */
	getNextPowerRestoreTime() {
		//下一点体力恢复的时间 = 体力恢复间隔 - ((当前服务器时间上次 - 上次服务器刷新体力的时间) % 体力恢复间隔)
		// return 60000 - Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) % 60000);
		return GlobalParamsFunc.instance.getDataNum('spRestoreTime') - Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) % GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
	}

	getCurrentSp() {
		var maxSp = GlobalParamsFunc.instance.getDataNum('maxSp');
		// var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / 60000);
		var nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
		if (UserExtModel.instance.getLastFreshPower() > maxSp) {
			nowPower = UserExtModel.instance.getLastFreshPower();
		} else if (nowPower > maxSp) {
			nowPower = maxSp;
		}
		return nowPower;
		//return this.getLastFreshPower() + Math.floor((Client.instance.serverTime - this.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
	}

	//获取天赋技能升级次数
	getTalentSkillUpgradeNum() {
		return this._data.talentSkillUpgradeNum || 0;
	}

	//获取天赋免费升级的次数
	getTalentFreeUpgradeCount() {
		return this._data.talentFreeUpgradeCount || 0;
	}

	//是否出现天赋免费升级
	getIsFreeUpgradeTalentInGame() {
		//获取天赋升级次数
		var talentUpgradeNum = UserExtModel.instance.getTalentSkillUpgradeNum();
		if (talentUpgradeNum < GlobalParamsFunc.instance.getDataNum("talentVideoLevelUpOpenNub")) {
			return false;
		}

		var rate = GlobalParamsFunc.instance.getDataByTwoId("talentVideoLevelUpShowInterval", "arr")[0].split(",");
		var freeUpgradeCount = this.getTalentFreeUpgradeCount();

		if (freeUpgradeCount <= Number(rate[1])) {
			return true;
		}
		return false;
	}

	getOfflineTime() {
		return this._data.offlineTime || 0;
	}

	getLoginTime() {
		return this._data.loginTime;
	}

	getLastOfflineTime() {
		return this._data.lastOfflineTime || UserModel.instance.getLastSendTime();
	}

	//获取离线收益
	calcuOfflineReward() {
		var levelInfo = LevelFunc.instance.getLevelInfoById(UserExtModel.instance.getMaxLevel()).offLineGiveGold[0];
		var talentBuff = TalentSkillsModel.instance.getBuff();

		var offlineTime = UserExtModel.instance.getOfflineTime();
		offlineTime = Math.min(GlobalParamsFunc.instance.getDataNum('offLineMaxTime'), offlineTime);
		var goldTime = Math.ceil(offlineTime / GlobalParamsFunc.instance.getDataNum('offLineMinutesNub'));
		var reward = levelInfo.split(',');

		return [reward[0], Math.round(reward[1] * goldTime * (10000) / 10000)];
	}

	//获取每日邀请点击状态
	getEverydayInvite() {
		return this._data.everydayInvite || 0;
	}

	//获取首次进入漫画标识
	getEnterFogFlag() {
		return this._data.enterFogFlag || 0;
	}

	//获取玩家战斗力
	getRoleForce() {
		return Number(this._data.force) || 0;

	}

	//获取每日首次进入迷雾标识
	checkFirstEnterFog() {
		return this._data.dailyFirstEnterFog || 0;
	}

	//判断是否显示转盘按钮
	checkIsTurnableShow() {
		var isShow = false;
		var luckyPlateLevel = GlobalParamsFunc.instance.getDataNum("luckyPlateLevel");
		var curMaxLevel = UserExtModel.instance.getMaxLevel();
		if (Number(curMaxLevel) + 1 >= luckyPlateLevel) {
			var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_TURNABLE);
			if (freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				isShow = true;
			}
		}

		return isShow;
	}
}
