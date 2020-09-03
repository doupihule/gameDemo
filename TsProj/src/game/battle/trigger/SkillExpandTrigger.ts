import InstanceLogical from "../instance/InstanceLogical";
import BattleSkillData from "../data/BattleSkillData";

import BattleFunc from "../../sys/func/BattleFunc";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";
import BattleRoleView from "../view/BattleRoleView";
import UserInfo from "../../../framework/common/UserInfo";
import RandomUtis from "../../../framework/utils/RandomUtis";
import TableUtils from "../../../framework/utils/TableUtils";
import SwitchModel from "../../sys/model/SwitchModel";

/**
 * 技能或者ai扩展. 目前实现 连线特效. 播放声音.  震屏.
 */

export default class SkillExpandTrigger {
	//技能扩展触发器. 专门用来扩展一些特殊的技能效果.

	//连线特效
	static EXPAND_TYLE_LINEEFFECT: string = "1"


	public static onCheckExpand(instance: InstanceLogical, skill: BattleSkillData, expandParams: any, useArr: InstanceLogical[], isFollow = false) {
		if (!expandParams) {
			return
		}
		for (var i = 0; i < expandParams.length; i++) {
			var info = expandParams[i];
			var type = info[0];
			var func = this["skillExpand_" + type];
			if (!func) {
				LogsManager.errorTag("skillExpandError", "错误的技能扩展类型:" + type);
			} else {
				func.call(this, instance, skill, info, useArr, isFollow);
			}
		}

	}


	//创建连线特效
	public static skillExpand_1(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[], isFollow) {
		if (!useArr) {
			BattleLogsManager.battleWarn("连线特效没有目标,skill:", skill._skillId);
			return;
		}

		var sourceLenth = Number(params[13]);
		var tweenTime = Number(params[14]);

		for (var i = 0; i < useArr.length; i++) {
			var targetRole = useArr[i];
			var tempArr = params.slice(1, 13);
			var expandPams = {
				type: params[0],
				length: Number(sourceLenth),
				frame: Math.floor(tweenTime * BattleFunc.miniSecondToFrame),
				role: targetRole
			};   // [params[0], sourceLenth, tweenTime, targetRole];
			instance.createOneEffByParam(tempArr, isFollow, false, expandPams);
		}

	}

	//震屏参数, 延迟时间(ms),震屏方式,持续时间(为帧,因为时间很短,所以必须绝对精确),震屏力度,震屏频率(多少帧震一次,一般2-4帧调整)
	public static skillExpand_2(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {

		var delayTime = Number(params[1]);
		if (delayTime > 0) {
			delayTime = BattleFunc.instance.turnMinisecondToframe(delayTime);
			instance.controler.setCallBack(delayTime, instance.controler.cameraControler.shakeCameraByParams, instance.controler.cameraControler, params);
		} else {
			instance.controler.cameraControler.shakeCameraByParams(params)
		}
	}

	//播放音效
	public static skillExpand_3(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {
		var sound = params[3];
		var delayTime = Number(params[1]);
		if (delayTime > 0) {
			delayTime = BattleFunc.instance.turnMinisecondToframe(delayTime);
		}

		instance.controler.setCallBack(delayTime, instance.controler.playSoundByParams, instance.controler, params);
	}

	//隐藏slot
	public static skillExpand_4(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {
		var view: BattleRoleView = instance.getView();
		for (var i = 1; i < params.length; i++) {
			var slotName = params[i];
			view.showOrHideSlot(slotName, false);
		}

	}

	//创建飘字效果
	public static skillExpand_5(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {
		var name = params[1]
		var continueTime = Number(params[2]);
		var scaleRate = Number(params[3]) / 10000;
		instance.controler.battleUI.freshSkillTipGroup(name, continueTime, scaleRate)
	}

	//微震动效果
	public static skillExpand_6(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {
		//微震动开关是1 说明关闭了微震动
		if (SwitchModel.instance.getSwitchByType(SwitchModel.shake_switch)) return;
		var shakeNums = Number(params[1]);
		UserInfo.platform.vibrateByCount(shakeNums);

	}

	//受击硬直
	public static skillExpand_7(instance: InstanceLogical, skill: BattleSkillData, params: any[], useArr: InstanceLogical[]) {
		//让受击者抖动
		if (useArr.length == 0) {
			return;
		}
		for (var i = 0; i < useArr.length; i++) {
			var targetInstance: InstanceLogical = useArr[i];
			var frame = Number(params[3]);

			var delayTime = Number(params[1]);
			var ratio = Number(params[6]);
			if (params.length < 7) {
				LogsManager.errorTag("battleCfgsError", "受击抖动配置长度错误,skillId:" + skill._skillId)
			}
			//必须满足概率才硬直或者能够移动
			if (targetInstance.checkCanMove() && (ratio >= 10000 || RandomUtis.getOneRandomInt(10000, 0, BattleFunc.battleRandomIndex) < ratio)) {
				var tempParams = params;
				var dx: number = targetInstance.pos.x - instance.pos.x;
				if (dx < 0) {
					tempParams = TableUtils.copyOneArr(params);
					tempParams[4] = -Number(tempParams[4]);
				}
				if (delayTime > 0) {
					delayTime = BattleFunc.instance.turnMinisecondToframe(delayTime);
					targetInstance.controler.setCallBack(delayTime, instance.shakeCameraByParams, targetInstance, tempParams);
				} else {
					targetInstance.shakeCameraByParams(tempParams)
				}
			}


			targetInstance.setShakeParams(frame, Number(params[2]), Number(params[4]), Number(params[5]))
		}

	}

}