import Client from "../../../framework/common/kakura/Client";
import RolesFunc from "../func/RolesFunc";
import RolesModel from "../model/RolesModel";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import {DataResourceType} from "../func/DataResourceFunc";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import UserModel from "../model/UserModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import BattleFunc from "../func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import PiecesModel from "../model/PiecesModel";

/* 
角色系统
 */
export default class RolesServer {

	static incomeCoin = 0;

	//英雄解锁
	static unlockRole(params: any, callBack: any, thisObj: any) {
		var upData = {};
		var deData = {};
		var role = {};

		var allRole = RolesModel.instance.getInLineRole();
		var unlockLine = GlobalParamsFunc.instance.getUnlockLineCount();
		//还能上阵的数量
		var leftCount = unlockLine - allRole.length;
		var item = BattleFunc.instance.getCfgDatas("Role", params.roleId)

		var info = item.unlockCondition;
		var temp = info[0].split(",");
		if (Number(temp[0]) == RolesFunc.ROLE_UNLOCK_TYPE_LEVEL) {
			//如果当前解锁等级等于当前过了的关卡并且还未解锁过此角色 解锁此角色
			if (Number(temp[1]) <= UserModel.instance.getMaxBattleLevel() && !RolesModel.instance.getIsHaveRole(params.roleId)) {
				role[params.roleId] = {
					"id": params.roleId,
					"level": 1,
				}
				if (leftCount > 0) {
					role[params.roleId] = {
						"id": params.roleId,
						"level": 1,
						"inLine": 1
					}

				} else {
					role[params.roleId] = {
						"id": params.roleId,
						"level": 1,
					}
				}

			}
		}
		upData["roles"] = role;

		//货币更新
		if (params.costType && params.costType == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.substract(UserModel.instance.getCoin(), BigNumUtils.round(params.costNum));
		}
		if (params.costType && params.costType == DataResourceType.GOLD) {
			var golds = UserModel.instance.costGold(BigNumUtils.round(params.costNum));
			upData["giftGold"] = golds[0];
			upData["gold"] = golds[1];
		}


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	//英雄升级
	static upgradeRole(params: any, callBack: any, thisObj: any) {
		// var params = {
		//     "roleId": this.oldRoleId,
		//     "costType": DataResourceType.COIN,
		//     "costNum": cost
		// };
		var upData = {};
		var ext = {};
		var extData = {};


		if (!params || !params.roleId) {
			return;
		}

		var roleId = params["roleId"];

		var updateLevel = 1;
		if (params.updateLevel) {
			updateLevel = params.updateLevel;
		}

		//货币更新
		if (params.costType && params.costType == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.substract(UserModel.instance.getCoin(), BigNumUtils.round(params.costNum));
		}
		if (params.costType && params.costType == DataResourceType.GOLD) {
			var golds = UserModel.instance.costGold(BigNumUtils.round(params.costNum));
			upData["giftGold"] = golds[0];
			upData["gold"] = golds[1];
		}

		//更新英雄等级
		var maxLevel;
		if (Number(roleId) == GlobalParamsFunc.instance.getDataNum("bornHomeId")) {
			maxLevel = GlobalParamsFunc.instance.getDataNum("flatMaxLevel");
		} else {
			maxLevel = GlobalParamsFunc.instance.getDataNum("roleMaxLevel");
		}
		var upLevel = Math.min(RolesModel.instance.getRoleLevelById(roleId) + updateLevel, maxLevel);
		ext[roleId] = {
			"level": upLevel,
			"id": roleId
		};
		upData["roles"] = ext;

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	/**更新角色上阵信息 */
	static upDataRoleInfo(data, callBack = null, thisObj = null) {
		var upData = {};
		//兼容有角色的id不存在了 原因未知
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var item = data[key];
				if (!item.id) {
					LogsManager.errorTag("errorId", "无效的角色id", item)
					item.id = key;
					data[key] = item;
				}
			}
		}
		upData["roles"] = data;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	/**合成装备 */
	static composeEquip(data, callBack = null, thisObj = null) {
		var upData = {};
		var role = {};
		var equip = {};
		var equipId = data.equipId;
		equip[equipId] = 1;
		role[data.roleId] = {};
		role[data.roleId]["equip"] = equip;
		upData["roles"] = role;
		var cost = RolesFunc.instance.getCfgDatasByKey("Equip", equipId, "cost")
		for (var i = 0; i < cost.length; i++) {
			var costItem = cost[i].split(",");
			if (Number(costItem[0]) == DataResourceType.COIN) {
				upData["coin"] = BigNumUtils.substract(UserModel.instance.getCoin(), costItem[1])
			} else if (Number(costItem[0]) == DataResourceType.GOLD) {
				upData["giftGold"] = BigNumUtils.substract(UserModel.instance.getGiftGold(), costItem[1])
			} else if (Number(costItem[0]) == DataResourceType.PIECE) {
				var count = PiecesModel.instance.getPieceCount(costItem[1]);
				upData["pieces"] = {};
				upData["pieces"][costItem[1]] = {
					count: count - Number(costItem[2])
				};
			}

		}
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	/**角色进化 */
	static roleEvolution(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var role = {};
		var deRole = {};
		//删除之前的装备
		deRole[data.roleId] = {
			equip: 1
		};
		deData["roles"] = deRole;
		role[data.roleId] = {};
		role[data.roleId]["starLevel"] = RolesModel.instance.getRoleStarLevel(data.roleId) + 1;
		upData["roles"] = role;
		var costItem = data.cost;
		if (costItem) {
			if (Number(costItem[0]) == DataResourceType.COIN) {
				upData["coin"] = BigNumUtils.substract(UserModel.instance.getCoin(), costItem[1])
			} else if (Number(costItem[0]) == DataResourceType.GOLD) {
				upData["giftGold"] = BigNumUtils.substract(UserModel.instance.getGiftGold(), costItem[1])
			}
		}
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}