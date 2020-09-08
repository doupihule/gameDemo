import BaseModel from "./BaseModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import Client from "../../../framework/common/kakura/Client";
import Message from "../../../framework/common/Message";
import UserEvent from "../event/UserEvent";

export default class UserExtModel extends BaseModel {
	private curSp = 0;
	private upSpTime = 0;

	public constructor() {
		super();
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
	/**
	 * 获取上次刷新体力值
	 */
	getLastFreshPower() {
		if(!this._data.sp && this._data.sp != 0){
			this._data.sp = GlobalParamsFunc.instance.getDataNum('bornSp');
		}
		return this._data.sp || 0;
	}

	/**
	 * 获取上次刷新时间
	 */
	getLastPowerFreshTime() {
		if(!this._data.upSpTime)
		{
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
		return GlobalParamsFunc.instance.getDataNum('spRestoreTime') - Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) % GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
	}

	getCurrentSp() {
		return this.getLastFreshPower() + Math.floor((Client.instance.serverTime - this.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
	}

	getLeftFreeCar() {
		return this._data.leftFreeCar || 0;
	}
}
