"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogFunc_1 = require("../../sys/func/FogFunc");
const FogModel_1 = require("../../sys/model/FogModel");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const FogConst_1 = require("../../sys/consts/FogConst");
const FogServer_1 = require("../../sys/server/FogServer");
const DataResourceFunc_1 = require("../../sys/func/DataResourceFunc");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const PassiveSkillData_1 = require("../../battle/data/PassiveSkillData");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
/**
 *道具触发器
 *
 */
class FogPropTrigger {
    static checkPropTriggerOnInstance(logicType, view) {
        var propData = FogModel_1.default.instance.getProp();
        //如果当前没有任何道具，直接返回
        if (!propData)
            return false;
        for (var id in propData) {
            var itemInfo = FogFunc_1.default.instance.getCfgDatas("Item", id);
            //有道具的逻辑类型等于当前类型
            if (itemInfo.logicType == logicType) {
                var func = this["runProp_" + logicType];
                if (!func) {
                    LogsManager_1.default.errorTag("fogPropError", "没有对应的item类型:", logicType);
                }
                else {
                    var itemData = FogFunc_1.default.instance.getCfgDatasByKey("ItemUpGrade", id, propData[id]);
                    func.call(this, itemData, view);
                }
            }
        }
    }
    //执行第一个道具 增加战斗能量
    static runProp_1(itemData, view) {
        view.maxEnergy += Number(itemData.params[0][0]);
    }
    //执行第二个道具 降低特定事件行动力消耗
    static runProp_2(itemData, view) {
        var ui = view;
        var reducePer = ui.actReduce;
        //[type,id,reducePer]
        var params = itemData.params;
        for (var i = 0; i < params.length; i++) {
            var item = params[i];
            var type = Number(item[0]);
            var id = Number(item[1]);
            if (type == FogPropTrigger.ReduceAct_Type_AllEvent) {
                //全部事件
                reducePer *= (1 - Number(item[2] / 10000));
            }
            else if (type == FogPropTrigger.ReduceAct_Type_SameEventId) {
                //相同事件id
                if (Number(ui.eventId) == id) {
                    reducePer *= (1 - Number(item[2] / 10000));
                }
            }
            else if (type == FogPropTrigger.ReduceAct_Type_SameLogical) {
                //相同事件逻辑id
                if (Number(ui.logicType) == id) {
                    reducePer *= (1 - Number(item[2] / 10000));
                }
            }
        }
        ui.actReduce = reducePer;
    }
    //执行第仨个道具 每驱散n团雾气恢复m点行动力
    static runProp_3(itemData, view) {
        var cell = view;
        var cellNum = Number(itemData.params[0][0]);
        var recoverNum = Number(itemData.params[1][0]);
        var count = FogModel_1.default.instance.getCountsById(FogConst_1.default.FOG_COUNT_OPENCELL);
        //如果当前开启的格子数量等于驱散数
        if (count >= cellNum) {
            //重置开启格子次数
            FogServer_1.default.delFogCount({ type: FogConst_1.default.FOG_COUNT_OPENCELL });
            //加一次行动力
            FogServer_1.default.addSourceCount({ type: DataResourceFunc_1.DataResourceType.ACT, count: recoverNum });
            //@zm 飘奖励
            var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
            FogFunc_1.default.instance.flyResTween([[DataResourceFunc_1.DataResourceType.ACT, recoverNum]], cell.x - 40, cell.y + thisObj.cellCtn.y);
        }
    }
    //执行第四个道具 战斗中的全局数值加成
    static runProp_4(itemData, view) {
        var params = itemData.params;
        var controler = view;
        for (var i = 0; i < params.length; i++) {
            var id = params[i][0];
            var passive = new PassiveSkillData_1.default(id, Number(itemData.level), controler.myHome, BattleConst_1.default.skill_kind_passive);
            controler.insterGlobalPassive(passive);
        }
    }
    //执行第五个道具 降低局内商店的商品购买价格
    static runProp_5(itemData, view) {
        var ui = view;
        var params = itemData.params;
        ui.reducePer *= Number(params[0][0]) / 10000;
    }
    //执行第六个道具 增加战斗中获得的局内货币
    static runProp_6(itemData, view) {
        var ui = view;
        var params = itemData.params;
        ui.addPercent *= (1 + Number(params[0][0]) / 10000);
    }
    //执行第七个道具 提高结算时的奖励加成
    static runProp_7(itemData, view) {
        var ui = (view);
        var params = itemData.params;
        ui.addPercent *= (1 + Number(params[0][0]) / 10000);
    }
    //执行第八个道具 完成特定事件后获得额外奖励
    static runProp_8(itemData, view) {
        var cell = view;
        var ui = cell.eventData;
        var params = itemData.params;
        var reward = {};
        var isMatch = false;
        for (var i = 0; i < params.length; i++) {
            var item = params[i];
            var type = Number(item[0]);
            var id = Number(item[1]);
            if (type == FogPropTrigger.ReduceAct_Type_AllEvent) {
                isMatch = true;
            }
            else if (type == FogPropTrigger.ReduceAct_Type_SameEventId) {
                //相同事件id
                if (Number(ui.eventId) == id) {
                    isMatch = true;
                }
            }
            else if (type == FogPropTrigger.ReduceAct_Type_SameLogical) {
                //相同事件逻辑id
                if (Number(ui.logicType) == id) {
                    isMatch = true;
                }
            }
            if (isMatch) {
                if (!reward[item[2]]) {
                    reward[item[2]] = 0;
                }
                reward[item[2]] += Number(item[3]);
            }
        }
        var result = [];
        var rewardItem = [];
        for (var key in reward) {
            rewardItem = [];
            rewardItem.push(key);
            rewardItem.push(reward[key]);
            result.push(rewardItem);
        }
        //同步奖励
        if (result.length > 0) {
            FogServer_1.default.getReward({ reward: result });
            //@zm 飘奖励
            var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
            FogFunc_1.default.instance.flyResTween(result, cell.x - 40, cell.y + thisObj.cellCtn.y);
        }
    }
    //执行第九个道具 战斗开场时，获得额外角色助阵
    static runProp_9(itemData, view) {
        var params = itemData.params;
        var controler = view;
        for (var i = 0; i < params.length; i++) {
            var item = params[i];
            controler.createMyRole(item[0], Number(item[1]), Number(item[2]), BattleConst_1.default.ROLETYPE_HELPROLE);
        }
    }
}
exports.default = FogPropTrigger;
/**道具逻辑类型：增加战斗能量上限 */
FogPropTrigger.Prop_type_AddEnergy = 1;
/**道具逻辑类型：降低特定事件行动力消耗 */
FogPropTrigger.Prop_type_ReduceActCost = 2;
/**道具逻辑类型：每驱散n团雾气恢复m点行动力 */
FogPropTrigger.Prop_type_RecoverAct = 3;
/**道具逻辑类型：战斗中的全局数值加成 */
FogPropTrigger.Prop_type_AddBattlePassive = 4;
/**道具逻辑类型：降低局内商店的商品购买价格 */
FogPropTrigger.Prop_type_ReduceBuyCost = 5;
/**道具逻辑类型：增加战斗中获得的局内货币 */
FogPropTrigger.Prop_type_AddMoneyPer = 6;
/**道具逻辑类型：提高结算时的奖励加成 */
FogPropTrigger.Prop_type_AddResultReward = 7;
/**道具逻辑类型：完成特定事件后获得额外奖励 */
FogPropTrigger.Prop_type_AddExtraRewardByEvent = 8;
/**道具逻辑类型：战斗开场时，获得额外角色助阵 */
FogPropTrigger.Prop_type_AddRoleHelp = 9;
//道具类型：1 可升级 2 不可升级
FogPropTrigger.ITEM_TYPE_CANUP = 1;
FogPropTrigger.ITEM_TYPE_CANNOTUP = 2;
//降低范围：1.所有事件  2.指定逻辑类型的事件 3.指定ID的事件
FogPropTrigger.ReduceAct_Type_AllEvent = 1;
FogPropTrigger.ReduceAct_Type_SameLogical = 2;
FogPropTrigger.ReduceAct_Type_SameEventId = 3;
//# sourceMappingURL=FogPropTrigger.js.map