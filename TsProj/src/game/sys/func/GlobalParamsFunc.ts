import BaseFunc from "../../../framework/func/BaseFunc";
import UserModel from "../model/UserModel";

export default class GlobalParamsFunc extends BaseFunc {
	private static _instance: GlobalParamsFunc;

	public static getInstance(): GlobalParamsFunc {
		if (!this._instance) {
			this._instance = new GlobalParamsFunc();
		}
		return this._instance;
	}

	public static get instance() {
		if (!this._instance) {
			this._instance = new GlobalParamsFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "GlobalParams_json"},
			{name: "TranslateGlobal_json"},
		]
	}

	/**分享失败处理类型 1: 通用飘字，  2： 弹微信框（点击确认后继续拉取分享） */
	shareHandleType: number = 2;
	/**视频中途退出处理类型 1: 通用飘字，  2： 弹微信框（点击确认后重新拉取视频） */
	videoHandleType: number = 2;

	static coin = 2; //金币
	static gold = 3; //钻石
	static power = 4; //体力

	/**根据id获取数据*/
	public getGlobalCfgDatas(id): any {
		// return this.cfg[id];
		return this.getCfgDatas("GlobalParams_json", id);
	}

	/**根据id获取TranslateGlobal数据*/
	public getTranslateGlobalCfgDatas(id): any {
		// return this.cfg[id];
		return this.getCfgDatas("TranslateGlobal_json", id);
	}


	/**根据id1,id2获取数据*/
	public getDataByTwoId(id1, id2): any {
		// return this.cfg[id];
		return this.getCfgDatasByKey("GlobalParams_json", id1, id2);
	}

	//获取配置数据的num
	public getDataNum(id) {
		return this.getGlobalCfgDatas(id).num
	}

	//获取字符串配置
	public getDataString(id) {
		return this.getGlobalCfgDatas(id).string
	}

	//获取数组配置
	public getDataArray(id) {
		return this.getGlobalCfgDatas(id).arr
	}

	/**获取banner的随机数据 */
	getBannerRandomById(id) {
		return this.getCfgDatasByKey("secretBox_json", id, "touchRound");
	}

	//获取基地技能解锁信息
	getBaseSkillList() {
		return this.getCfgDatasByKey("GlobalParams_json", "baseSkillList", "arr");
	}

	/**获取当前解锁了的阵位数 */
	getUnlockLineCount(level = null) {
		if (!level) {
			level = UserModel.instance.getMaxBattleLevel();
		}
		var count = 0;
		var info = this.getCfgDatasByKey("GlobalParams_json", "squadUnlock", "arr");
		for (var i = 0; i < info.length; i++) {
			var item = info[i].split(",");
			if (Number(item[1]) <= level) {
				count += 1;
			}
		}
		return count;
	}

}