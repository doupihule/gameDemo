import BaseModel from "./BaseModel";
import Message from "../../../framework/common/Message";
import RoleEvent from "../event/RoleEvent";
import UserModel from "./UserModel";
import RolesFunc from "../func/RolesFunc";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import UserExtModel from "./UserExtModel";
import BattleFunc from "../func/BattleFunc";
import BattleConst from "../consts/BattleConst";
import TalentFunc from "../func/TalentFunc";
import TableUtils from "../../../framework/utils/TableUtils";
import FogModel from "./FogModel";
import DataResourceConst from "../consts/DataResourceConst";

export default class RolesModel extends BaseModel {
	// 英雄列表：user.roles
	// {
	//     "1":{// 英雄id

	//         level:2,         //英雄等级
	//         upCostCoin: "1000", // 升级消耗
	//         skillPoint:10     //技能点
	//         energy:10         //能量点
	//         passiveSkills:{   //被动技能
	//             "1":2,        //被动技能id：被动技能等级
	//             "2":3,
	//         }
	//         normalSkills:{   //普通技能
	//              "1":2,//id=>level
	//              "2":3,
	//         }
	//         energySkill：{            //主动技能
	//              level:2,             //主动技能等级
	//         },
	//         advance:1   // 进阶次数
	//      } ,
	// }

	public constructor() {
		super();
	}

