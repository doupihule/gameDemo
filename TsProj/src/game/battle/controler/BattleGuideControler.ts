import BattleLogicalControler from "./BattleLogicalControler";
import UserModel from "../../sys/model/UserModel";
import GuideManager from "../../sys/manager/GuideManager";
import GuideConst from "../../sys/consts/GuideConst";
import {BattleUI} from "../../sys/view/battle/BattleUI";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import BattleFunc from "../../sys/func/BattleFunc";
import StatisticsManager from "../../sys/manager/StatisticsManager";

/**
 *
 * 战斗中先关的引导控制器.逻辑抽离出来.
 * 方便扩展
 *
 */

export default class BattleGuideControler {
	public controler: BattleLogicalControler;
	public battleUI: BattleUI;

	public constructor(controler: BattleLogicalControler) {
		this.controler = controler;
		this.battleUI = this.controler.battleUI;
	}


}