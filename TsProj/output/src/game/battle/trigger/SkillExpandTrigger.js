"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const RandomUtis_1 = require("../../../framework/utils/RandomUtis");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const SwitchModel_1 = require("../../sys/model/SwitchModel");
/**
 * 技能或者ai扩展. 目前实现 连线特效. 播放声音.  震屏.
 */
class SkillExpandTrigger {
    static onCheckExpand(instance, skill, expandParams, useArr, isFollow = false) {
        if (!expandParams) {
            return;
        }
        for (var i = 0; i < expandParams.length; i++) {
            var info = expandParams[i];
            var type = info[0];
            var func = this["skillExpand_" + type];
            if (!func) {
                LogsManager_1.default.errorTag("skillExpandError", "错误的技能扩展类型:" + type);
            }
            else {
                func.call(this, instance, skill, info, useArr, isFollow);
            }
        }
    }
    //创建连线特效
    static skillExpand_1(instance, skill, params, useArr, isFollow) {
        if (!useArr) {
            BattleLogsManager_1.default.battleWarn("连线特效没有目标,skill:", skill._skillId);
            return;
        }
        var sourceLenth = Number(params[13]);
        var tweenTime = Number(params[14]);
        for (var i = 0; i < useArr.length; i++) {
            var targetRole = useArr[i];
            var tempArr = params.slice(1, 13);
            var expandPams = { type: params[0], length: Number(sourceLenth), frame: Math.floor(tweenTime * BattleFunc_1.default.miniSecondToFrame), role: targetRole }; // [params[0], sourceLenth, tweenTime, targetRole];
            instance.createOneEffByParam(tempArr, isFollow, false, expandPams);
        }
    }
    //震屏参数, 延迟时间(ms),震屏方式,持续时间(为帧,因为时间很短,所以必须绝对精确),震屏力度,震屏频率(多少帧震一次,一般2-4帧调整) 
    static skillExpand_2(instance, skill, params, useArr) {
        var delayTime = Number(params[1]);
        if (delayTime > 0) {
            delayTime = BattleFunc_1.default.instance.turnMinisecondToframe(delayTime);
            instance.controler.setCallBack(delayTime, instance.controler.cameraControler.shakeCameraByParams, instance.controler.cameraControler, params);
        }
        else {
            instance.controler.cameraControler.shakeCameraByParams(params);
        }
    }
    //播放音效
    static skillExpand_3(instance, skill, params, useArr) {
        var sound = params[3];
        var delayTime = Number(params[1]);
        if (delayTime > 0) {
            delayTime = BattleFunc_1.default.instance.turnMinisecondToframe(delayTime);
        }
        instance.controler.setCallBack(delayTime, instance.controler.playSoundByParams, instance.controler, params);
    }
    //隐藏slot
    static skillExpand_4(instance, skill, params, useArr) {
        var view = instance.getView();
        for (var i = 1; i < params.length; i++) {
            var slotName = params[i];
            view.showOrHideSlot(slotName, false);
        }
    }
    //创建飘字效果
    static skillExpand_5(instance, skill, params, useArr) {
        var name = params[1];
        var continueTime = Number(params[2]);
        var scaleRate = Number(params[3]) / 10000;
        instance.controler.battleUI.freshSkillTipGroup(name, continueTime, scaleRate);
    }
    //微震动效果
    static skillExpand_6(instance, skill, params, useArr) {
        //微震动开关是1 说明关闭了微震动
        if (SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.shake_switch))
            return;
        var shakeNums = Number(params[1]);
        UserInfo_1.default.platform.vibrateByCount(shakeNums);
    }
    //受击硬直
    static skillExpand_7(instance, skill, params, useArr) {
        //让受击者抖动
        if (useArr.length == 0) {
            return;
        }
        for (var i = 0; i < useArr.length; i++) {
            var targetInstance = useArr[i];
            var frame = Number(params[3]);
            var delayTime = Number(params[1]);
            var ratio = Number(params[6]);
            if (params.length < 7) {
                LogsManager_1.default.errorTag("battleCfgsError", "受击抖动配置长度错误,skillId:" + skill._skillId);
            }
            //必须满足概率才硬直或者能够移动
            if (targetInstance.checkCanMove() && (ratio >= 10000 || RandomUtis_1.default.getOneRandomInt(10000, 0, BattleFunc_1.default.battleRandomIndex) < ratio)) {
                var tempParams = params;
                var dx = targetInstance.pos.x - instance.pos.x;
                if (dx < 0) {
                    tempParams = TableUtils_1.default.copyOneArr(params);
                    tempParams[4] = -Number(tempParams[4]);
                }
                if (delayTime > 0) {
                    delayTime = BattleFunc_1.default.instance.turnMinisecondToframe(delayTime);
                    targetInstance.controler.setCallBack(delayTime, instance.shakeCameraByParams, targetInstance, tempParams);
                }
                else {
                    targetInstance.shakeCameraByParams(tempParams);
                }
            }
            targetInstance.setShakeParams(frame, Number(params[2]), Number(params[4]), Number(params[5]));
        }
    }
}
exports.default = SkillExpandTrigger;
//技能扩展触发器. 专门用来扩展一些特殊的技能效果. 
//连线特效
SkillExpandTrigger.EXPAND_TYLE_LINEEFFECT = "1";
//# sourceMappingURL=SkillExpandTrigger.js.map