	//单例
	private static _instance: RolesModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new RolesModel();
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
		Message.instance.send(RoleEvent.ROLE_CHANGE, d);
	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);
		Message.instance.send(RoleEvent.ROLE_CHANGE);
	}

	//获取玩家所有的英雄
	getRolesList() {
		return this._data || {};
	}

	//获取玩家某个英雄
	getRoleById(roleId) {
		if (!this._data || !this._data[roleId]) {
			return {};
		}
		return this._data[roleId];
	}

	//获取英雄进阶次数

	/***********************zm********************** */
	//获取是否拥有某角色
	getIsHaveRole(id) {
		if (!this._data || !this._data[id]) {
			return false;
		}
		return true;
	}

	//获取玩家对应英雄的等级
	getRoleLevelById(roleId) {
		if (!this._data || !this._data[roleId] || !this._data[roleId].level) {
			return 1;
		}
		return this._data[roleId].level;
	}

	/**获取在阵上的角色 */
	getInLineRole() {
		var list = [];
		var data = this._data;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var item = data[key];
				var info = TableUtils.copyOneTable(BattleFunc.instance.getCfgDatas("Role", key));
				if (info.kind != BattleConst.LIFE_JIDI && item.inLine) {
					info.level = item.level || 1;
					list.push(info);
				}
			}
		}
		list.sort(this.sortRoleQual);
		return list;
	}

	sortRoleQual(a, b) {
		var big = b.quality - a.quality;
		if (big == 0) {
			big = b.level - a.level;
		}
		if (big == 0) {
			big = b.id - a.id;
		}
		return big;
	}

	/**获取迷雾上阵角色 */
	getFogRole() {
		var list = [];
		var role = FogModel.instance.getLine();
		for (var id in role) {
			var info = TableUtils.copyOneTable(BattleFunc.instance.getCfgDatas("Role", id));
			info.level = this.getRoleLevelById(id);
			list.push(info);
		}
		list.sort(this.sortRoleQual);
		return list;
	}

	//判断角色是否已经解锁
	checkRoleUnlock(roleId) {
		var data = this._data;
		if (data.hasOwnProperty(roleId)) {
			return true;
		}

		var unlockLevel = RolesFunc.instance.getUnlockLevel(roleId);
		if (unlockLevel == 0) {
			return true;
		}

		return false;
	}

	checkRoleLevelunlock(roleId) {
		var needLevel = RolesFunc.instance.getUnlockLevel(roleId);
		var curLevel = UserExtModel.instance.getMaxLevel();

		if (Number(needLevel) > Number(curLevel)) {
			return false;
		}
		return true;
	}


	//判断角色是否上阵
	checkRolInLine(roleId) {
		var list = [];
		var data = this._data;
		if (data.hasOwnProperty(roleId)) {
			var item = data[roleId];
			var info = BattleFunc.instance.getCfgDatas("Role", roleId);
			if (info.kind != BattleConst.LIFE_JIDI && item.inLine) {
				return true;
			}
		}

		return false;
	}

	//判断角色是否可以升级
	checkRoleUpgrade(roleId) {
		if (!RolesModel.instance.checkRoleUnlock(roleId)) {
			return false;
		}
		var canUpgrade = false;
		var roleLevel = this.getRoleLevelById(roleId);
		var levelPay = RolesFunc.instance.getRoleUpCostById(roleId, roleLevel);

		var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("roleMaxLevel");
		if (roleLevel >= roleMaxLevel) {
			return canUpgrade;
		}

		if (levelPay.length != 0) {
			for (var i = 0; i < levelPay.length; i++) {
				var temp = levelPay[i].split(",");
				switch (Number(temp[0])) {
					case DataResourceConst.COIN:
						if (BigNumUtils.compare(UserModel.instance.getCoin(), temp[1])) {
							canUpgrade = true;
						}
						break;
					case DataResourceConst.GOLD:
						if (BigNumUtils.compare(UserModel.instance.getGold(), temp[1])) {
							canUpgrade = true;
						}
						break;
				}
			}
		}
		return canUpgrade;
	}

	//判断是否可以升级基地
	checkFlatRedPoint() {
		var homeId = GlobalParamsFunc.instance.getDataNum("bornHomeId");
		var roleLevel = RolesModel.instance.getRoleLevelById(homeId);

		//判断是否已经满级
		var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("roleMaxLevel");
		if (roleLevel >= roleMaxLevel) {
			return false;
		}

		//判断能否升级
		var levelPay = RolesFunc.instance.getRoleUpCostById(homeId, roleLevel);
		var levelPayArr = levelPay[0].split(",");


		if (Number(levelPayArr[0]) == DataResourceConst.COIN) {		//金币
			if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(levelPayArr[1]))) {
				return false;
			} else {
				return true;
			}

		} else if (Number(levelPayArr[0]) == DataResourceConst.GOLD) {		//钻石
			if (!BigNumUtils.compare(UserModel.instance.getGold(), BigNumUtils.round(levelPayArr[1]))) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}

	//判断是否可以升级天赋
	checkTalentRedPoint() {
		//全部满级
		var isAllLevelFull = TalentFunc.instance.checkTalentSkillLevelFull();
		if (isAllLevelFull) {
			return false;
		}

		//关卡条件不够
		var canUpdate = TalentFunc.instance.checkTalentSkillUpdate();
		if (canUpdate != true) {
			return false;
		}

		//判断是否免费升级
		var talentUpgradeNum = UserExtModel.instance.getTalentSkillUpgradeNum();
		if (talentUpgradeNum >= GlobalParamsFunc.instance.getDataNum("talentVideoLevelUpOpenNub")) {
			if (!UserExtModel.instance.getIsFreeUpgradeTalentInGame()) {
				return false;
			}
			return true;
		} else {
			//货币升级
			var updateInfo = TalentFunc.instance.getTalentUpdateInfo(UserExtModel.instance.getTalentSkillUpgradeNum() + 1);
			var costArr = updateInfo.talentCost[0].split(',');

			switch (Number(costArr[0])) {
				case DataResourceConst.COIN:
					if (!BigNumUtils.compare(UserModel.instance.getCoin(), costArr[1])) {
						return false;
					} else {
						return true;
					}
				case DataResourceConst.GOLD:

					if (!BigNumUtils.compare(UserModel.instance.getGold(), costArr[1])) {
						return false;
					} else {
						return true;
					}
			}
			return false;
		}
	}

	/**
	 * 获取角色星级
	 * @param id  角色id
	 */
	getRoleStarLevel(id) {
		if (!this._data || !this._data[id]) return 0;
		return this._data[id].starLevel || 0;
	}

	// {
	//     1010:{
	//         id:1010,
	//         level:1,
	//         starLevel:1,
	//         equip:{
	//             100:1,
	//             101:1,
	//         }
	//     }
	// }
	/**
	 * 获取当前已合成装备
	 * @param id
	 */
	getRoleEquip(id) {
		if (!this._data || !this._data[id] || !this._data[id]["equip"]) return null;
		return this._data[id].equip
	}

	/**
	 * 获取是否拥有某装备
	 * @param roleId 角色id
	 * @param equipId 装备id
	 */
	getIsHaveEquip(roleId, equipId) {
		//当前星级五级都拥有了
		var roleStar = this.getRoleStarLevel(roleId)
		if (roleStar >= 5) return true;

		var equip = this.getRoleEquip(roleId);
		if (!equip || !equip[equipId]) {
			var level = RolesFunc.instance.getEquipStar(roleId, equipId);
			if (level <= roleStar) {
				return true;
			}
			{
				return false;
			}
		}
		return true;
	}

	/**获取解锁的角色 */
	getUnlockRole() {
		var list = [];
		var data = this._data;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var item = data[key];
				var info = TableUtils.copyOneTable(BattleFunc.instance.getCfgDatas("Role", key));
				if (info.kind != BattleConst.LIFE_JIDI) {
					list.push(info);
				}
			}
		}
		return list;
	}

	/**获取解锁的角色 */
	getUnlockRoles() {
		var list = [];
		var data = this._data;
		var info;
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				info = TableUtils.copyOneTable(BattleFunc.instance.getCfgDatas("Role", key));
				if (info.kind != BattleConst.LIFE_JIDI) {
					list.push(key);
				}
			}
		}
		return list;
	}
}
