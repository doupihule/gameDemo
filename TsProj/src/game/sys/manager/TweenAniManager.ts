import TimerManager from "../../../framework/manager/TimerManager";
import StringUtils from "../../../framework/utils/StringUtils";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import PoolCode from "../consts/PoolCode";
import PoolTools from "../../../framework/utils/PoolTools";
import DataResourceFunc from "../func/DataResourceFunc";
import BattleFunc from "../func/BattleFunc";

/**Tween动画 */
export default class TweenAniManager {
	private static _instance: TweenAniManager;

	constructor() {

	}

	static get instance(): TweenAniManager {
		if (!this._instance) {
			this._instance = new TweenAniManager();
		}
		return this._instance;
	}

	/**渐现动画 */
	fadeInAni(thisObj, callback = null, duration = 500, obj = null, firtAlpha = 0, lastAlpha = 1) {
		thisObj.alpha = firtAlpha;
		// TweenTools.tweenTo(thisObj, {alpha: lastAlpha}, duration, null, Laya.Handler.create(obj, () => {
			callback && callback.call(obj);
		// }));
	}




}
