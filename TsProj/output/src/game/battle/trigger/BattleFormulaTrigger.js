"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleConst_1 = require("../../sys/consts/BattleConst");
const ConditionTrigger_1 = require("./ConditionTrigger");
const RandomUtis_1 = require("../../../framework/utils/RandomUtis");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const GameSwitch_1 = require("../../../framework/common/GameSwitch");
const GameSwitchConst_1 = require("../../sys/consts/GameSwitchConst");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const UserInfo_1 = require("../../../framework/common/UserInfo");
/**
 * 战斗中的公式计算.
 * 计算伤害. 计算加血等
 *
 */
class BattleFormulaTrigger {
    //战斗中的公式计算
    // out 返回结果 [结果类型(闪避,暴击),伤害值,额外伤害 ]
    static damage(attacker, defer, skillAction, skillFixValue, skillPercentValue, buff = null) {
        //伤害检测判定之前
        var tempArr = BattleFunc_1.default.getOneTempArr();
        tempArr.length = 0;
        tempArr.push(attacker);
        ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_checkDmgBefore, defer, tempArr, skillAction, attacker);
        BattleFunc_1.default.cacheOneTempArr(tempArr);
        var buffNums = 1;
        if (buff) {
            buffNums = buff.layerNums;
        }
        var attackerAttr = attacker.attrData;
        var deferAttr = defer.attrData;
        //计算闪避
        var shanbi = false;
        //超级武器不能闪避
        var shanbiRatio;
        if (buff) {
            shanbiRatio = 0;
        }
        else {
            var basRatio = skillAction.skillLogicalParams[0][2] / 10000;
            /**
             *
             * 实际闪避率=  max( 1 -(基础命中率+（攻击方命中值-受击方闪避值）/10000 )，0）
                实际暴击命中率=max(min(1-闪避率，暴击率),0)
                实际普通命中率= max(1-闪避率-暴击率,0)
                暴击率=max((攻击方暴击值-受击方抗爆值）/10000,0)
             *
             */
            shanbiRatio = Math.max(1 - basRatio - (attackerAttr.getOneAttr(BattleConst_1.default.attr_hit) - deferAttr.getOneAttr(BattleConst_1.default.attr_dodge)) / 10000, 0);
        }
        var baojiRatio = Math.max((attackerAttr.getOneAttr(BattleConst_1.default.attr_crit) - deferAttr.getOneAttr(BattleConst_1.default.attr_toughness)) / 10000, 0);
        var realCrit = Math.max(Math.min(1 - shanbiRatio, baojiRatio), 0);
        var random = RandomUtis_1.default.getOneRandom(BattleFunc_1.default.battleRandomIndex);
        var baoshang = 1;
        var isMiss;
        var dmgType;
        if (random < shanbiRatio) {
            dmgType = BattleConst_1.default.damage_miss;
            isMiss = true;
        }
        else if (random < shanbiRatio + realCrit) {
            //计算暴击伤害
            baoshang = BattleFunc_1.default.critDamgeRatio + attackerAttr.getOneAttr(BattleConst_1.default.attr_critDmg) / 10000;
            dmgType = BattleConst_1.default.damage_baoji;
        }
        else {
            baoshang = 1;
            dmgType = BattleConst_1.default.damage_normal;
        }
        //额外伤害率
        /**
         * 计算本次效果的额外伤害率
            额外伤害率=（1+攻击方伤害加成万分比/10000-被攻击方免伤万分比/10000）

            实际伤害值=max(攻击力*最低伤害比例, roundup(((攻击方攻击力-受击方防御力) *技能攻击万分比/10000+技能基础伤害)*暴击伤害率*闪避伤害率*额外伤害率)) *造成伤害的buff层数
         *
         */
        if (!isMiss) {
            var atkDmgValue = attackerAttr.getOneAttr(BattleConst_1.default.attr_damage);
            var defRelietValue = deferAttr.getOneAttr(BattleConst_1.default.attr_relief);
            var dmgratio = this.countDmgRatio(attackerAttr, deferAttr);
            var atk = attackerAttr.getOneAttr(BattleConst_1.default.attr_attack);
            var def = deferAttr.getOneAttr(BattleConst_1.default.attr_def);
            var minDmg = Math.round(atk * BattleFunc_1.default.minDamageRatio);
            var targetDmg = Math.round((Math.ceil(atk - def) * skillPercentValue / 10000 + skillFixValue) * baoshang * dmgratio);
            var dmg = Math.max(minDmg, targetDmg) * buffNums;
            if (GameSwitch_1.default.checkOnOff(GameSwitchConst_1.default.SWITCH_BATTLE_INFO)) {
                var key = attacker.dataId + "_" + skillAction.skillEffectId;
                //记录攻击次数 每个人的每个效果只打2次日志
                if (!this._cacheLogsMap[key]) {
                    this._cacheLogsMap[key] = 0;
                }
                this._cacheLogsMap[key]++;
                if (this._cacheLogsMap[key] < 3) {
                    var logStr = "攻击者:" + attacker.dataId + ",受击着:" + defer.dataId + ",攻击:" + atk + ",防御:" + def + ",伤害加成:" + atkDmgValue + ",伤害减免:" + defRelietValue + ",技能系数:" + skillFixValue + "_" + skillPercentValue
                        + ",爆伤:" + baoshang
                        + ",最小伤害:" + minDmg + ",最终伤害:" + dmg;
                    if (UserInfo_1.default.isWeb()) {
                        BattleLogsManager_1.default.debugByRole(attacker.dataId, logStr, "\n攻击者对象", attacker, "防御者对象:", defer, "技能效果:", skillAction);
                    }
                    else {
                        BattleLogsManager_1.default.debugByRole(attacker.dataId, logStr);
                    }
                }
            }
            // var dmg = attackerAttr.getOneAttr(BattleConst.attr_attack) - deferAttr.getOneAttr(BattleConst.attr_def);
            if (dmg < 1)
                dmg = 1;
        }
        else {
            dmg = 0;
        }
        if (isNaN(dmg)) {
            LogsManager_1.default.errorTag("battleError", "___遇到错误的伤害");
            dmg = 1;
        }
        this.doDmgResult(attacker, defer, dmg, dmgType, skillAction, buff);
    }
    //按照属性百分比计算伤害
    static dmgByAttr(attacker, defer, skillAction, skillFixValue, skillPercentValue, buff = null) {
        var attrFrom;
        var tempAttrId;
        var useMianshang;
        attrFrom = (skillAction.skillLogicalParams[0][3]);
        tempAttrId = skillAction.skillLogicalParams[0][4];
        useMianshang = skillAction.skillLogicalParams[0][5];
        var tempRole;
        if (attrFrom == 1) {
            tempRole = attacker;
        }
        else {
            tempRole = defer;
        }
        var targetValue = tempRole.attrData.getOneAttr(tempAttrId);
        var dmg = skillPercentValue / 10000 * targetValue + skillFixValue;
        //1是计算伤害免伤
        if (useMianshang == 1) {
            var dmgratio = this.countDmgRatio(attacker.attrData, defer.attrData);
            targetValue *= dmgratio;
        }
        //对结果向下取整
        targetValue = Math.floor(targetValue);
        this.doDmgResult(attacker, defer, dmg, BattleConst_1.default.damage_normal, skillAction, buff);
    }
    // 执行最终伤害 因为有2个地方调用. 所以代码需要整合
    // out 结果 [结果类型(闪避,暴击),伤害值,额外伤害 ]
    static doDmgResult(attacker, defer, dmg, type, skillAction, buff = null) {
        var out = BattleFunc_1.default.getOneTempArr();
        var tempArr = BattleFunc_1.default.getOneTempArr();
        out[0] = type;
        out[1] = dmg;
        out[2] = attacker;
        tempArr.push(defer);
        defer.tempBeUsedValue[0] = out[0];
        defer.tempBeUsedValue[1] = out[1];
        defer.tempBeUsedValue[2] = attacker;
        attacker.tempUseValue[0] = out[0];
        attacker.tempUseValue[1] = out[1];
        attacker.tempUseValue[2] = defer;
        ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_checkDmgAfter, defer, tempArr, skillAction, attacker);
        if (type != BattleConst_1.default.damage_miss) {
            //判断吸血 非buff要判断吸血
            if (!buff) {
                var xixueValue = attacker.attrData.getOneAttr(BattleConst_1.default.attr_xixue);
                //必须吸血率大于0
                if (xixueValue > 0) {
                    var value = Math.floor(xixueValue / 10000 * dmg);
                    attacker.onXixue(value);
                }
            }
        }
        defer.onBeHit(attacker, skillAction.skill, skillAction, out);
        //每次计算伤害后清空临时属性
        attacker.attrData.clearTempAttr();
        defer.attrData.clearTempAttr();
        BattleFunc_1.default.cacheOneTempArr(tempArr);
        BattleFunc_1.default.cacheOneTempArr(out);
        return out;
    }
    //  计算最终的伤害系数
    static countDmgRatio(attackerAttr, deferAttr) {
        var atkDmgValue = attackerAttr.getOneAttr(BattleConst_1.default.attr_damage);
        var defRelietValue = deferAttr.getOneAttr(BattleConst_1.default.attr_relief);
        var dmgratio = 1 + (atkDmgValue - defRelietValue) / 10000;
        if (dmgratio < 0) {
            dmgratio = 0;
        }
        //还要计算最终伤害加成和减免
        var finalDmg = attackerAttr.getOneAttr(BattleConst_1.default.attr_final_damage) / 10000 + 1;
        var finalReliet = 1 - deferAttr.getOneAttr(BattleConst_1.default.attr_final_relief) / 10000;
        return dmgratio * finalDmg * finalReliet;
    }
    //治疗
    static trit(attacker, defer, skill, skillAction, buffNums = 1) {
        //收到回血之前判定
        var out = BattleFunc_1.default.getOneTempArr();
        var tempArr = BattleFunc_1.default.getOneTempArr();
        tempArr.length = 0;
        tempArr.push(attacker);
        ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_addhp, defer, tempArr, skillAction);
        out.length = 0;
        var attackerAttr = attacker.attrData;
        var deferAttr = defer.attrData;
        /**
         * 效果触发后，先判断是否暴击：
        暴击率=max(攻击方暴击值/10000,0)
        若触发暴击则暴击加成率=2+攻击方暴击伤害值/10000;
        否则暴击加成率=1；
         */
        var critRatio = Math.max(attackerAttr.getOneAttr(BattleConst_1.default.attr_crit) / 10000, 0);
        var random = RandomUtis_1.default.getOneRandom(BattleFunc_1.default.battleRandomIndex);
        ;
        var critdmage;
        //如果暴击了
        if (random < critRatio) {
            out[0] = BattleConst_1.default.damage_baoji;
            critdmage = 2 + attackerAttr.getOneAttr(BattleConst_1.default.attr_critDmg) / 10000;
        }
        else {
            out[0] = BattleConst_1.default.damage_normal;
            critdmage = 1;
        }
        /**
         * 计算本次效果的额外加成率
            额外加成率=（1+目标被治疗加成万分比/10000-目标被减疗万分比/10000）*（1+治疗者治疗加成万分比）
         */
        var extraAdded = (1 + deferAttr.getOneAttr(BattleConst_1.default.attr_betreated) / 10000) * (1 + attackerAttr.getOneAttr(BattleConst_1.default.attr_treate) / 10000);
        /**
         * 实际回血效果=max(1, roundup((攻击方攻击力*技能回血万分比/10000+技能基础治疗量)*暴击加成率*额外加成率)) *buff层数
         */
        var skillParam = skillAction.skillLogicalParams[0];
        var treatValue = Math.max(1, Math.ceil(attackerAttr.getOneAttr(BattleConst_1.default.attr_attack) * skillParam[1] / 10000 + skillParam[0]) * critdmage * extraAdded);
        //还要计算最终治疗加成和被治疗加成
        var finalDmg = attackerAttr.getOneAttr(BattleConst_1.default.attr_final_treate) / 10000 + 1;
        var finalReliet = 1 + deferAttr.getOneAttr(BattleConst_1.default.attr_final_betreated) / 10000;
        treatValue = Math.floor(treatValue * finalDmg * finalReliet);
        treatValue *= buffNums;
        out[1] = treatValue;
        out[2] = attacker;
        defer.tempBeUsedValue[0] = out[0];
        defer.tempBeUsedValue[1] = out[1];
        defer.tempBeUsedValue[2] = attacker;
        attacker.tempUseValue[0] = out[0];
        attacker.tempUseValue[1] = out[1];
        attacker.tempUseValue[2] = defer;
        defer.onBeTrit(attacker, skill, skillAction, out);
        //每次计算伤害后清空临时属性
        attackerAttr.clearTempAttr();
        deferAttr.clearTempAttr();
        BattleFunc_1.default.cacheOneTempArr(tempArr);
        BattleFunc_1.default.cacheOneTempArr(out);
        return out;
    }
}
exports.default = BattleFormulaTrigger;
BattleFormulaTrigger._cacheLogsMap = {};
//# sourceMappingURL=BattleFormulaTrigger.js.map