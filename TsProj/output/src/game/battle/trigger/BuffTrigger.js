"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SkillActionData_1 = require("../data/SkillActionData");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const ConditionTrigger_1 = require("./ConditionTrigger");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const BattleFormulaTrigger_1 = require("./BattleFormulaTrigger");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
/**
 * buff触发器.
 * 触发buff时 执行的事情
 *
 */
class BuffTrigger {
    //初始化
    static init() {
        if (this._hasInit) {
            return;
        }
        this._hasInit = true;
        //安全的buff 表示不可被选中
        this.safeBuffBit = this.buffTypeToBit[this.buff_logical_safe];
        this.safeByAllBuffBit = this.buffTypeToBit[this.buff_logical_safe_all];
        this.forceCtrlBuffBit = this.buffTypeToBit[this.buff_logical_bingdong] | this.buffTypeToBit[this.buff_logical_xuanyun] |
            this.buffTypeToBit[this.buff_logical_jifei] | this.buffTypeToBit[this.buff_logical_jitui] |
            this.buffTypeToBit[this.buff_logical_chaofeng];
        //控制类型的buff
        this.ctrlBuffBit = this.forceCtrlBuffBit & this.buffTypeToBit[this.buff_logical_chenmo];
    }
    //buff触发器
    static setOneBuff(attacker, defer, skillAction, buff) {
        var logicType = buff.logicType;
        var func = this["runBuff_" + logicType];
        //不能给死人在加buff
        if (defer.hp <= 0) {
            return;
        }
        //如果是 无敌状态 不受减溢buff
        if (defer.invincibleNum > 0 && buff.type == BattleConst_1.default.buff_jianyi) {
            return;
        }
        //如果是有免疫类型buff的 
        if (this.checkMianyiBuff(defer, buff)) {
            return;
        }
        var oldBuff = defer.getBuffById(buff._id);
        var targetLayerNumer = 1;
        //如果有旧buff 判断覆盖逻辑
        if (oldBuff) {
            //如果是提升属性的buff 
            var maxLayer = buff.getMaxLayer();
            if (maxLayer == -1) {
                maxLayer = 9999;
            }
            if (maxLayer > 0) {
                targetLayerNumer = oldBuff.layerNums + buff.layerNums;
                if (targetLayerNumer > maxLayer) {
                    targetLayerNumer = maxLayer;
                }
                buff.layerNums = targetLayerNumer;
                //标记这个buff是被覆盖清除的
                defer.clearOneBuff(oldBuff, BattleConst_1.default.buff_remove_cover);
            }
            else if (maxLayer == -2) {
                //刷新某种id的剩余时间
                defer.refreshBuffTimeById(buff._id);
            }
        }
        //防守方插入一个buff
        defer.insterOneBuff(buff);
    }
    //判断是否免疫buff
    static checkMianyiBuff(defer, buff) {
        //@test  后续扩展
        return false;
    }
    //延迟执行buff效果
    static runOneBuffEffect(attacker, defer, skillAction, buff) {
        var logicType = buff.logicType;
        var func = this["runBuff_" + logicType];
        // //被作用着触发效果 每次buff的效果被作用时触发 
        ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_beUsedBuff, defer, BattleFunc_1.default.emptyArr, buff.skillAction, buff);
        var tempArr = BattleFunc_1.default.getOneTempArr();
        tempArr.push(defer);
        // //施法者触发效果
        ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_buffUsed, attacker, tempArr, buff.skillAction, buff);
        BattleFunc_1.default.cacheOneTempArr(tempArr);
        //这些是被buff作用的人 
        if (!func) {
            LogsManager_1.default.errorTag("buffError", "没有对应的buff效果类型:", logicType);
        }
        else {
            func.call(this, attacker, defer, skillAction, buff);
        }
    }
    //伤害buff
    static runBuff_1(attacker, defer, skillAction, buff) {
        BattleFormulaTrigger_1.default.damage(attacker, defer, skillAction, buff.skillLogicalParams[0][0], buff.skillLogicalParams[0][1], buff);
    }
    //属性提升
    static runBuff_2(attacker, defer, skillAction, buff) {
        var params = buff.skillLogicalParams;
        var tb = {};
        for (var i = 0; i < params.length; i++) {
            var tempInfo = params[i];
            var attrId = tempInfo[0];
            var value = this.getValueByFrom(attacker, defer, tempInfo[2], tempInfo[3], tempInfo[4]) + tempInfo[1];
            value = value * (buff.layerNums || 1);
            tb[attrId] = value;
            defer.attrData.updateOneAttr(attrId, value, 0, defer.attrData.extraAttr);
        }
        defer.buffAttrInfo.push({ buff: buff, attr: tb });
        //更新这一组属性
        // defer.attrData.changeExtraAttr(tb, 1, true);
    }
    //额外提升 合并到2改成属性提升
    static runBuff_3(attacker, defer, skillAction, buff) {
        LogsManager_1.default.warn("暂时废弃的buff生效类型3,buffid:", buff._id);
    }
    //眩晕 不需要再处理
    static runBuff_4(attacker, defer, skillAction, buff) {
        //晕眩 需要停止运动
        defer.initStand();
        //播放闲置动作
        defer.playAction(BattleConst_1.default.LABEL_IDLE, true);
        //被打断技能
        defer.interruptSkill(attacker);
    }
    //冰冻 需要停住角色动画
    static runBuff_5(attacker, defer, skillAction, buff) {
        defer.changeViewPauseValue(1);
        //晕眩 需要停止运动
        defer.initStand();
        //被打断技能
        defer.interruptSkill(attacker);
    }
    //击退
    static runBuff_6(attacker, defer, skillAction, buff) {
        var localParams = buff.skillLogicalParams;
        var frame = Number(localParams[0][1]);
        frame = BattleFunc_1.default.instance.turnMinisecondToframe(frame);
        defer.interruptSkill(attacker);
        //清除正在执行的技能序列
        defer.onHitedBack(attacker, localParams[0][0], localParams[0][2] || 0, frame);
        defer.controler.setCallBack(frame, defer.clearOneBuff, defer, buff);
    }
    //击飞
    static runBuff_7(attacker, defer, skillAction, buff) {
        var params = buff.skillLogicalParams[0];
        defer.onBeHitFly(params, attacker);
    }
    //沉默 不需要单独处理 
    static runBuff_8(attacker, defer, skillAction, buff) {
    }
    //怒气
    static runBuff_9(attacker, defer, skillAction, buff) {
        var value = buff.skillLogicalParams[0][0];
        //降低怒气
        defer.changeEnergy(value);
    }
    //护盾
    static runBuff_10(attacker, defer, skillAction, buff) {
        //计算护盾的值
        var value = 0;
        var params = buff.skillLogicalParams[0];
        value = this.getValueByFrom(attacker, defer, params[1], params[2], params[3]);
        value += params[0];
        BattleLogsManager_1.default.debugByRole(attacker.dataId, "获得护盾值:", value, "技能效果id:", skillAction.skillEffectId);
        defer.shieldInfoArr.push({ value: value, buff: buff });
    }
    //无敌
    static runBuff_11(attacker, defer, skillAction, buff) {
        defer.invincibleNum++;
        BattleLogsManager_1.default.debugByRole(attacker.dataId, attacker.dataId + "给" + defer.dataId + "添加无敌效果");
    }
    //免疫
    static runBuff_12(attacker, defer, skillAction, buff) {
        //下个版本优化
    }
    //获得被动
    static runBuff_13(attacker, defer, skillAction, buff) {
        var arr = buff.skillLogicalParams;
        for (var i = 0; i < arr.length; i++) {
            var passiveId = String(arr[i][0]);
            var level = skillAction.skill.level;
            var passiveSkill = attacker.controler.createPassiveSkill(passiveId, level, defer, buff.skillAction.relyonSkill || buff.skillAction.skill);
            attacker.passiveSkills.push(passiveSkill);
            passiveSkill.fromValue = buff;
        }
    }
    //变更技能
    static runBuff_14(attacker, defer, skillAction, buff) {
    }
    //技能释放加速
    static runBuff_15(attacker, defer, skillAction, buff) {
        var params = buff.skillLogicalParams;
        for (var i = 0; i < params.length; i++) {
            var tempArr = params[i];
            var id = tempArr[0];
            var value = tempArr[1];
            defer.setSkillSpeedUpValue(id, value);
        }
    }
    //嘲讽
    static runBuff_16(attacker, defer, skillAction, buff) {
        defer.beTauntTargetInfo.target = attacker;
        defer.beTauntTargetInfo.buff = buff;
    }
    //对作用目标释放技能效果	技能效果ID
    static runBuff_17(attacker, defer, skillAction, buff) {
        //@test 还没实现
        var skill = skillAction.skill;
        var tempArr = buff.skillLogicalParams;
        for (var i = 0; i < tempArr.length; i++) {
            var tempInfo = tempArr[i];
            var id = tempInfo[0];
            var act = skill.getActionById(id);
            var useSkill = skill;
            act = new SkillActionData_1.default(id, skill.owner, useSkill, 0, 1, 1, 0, 0, skillAction.relyonSkill);
            //否则立马执行一次效果
            defer.checkSkillEffect(act);
        }
    }
    //回血	为作用对象回复生命	固定回血数值	回血万分比
    static runBuff_18(attacker, defer, skillAction, buff) {
        var value = 0;
        var params = buff.skillLogicalParams[0];
        value = this.getValueByFrom(attacker, defer, params[1], params[2], params[3]);
        value += params[0];
        var tempArr = BattleFunc_1.default.getOneTempArr();
        tempArr[0] = BattleConst_1.default.damage_normal;
        tempArr[1] = value;
        defer.onBeTrit(attacker, skillAction.skill, skillAction, tempArr);
        BattleFunc_1.default.cacheOneTempArr(tempArr);
    }
    //不可被敌人选中
    static runBuff_19(attacker, defer, skillAction, buff) {
    }
    //不可被所有人选中
    static runBuff_20(attacker, defer, skillAction, buff) {
    }
    //根据配置来源读取数值 
    static getValueByFrom(attacker, defer, percentValue, fromType, attrId) {
        var value;
        if (!fromType) {
            return 0;
        }
        if (fromType == 1) {
            value = percentValue / 10000 * attacker.attrData.getOneBaseAttr(attrId);
        }
        else if (fromType == 2) {
            value = percentValue / 10000 * defer.attrData.getOneBaseAttr(attrId);
        }
        else if (fromType == 3) {
            //本次造成的伤害
            if (defer.tempUseValue) {
                if (defer.tempUseValue[1]) {
                    value = Number(defer.tempUseValue[1]);
                    if (!value) {
                        value = 0;
                    }
                    else {
                        value *= percentValue / 10000;
                    }
                }
                else {
                    value = 0;
                }
            }
            else {
                value = 0;
            }
        }
        else if (fromType == 4) {
            value = percentValue / 10000 * defer.attrData.getOneBaseAttr(attrId);
        }
        return Math.floor(value);
    }
    //---------------------------------清除一个buff-----------------------------------------
    static onClearBuff(defer, buff, removeChance = 1) {
        var logicalType = buff.logicType;
        var func = this["clearBuff_" + logicalType];
        if (!func) {
            return;
        }
        func.call(this, buff.onwer, defer, buff.skillAction, buff);
    }
    //伤害buff 不需要特殊处理
    static clearBuff_1(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //属性
    static clearBuff_2(attacker, defer, skillAction, buff, removeChance = 1) {
        //这里需要还原属性
        for (var i = defer.buffAttrInfo.length - 1; i >= 0; i--) {
            var info = defer.buffAttrInfo[i];
            if (info.buff == buff) {
                var attr = info.attr;
                for (var s in attr) {
                    //把里面的值 反向扣回去
                    defer.attrData.updateOneAttr(s, -attr[s], 0, defer.attrData.extraAttr);
                }
                //同时从数组移除
                defer.buffAttrInfo.splice(i, 1);
            }
        }
    }
    //额外提升
    static clearBuff_3(attacker, defer, skillAction, buff, removeChance = 1) {
        //还原额外提升的属性
    }
    //眩晕 不需要特殊处理
    static clearBuff_4(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //冰冻
    static clearBuff_5(attacker, defer, skillAction, buff, removeChance = 1) {
        //如果是动作暂停状态的 那么 就复原动作
        defer.changeViewPauseValue(-1);
        //复原为闲置动作
        defer.resumeIdleAction();
    }
    //击退 不需要特殊处理
    static clearBuff_6(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //击飞 不需要特殊处理
    static clearBuff_7(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //沉默 不需要特殊处理
    static clearBuff_8(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //怒气 不需要特殊处理
    static clearBuff_9(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //护盾移除
    static clearBuff_10(attacker, defer, skillAction, buff, removeChance = 1) {
        var arr = defer.shieldInfoArr;
        if (arr.length > 0) {
            for (var i = arr.length - 1; i >= 0; i--) {
                var info = arr[i];
                //移除指定的buff
                if (info.buff == buff) {
                    arr.splice(i, 1);
                }
            }
        }
    }
    //无敌
    static clearBuff_11(attacker, defer, skillAction, buff, removeChance = 1) {
        //取消无敌效果
        if (defer.invincibleNum > 0) {
            defer.invincibleNum--;
        }
    }
    //免疫 不需要特殊处理
    static clearBuff_12(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //获得被动
    static clearBuff_13(attacker, defer, skillAction, buff, removeChance = 1) {
        //把这个被动技能从数组移除
        var arr = defer.passiveSkills;
        for (var i = arr.length - 1; i >= 0; i--) {
            var passSkill = arr[i];
            if (passSkill.fromValue == buff) {
                arr.splice(i, 1);
                PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_PASSIVE, passSkill);
            }
        }
    }
    //变更技能 不需要特殊处理
    static clearBuff_14(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //技能释放加速
    static clearBuff_15(attacker, defer, skillAction, buff, removeChance = 1) {
        var params = buff.skillLogicalParams;
        for (var i = 0; i < params.length; i++) {
            var tempArr = params[i];
            var id = tempArr[0];
            var value = tempArr[1];
            defer.setSkillSpeedUpValue(id, -value);
        }
    }
    //嘲讽
    static clearBuff_16(attacker, defer, skillAction, buff, removeChance = 1) {
        defer.beTauntTargetInfo.target = null;
        defer.beTauntTargetInfo.buff = null;
    }
    //对作用目标释放技能效果  不需要特殊处理
    static clearBuff_17(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //回血buff 不需要特殊处理
    static clearBuff_18(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //不可被选中
    static clearBuff_19(attacker, defer, skillAction, buff, removeChance = 1) {
    }
    //不可被所有人选中
    static clearBuff_20(attacker, defer, skillAction, buff, removeChance = 1) {
    }
}
exports.default = BuffTrigger;
BuffTrigger.buff_logical_dmage = 1; //伤害buff
BuffTrigger.buff_logical_prop = 2; //属性buff
BuffTrigger.buff_logical_otherprop = 3; //额外提升效果
BuffTrigger.buff_logical_xuanyun = 4; //眩晕
BuffTrigger.buff_logical_bingdong = 5; //冰冻
BuffTrigger.buff_logical_jitui = 6; //击退
BuffTrigger.buff_logical_jifei = 7; //击飞
BuffTrigger.buff_logical_chenmo = 8; //沉默
BuffTrigger.buff_logical_nuqi = 9; //怒气
BuffTrigger.buff_logical_hudun = 10; //护盾
BuffTrigger.buff_logical_wudi = 11; //无敌
BuffTrigger.buff_logical_mianyi = 12; //免疫
BuffTrigger.buff_logical_biedong = 13; //获得被动
BuffTrigger.buff_logical_change_skill = 14; //变更技能
BuffTrigger.buff_logical_add_skill = 15; //技能释放加速
BuffTrigger.buff_logical_chaofeng = 16; //嘲讽
BuffTrigger.buff_logical_safe = 19; //无法被敌人选中
BuffTrigger.buff_logical_safe_all = 20; //无法被所有人选中
//buff对应的bit 用来记录角色当前拥有的控制型buff状态
BuffTrigger.buffTypeToBit = {
    [4]: 1, [5]: 2, [6]: 4, [7]: 8, [8]: 16,
    [19]: 512, [20]: 1024
};
BuffTrigger._hasInit = false;
//# sourceMappingURL=BuffTrigger.js.map