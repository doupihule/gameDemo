import FogInstanceCell from "../instance/FogInstanceCell";
import FogEventData from "../data/FogEventData";
import FogFunc from "../../sys/func/FogFunc";
import FogModel from "../../sys/model/FogModel";

import FogConst from "../../sys/consts/FogConst";
import FogServer from "../../sys/server/FogServer";
import BattleLogicalControler from "../../battle/controler/BattleLogicalControler";
import BattleConst from "../../sys/consts/BattleConst";
import PassiveSkillData from "../../battle/data/PassiveSkillData";
import WindowManager from "../../../framework/manager/WindowManager";
import DataResourceConst from "../../sys/consts/DataResourceConst";

/**
 *道具触发器
 *
 */
export default class FogPropTrigger {
	/**道具逻辑类型：增加战斗能量上限 */
	public static Prop_type_AddEnergy = 1;
	/**道具逻辑类型：降低特定事件行动力消耗 */
	public static Prop_type_ReduceActCost = 2;
	/**道具逻辑类型：每驱散n团雾气恢复m点行动力 */
	public static Prop_type_RecoverAct = 3;
	/**道具逻辑类型：战斗中的全局数值加成 */
	public static Prop_type_AddBattlePassive = 4;
	/**道具逻辑类型：降低局内商店的商品购买价格 */
	public static Prop_type_ReduceBuyCost = 5;
	/**道具逻辑类型：增加战斗中获得的局内货币 */
	public static Prop_type_AddMoneyPer = 6;
	/**道具逻辑类型：提高结算时的奖励加成 */
	public static Prop_type_AddResultReward = 7;
	/**道具逻辑类型：完成特定事件后获得额外奖励 */
	public static Prop_type_AddExtraRewardByEvent = 8;
	/**道具逻辑类型：战斗开场时，获得额外角色助阵 */
	public static Prop_type_AddRoleHelp = 9;

	//道具类型：1 可升级 2 不可升级
	public static ITEM_TYPE_CANUP = 1;
	public static ITEM_TYPE_CANNOTUP = 2;

	//降低范围：1.所有事件  2.指定逻辑类型的事件 3.指定ID的事件
	public static ReduceAct_Type_AllEvent = 1;
	public static ReduceAct_Type_SameLogical = 2;
	public static ReduceAct_Type_SameEventId = 3;

	public static checkPropTriggerOnInstance(logicType, view) {
		var propData = FogModel.instance.getProp();
		//如果当前没有任何道具，直接返回
		if (!propData) return false;
		for (var id in propData) {
			var itemInfo = FogFunc.instance.getCfgDatas("Item", id);
			//有道具的逻辑类型等于当前类型
			if (itemInfo.logicType == logicType) {
				var func = this["runProp_" + logicType];
				if (!func) {
					LogsManager.errorTag("fogPropError", "没有对应的item类型:", logicType);
				} else {
					var itemData = FogFunc.instance.getCfgDatasByKey("ItemUpGrade", id, propData[id]);
					func.call(this, itemData, view);
				}
			}

		}

	}

	//执行第一个道具 增加战斗能量
	public static runProp_1(itemData, view) {
	}

	//执行第二个道具 降低特定事件行动力消耗
	public static runProp_2(itemData, view) {
		var ui = (view as FogEventData);
		var reducePer = ui.actReduce;
		//[type,id,reducePer]
		var params = itemData.params;
		for (var i = 0; i < params.length; i++) {
			var item = params[i];
			var type = Number(item[0]);
			var id = Number(item[1]);
			if (type == FogPropTrigger.ReduceAct_Type_AllEvent) {
				//全部事件
				reducePer *= (1 - Number(item[2] / 10000))
			} else if (type == FogPropTrigger.ReduceAct_Type_SameEventId) {
				//相同事件id
				if (Number(ui.eventId) == id) {
					reducePer *= (1 - Number(item[2] / 10000))
				}
			} else if (type == FogPropTrigger.ReduceAct_Type_SameLogical) {
				//相同事件逻辑id
				if (Number(ui.logicType) == id) {
					reducePer *= (1 - Number(item[2] / 10000))
				}
			}
		}
		ui.actReduce = reducePer;
	}

