import BaseFunc from "./BaseFunc";
import GameUtils from "../../utils/GameUtils";
import LogsManager from "../manager/LogsManager";

export default class FullJumpFunc extends BaseFunc {
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "FullJump_json", ignoreNoExist: true},
		];
	}

	// onshow情况下展示全屏互推
	static ID_ONSHOW: string = "1";
	//  在确认跳转弹窗中，点击取消时（现在本身就有，无需处理）
	static ID_JUMP_FALSE: string = "2";
	// 普通关卡结束时
	static ID_COMMON_GAME: string = "3";
	// 远征关卡结束时
	static ID_WAR_GAME: string = "4";
	// 当用户关闭抽奖面板时
	static ID_EXIT_LOTTERY: string = "5";
	// 当用户关闭七日登陆面板时
	static ID_EXIT_SEVEN_DAY: string = "6";
	// 当用户关闭排行榜时
	static ID_EXIT_RANK: string = "7";
	// 当用户关闭邀请面板时
	static ID_EXIT_SHARE: string = "8";
	// 关闭基地升级面板时
	static ID_EXIT_UPDATE: string = "9";
	// 关闭上阵面板时
	static ID_EXIT_FORMATE: string = "10";

	private static _instance: FullJumpFunc;

	static get instance() {
		if (!this._instance) {
			this._instance = new FullJumpFunc();
		}
		return this._instance;
	}

	/**
	 * 能否展示全屏互推
	 * @param id 场景id
	 */
	canShowFUllJump(id) {
		var jumpData = this.getCfgDatas("FullJump_json", id, true);
		if (!jumpData) return false;
		var jumpProb = jumpData.probab;
		var randNum = GameUtils.getRandomInt(1, 10000);
		LogsManager.echo("ycn full jump jumpProb:", jumpProb, ",randNum:", randNum);
		if (randNum <= jumpProb) {
			return true;
		} else {
			return false;
		}
	}
}