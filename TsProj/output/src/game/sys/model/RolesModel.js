"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Message_1 = require("../../../framework/common/Message");
const RoleEvent_1 = require("../event/RoleEvent");
const UserModel_1 = require("./UserModel");
const RolesFunc_1 = require("../func/RolesFunc");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const UserExtModel_1 = require("./UserExtModel");
const BattleFunc_1 = require("../func/BattleFunc");
const BattleConst_1 = require("../consts/BattleConst");
const TalentFunc_1 = require("../func/TalentFunc");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const FogModel_1 = require("./FogModel");
class RolesModel extends BaseModel_1.default {
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
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new RolesModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
        Message_1.default.instance.send(RoleEvent_1.default.ROLE_CHANGE, d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
        Message_1.default.instance.send(RoleEvent_1.default.ROLE_CHANGE);
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
                var info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", key));
                if (info.kind != BattleConst_1.default.LIFE_JIDI && item.inLine) {
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
        var role = FogModel_1.default.instance.getLine();
        for (var id in role) {
            var info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", id));
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
        var unlockLevel = RolesFunc_1.default.instance.getUnlockLevel(roleId);
        if (unlockLevel == 0) {
            return true;
        }
        return false;
    }
    checkRoleLevelunlock(roleId) {
        var needLevel = RolesFunc_1.default.instance.getUnlockLevel(roleId);
        var curLevel = UserExtModel_1.default.instance.getMaxLevel();
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
            var info = BattleFunc_1.default.instance.getCfgDatas("Role", roleId);
            if (info.kind != BattleConst_1.default.LIFE_JIDI && item.inLine) {
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
        var levelPay = RolesFunc_1.default.instance.getRoleUpCostById(roleId, roleLevel);
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("roleMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            return canUpgrade;
        }
        if (levelPay.length != 0) {
            for (var i = 0; i < levelPay.length; i++) {
                var temp = levelPay[i].split(",");
                switch (Number(temp[0])) {
                    case DataResourceFunc_1.DataResourceType.COIN:
                        if (BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), temp[1])) {
                            canUpgrade = true;
                        }
                        break;
                    case DataResourceFunc_1.DataResourceType.GOLD:
                        if (BigNumUtils_1.default.compare(UserModel_1.default.instance.getGold(), temp[1])) {
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
        var homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        var roleLevel = RolesModel.instance.getRoleLevelById(homeId);
        //判断是否已经满级
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("roleMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            return false;
        }
        //判断能否升级
        var levelPay = RolesFunc_1.default.instance.getRoleUpCostById(homeId, roleLevel);
        var levelPayArr = levelPay[0].split(",");
        if (Number(levelPayArr[0]) == DataResourceFunc_1.DataResourceType.COIN) { //金币
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(levelPayArr[1]))) {
                return false;
            }
            else {
                return true;
            }
        }
        else if (Number(levelPayArr[0]) == DataResourceFunc_1.DataResourceType.GOLD) { //钻石
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGold(), BigNumUtils_1.default.round(levelPayArr[1]))) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }
    //判断是否可以升级天赋
    checkTalentRedPoint() {
        //全部满级
        var isAllLevelFull = TalentFunc_1.default.instance.checkTalentSkillLevelFull();
        if (isAllLevelFull) {
            return false;
        }
        //关卡条件不够
        var canUpdate = TalentFunc_1.default.instance.checkTalentSkillUpdate();
        if (canUpdate != true) {
            return false;
        }
        //判断是否免费升级
        var talentUpgradeNum = UserExtModel_1.default.instance.getTalentSkillUpgradeNum();
        if (talentUpgradeNum >= GlobalParamsFunc_1.default.instance.getDataNum("talentVideoLevelUpOpenNub")) {
            if (!UserExtModel_1.default.instance.getIsFreeUpgradeTalentInGame()) {
                return false;
            }
            return true;
        }
        else {
            //货币升级
            var updateInfo = TalentFunc_1.default.instance.getTalentUpdateInfo(UserExtModel_1.default.instance.getTalentSkillUpgradeNum() + 1);
            var costArr = updateInfo.talentCost[0].split(',');
            switch (Number(costArr[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), costArr[1])) {
                        return false;
                    }
                    else {
                        return true;
                    }
                case DataResourceFunc_1.DataResourceType.GOLD:
                    if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGold(), costArr[1])) {
                        return false;
                    }
                    else {
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
        if (!this._data || !this._data[id])
            return 0;
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
        if (!this._data || !this._data[id] || !this._data[id]["equip"])
            return null;
        return this._data[id].equip;
    }
    /**
     * 获取是否拥有某装备
     * @param roleId 角色id
     * @param equipId 装备id
     */
    getIsHaveEquip(roleId, equipId) {
        //当前星级五级都拥有了
        var roleStar = this.getRoleStarLevel(roleId);
        if (roleStar >= 5)
            return true;
        var equip = this.getRoleEquip(roleId);
        if (!equip || !equip[equipId]) {
            var level = RolesFunc_1.default.instance.getEquipStar(roleId, equipId);
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
                var info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", key));
                if (info.kind != BattleConst_1.default.LIFE_JIDI) {
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
                info = TableUtils_1.default.copyOneTable(BattleFunc_1.default.instance.getCfgDatas("Role", key));
                if (info.kind != BattleConst_1.default.LIFE_JIDI) {
                    list.push(key);
                }
            }
        }
        return list;
    }
}
exports.default = RolesModel;
//# sourceMappingURL=RolesModel.js.map