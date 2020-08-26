"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleType = void 0;
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const UserExtModel_1 = require("../model/UserExtModel");
const RolesModel_1 = require("../model/RolesModel");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const BattleFunc_1 = require("./BattleFunc");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("./ShareTvOrderFunc");
const DataResourceFunc_1 = require("./DataResourceFunc");
const UserModel_1 = require("../model/UserModel");
const PiecesModel_1 = require("../model/PiecesModel");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const BattleConst_1 = require("../consts/BattleConst");
class RoleType {
}
exports.RoleType = RoleType;
RoleType.ROLE = 1;
RoleType.HERO = 2;
/**角色相关 */
class RolesFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Role_json" },
            { name: "TranslateRole_json" },
            { name: "RoleUpdate_json" },
            { name: "RoleStar_json" },
            { name: "EquipMaterial_json" },
            { name: "Equip_json" },
            { name: "Comment_json" },
            { name: "RoleComment_json" },
            { name: "TranslateComment_json" }
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new RolesFunc();
        }
        return this._instance;
    }
    getAllRole() {
        return this.getAllCfgData("Role_json");
    }
    getRoleLevelsById(id) {
        return this.getCfgDatas("Role_json", id);
    }
    getRoleInfoById(id) {
        return this.getCfgDatas("Role_json", id);
    }
    getRoleById(id, level = 1) {
        return this.getCfgDatasByKey("Role_json", id, level);
    }
    getRoleDataById(id, id1) {
        return this.getCfgDatasByKey("Role_json", id, id1);
    }
    getRoleUpCostById(id, level) {
        return this.getCfgDatasByMultyKey("RoleUpdate_json", id, level, "levelPay");
    }
    getRoleSizeById(id, level) {
        return this.getCfgDatasByMultyKey("RoleUpdate_json", id, level, "size");
    }
    getRoleUpdateInfo(id, id1) {
        return this.getCfgDatasByKey("RoleUpdate_json", id, id1);
    }
    /**根据id判断是否解锁,true未解锁  */
    getIslockById(id) {
        var data = this.getCfgDatas("Role_json", id);
        if (data.unlockLevel) {
            var param = data.unlockLevel[0].split(",");
            if (param[0] == "1") {
                //关卡解锁
                var curLevel = UserExtModel_1.default.instance.getMaxLevel();
                if (curLevel >= Number(param[1])) {
                    return false;
                }
            }
            return param[1];
        }
        return false;
    }
    //获取英雄进阶消耗信息
    getRoleAdvanceCost(id) {
        return this.getCfgDatas("HeroAdvance_json", id);
    }
    getMaxLevel(id) {
        // return 1;
        var roleLevels = this.getCfgDatas("Role_json", id);
        var level = 0;
        for (var index in roleLevels) {
            level++;
        }
        return level;
    }
    getRoleRandom() {
        return this.getAllCfgData("RoleRandom_json");
    }
    getRoleRandomById(id) {
        return this.getCfgDatas("RoleRandom_json", id);
    }
    getBattleRoleIcon(icon) {
        return "uisource/heroicon/heroicon/" + icon + ".png";
    }
    //获取角色的解锁关卡
    getUnlockLevel(roleId) {
        var unlockLevel = 0;
        var unlockCondition = this.getCfgDatasByKey("Role_json", roleId, "unlockCondition");
        if (unlockCondition.length != 0) {
            for (var i = 0; i < unlockCondition.length; i++) {
                var temp = unlockCondition[i].split(",");
                if (Number(temp[0]) == RolesFunc.ROLE_UNLOCK_TYPE_LEVEL) {
                    unlockLevel = Number(temp[1]);
                    break;
                }
            }
        }
        return unlockLevel;
    }
    //获取角色解锁的条件
    checkIsVideoUnlockRole(roleId) {
        var unlockMoney = [];
        var unlockCondition = this.getCfgDatasByKey("Role_json", roleId, "unlockCondition");
        if (unlockCondition.length >= 2) {
            if (Number(unlockCondition[1].split(",")[0]) != -1) {
                return false;
            }
            //判断是否有视频或者分享
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_UNLOCK_ROLE);
            if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                return false;
            }
            return true;
        }
        return false;
    }
    //获取角色解锁需要的货币
    getUnlockMoney(roleId) {
        var unlockMoney = [];
        var unlockCondition = this.getCfgDatasByKey("Role_json", roleId, "unlockCondition");
        if (unlockCondition.length == 2 && Number(unlockCondition[1].split(",")[0]) != -1) {
            unlockMoney = [Number(unlockCondition[1].split(",")[0]), Number(unlockCondition[1].split(",")[1])];
        }
        else if (unlockCondition.length == 3 && Number(unlockCondition[1].split(",")[0]) == -1) {
            unlockMoney = [Number(unlockCondition[2].split(",")[0]), Number(unlockCondition[2].split(",")[1])];
        }
        return unlockMoney;
    }
    //获取角色升级需要的货币
    getUpgradeCost(roleId, level) {
        var levelPay = this.getCfgDatasByMultyKey("RoleUpdate_json", roleId, level, "levelPay");
        var upgradeMoney = [Number(levelPay[0].split(",")[0]), Number(levelPay[0].split(",")[1])];
        return upgradeMoney;
    }
    /**
     * 设置角色说话
     * @param id  角色id
     * @param pos 说话的位置 结算/布阵
     * @param txt 改变的文本
     * @param thisObj 谁添加的定时器
     */
    setRoleSpeak(id, pos, txt, thisObj) {
        var interval = 3000;
        var roleInfo = BattleFunc_1.default.instance.getCfgDatas("Role", id);
        var speak = [""];
        if (pos == RolesFunc.ROLE_SPEAK_RESULT) {
            interval = GlobalParamsFunc_1.default.instance.getDataNum("settlementSpeakInterval");
            speak = roleInfo.settlementSpeak;
        }
        else if (pos == RolesFunc.ROLE_SPEAK_Detail) {
            interval = GlobalParamsFunc_1.default.instance.getDataNum("preSpeak");
            speak = roleInfo.settlementSpeak;
        }
        else if (pos == RolesFunc.ROLE_SPEAK_WORK) {
            interval = GlobalParamsFunc_1.default.instance.getDataNum("workSpeakInterval");
            speak = GlobalParamsFunc_1.default.instance.getDataArray("workCompanySpeak");
        }
        var index = 0;
        txt.text = TranslateFunc_1.default.instance.getTranslate(speak[index]);
        index = index + 1 > speak.length - 1 ? 0 : index + 1;
        var timeCode = TimerManager_1.default.instance.add(() => {
            txt.text = TranslateFunc_1.default.instance.getTranslate(speak[index]);
            index = index + 1 > speak.length - 1 ? 0 : index + 1;
        }, thisObj, interval);
        return timeCode;
    }
    /**获取本关怪物id */
    getLevelMonsterArr(levelId) {
        var enemyArr = [];
        var enemyIdArr = [];
        var wave = BattleFunc_1.default.instance.getCfgDatasByKey("Level", levelId, "levelWave");
        for (var i = 0; i < wave.length; i++) {
            var info = wave[i].split(",");
            var monsterInfo = BattleFunc_1.default.instance.getCfgDatasByKey("LevelWave", info[0], "waveMap");
            for (var j = 0; j < monsterInfo.length; j++) {
                var item = monsterInfo[j].split(",");
                var id = item[0];
                if (enemyIdArr.indexOf(id) == -1) {
                    var data = {};
                    data = {
                        id: id,
                        level: Number(item[2]),
                        starLevel: Number(item[3])
                    };
                    enemyIdArr.push(id);
                    enemyArr.push(data);
                }
            }
        }
        enemyArr.splice(6, enemyArr.length - 6);
        return enemyArr;
    }
    /**
     * 添加星级图片
     * @param parnet 容器 类型是Image
     * @param id  角色id
     */
    addStarImg(parnet, id, width = 44, height = 43, star = null) {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (UserModel_1.default.instance.getMaxBattleLevel() < unlock) {
            return;
        }
        if (parnet.numChildren == 0) {
            for (var i = 0; i < 5; i++) {
                var img = new Laya.Image("uisource/common/common/equip_image_xing2.png");
                img.width = width;
                img.height = height;
                img.x = i * width;
                parnet.addChild(img);
            }
        }
        var starLevel = star;
        if (!starLevel) {
            starLevel = RolesModel_1.default.instance.getRoleStarLevel(id);
        }
        for (var i = 0; i < parnet.numChildren; i++) {
            var item = parnet.getChildAt(i);
            if (i < starLevel) {
                item.skin = "uisource/common/common/equip_image_xing1.png";
            }
            else {
                item.skin = "uisource/common/common/equip_image_xing2.png";
            }
        }
    }
    /**
     * 获取装备状态
     * @param roleId
     * @param equipId
     */
    getEquipState(roleId, equipId, ignoreCost = false) {
        var isHave = RolesModel_1.default.instance.getIsHaveEquip(roleId, equipId);
        if (isHave)
            return RolesFunc.STATE_OWN;
        var result = RolesFunc.STATE_CANCOMPOSE;
        //判断碎片和钱是否足够
        var cost = this.getCfgDatasByKey("Equip", equipId, "cost");
        for (var i = 0; i < cost.length; i++) {
            var costItem = cost[i].split(",");
            if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.COIN && !ignoreCost) {
                if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), costItem[1])) {
                    result = RolesFunc.STATE_NOEQUIP;
                    break;
                }
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.GOLD && !ignoreCost) {
                if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), costItem[1])) {
                    result = RolesFunc.STATE_NOEQUIP;
                    break;
                }
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
                var count = PiecesModel_1.default.instance.getPieceCount(costItem[1]);
                if (count < Number(costItem[2])) {
                    result = RolesFunc.STATE_NOEQUIP;
                    break;
                }
            }
        }
        return result;
    }
    /**获取某装备的要求星级 */
    getEquipStar(role, equip) {
        var data = this.getCfgDatas("RoleStar", role);
        var level;
        for (var key in data) {
            var info = data[key];
            if (info.equipId.indexOf(equip + "") != -1) {
                level = Number(key);
                break;
            }
        }
        return level;
    }
    //当前属性纯数值
    getAttrNumByLevel(attId, roleId, level = null, starLevel = null, isBattle = true, firstStar = null, equip = null) {
        if (level == null) {
            level = RolesModel_1.default.instance.getRoleLevelById(roleId);
        }
        //基础
        var baseAtt = this.getCfgDatasByMultyKey("RoleUpdate", roleId, level, "attribute");
        baseAtt = BattleFunc_1.default.instance.turnPropArrToTable(baseAtt);
        //装备加成
        var equipAdd = 0;
        //星级加成
        var starAdd = 0;
        var result = 0;
        var passAdNum = 0;
        var passAdPer = 0;
        if (starLevel == null) {
            starLevel = RolesModel_1.default.instance.getRoleStarLevel(roleId);
        }
        if (isBattle || RolesModel_1.default.instance.checkRoleUnlock(roleId)) {
            if (!equip) {
                equip = RolesModel_1.default.instance.getRoleEquip(roleId);
            }
            //先把当前拥有的装备的属性加上
            if (equip && Object.keys(equip).length > 0) {
                for (var key in equip) {
                    if (equip.hasOwnProperty(key)) {
                        var att = this.getCfgDatasByKey("Equip", key, "attribute");
                        att = BattleFunc_1.default.instance.turnPropArrToTable(att);
                        equipAdd += Number(att[attId] && att[attId][0]) || 0;
                    }
                }
            }
            //小于当前星级的装备加成
            var roleStar = this.getCfgDatas("RoleStar", roleId);
            for (var key in roleStar) {
                if (roleStar.hasOwnProperty(key)) {
                    var item = roleStar[key];
                    if (item.equipId) {
                        if (item.star <= starLevel) {
                            for (var i = 0; i < item.equipId.length; i++) {
                                var itematt = this.getCfgDatasByKey("Equip", item.equipId[i], "attribute");
                                itematt = BattleFunc_1.default.instance.turnPropArrToTable(itematt);
                                equipAdd += Number(itematt[attId] && itematt[attId][0]) || 0;
                            }
                        }
                    }
                }
            }
        }
        //是否额外指定星级
        if (firstStar == null) {
            firstStar = starLevel;
        }
        if (firstStar != 0) {
            //星级加成
            var starAtt = this.getCfgDatasByMultyKey("RoleStar", roleId, firstStar, "attribute");
            starAtt = BattleFunc_1.default.instance.turnPropArrToTable(starAtt);
            starAdd += Number(starAtt[attId] && starAtt[attId][0]) || 0;
            //星级的被动中的属性加成 不计算战斗中的 战斗中额外计算
            if (!isBattle) {
                var passiveSkill = this.getRolePassiveSkill(roleId, firstStar);
                if (passiveSkill.length > 0) {
                    for (var i = 0; i < passiveSkill.length; i++) {
                        var data = BattleFunc_1.default.instance.getCfgDatas("PassiveSkill", passiveSkill[i]);
                        var param = data.effectParams;
                        //判断是否有改变角色属性的被动
                        if (data.effectType == BattleConst_1.default.passive_effect_attr) {
                            for (var j = 0; j < param.length; j++) {
                                var item = param[j];
                                if (item[0] == attId) {
                                    passAdNum = passAdNum + Number(item[1]);
                                    passAdPer = passAdPer + Number(item[2]);
                                }
                            }
                        }
                    }
                }
            }
        }
        result = (1 + passAdPer / 10000) * (Number(baseAtt[attId] && baseAtt[attId][0]) || 0) + equipAdd + starAdd + passAdNum;
        return result;
    }
    /**获取属性显示 文本格式 */
    getAttShowTxt(attId, roleId, level, starLevel, inBattle = false, firstStar = null) {
        var result = this.getAttrNumByLevel(attId, roleId, level, starLevel, inBattle, firstStar);
        var style = BattleFunc_1.default.getPropStyle(attId);
        if (style == BattleConst_1.default.PROPSTYLE_NUM) {
            return Math.floor(result) + "";
        }
        else if (style == BattleConst_1.default.PROPSTYLE_RATIO) {
            return result / 100 + "%";
        }
    }
    /**
     * 获取一个角色的所有被动
     * @param id
     * @param starLevel
     */
    getRolePassiveSkill(id, starLevel) {
        var idArr = [];
        var allInfo = this.getCfgDatas("RoleStar", id);
        for (var key in allInfo) {
            if (allInfo.hasOwnProperty(key)) {
                var item = allInfo[key];
                if (starLevel >= item.star && item.passiveSkill) {
                    for (var i = 0; i < item.passiveSkill.length; i++) {
                        idArr.push(item.passiveSkill[i]);
                    }
                }
            }
        }
        return idArr;
    }
    getEquipIcon(icon) {
        return "uisource/equipicon/equipicon/" + icon + ".png";
    }
    //设置角色局外的被动效果
    setPassiveSkillEffect(id, type, result) {
        var level = RolesModel_1.default.instance.getRoleStarLevel(id);
        var skill = this.getRolePassiveSkill(id, level);
        if (skill.length > 0) {
            for (var i = 0; i < skill.length; i++) {
                var data = BattleFunc_1.default.instance.getCfgDatas("PassiveSkill", skill[i]);
                //判断是否有改变角色技能的被动
                if (data.effectType == type) {
                    var num = Number(data.effectParams[0]);
                    result += num;
                }
            }
        }
        return result;
    }
    /**设置能量消耗 */
    setEnergyCost(id, cost) {
        return this.setPassiveSkillEffect(id, BattleConst_1.default.passive_effect_changeEnergeCost, cost);
    }
    //获取所有角色的战力
    getAllRoleForce() {
        var role = RolesModel_1.default.instance.getData();
        var result = 0;
        for (var key in role) {
            if (role.hasOwnProperty(key)) {
                var item = role[key];
                result += this.getRoleForceById(item);
            }
        }
        RolesFunc.nowForce = result;
        return result;
    }
    /**根据角色获取战力 */
    getRoleForceById(data) {
        var id = data.id;
        var lastForce = 0;
        //角色战力
        var roleForce = RolesFunc.instance.getCfgDatasByMultyKey("RoleUpdate", id, data.level || 1, "power");
        var starForce = 0;
        var equipForce = 0;
        var starLevel = Number(data.starLevel) || 0;
        //星级战力
        if (data.starLevel) {
            starForce = RolesFunc.instance.getCfgDatasByMultyKey("RoleStar", id, data.starLevel, "power");
            //小于当前星级的装备加成
            var roleStar = this.getCfgDatas("RoleStar", id);
            for (var key in roleStar) {
                if (roleStar.hasOwnProperty(key)) {
                    var item = roleStar[key];
                    if (item.equipId) {
                        if (item.star <= starLevel) {
                            for (var i = 0; i < item.equipId.length; i++) {
                                equipForce += this.getCfgDatasByKey("Equip", item.equipId[i], "power");
                            }
                        }
                    }
                }
            }
        }
        var equip = RolesModel_1.default.instance.getRoleEquip(id);
        //先把当前拥有的装备的属性加上
        if (equip && Object.keys(equip).length > 0) {
            for (var key in equip) {
                if (equip.hasOwnProperty(key)) {
                    equipForce += this.getCfgDatasByKey("Equip", key, "power");
                }
            }
        }
        return roleForce + starForce + equipForce;
    }
    /**获取所有的助阵英雄 */
    getHelpRoleTab() {
        if (!this.helpRoleTab) {
            this.helpRoleTab = [];
            var cfg = this.getAllRole();
            for (var key in cfg) {
                var item = cfg[key];
                if (item.tryParams) {
                    this.helpRoleTab.push(key + "," + item.tryParams);
                }
            }
        }
        return this.helpRoleTab;
    }
}
exports.default = RolesFunc;
//英雄解锁条件类型
RolesFunc.ROLE_UNLOCK_TYPE_LEVEL = 1; //关卡等级
RolesFunc.ROLE_ITEM_LIST = 1;
RolesFunc.ROLE_ITEM_COMMON = 2;
/**角色说话位置 结算 */
RolesFunc.ROLE_SPEAK_RESULT = 1;
/**角色说话位置 布阵 */
RolesFunc.ROLE_SPEAK_BUZHENG = 2;
/**角色说话位置 打工 */
RolesFunc.ROLE_SPEAK_WORK = 4;
RolesFunc.ROLE_SPEAK_Detail = 3;
//装备状态:未拥有
RolesFunc.STATE_NOEQUIP = 1;
//装备状态:可以合成
RolesFunc.STATE_CANCOMPOSE = 2;
//装备状态:已拥有
RolesFunc.STATE_OWN = 3;
//当前战力
RolesFunc.nowForce = 0;
RolesFunc.ROLE_UPGRADE_SPINE = "effect_role_levelup01";
RolesFunc.maxLevel = 10;
//# sourceMappingURL=RolesFunc.js.map