	//执行第仨个道具 每驱散n团雾气恢复m点行动力
	public static runProp_3(itemData, view) {
		var cell = (view as FogInstanceCell)
		var cellNum = Number(itemData.params[0][0]);
		var recoverNum = Number(itemData.params[1][0]);
		var count = FogModel.instance.getCountsById(FogConst.FOG_COUNT_OPENCELL);
		//如果当前开启的格子数量等于驱散数
		if (count >= cellNum) {
			//重置开启格子次数
			FogServer.delFogCount({type: FogConst.FOG_COUNT_OPENCELL})
			//加一次行动力
			FogServer.addSourceCount({type: DataResourceConst.ACT, count: recoverNum})
			//@zm 飘奖励
			var thisObj = WindowManager.getUIByName("FogMainUI");
			FogFunc.instance.flyResTween([[DataResourceConst.ACT, recoverNum]], cell.x - 40, cell.y + thisObj.cellCtn.y);
		}
	}

	//执行第四个道具 战斗中的全局数值加成
	public static runProp_4(itemData, view) {
		var params = itemData.params;
		var controler = (view as BattleLogicalControler)
		for (var i = 0; i < params.length; i++) {
			var id = params[i][0];
			var passive: PassiveSkillData = new PassiveSkillData(id, Number(itemData.level), controler.myHome, BattleConst.skill_kind_passive);
			controler.insterGlobalPassive(passive);
		}
	}

	//执行第五个道具 降低局内商店的商品购买价格
	public static runProp_5(itemData, view) {
	}

	//执行第六个道具 增加战斗中获得的局内货币
	public static runProp_6(itemData, view) {
		var ui = view;
		var params = itemData.params;
		ui.addPercent *= (1 + Number(params[0][0]) / 10000);
	}

	//执行第七个道具 提高结算时的奖励加成
	public static runProp_7(itemData, view) {
		var ui = (view)
		var params = itemData.params;
		ui.addPercent *= (1 + Number(params[0][0]) / 10000);
	}

	//执行第八个道具 完成特定事件后获得额外奖励
	public static runProp_8(itemData, view) {
		var cell = (view as FogInstanceCell)
		var ui = cell.eventData;
		var params = itemData.params;
		var reward = {};
		var isMatch = false
		for (var i = 0; i < params.length; i++) {
			var item = params[i];
			var type = Number(item[0]);
			var id = Number(item[1]);
			if (type == FogPropTrigger.ReduceAct_Type_AllEvent) {
				isMatch = true;
			} else if (type == FogPropTrigger.ReduceAct_Type_SameEventId) {
				//相同事件id
				if (Number(ui.eventId) == id) {
					isMatch = true;

				}
			} else if (type == FogPropTrigger.ReduceAct_Type_SameLogical) {
				//相同事件逻辑id
				if (Number(ui.logicType) == id) {
					isMatch = true;

				}
			}
			if (isMatch) {
				if (!reward[item[2]]) {
					reward[item[2]] = 0
				}
				reward[item[2]] += Number(item[3])
			}
		}
		var result = [];
		var rewardItem = [];
		for (var key in reward) {
			rewardItem = [];
			rewardItem.push(key)
			rewardItem.push(reward[key])
			result.push(rewardItem)
		}
		//同步奖励
		if (result.length > 0) {
			FogServer.getReward({reward: result});
			//@zm 飘奖励
			var thisObj = WindowManager.getUIByName("FogMainUI");
			FogFunc.instance.flyResTween(result, cell.x - 40, cell.y + thisObj.cellCtn.y);
		}
	}

	//执行第九个道具 战斗开场时，获得额外角色助阵
	public static runProp_9(itemData, view) {
		var params = itemData.params;
		var controler = (view as BattleLogicalControler)
		for (var i = 0; i < params.length; i++) {
			var item = params[i];
			controler.createMyRole(item[0], Number(item[1]), Number(item[2]), BattleConst.ROLETYPE_HELPROLE)
		}
	}


}  