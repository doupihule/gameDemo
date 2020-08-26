import UserModel from "../model/UserModel";
import LogsManager from "../../../framework/manager/LogsManager";
import RolesFunc from "../func/RolesFunc";
import ChapterFunc from "../func/ChapterFunc";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../consts/WindowCfgs";
import GuideManager from "../manager/GuideManager";
import GuideConst from "../consts/GuideConst";
import GameMainUI from "../view/main/GameMainUI";
import BattleConst from "../consts/BattleConst";
import LevelFunc from "../func/LevelFunc";
import StatisticsManager from "../manager/StatisticsManager";

export default class TaskGuideTrigger {

	static clickGoOn(data) {
		var type = data.logicType;
		var func = this["clickGoOn_" + type];
		if (!func) {
			LogsManager.errorTag("fogPropError", "没有对应的任务类型:", type);
		} else {
			return this["clickGoOn_" + type](data)
		}
		return null
	}

	/**去章节并且指向当前关卡 */
	static clickGoOn_1(data) {
		var targetLevel = Number(data.params[0][0]);
		var chapInfo = ChapterFunc.instance.getOpenConditionByLevel(targetLevel);
		var chapter = chapInfo.split("-");
		StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10002, {taskId: data.id})
		WindowManager.SwitchUI(WindowCfgs.ChapterMapUI, [WindowCfgs.GameMainUI, WindowCfgs.TaskUI], {
			chapterId: chapter[0],
			targetName: chapInfo
		})
	}

	static showGuide_1(x, y, callBack = null, thisObj = null) {
		GuideManager.ins.setGuideData(GuideConst.GUIDE_10002, GuideManager.GuideType.None, null, null, null, null, x, y);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_10002, this.closeGuide.bind(this, [callBack, thisObj]), this);
	}

	static closeGuide(data = null) {
		if (data) {
			var callBack = data[0];
			var thisObj = data[1];
			callBack && callBack.call(thisObj)
		}
		WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
	}

	/*去主界面指向对应角色 */
	static clickGoOn_2(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		var targetRole = Number(data.params[0][0]);
		var main: GameMainUI = WindowManager.getUIByName(WindowCfgs.GameMainUI);
		var role = main.getTargetRole(targetRole);
		StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10002, {taskId: data.id})
		this.showGuide_2(role, main);
	}

	static showGuide_2(img, parent) {
		GuideManager.ins.setGuideData(GuideConst.GUIDE_10002, GuideManager.GuideType.Static, img, parent);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_10002, this.closeGuide, this);
	}

	/*去该角色升级界面 */
	static clickGoOn_3(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		var targetRole = Number(data.params[0][0]);
		var kind = RolesFunc.instance.getCfgDatasByKey("Role", targetRole, "kind");
		if (kind == BattleConst.LIFE_JIDI) {
			WindowManager.OpenUI(WindowCfgs.HomeUpgradeUI);
		} else {
			WindowManager.OpenUI(WindowCfgs.RoleDetailUI, {id: targetRole})
		}
	}

	/*去该角色升星界面 */
	static clickGoOn_4(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		var targetRole = Number(data.params[0][0]);
		WindowManager.OpenUI(WindowCfgs.RoleDetailUI, {id: targetRole, tab: 1})
	}

	/*去该角色装备界面 */
	static clickGoOn_5(data) {
		this.clickGoOn_4(data);
	}

	/*去最新章节地图 */
	static clickGoOn_6(data) {
		var level = UserModel.instance.getMaxBattleLevel();
		var maxLevel = LevelFunc.instance.getMaxLevel();
		level = level + 1 > maxLevel ? maxLevel : level + 1;
		var chapInfo = ChapterFunc.instance.getOpenConditionByLevel(level).split("-");
		WindowManager.SwitchUI(WindowCfgs.ChapterMapUI, [WindowCfgs.GameMainUI, WindowCfgs.TaskUI], {chapterId: chapInfo[0]})
	}

	/**手指指向最新可解锁的角色 */
	static clickGoOn_7(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		var main: GameMainUI = WindowManager.getUIByName(WindowCfgs.GameMainUI);
		var role = main.getUnlockRole();
		if (role) {
			StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10002, {taskId: data.id})
			this.showGuide_2(role.item, main);
		}
	}

	/**手指指向布阵 */
	static clickGoOn_8(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		var main: GameMainUI = WindowManager.getUIByName(WindowCfgs.GameMainUI);
		StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10002, {taskId: data.id})
		this.showGuide_2(main.formationImg, main);
	}

	/**主界面 */
	static clickGoOn_9(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
	}

	/**主界面 */
	static clickGoOn_10(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
	}

	/**打开转盘 */
	static clickGoOn_11(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		WindowManager.OpenUI(WindowCfgs.TurnableUI);
	}

	/**手指指向迷雾 */
	static clickGoOn_12(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10002, {taskId: data.id})
		var main: GameMainUI = WindowManager.getUIByName(WindowCfgs.GameMainUI);
		this.showGuide_2(main.fogImg, main);
	}

	static clickGoOn_13(data) {
		this.clickGoOn_12(data);
	}

	//切换到日程界面
	static clickGoOn_19(data) {
		WindowManager.OpenUI(WindowCfgs.TaskUI, {tab: 1})
	}

	//抽装备
	static clickGoOn_20(data) {
		WindowManager.CloseUI(WindowCfgs.TaskUI);
		WindowManager.OpenUI(WindowCfgs.MainShopUI)
	}

	/**打开转盘 */
	static clickGoOn_21(data) {
		this.clickGoOn_11(data)
	}
}