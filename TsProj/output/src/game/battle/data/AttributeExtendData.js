"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const RolesFunc_1 = require("../../sys/func/RolesFunc");
/**
 * 角色属性数据.
 */
class AttributeExtendData {
    //初始化  outRecount是否 不算属性.为了提升性能. 
    constructor(id, roleData, lifeType, userData, globalAttrMap = null, outRecount = false) {
        //等级
        this.level = 1;
        //星级
        this.starLevel = 0;
        //是否数据发生变化 
        this.hasDataChange = false;
        //是否已经算过被动技能了.已经算过的被动技能 下次更新数据的时候 不能再算了
        this.hasCountPassive = false;
        this._hasTempAttrChange = false;
        this.resetData(id, roleData, lifeType, userData, globalAttrMap);
    }
    //重置数据. 因为这个对方是会被反复使用的 
    resetData(id, roleData, lifeType, userData, globalAttrMap = null, outRecount = false) {
        this.id = id;
        this.skillCdMap = {};
        this._data = roleData;
        this._userData = userData;
        this.extraAttr = {};
        this.tempOnceAttr = {};
        this.baseAttr = {};
        this.addAttr = {};
        this.finalAttr = {};
        this.hasCountPassive = false;
        this.lifeType = lifeType;
        this.updateData(roleData, globalAttrMap, outRecount);
    }
    //更新数据
    updateData(roleData, globalAttrMap = null, outRecount = false) {
        this._globalAttrMap = globalAttrMap;
        var attrId;
        var advanceAttr;
        this.level = roleData.level || 1;
        this.starLevel = roleData.starLevel || 0;
        //传了装备就用传的，没传就默认为null，回去role数据下获取
        this.equip = roleData.equip || null;
        var attrArr = BattleFunc_1.default.instance.getCfgDatasByMultyKey("RoleUpdate", this.id, this.level, "attribute");
        this.baseAttr = this.resetBaseAtt(attrArr);
        //计算被动技能加成
        this.countPassiveAttr(roleData);
        //必须是算属性的
        if (!outRecount) {
            this.countAllAttr();
        }
    }
    //计算召唤物属性
    countSummonedAttr(level, fromAttr) {
        var attrArr = BattleFunc_1.default.instance.getCfgDatasByMultyKey("RoleUpdate", this.id, level, "attribute");
        this.baseAttr = this.resetBaseAtt(attrArr);
        this.countAllAttr();
    }
    //重新计算基础属性 加上装备和星级
    resetBaseAtt(attrArr) {
        attrArr = BattleFunc_1.default.instance.turnPropArrToTable(attrArr);
        //基地直接返回当前初始值
        if (this.lifeType != BattleConst_1.default.LIFE_JIDI) {
            for (var key in attrArr) {
                if (attrArr.hasOwnProperty(key)) {
                    var info = attrArr[key];
                    info[0] = RolesFunc_1.default.instance.getAttrNumByLevel(key, this.id, this.level, this.starLevel, true, null, this.equip);
                    attrArr[key] = info;
                }
            }
        }
        return attrArr;
    }
    //计算被动技能加成
    countPassiveAttr(roleData) {
        //只有角色有被动技能加成
        if (this.lifeType == BattleConst_1.default.LIFE_PLAYER) {
            return;
        }
        //如果已经算过了 return
        if (this.hasCountPassive) {
            return;
        }
        var passSkill = roleData.passiveSkills;
        if (!passSkill || passSkill.length == 0) {
            return;
        }
        this.hasCountPassive = true;
        for (var i = 0; i < passSkill.length; i++) {
            var passiveId = passSkill[i];
            var passiveCfg = BattleFunc_1.default.instance.getCfgDatas("PassiveSkill", passiveId);
            var effectType = passiveCfg.effectType;
            //只读 属性加成的被动技
            var tempArr = [];
            if (effectType == BattleConst_1.default.passive_effect_attr) {
                var effectParams = passiveCfg.effectParams;
                for (var s = 0; s < effectParams.length; s++) {
                    tempArr = effectParams[s];
                    this.updateOneAttr(tempArr[0], Number(tempArr[1]), Number(tempArr[2]), this.extraAttr, true);
                }
            }
            else if (effectType == BattleConst_1.default.passive_effect_skillcd) {
                var effectParams = passiveCfg.effectParams;
                for (var s = 0; s < effectParams.length; s++) {
                    var arr = effectParams[s];
                    var skillId = String(arr[0]);
                    var value = Number(arr[1]);
                    var skillValue = 10000 + value;
                    if (skillValue < 0) {
                        skillValue = 0;
                    }
                    this.skillCdMap[skillId] = skillValue;
                }
            }
        }
    }
    //重算所有属性 这些属性不包括血量和当前能量.
    countAllAttr() {
        for (var i in BattleFunc_1.default.idToShowMap) {
            this.countOneProp(i);
        }
        this.hasDataChange = false;
    }
    //清除临时属性
    clearTempAttr() {
        if (!this._hasTempAttrChange) {
            return;
        }
        this._hasTempAttrChange = false;
        var map = this.tempOnceAttr;
        for (var i in map) {
            var tempArr = map[i];
            if (tempArr[0] != 0 || tempArr[1] != 0) {
                map[i][0] = 0;
                map[i][1] = 0;
                //重算这条属性
                this.countOneProp(i);
            }
        }
    }
    //计算一条属性
    countOneProp(attrId) {
        var showType = BattleFunc_1.default.getPropStyle(attrId);
        //如果没有showType; 按万分比属性走
        var baseValue = this.baseAttr[attrId] && this.baseAttr[attrId][0] || 0;
        var fixValue = this.extraAttr[attrId] && this.extraAttr[attrId][0] || 0;
        var percentValue = this.extraAttr[attrId] && this.extraAttr[attrId][1] || 0;
        //加上临时属性加成
        fixValue += (this.tempOnceAttr[attrId] && this.tempOnceAttr[attrId][0] || 0);
        percentValue += (this.tempOnceAttr[attrId] && this.tempOnceAttr[attrId][1] || 0);
        var resultValue;
        //数值属性
        if (showType == BattleConst_1.default.PROPSTYLE_NUM) {
            //属性=额外万分比加成*英雄进阶系数* 全局天赋加成系数* （基础属性+属性成长*英雄等级）*A^rounddown(英雄等级/B)*C^rounddown(英雄等级/D) +额外固定值加成
            resultValue = (1 + percentValue / 10000) * (baseValue) + fixValue;
        }
        else {
            //属性=基础属性+英雄进阶加成+额外固定值加成
            resultValue = baseValue + fixValue;
        }
        //对最终结果取整
        resultValue = Math.floor(resultValue);
        //存储最终属性
        this.finalAttr[attrId] = resultValue;
    }
    //更新一组属性 根据传进来的数据判断  {attrId:[num,value], }  recountAttr是否重算战力
    changeExtraAttr(srcMap, way = 1, recountAttr = false) {
        var targetMap = this.extraAttr;
        for (var i in srcMap) {
            if (!targetMap[i]) {
                targetMap[i] = [0, 0];
            }
            targetMap[i][0] += srcMap[i][0] * way;
            targetMap[i][1] += srcMap[i][1] * way;
            //如果是重算战力才执行
            if (recountAttr) {
                this.countOneProp(i);
            }
        }
    }
    //跟新一组临时属性 主要是 针对本次伤害判定时 计算额外伤害系数和常量.这个修改不用更新属性
    changeTempAttr(srcMap) {
        var targetMap = this.tempOnceAttr;
        for (var i in srcMap) {
            this.changeOneTempAttr(i, srcMap[i][0], srcMap[i][1]);
        }
    }
    //改变某一条临时属性
    changeOneTempAttr(attrId, fixValue, percentValue) {
        this._hasTempAttrChange = true;
        this.updateOneAttr(attrId, fixValue, percentValue, this.tempOnceAttr);
    }
    //更新某一条属性
    updateOneAttr(attrId, fixValue, percentValue, changeMap, outRecount = false) {
        var arr = changeMap[attrId];
        if (!arr) {
            arr = [0, 0];
            changeMap[attrId] = arr;
        }
        arr[0] += fixValue;
        arr[1] += percentValue;
        //如果需要重算属性的执行重算. 是为了提升性能
        if (!outRecount) {
            this.countOneProp(attrId);
        }
    }
    //获取某个技能的cd加成
    getSkillCdAdded(skillId) {
        return this.skillCdMap[skillId] || 10000;
    }
    //获取一个属性
    getOneAttr(propId) {
        return this.finalAttr[propId] || 0;
    }
    //获取基础属性
    getOneBaseAttr(propId) {
        return this.baseAttr[propId] && this.baseAttr[propId][0] || 0;
    }
}
exports.default = AttributeExtendData;
//# sourceMappingURL=AttributeExtendData.js.map