import InstanceLogical from "../instance/InstanceLogical";
import BattleSkillData from "../data/BattleSkillData";
import SkillActionData from "../data/SkillActionData";
import BattleConst from "../../sys/consts/BattleConst";
import ConditionTrigger from "./ConditionTrigger";
import RandomUtis from "../../../framework/utils/RandomUtis";
import BattleFunc from "../../sys/func/BattleFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import GameSwitch from "../../../framework/common/GameSwitch";
import GameSwitchConst from "../../sys/consts/GameSwitchConst";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import BattleBuffData from "../data/BattleBuffData";
import UserInfo from "../../../framework/common/UserInfo";
import InstanceMonster from "../instance/InstanceMonster";
import AttributeExtendData from "../data/AttributeExtendData";

/**
 * 战斗中的公式计算.
 * 计算伤害. 计算加血等
 * 
 */
export default class BattleFormulaTrigger {


    private static _cacheLogsMap: any = {};


    //战斗中的公式计算
    // out 返回结果 [结果类型(闪避,暴击),伤害值,额外伤害 ]
    public static damage(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, skillFixValue: number, skillPercentValue: number, buff: BattleBuffData = null) {
        //伤害检测判定之前

        var tempArr = BattleFunc.getOneTempArr();
        tempArr.length = 0;
        tempArr.push(attacker);
        ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_checkDmgBefore, defer, tempArr, skillAction, attacker);

        BattleFunc.cacheOneTempArr(tempArr);
        var buffNums = 1;
        if (buff) {
            buffNums = buff.layerNums;
        }
        var attackerAttr = attacker.attrData;
        var deferAttr = defer.attrData;

        //计算闪避
        var shanbi: boolean = false;
        //超级武器不能闪避
        var shanbiRatio;
        if (buff) {
            shanbiRatio = 0
        } else {
            var basRatio = skillAction.skillLogicalParams[0][2] / 10000;
            /**
             * 
             * 实际闪避率=  max( 1 -(基础命中率+（攻击方命中值-受击方闪避值）/10000 )，0）
                实际暴击命中率=max(min(1-闪避率，暴击率),0)
                实际普通命中率= max(1-闪避率-暴击率,0)
                暴击率=max((攻击方暴击值-受击方抗爆值）/10000,0)
             * 
             */
            shanbiRatio = Math.max(1 - basRatio - (attackerAttr.getOneAttr(BattleConst.attr_hit) - deferAttr.getOneAttr(BattleConst.attr_dodge)) / 10000, 0);

        }

        var baojiRatio = Math.max((attackerAttr.getOneAttr(BattleConst.attr_crit) - deferAttr.getOneAttr(BattleConst.attr_toughness)) / 10000, 0);

        var realCrit = Math.max(Math.min(1 - shanbiRatio, baojiRatio), 0);

        var random = RandomUtis.getOneRandom(BattleFunc.battleRandomIndex);
        var baoshang: number = 1;
        var isMiss: boolean;
	 var dmgType;
        if (random < shanbiRatio) {
            dmgType = BattleConst.damage_miss
            isMiss = true;
        } else if (random < shanbiRatio + realCrit) {
            //计算暴击伤害
            baoshang = BattleFunc.critDamgeRatio + attackerAttr.getOneAttr(BattleConst.attr_critDmg) / 10000;
	        dmgType = BattleConst.damage_baoji
        } else {
            baoshang = 1;
            dmgType = BattleConst.damage_normal
        }


