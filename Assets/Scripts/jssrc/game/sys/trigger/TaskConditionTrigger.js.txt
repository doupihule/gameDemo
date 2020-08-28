"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const RolesModel_1 = require("../model/RolesModel");
const RolesFunc_1 = require("../func/RolesFunc");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const PiecesModel_1 = require("../model/PiecesModel");
const TaskModel_1 = require("../model/TaskModel");
class TaskConditionTrigger {
    //  /**任务条件：解锁角色id */
    //  static taskCondition_unlockRole = 2;
    //   /**任务条件：解锁角色id */
    // static taskCondition_unlockRole = 2;
    //  /**任务条件：解锁角色id */
    //  static taskCondition_unlockRole = 2;
    static checkTaskCondition(data) {
        var type = data.logicType;
        var func = this["checkTask_" + type];
        if (!func) {
            LogsManager_1.default.errorTag("fogPropError", "没有对应的任务类型:", type);
        }
        else {
            return this["checkTask_" + type](data);
        }
        return null;
    }
    //noProcess 不显示计数
    /**通关主线关卡 */
    static checkTask_1(data) {
        var params = data.params;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var targetLevel = Number(params[0][0]);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish, noProcess: 1 };
    }
    /**解锁角色 */
    static checkTask_2(data) {
        var params = data.params;
        var id = params[0][0];
        var isUnlock = RolesModel_1.default.instance.getIsHaveRole(id);
        var cur = isUnlock ? 1 : 0;
        return { cur: cur, target: 1, finish: cur };
    }
    /**升级角色 */
    static checkTask_3(data) {
        var params = data.params;
        var id = params[0][0];
        var targetLevel = Number(params[1][0]);
        var level = RolesModel_1.default.instance.getRoleLevelById(id);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish };
    }
    /**升星角色 */
    static checkTask_4(data) {
        var params = data.params;
        var id = params[0][0];
        var targetLevel = Number(params[1][0]);
        var level = RolesModel_1.default.instance.getRoleStarLevel(id);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish };
    }
    /**为角色合成装备 */
    static checkTask_5(data) {
        var params = data.params;
        var id = params[0][0];
        var targetId = params[1][0];
        var equip = RolesModel_1.default.instance.getIsHaveEquip(id, targetId);
        var target;
        var cost = RolesFunc_1.default.instance.getCfgDatasByKey("Equip", targetId, "cost");
        for (var i = 0; i < cost.length; i++) {
            var costItem = cost[i].split(",");
            if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
                target = Number(costItem[2]);
                break;
            }
        }
        var cur = target;
        if (!equip) {
            cur = PiecesModel_1.default.instance.getPieceCount(costItem[1]);
        }
        var finish = equip ? 1 : 0;
        return { cur: cur, target: target, finish: equip };
    }
    /**主线关卡胜利 */
    static checkTask_6(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = TaskModel_1.default.instance.getTaskProcessByType(data.type, data.logicType);
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish };
    }
    /**解锁n个角色 */
    static checkTask_7(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = RolesModel_1.default.instance.getUnlockRole().length;
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish };
    }
    /**最大上阵角色达到n个 */
    static checkTask_8(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = RolesModel_1.default.instance.getInLineRole().length;
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish };
    }
    /**拥有n个m级角色 */
    static checkTask_9(data) {
        var params = data.params;
        var targetCount = Number(params[0][0]);
        var targetLevel = Number(params[1][0]);
        var role = RolesModel_1.default.instance.getRolesList();
        var curCount = 0;
        for (var key in role) {
            var element = role[key];
            if (element.level >= targetLevel) {
                curCount += 1;
            }
        }
        var finish = curCount >= targetCount ? 1 : 0;
        return { cur: curCount, target: targetCount, finish: finish };
    }
    /**拥有n个m星角色 */
    static checkTask_10(data) {
        var params = data.params;
        var targetCount = Number(params[0][0]);
        var targetLevel = Number(params[1][0]);
        var role = RolesModel_1.default.instance.getRolesList();
        var curCount = 0;
        for (var key in role) {
            var element = role[key];
            var star = element.starLevel || 0;
            if (star >= targetLevel) {
                curCount += 1;
            }
        }
        var finish = curCount >= targetCount ? 1 : 0;
        return { cur: curCount, target: targetCount, finish: finish };
    }
    /**看视频n次 */
    static checkTask_11(data) {
        return this.checkTask_6(data);
    }
    /**迷雾街区结算n次 */
    static checkTask_12(data) {
        return this.checkTask_6(data);
    }
    /**迷雾街区最大达到n层 */
    static checkTask_13(data) {
        return this.checkTask_6(data);
    }
    /**完成n个每日任务 */
    static checkTask_19(data) {
        return this.checkTask_6(data);
    }
    /**抽装备n次 */
    static checkTask_20(data) {
        return this.checkTask_6(data);
    }
    /**使用转盘n次 */
    static checkTask_21(data) {
        return this.checkTask_6(data);
    }
}
exports.default = TaskConditionTrigger;
/**任务条件：主线胜利 */
TaskConditionTrigger.taskCondition_levelWin = 6;
/**任务条件：看视频 */
TaskConditionTrigger.taskCondition_videoCount = 11;
/**任务条件：迷雾街区结算次数 */
TaskConditionTrigger.taskCondition_fogResultCount = 12;
/**任务条件：迷雾街区最大层数 */
TaskConditionTrigger.taskCondition_fogHighLayer = 13;
/**任务条件：完成每日任务数 */
TaskConditionTrigger.taskCondition_dailyTaskCount = 19;
/**任务条件：抽装备次数 */
TaskConditionTrigger.taskCondition_equipCount = 20;
/**任务条件：转盘数 */
TaskConditionTrigger.taskCondition_turntable = 21;
//# sourceMappingURL=TaskConditionTrigger.js.map