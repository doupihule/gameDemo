import UserModel from "../model/UserModel";
import LogsManager from "../../../framework/manager/LogsManager";
import RolesModel from "../model/RolesModel";
import RolesFunc from "../func/RolesFunc";
import { DataResourceType } from "../func/DataResourceFunc";
import PiecesModel from "../model/PiecesModel";
import TaskModel from "../model/TaskModel";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

export default class TaskConditionTrigger {
    /**任务条件：主线胜利 */
    static taskCondition_levelWin = 6;
    /**任务条件：看视频 */
    static taskCondition_videoCount = 11;
    /**任务条件：迷雾街区结算次数 */
    static taskCondition_fogResultCount = 12;
    /**任务条件：迷雾街区最大层数 */
    static taskCondition_fogHighLayer = 13;
    /**任务条件：完成每日任务数 */
    static taskCondition_dailyTaskCount = 19;
    /**任务条件：抽装备次数 */
    static taskCondition_equipCount = 20;
    /**任务条件：转盘数 */
    static taskCondition_turntable = 21;
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
            LogsManager.errorTag("fogPropError", "没有对应的任务类型:", type);
        } else {
            return this["checkTask_" + type](data)
        }
        return null

    }
    //noProcess 不显示计数
    /**通关主线关卡 */
    static checkTask_1(data) {
        var params = data.params;
        var level = UserModel.instance.getMaxBattleLevel();
        var targetLevel = Number(params[0][0]);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish, noProcess: 1 }
    }
    /**解锁角色 */
    static checkTask_2(data) {
        var params = data.params;
        var id = params[0][0];
        var isUnlock = RolesModel.instance.getIsHaveRole(id);
        var cur = isUnlock ? 1 : 0;
        return { cur: cur, target: 1, finish: cur }
    }
    /**升级角色 */
    static checkTask_3(data) {
        var params = data.params;
        var id = params[0][0];
        var targetLevel = Number(params[1][0]);
        var level = RolesModel.instance.getRoleLevelById(id);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish }
    }
    /**升星角色 */
    static checkTask_4(data) {
        var params = data.params;
        var id = params[0][0];
        var targetLevel = Number(params[1][0]);
        var level = RolesModel.instance.getRoleStarLevel(id);
        var finish = level >= targetLevel ? 1 : 0;
        return { cur: level, target: targetLevel, finish: finish }
    }
    /**为角色合成装备 */
    static checkTask_5(data) {
        var params = data.params;
        var id = params[0][0];
        var targetId = params[1][0];
        var equip = RolesModel.instance.getIsHaveEquip(id, targetId);
        var target;
        var cost = RolesFunc.instance.getCfgDatasByKey("Equip", targetId, "cost");
        for (var i = 0; i < cost.length; i++) {
            var costItem = cost[i].split(",");
            if (Number(costItem[0]) == DataResourceType.PIECE) {
                target = Number(costItem[2]);
                break;
            }
        }
        var cur = target;
        if (!equip) {
            cur = PiecesModel.instance.getPieceCount(costItem[1]);
        }
        var finish = equip ? 1 : 0;

        return { cur: cur, target: target, finish: equip }
    }
    /**主线关卡胜利 */
    static checkTask_6(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = TaskModel.instance.getTaskProcessByType(data.type, data.logicType);
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish }
    }
    /**解锁n个角色 */
    static checkTask_7(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = RolesModel.instance.getUnlockRole().length;
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish }
    }
    /**最大上阵角色达到n个 */
    static checkTask_8(data) {
        var params = data.params;
        var target = Number(params[0][0]);
        var cur = RolesModel.instance.getInLineRole().length;
        var finish = cur >= target ? 1 : 0;
        return { cur: cur, target: target, finish: finish }
    }
    /**拥有n个m级角色 */
    static checkTask_9(data) {
        var params = data.params;
        var targetCount = Number(params[0][0]);
        var targetLevel = Number(params[1][0]);
        var role = RolesModel.instance.getRolesList();
        var curCount = 0;
        for (var key in role) {
            var element = role[key];
            if (element.level >= targetLevel) {
                curCount += 1;
            }
        }
        var finish = curCount >= targetCount ? 1 : 0;
        return { cur: curCount, target: targetCount, finish: finish }
    }
    /**拥有n个m星角色 */
    static checkTask_10(data) {
        var params = data.params;
        var targetCount = Number(params[0][0]);
        var targetLevel = Number(params[1][0]);
        var role = RolesModel.instance.getRolesList();
        var curCount = 0;
        for (var key in role) {
            var element = role[key];
            var star = element.starLevel || 0;
            if (star >= targetLevel) {
                curCount += 1;
            }
        }
        var finish = curCount >= targetCount ? 1 : 0;
        return { cur: curCount, target: targetCount, finish: finish }
    }
    /**看视频n次 */
    static checkTask_11(data) {
        return this.checkTask_6(data)
    }
    /**迷雾街区结算n次 */
    static checkTask_12(data) {
        return this.checkTask_6(data)
    }
    /**迷雾街区最大达到n层 */
    static checkTask_13(data) {
        return this.checkTask_6(data)
    }
    /**完成n个每日任务 */
    static checkTask_19(data) {
        return this.checkTask_6(data)
    }
    /**抽装备n次 */
    static checkTask_20(data) {
        return this.checkTask_6(data)
    }
    /**使用转盘n次 */
    static checkTask_21(data) {
        return this.checkTask_6(data)
    }
}