        //额外伤害率
        /**
         * 计算本次效果的额外伤害率
            额外伤害率=（1+攻击方伤害加成万分比/10000-被攻击方免伤万分比/10000）

            实际伤害值=max(攻击力*最低伤害比例, roundup(((攻击方攻击力-受击方防御力) *技能攻击万分比/10000+技能基础伤害)*暴击伤害率*闪避伤害率*额外伤害率)) *造成伤害的buff层数
         * 
         */
        if (!isMiss) {
            var atkDmgValue = attackerAttr.getOneAttr(BattleConst.attr_damage)
            var defRelietValue = deferAttr.getOneAttr(BattleConst.attr_relief)

            var dmgratio =this.countDmgRatio(attackerAttr,deferAttr);
            var atk = attackerAttr.getOneAttr(BattleConst.attr_attack);
            var def = deferAttr.getOneAttr(BattleConst.attr_def);
            var minDmg = Math.round(atk * BattleFunc.minDamageRatio);
            var targetDmg = Math.round((Math.ceil(atk - def) * skillPercentValue / 10000 + skillFixValue) * baoshang * dmgratio);
            var dmg = Math.max(minDmg, targetDmg) * buffNums;
            if (GameSwitch.checkOnOff(GameSwitchConst.SWITCH_BATTLE_INFO)) {
                var key = attacker.dataId + "_" + skillAction.skillEffectId
                //记录攻击次数 每个人的每个效果只打2次日志
                if (!this._cacheLogsMap[key]) {
                    this._cacheLogsMap[key] = 0
                }
                this._cacheLogsMap[key]++;
                if (this._cacheLogsMap[key] < 3) {
                    var logStr: string = "攻击者:" + attacker.dataId + ",受击着:" + defer.dataId + ",攻击:" + atk + ",防御:" + def + ",伤害加成:" + atkDmgValue + ",伤害减免:" + defRelietValue + ",技能系数:" + skillFixValue + "_" + skillPercentValue
                        + ",爆伤:" + baoshang
                        + ",最小伤害:" + minDmg + ",最终伤害:" + dmg;
                    if (UserInfo.isWeb()) {
                        BattleLogsManager.debugByRole(attacker.dataId, logStr, "\n攻击者对象", attacker, "防御者对象:", defer, "技能效果:", skillAction)
                    } else {
                        BattleLogsManager.debugByRole(attacker.dataId, logStr)
                    }
                }
            }

            // var dmg = attackerAttr.getOneAttr(BattleConst.attr_attack) - deferAttr.getOneAttr(BattleConst.attr_def);
            if (dmg < 1) dmg = 1;
        } else {
            dmg = 0;
        }
        if (isNaN(dmg)) {
            LogsManager.errorTag("battleError", "___遇到错误的伤害")
            dmg = 1;
        }
        this.doDmgResult(attacker,defer,dmg,dmgType,skillAction,buff);
    }

    //按照属性百分比计算伤害
    public static dmgByAttr(attacker: InstanceLogical, defer: InstanceLogical, skillAction: SkillActionData, skillFixValue: number, skillPercentValue: number, buff: BattleBuffData = null) {
        var attrFrom: number;
        var tempAttrId: string;
        var useMianshang: number;
        attrFrom = (skillAction.skillLogicalParams[0][3]);
        tempAttrId = skillAction.skillLogicalParams[0][4];
        useMianshang = skillAction.skillLogicalParams[0][5];
        var tempRole:InstanceLogical;
        if (attrFrom == 1) {
            tempRole = attacker;
        } else {
            tempRole = defer;
        }
        var targetValue = tempRole.attrData.getOneAttr(tempAttrId);
        var dmg = skillPercentValue/10000 * targetValue+ skillFixValue;
        //1是计算伤害免伤
        if(useMianshang ==1){
            var dmgratio = this.countDmgRatio(attacker.attrData,defer.attrData);
            targetValue*=dmgratio;
        }
        //对结果向下取整
        targetValue = Math.floor(targetValue);
        this.doDmgResult(attacker,defer,dmg,BattleConst.damage_normal,skillAction,buff);


    }
    
    // 执行最终伤害 因为有2个地方调用. 所以代码需要整合
    // out 结果 [结果类型(闪避,暴击),伤害值,额外伤害 ]
    private static doDmgResult(attacker:InstanceLogical,defer:InstanceLogical,dmg:number,type:number,skillAction:SkillActionData,buff:BattleBuffData=null){
        var out = BattleFunc.getOneTempArr();
        var tempArr = BattleFunc.getOneTempArr();
        out[0] = type;
        out[1] = dmg
        out[2] = attacker;
        tempArr.push(defer);
        defer.tempBeUsedValue[0] = out[0]
        defer.tempBeUsedValue[1] = out[1]
        defer.tempBeUsedValue[2] = attacker
        attacker.tempUseValue[0] = out[0]
        attacker.tempUseValue[1] = out[1]
        attacker.tempUseValue[2] = defer
        ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_checkDmgAfter, defer, tempArr, skillAction, attacker);
        if (type != BattleConst.damage_miss) {

            //判断吸血 非buff要判断吸血
            if (!buff) {
                var xixueValue = attacker.attrData.getOneAttr(BattleConst.attr_xixue);
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
        BattleFunc.cacheOneTempArr(tempArr);
        BattleFunc.cacheOneTempArr(out);
        return out;
    }


    //  计算最终的伤害系数
    private static countDmgRatio(attackerAttr:AttributeExtendData,deferAttr:AttributeExtendData){
        var atkDmgValue = attackerAttr.getOneAttr(BattleConst.attr_damage)
        var defRelietValue = deferAttr.getOneAttr(BattleConst.attr_relief)

        var dmgratio = 1 + (atkDmgValue - defRelietValue) / 10000;
        if(dmgratio< 0){
            dmgratio = 0
        }
        //还要计算最终伤害加成和减免
        var finalDmg = attackerAttr.getOneAttr(BattleConst.attr_final_damage) / 10000 + 1;
        var finalReliet = 1 - deferAttr.getOneAttr(BattleConst.attr_final_relief) / 10000;
        return dmgratio* finalDmg* finalReliet
    }

    //治疗
    public static trit(attacker: InstanceLogical, defer: InstanceLogical, skill: BattleSkillData, skillAction: SkillActionData, buffNums: number = 1) {
        //收到回血之前判定
        var out: any[] = BattleFunc.getOneTempArr();
        var tempArr = BattleFunc.getOneTempArr();
        tempArr.length = 0;
        tempArr.push(attacker);
        ConditionTrigger.onOpportunityByInstance(ConditionTrigger.opportunity_addhp, defer, tempArr, skillAction);
        out.length = 0;

        var attackerAttr = attacker.attrData;
        var deferAttr = defer.attrData;

        /**
         * 效果触发后，先判断是否暴击：
        暴击率=max(攻击方暴击值/10000,0)
        若触发暴击则暴击加成率=2+攻击方暴击伤害值/10000;
        否则暴击加成率=1；
         */
        var critRatio = Math.max(attackerAttr.getOneAttr(BattleConst.attr_crit) / 10000, 0);
        var random = RandomUtis.getOneRandom(BattleFunc.battleRandomIndex);;
        var critdmage: number;
        //如果暴击了
        if (random < critRatio) {
            out[0] = BattleConst.damage_baoji;
            critdmage = 2 + attackerAttr.getOneAttr(BattleConst.attr_critDmg) / 10000;
        } else {
            out[0] = BattleConst.damage_normal;
            critdmage = 1;
        }

        /**
         * 计算本次效果的额外加成率
            额外加成率=（1+目标被治疗加成万分比/10000-目标被减疗万分比/10000）*（1+治疗者治疗加成万分比）
         */
        var extraAdded = (1 + deferAttr.getOneAttr(BattleConst.attr_betreated) / 10000) * (1 + attackerAttr.getOneAttr(BattleConst.attr_treate) / 10000);
        /**
         * 实际回血效果=max(1, roundup((攻击方攻击力*技能回血万分比/10000+技能基础治疗量)*暴击加成率*额外加成率)) *buff层数
         */
        var skillParam = skillAction.skillLogicalParams[0]
        var treatValue = Math.max(1, Math.ceil(attackerAttr.getOneAttr(BattleConst.attr_attack) * skillParam[1] / 10000 + skillParam[0]) * critdmage * extraAdded);

        //还要计算最终治疗加成和被治疗加成
        var finalDmg = attackerAttr.getOneAttr(BattleConst.attr_final_treate) / 10000 + 1;
        var finalReliet = 1 + deferAttr.getOneAttr(BattleConst.attr_final_betreated) / 10000;
        treatValue = Math.floor(treatValue * finalDmg * finalReliet);

        treatValue *= buffNums;
        out[1] = treatValue;
        out[2] = attacker;
        defer.tempBeUsedValue[0] = out[0]
        defer.tempBeUsedValue[1] = out[1]
        defer.tempBeUsedValue[2] = attacker
        attacker.tempUseValue[0] = out[0]
        attacker.tempUseValue[1] = out[1]
        attacker.tempUseValue[2] = defer
        defer.onBeTrit(attacker, skill, skillAction, out);
        //每次计算伤害后清空临时属性
        attackerAttr.clearTempAttr();
        deferAttr.clearTempAttr();
        BattleFunc.cacheOneTempArr(tempArr);
        BattleFunc.cacheOneTempArr(out)
        return out;
    }





}