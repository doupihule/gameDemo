import GameSwitch from "../../common/GameSwitch";
import UserInfo from "../../common/UserInfo";
import LogsManager from "../../manager/LogsManager";
import AdVideoManager from "../AdVideoManager";
import Client from "../../common/kakura/Client";
import TimerManager from "../../manager/TimerManager";
import StatisticsManager from "../../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../../consts/StatisticsCommonConst";

export default class OriginalAdBaseComp {
	/** 用于日志区分不同原生广告日志 */
	protected logName;

	public _originalAd; //原生广告实例
	public _isLoadOriginalSucc: boolean = false; //是否下载原生广告成功
	/**
	 * 原生广告：是否已经准备好可以展示
	 */
	public _isOriginalObjReady: boolean = false;
	/**
	 * 原生广告重新加载锁：当上一个广告实例为初始化完成，无法销毁并创建新的
	 */
	public _startLoadTime = null;

	protected _curIdsKey //当前拉取id次数
	protected _tryCount //当前拉取id次数
	protected adList;

	protected _adOriginalIds


	/**
	 * 子类重写获取Id方法
	 */
	public get adOriginalIds(): string {
		if (!this._adOriginalIds) {
			if (GameSwitch.getSwitchState(GameSwitch.ORIGIN_ID)) {
				this._adOriginalIds = (String(GameSwitch.getSwitchState(GameSwitch.ORIGIN_ID))).split("|");
				;
			}
		}
		return this._adOriginalIds;
	}

