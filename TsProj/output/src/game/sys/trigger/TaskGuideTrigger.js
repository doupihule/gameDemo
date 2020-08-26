"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const RolesFunc_1 = require("../func/RolesFunc");
const ChapterFunc_1 = require("../func/ChapterFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../consts/WindowCfgs");
const GuideManager_1 = require("../manager/GuideManager");
const GuideConst_1 = require("../consts/GuideConst");
const BattleConst_1 = require("../consts/BattleConst");
const LevelFunc_1 = require("../func/LevelFunc");
const StatisticsManager_1 = require("../manager/StatisticsManager");
class TaskGuideTrigger {
    static clickGoOn(data) {
        var type = data.logicType;
        var func = this["clickGoOn_" + type];
        if (!func) {
            LogsManager_1.default.errorTag("fogPropError", "没有对应的任务类型:", type);
        }
        else {
            return this["clickGoOn_" + type](data);
        }
        return null;
    }
    /**去章节并且指向当前关卡 */
    static clickGoOn_1(data) {
        var targetLevel = Number(data.params[0][0]);
        var chapInfo = ChapterFunc_1.default.instance.getOpenConditionByLevel(targetLevel);
        var chapter = chapInfo.split("-");
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10002, { taskId: data.id });
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, [WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.TaskUI], { chapterId: chapter[0], targetName: chapInfo });
    }
    static showGuide_1(x, y, callBack = null, thisObj = null) {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10002, GuideManager_1.default.GuideType.None, null, null, null, null, x, y);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10002, this.closeGuide.bind(this, [callBack, thisObj]), this);
    }
    static closeGuide(data = null) {
        if (data) {
            var callBack = data[0];
            var thisObj = data[1];
            callBack && callBack.call(thisObj);
        }
        WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
    }
    /*去主界面指向对应角色 */
    static clickGoOn_2(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        var targetRole = Number(data.params[0][0]);
        var main = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.GameMainUI);
        var role = main.getTargetRole(targetRole);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10002, { taskId: data.id });
        this.showGuide_2(role, main);
    }
    static showGuide_2(img, parent) {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10002, GuideManager_1.default.GuideType.Static, img, parent);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10002, this.closeGuide, this);
    }
    /*去该角色升级界面 */
    static clickGoOn_3(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        var targetRole = Number(data.params[0][0]);
        var kind = RolesFunc_1.default.instance.getCfgDatasByKey("Role", targetRole, "kind");
        if (kind == BattleConst_1.default.LIFE_JIDI) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.HomeUpgradeUI);
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleDetailUI, { id: targetRole });
        }
    }
    /*去该角色升星界面 */
    static clickGoOn_4(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        var targetRole = Number(data.params[0][0]);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleDetailUI, { id: targetRole, tab: 1 });
    }
    /*去该角色装备界面 */
    static clickGoOn_5(data) {
        this.clickGoOn_4(data);
    }
    /*去最新章节地图 */
    static clickGoOn_6(data) {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var maxLevel = LevelFunc_1.default.instance.getMaxLevel();
        level = level + 1 > maxLevel ? maxLevel : level + 1;
        var chapInfo = ChapterFunc_1.default.instance.getOpenConditionByLevel(level).split("-");
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, [WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.TaskUI], { chapterId: chapInfo[0] });
    }
    /**手指指向最新可解锁的角色 */
    static clickGoOn_7(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        var main = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.GameMainUI);
        var role = main.getUnlockRole();
        if (role) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10002, { taskId: data.id });
            this.showGuide_2(role.item, main);
        }
    }
    /**手指指向布阵 */
    static clickGoOn_8(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        var main = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.GameMainUI);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10002, { taskId: data.id });
        this.showGuide_2(main.formationImg, main);
    }
    /**主界面 */
    static clickGoOn_9(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
    }
    /**主界面 */
    static clickGoOn_10(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
    }
    /**打开转盘 */
    static clickGoOn_11(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
    }
    /**手指指向迷雾 */
    static clickGoOn_12(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10002, { taskId: data.id });
        var main = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.GameMainUI);
        this.showGuide_2(main.fogImg, main);
    }
    static clickGoOn_13(data) {
        this.clickGoOn_12(data);
    }
    //切换到日程界面
    static clickGoOn_19(data) {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TaskUI, { tab: 1 });
    }
    //抽装备
    static clickGoOn_20(data) {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskUI);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.MainShopUI);
    }
    /**打开转盘 */
    static clickGoOn_21(data) {
        this.clickGoOn_11(data);
    }
}
exports.default = TaskGuideTrigger;
//# sourceMappingURL=TaskGuideTrigger.js.map