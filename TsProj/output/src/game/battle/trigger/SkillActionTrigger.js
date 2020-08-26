"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const BattleFormulaTrigger_1 = require("./BattleFormulaTrigger");
const BattleBuffData_1 = require("../data/BattleBuffData");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const BuffTrigger_1 = require("./BuffTrigger");
const ConditionTrigger_1 = require("./ConditionTrigger");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BattleAoeData_1 = require("../data/BattleAoeData");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const ChooseTrigger_1 = require("./ChooseTrigger");
const SkillExpandTrigger_1 = require("./SkillExpandTrigger");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
/**
 * 技能效果生效后做的事
 *
 */
class SkillActionTrigger {
    //判断执行技能效果
    static checkSkillAction(attacker, skillAction, useArr) {
        var replaceArr = BattleFunc_1.default.getOneTempArr();
        //判断是否有被动技能需要变更效果
        var skill = skillAction.skill;
        //当前效果是非被动技能才去触发.否则容易引起死循环
        if (skill.skillType != BattleConst_1.default.skill_kind_passive && !skillAction.relyonSkill) {
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_createAction, attacker, BattleFunc_1.default.emptyArr, skillAction, replaceArr);
        }
        //如果有需要更换的技能效果
        if (replaceArr.length > 0) {
            for (var i = 0; i < replaceArr.length; i++) {
                this.beforRunSkillAction(attacker, replaceArr[i], useArr);
            }
        }
        else {
            this.beforRunSkillAction(attacker, skillAction, useArr);
        }
        BattleFunc_1.default.cacheOneTempArr(replaceArr);
    }
    //执行技能action之前 需要筛选目标
    static beforRunSkillAction(attacker, skillAction, useArr) {
        var chooseArr;
        ;
        var hasHit = false;
        var needCahce = false;
        if (useArr) {
            chooseArr = useArr;
        }
        else {
            //如果是通过别的方式给这个技能效果赋值了选择目标了
            if (skillAction.tempChooseArr.length > 0) {
                chooseArr = BattleFunc_1.default.getOneTempArr();
                needCahce = true;
                TableUtils_1.default.copyOneArr(skillAction.tempChooseArr, chooseArr);
            }
            else {
                //如果没有选择目标  那么继承技能的
                if (!skillAction.chooseTartgetCfg) {
                    chooseArr = skillAction.skill.tempChooseArr;
                }
                else {
                    chooseArr = BattleFunc_1.default.getOneTempArr();
                    ChooseTrigger_1.default.getSkillTargetRole(attacker, skillAction.skill, skillAction.chooseTartgetCfg, chooseArr);
                    needCahce = true;
                }
            }
        }
        if (chooseArr.length > 0) {
            hasHit = true;
            //如果是没有条件的 那么直接执行
            this.runOneSkillAction(attacker, skillAction.skill, skillAction, chooseArr);
        }
        if (needCahce) {
            BattleFunc_1.default.cacheOneTempArr(chooseArr);
        }
        //使用技能效果就需要清除临时属性
        if (attacker.attrData) {
            attacker.attrData.clearTempAttr();
        }
        return hasHit;
    }
    //技能效果触发器
    static runOneSkillAction(attacker, skill, skillAction, useArr) {
        var logicType = skillAction.cfgData.logicType;
        if (skillAction.condition) {
            var rt = ConditionTrigger_1.default.checkOneOpportunity(attacker, skill, skillAction.condition, useArr, skillAction);
            if (!rt) {
                return;
            }
        }
        //useArr是临时数组
        //把声音和特效单独处理
        if (skillAction.cfgData.sound) {
            attacker.controler.playSound(skillAction.cfgData.sound);
        }
        //如果有特效 那么播放被作用者特效
        if (skillAction.cfgData.effect) {
        }
        //恢复能量
        attacker.changeEnergy(skillAction.resumeEnergy);
        var targetSound = skillAction.cfgData.sound;
        var effectParams = skillAction.cfgData.effect;
        //给受击者播放特效
        if (useArr && useArr.length > 0 && effectParams) {
            for (var i = 0; i < useArr.length; i++) {
                if (useArr[i].hp > 0) {
                    useArr[i].createEffByParams(effectParams, false, false);
                }
            }
        }
        var skillTempChooseArr = skillAction.tempChooseArr;
        skillTempChooseArr.length = 0;
        //拿到临时的数组 变量. 存起来
        for (var i = 0; i < useArr.length; i++) {
            skillTempChooseArr.push(useArr[i]);
        }
        //被动技能不二次触发时机了
        if (skill.skillType != BattleConst_1.default.skill_kind_passive) {
            //效果触发之前做的事. 可能是额外增伤, 触发额外效果
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_action_usedBefore, attacker, useArr, skillAction);
        }
        var func = this["runSkillAction_" + logicType];
        if (!func) {
            LogsManager_1.default.errorTag("skillactionError", "没有对应的效果类型:", logicType);
            return 0;
        }
        else {
            var rt = func.call(this, attacker, skill, skillAction, useArr);
            //效果触发之后 根据各自的触发条件读取 tempArr_actionResult里面的字段
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_action_usedAfter, attacker, useArr, skillAction);
            //判断执行额外的技能效果
            SkillExpandTrigger_1.default.onCheckExpand(attacker, skill, skillAction.cfgData.expand, useArr);
            //技能效果执行完毕后需要把长度清0;
            skillTempChooseArr.length = 0;
            return rt;
        }
    }
    //执行伤害效果 
    static runSkillAction_1(attacker, skill, skillAction, useArr) {
        //公式效果暂时先搁置.
        for (var i = 0; i < useArr.length; i++) {
            var defer = useArr[i];
            //这里需要判断防守方血量是否为0.因为重复的技能检测会导致检测过程中有角色死亡
            if (defer.hp > 0) {
                //如果是按照属性百分比算伤害的
                if (skillAction.skillLogicalParams[0][3]) {
                    BattleFormulaTrigger_1.default.dmgByAttr(attacker, defer, skillAction, skillAction.skillLogicalParams[0][0], skillAction.skillLogicalParams[0][1]);
                }
                else {
                    BattleFormulaTrigger_1.default.damage(attacker, defer, skillAction, skillAction.skillLogicalParams[0][0], skillAction.skillLogicalParams[0][1]);
                }
            }
        }
    }
    //回血效果
    static runSkillAction_2(attacker, skill, skillAction, useArr) {
        for (var i = 0; i < useArr.length; i++) {
            var defer = useArr[i];
            BattleFormulaTrigger_1.default.trit(attacker, defer, skill, skillAction);
        }
    }
    //吸血效果
    static runSkillAction_3(attacker, skill, skillAction, useArr) {
        //改变攻击者比例吸血
        attacker.attrData.changeOneTempAttr(BattleConst_1.default.attr_xixue, skillAction.skillLogicalParams[0][0], 0);
    }
    //吸金效果
    static runSkillAction_4(attacker, skill, skillAction, useArr) {
    }
    //添加buff
    static runSkillAction_5(attacker, skill, skillAction, useArr) {
        var logicalParams = skillAction.skillLogicalParams;
        for (var i = 0; i < logicalParams.length; i++) {
            var buffId = logicalParams[i][0];
            var cengshu = logicalParams[i][1];
            var cacheBuff = PoolTools_1.default.getItem("buff_" + buffId);
            if (!cacheBuff) {
                cacheBuff = new BattleBuffData_1.default(buffId);
            }
            cacheBuff.setData(attacker, skillAction, cengshu);
            //遍历被作用者 使用buff
            for (var s = 0; s < useArr.length; s++) {
                var targetInstance = useArr[s];
                BuffTrigger_1.default.setOneBuff(attacker, useArr[s], skillAction, cacheBuff);
            }
        }
    }
    //移除buff
    static runSkillAction_6(attacker, skill, skillAction, useArr) {
        for (var i = 0; i < useArr.length; i++) {
            var defer = useArr[i];
            var skillParams = skillAction.skillLogicalParams;
            for (var s = 0; s < skillParams.length; s++) {
                var tempArr = skillParams[s];
                var kind = tempArr[0];
                for (var m = 1; m < tempArr.length; m++) {
                    this.removeBuffByKind(defer, kind, tempArr[m]);
                }
            }
        }
    }
    //按品类移除
    static removeBuffByKind(user, kind, value) {
        var buffMapInfo = user.buffInfo;
        for (var i in buffMapInfo) {
            var buffArr = buffMapInfo[i];
            var len = buffArr.length;
            for (var s = len - 1; s >= 0; s--) {
                var buff = buffArr[s];
                if (this.checkBuffKind(buff, kind, value)) {
                    user.clearOneBuff(buff, BattleConst_1.default.buff_remove_qusan);
                }
            }
        }
    }
    static checkBuffKind(buff, kind, value) {
        if (kind == BattleConst_1.default.buff_kind_group) {
            return buff.group == value;
        }
        else if (kind == BattleConst_1.default.buff_kind_fu) {
            return buff.type == value;
        }
        else if (kind == BattleConst_1.default.buff_kind_zheng) {
            return buff.type == value;
        }
        else if (kind == BattleConst_1.default.buff_kind_type) {
            return buff.logicType == value;
        }
        else if (kind == BattleConst_1.default.buff_kind_id) {
            return buff._id == String(value);
        }
        return false;
    }
    //改变怒气
    static runSkillAction_7(attacker, skill, skillAction, useArr) {
        for (var i = 0; i < useArr.length; i++) {
            //额外回怒
            useArr[i].changeEnergy(skillAction.skillLogicalParams[0][0]);
        }
    }
    //瞬移
    static runSkillAction_8(attacker, skill, skillAction, useArr) {
        var defer = useArr[0];
        var params = skillAction.skillLogicalParams[0];
        var keepDis = params[1] && params[1] || 60;
        if (!defer) {
            return;
        }
        var targetX = defer.pos.x + defer._viewWay * keepDis;
        //记录当前坐标
        attacker.setLastPos(attacker.pos.x, attacker.pos.y, attacker.pos.z);
        attacker.setPos(targetX, 0, defer.pos.z);
        var lastFrame = BattleFunc_1.default.instance.turnMinisecondToframe(params[0]);
        //一定时间后坐标还原回去
        attacker.controler.setCallBack(lastFrame, attacker.resumeToLastPos, attacker);
        BattleLogsManager_1.default.battleEcho("xd 触发瞬移了---lastFrame:", lastFrame);
    }
    //复活
    static runSkillAction_9(attacker, skill, skillAction, useArr) {
        var ratio = skillAction.skillLogicalParams[0][0] / 10000;
        for (var i = 0; i < useArr.length; i++) {
            var targetIns = useArr[i];
            //按照百分比血量复活
            targetIns.doRelive(Math.floor(targetIns.maxHp * ratio), skillAction);
        }
    }
    //反弹伤害 给受击设置反伤属性
    static runSkillAction_10(attacker, skill, skillAction, useArr) {
        var value = skillAction.skillLogicalParams[0][0];
        var tempBeUsedValue = attacker.tempBeUsedValue;
        if (!tempBeUsedValue) {
            return;
        }
        var dmgValue = tempBeUsedValue[1];
        if (!dmgValue) {
            return;
        }
        var fanshangValue = Math.floor(dmgValue * value / 10000);
        var tempArr = BattleFunc_1.default.getOneTempArr();
        for (var i = 0; i < useArr.length; i++) {
            var targetIns = useArr[i];
            targetIns.onBeFanshang(dmgValue, attacker);
            // targetIns.attrData.changeOneTempAttr(BattleConst.attr_fanshang,value,0 );
        }
    }
    //召唤
    static runSkillAction_11(attacker, skill, skillAction, useArr) {
        var params = skillAction.skillLogicalParams;
        for (var s = 0; s < useArr.length; s++) {
            for (var i = 0; i < params.length; i++) {
                var info = params[i];
                var targetRole = useArr[s];
                var x = info[0] / attacker._viewWay + targetRole.pos.x;
                var z = -info[1] + attacker.pos.z;
                var id = String(info[2]);
                var lifeFrame = BattleFunc_1.default.instance.turnMinisecondToframe(info[3]);
                //创建召唤物
                attacker.controler.createSummoned(id, { level: attacker.getData().level, id, starLevel: attacker.getData().starLevel }, x, z, attacker, lifeFrame);
            }
        }
    }
    //触发aoe
    static runSkillAction_12(attacker, skill, skillAction, useArr) {
        var aoeIdArr = skillAction.skillLogicalParams[0];
        for (var i = 0; i < useArr.length; i++) {
            for (var s = 0; s < aoeIdArr.length; s++) {
                var aoeId = String(aoeIdArr[s]);
                var aoeData = PoolTools_1.default.getItem(PoolCode_1.default.POOL_AOEDATA + aoeId);
                if (!aoeData) {
                    aoeData = new BattleAoeData_1.default(aoeId);
                }
                aoeData.setData(skillAction, attacker);
                //开始执行aoe效果
                aoeData.doAoeAction(useArr[i]);
            }
        }
    }
    //发射子弹
    static runSkillAction_13(attacker, skill, skillAction, useArr) {
        var paramsArr = skillAction.skillLogicalParams;
        for (var i = 0; i < paramsArr.length; i++) {
            //子弹序列：ID1,偏移X，偏移Y;ID2,偏移X,偏移Y……;
            var info = paramsArr[i];
            var bulletId = String(info[0]);
            var x = info[1] * attacker.cfgScale * attacker._viewWay;
            var y = -info[2] * attacker.cfgScale;
            //旋转角度
            var rotation = info[3];
            //偏移z坐标. 支持子弹在地平面偏移 通用所有游戏 兼容默认配置
            var offz = info[4] || 0;
            for (var s = 0; s < useArr.length; s++) {
                attacker.controler.createBullet(bulletId, attacker, skillAction, x + attacker.pos.x, attacker.pos.y + y, rotation, useArr[s], offz);
                if (useArr.length > 1 && paramsArr.length > 1) {
                    LogsManager_1.default.errorTag("skillactionError", "技能效果id:", skillAction.skillEffectId, "_选择了多个目标.同时配置了多个子弹.不符合逻辑");
                    break;
                }
            }
        }
    }
    //使释放者按照配置的位移时间，移动到终点。
    static runSkillAction_14(attacker, skill, skillAction, useArr) {
        if (useArr.length == 0) {
            return;
        }
        var targetRole = useArr[0];
        var paramsArr = skillAction.skillLogicalParams;
        var pointArr = [];
        var expandArr = [];
        for (var i = 0; i < paramsArr.length; i++) {
            var info = paramsArr[i];
            var frame = BattleFunc_1.default.instance.turnMinisecondToframe(info[0]);
            var isFollow = info[3];
            var x;
            var z;
            var expandParams = {
                frame: frame,
            };
            //朝向攻击者
            if (isFollow == 1) {
                x = info[1] * attacker._viewWay;
                z = info[2];
                expandParams.target = targetRole;
            }
            else {
                x = info[1] * attacker._viewWay + targetRole.pos.x;
                z = info[2] + targetRole.pos.z;
            }
            pointArr.push(new Laya.Vector3(x, 0, z));
            expandArr.push(expandParams);
        }
        attacker.moveToGroupPoints(pointArr, 0, null, null, expandArr);
    }
}
exports.default = SkillActionTrigger;
SkillActionTrigger.action_dmage = 1; //伤害
SkillActionTrigger.action_resumehp = 2; //回血
SkillActionTrigger.action_xixue = 3; //吸血
SkillActionTrigger.action_xijin = 4; //吸金
SkillActionTrigger.action_addbuff = 5; //添加buff
SkillActionTrigger.action_rmbuff = 6; //移除buff
SkillActionTrigger.action_energy = 7; //改变怒气
SkillActionTrigger.action_shunyi = 8; //瞬移
SkillActionTrigger.action_fuhuo = 9; //复活
SkillActionTrigger.action_fanshang = 10; //反伤
SkillActionTrigger.action_zhaohuan = 11; //召唤
SkillActionTrigger.action_aoe = 12; //触发aoe
SkillActionTrigger.action_bullet = 13; //发射子弹
//# sourceMappingURL=SkillActionTrigger.js.map