	canOriginalAdv() {
		if (!(UserInfo.isOppo() || UserInfo.isVivo())) {
			LogsManager.echo("hlx " + this.logName + "关闭：平台不支持原生广告");
			return false;
		}

		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ORIGIN)) {
			LogsManager.echo("hlx " + this.logName + "关闭：开关关闭");
			return false;
		}

		if (!AdVideoManager.instance._isInitAdv) {
			LogsManager.echo("hlx " + this.logName + "关闭：_isInitAdv 广告组件未初始化完毕");
			LogsManager.errorTag('originAd_id_not_init', 'originAd_id_not_init');
			return false;
		}

		if (!UserInfo.platform.getWX().createNativeAd) {
			LogsManager.echo("hlx " + this.logName + "关闭：createNativeAd函数不存在");
			LogsManager.errorTag("noOriginalAd", "这个设备没有原生广告组件")
			return false;
		}

		if (!this.adOriginalIds || !(this.adOriginalIds.length >= 1)) {
			LogsManager.echo('hlx ' + this.logName + '关闭：adOriginalIds未配置');
			return false;
		}

		return true;
	}

	/**
	 * 拉取原生广告
	 */
	public registerOrigionAdv(callBack = null, thisObj = null, params = {}) {
		this._isLoadOriginalSucc = false;
		LogsManager.echo("hlx " + this.logName + "原生广告初始化开始--------------------");
		if (!this.canOriginalAdv()) {
			return;
		}
		this._tryCount = 1;
		if (this._curIdsKey == null) {
			// 第一次随机起始广告Id
			this._curIdsKey = Math.floor(Math.random() * this.adOriginalIds.length);
		}
		this.createOriginalSysc(this.adOriginalIds, callBack, thisObj, params);
	}

	/**
	 * 获取一个数组的下一个Key
	 */
	protected getArrNextKey(currentKey, length) {
		if (currentKey + 1 >= length) {
			return 0;
		} else {
			return currentKey + 1
		}
	}

	/**
	 * 创建原生广告实例
	 */
	protected createOriginalSysc(idArr, callBack = null, thisObj = null, params = {}) {
		LogsManager.echo("hlx " + this.logName + " 原生广告初始化开始2--------------------" + this._curIdsKey);

		// 上锁中
		if (this._startLoadTime != null) {
			// 上锁小于5秒，给失败返回
			if (Client.instance.serverTime - this._startLoadTime < 5) {
				LogsManager.warn("hlx " + this.logName + " 广告实例未初始化完成，不重复初始化: 建议查询代码不要频繁加载原生广告！", Client.instance.serverTime - this._startLoadTime);
				callBack && callBack.call(thisObj, false, params)
				return;
			} else {
				// 上锁大于5秒，说明初始化load没有成功或失败回调。发送报错平台定位问题
				LogsManager.errorTag('original_lock_expire', "startTime:" + this._startLoadTime + " nowTime:" + Client.instance.serverTime);
			}
		}

		if (this._isLoadOriginalSucc) {
			LogsManager.errorTag('origin_LoadOriginalSucc_error', '成功不应该走到此处');
			return;
		}
		if (this._tryCount > this.adOriginalIds.length) {
			callBack && callBack.call(thisObj, false, params)
			return
		}

		if (this._originalAd) {
			if (this._isOriginalObjReady) {
				LogsManager.echo("hlx " + this.logName + " 原生广告已缓存，直接显示--------------------" + this._curIdsKey);
				// 预加载过就直接返回
				callBack && callBack.call(thisObj, true, params, this.adList);
				return;
			} else {
				var destory_originalAd = this._originalAd
				this._originalAd = null;
				if ('function' == typeof destory_originalAd.destroy) {
					destory_originalAd.destroy();
				}
			}
		}

		LogsManager.echo("hlx " + this.logName + " 创建原生广告对象")
		var id = this.adOriginalIds[this._curIdsKey];
		var wx = UserInfo.platform.getWX();

		// 创建实例后锁住无法重复创建实例
		this._startLoadTime = Client.instance.serverTime;

		this._originalAd = wx.createNativeAd({
			posId: id
		})
		if (this._originalAd) {
			var _originalAd = this._originalAd;
			_originalAd.onError(err => {

				LogsManager.echo("hlx " + this.logName + " onError--------------------" + this._curIdsKey, JSON.stringify(err));
				// 加载解锁
				this._startLoadTime = null;
				this._isLoadOriginalSucc = false;

				if (UserInfo.isVivo()) {
					//Vivo不重试
					return;
				}
				this._tryCount++
				if (this._curIdsKey + 1 >= this.adOriginalIds.length) {
					this._curIdsKey = 0;
				} else {
					this._curIdsKey++
				}

				// 加载失败换下一个Id加载
				// 需要延迟一段时间。不然下次load会不给回调 by 黄璐骁
				TimerManager.instance.setTimeout(this.createOriginalSysc, this, 300, idArr, callBack, thisObj, params);
			})
			_originalAd.onLoad((res) => {
				LogsManager.echo("hlx " + this.logName + " onLoad--------------------" + this._curIdsKey, JSON.stringify(res));
				// 加载解锁
				this._startLoadTime = null;
				this._isLoadOriginalSucc = true;
				this.adList = res.adList[0]
				if (res.adList[0]) {
					this._isOriginalObjReady = true;
					LogsManager.echo("原生广告初始化开始6--------------------");
					callBack && callBack.call(thisObj, true, params, this.adList);
				}
			})
			_originalAd.load();
		}
	}

	/**
	 * 汇报点击
	 */
	public reportClickOriginal(adId) {
		LogsManager.echo("hlx " + this.logName + " 汇报点击");
		StatisticsManager.ins.onEvent(StatisticsCommonConst.ORIGINAL_CLICK, {type: this.logName});
		this._originalAd.reportAdClick({
			adId: adId
		})
	}

	/**
	 * 汇报展示
	 */
	public reportShowOriginal(adId) {
		LogsManager.echo("hlx " + this.logName + " 汇报展示");
		StatisticsManager.ins.onEvent(StatisticsCommonConst.ORIGINAL_SHOW, {type: this.logName});
		this._isOriginalObjReady = false;
		this._originalAd.reportAdShow({
			adId: adId
		})
	}
}
