import InstanceLogical from "../instance/InstanceLogical";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleSkillData from "../data/BattleSkillData";
import InstanceBasic from "../instance/InstanceBasic";
import RandomUtis from "../../../framework/utils/RandomUtis";
import BattleFunc from "../../sys/func/BattleFunc";
import BattleAoeData from "../data/BattleAoeData";
import BattleBuffData from "../data/BattleBuffData";
import BattleConst from "../../sys/consts/BattleConst";
import BuffTrigger from "./BuffTrigger";
import BattleLogsManager from "../../sys/manager/BattleLogsManager";

//选择触发器
export default class ChooseTrigger {

	//选择最近的一个人 可以是敌方,也可以是我方
	public static chooseNearRole(targetRole: InstanceLogical, instanceArr: InstanceLogical[]) {
		var resultRole: InstanceLogical;
		var targetDis: number = 0;
		for (var i = 0; i < instanceArr.length; i++) {
			var role2: InstanceLogical = instanceArr[i];
			var dis = Math.abs(role2.pos.x - targetRole.pos.x);
			if (!resultRole) {
				resultRole = role2;
				targetDis = dis;
			} else {
				if (dis < targetDis) {
					resultRole = role2;
					targetDis = dis;
				}
			}
		}
		return resultRole;
	}

	//选一个绝对距离最近的人  ,添加排除数组
	public static chooseAbsNearRole(targetInstance: InstanceBasic, instanceArr: InstanceLogical[], excludeArr: InstanceLogical[] = null, extraDis = 0) {
		var resultRole: InstanceLogical;
		var targetDis: number = 0;
		for (var i = 0; i < instanceArr.length; i++) {
			var role2: InstanceLogical = instanceArr[i];
			//过滤排除对象
			if (excludeArr && excludeArr.indexOf(role2) != -1) {
				continue;
			}

			var dis = this.getPowerDis(role2.pos, targetInstance.pos);

			if (!resultRole) {
				resultRole = role2;
				targetDis = dis;
			} else {
				if (dis < targetDis) {
					resultRole = role2;
					targetDis = dis;
				}
			}
			//如果距离我最近的敌人大于我可攻击的范围
			if (extraDis && targetDis > extraDis * extraDis) {
				resultRole = null;
			}
		}
		return resultRole;
	}


	//获取角色 根据类型    提升的对象：1.自身2.全队3.前排4.后排5.指定队友，队友ID
	public static getRoleByType(targetRole: InstanceLogical, type, compareValue, out) {
		if (type == 1) {
			out.push(targetRole);
		} else if (type == 2) {
			var campArr = targetRole.campArr;
			for (var i = 0; i < campArr.length; i++) {
				out.push(campArr[i]);
			}
		} else if (type == 3 || type == 4) {
			if (type == 3) {
				compareValue = BattleConst.POSTYPE_QIANPAI
			} else {
				compareValue = BattleConst.POSTYPE_HOUPAI
			}
			;
			var campArr = targetRole.campArr;
			for (var i = 0; i < campArr.length; i++) {
				var instance: InstanceLogical = campArr[i];
				if (instance.posType == compareValue) {
					out.push(instance);
				}
			}
		} else if (type == 5) {
			var campArr = targetRole.campArr;
			for (var i = 0; i < campArr.length; i++) {
				var instance: InstanceLogical = campArr[i];
				if (instance.dataId == compareValue) {
					out.push(instance);
				}
			}
		}
		return out;
	}

	//获取2个实例的距离平方
	public static getPowerDis(p1: any, p2: any) {
		var dx = p1.x - p2.x;
		var dz = p1.z - p2.z;
		return dx * dx + dz * dz
	}

	//选择一个可以释放的技能 chooseOutResultArr[0] 返回结果,-2表示不能释放技能 -1表示有技能cd到了,但是打不到人,0表示正常结果, 2号位 返回选到的技能对象,
	public static chooseSkillToOut(targetRole: InstanceLogical, out: any[]) {
		var skill: BattleSkillData;
		var tempArr: any[];
		out[0] = -2;
		//如果能量满了 而且是自动释放技能的
		if (targetRole.isAutoSKill && targetRole.energy == targetRole.maxEnergy && targetRole.energySkill) {
			skill = targetRole.energySkill
			tempArr = this._initSkillChoose(targetRole, skill);
			if (tempArr.length > 0) {
				out[0] = 0
				out[1] = skill;
				return;
			} else {
				out[0] = -1
				out[1] = skill;
			}
		}
		//如果被沉默了 返回普攻
		if (targetRole.ctrlBuffBit & BuffTrigger.buff_logical_chenmo) {

			BattleLogsManager.battleEcho("id:", targetRole.dataId, "_被沉默了.释放普攻");
			skill = targetRole.normalSkills[targetRole.normalSkills.length - 1];
			tempArr = this._initSkillChoose(targetRole, skill);
			if (tempArr.length > 0) {
				out[0] = 0
				out[1] = skill;
				return;
			}
		}

		for (var i = 0; i < targetRole.normalSkills.length; i++) {
			skill = targetRole.normalSkills[i];
			//技能必须激活
			if (skill.isActive && skill.leftSkillCd <= 0) {

				tempArr = this._initSkillChoose(targetRole, skill);
				if (tempArr.length > 0) {
					out[0] = 0
					out[1] = skill;
					return skill;
				} else {
					out[0] = -1
					out[1] = skill;
				}

			}
		}
		//如果没有技能的cd到了
		if (out[0] == -2) {
			out[0] = -1
			out[1] = targetRole.normalSkills[targetRole.normalSkills.length - 1];
			this._initSkillChoose(targetRole, out[1]);
		}

		return;


	}

	/**
	 * 获取这个技能当前是否能使用
	 * @param targetRole 施法者
	 * @param skill 当前技能信息
	 * @param out 目标对象
	 */
	public static getIsCanUseSkill(targetRole, skill, out) {
		var tempArr = [];
		//技能必须激活
		if (skill.isActive && skill.leftSkillCd <= 0) {
			tempArr = this._initSkillChoose(targetRole, skill);
			if (tempArr.length > 0) {
				out[0] = 0
				out[1] = skill;
			} else {
				out[0] = -1
				out[1] = skill;
			}
		}
	}

	//初始化技能选择目标
	private static _initSkillChoose(targetRole, skill: BattleSkillData) {
		var tempArr = skill.tempChooseArr
		tempArr.length = 0;
		//获取能够检测到的人数量
		ChooseTrigger.getSkillTargetRole(targetRole, skill, skill.chooseTartgetCfg, tempArr);
		return tempArr
	}


	// 选敌类型1.圆 2.矩形 3.扇形
	public static RANGE_CIRCLE: number = 1;
	public static RANGE_RECT: number = 2;
	public static RANGE_SECTOR: number = 3;
	public static RANGE_FULLSCREEN: number = 4;

	// 选择目标阵营 0.自己 1.己方 2.敌方 ,3自己的召唤物
	private static choose_self: number = 0;
	private static choose_selfcamp: number = 1;
	private static choose_tocamp: number = 2;
	private static choose_summoned: number = 3;
	private static choose_campoutself: number = 4;   //己方不包括自己
	private static choose_hitself: number = 5;   //打自己的人
	private static choose_campwithdied: number = 11; //己方包括死亡单位

	//根据targetdata 技能选择可攻击到的人.
	/**
	 *
	 * @param instance 施法者
	 * @param skill  技能
	 * @param targetData
	 * @param out  输出选中数组
	 * @param usedDisInstance  如果不传 那么是以instance为目标去算距离.比如aoe
	 * @param soucePos 传入比较坐标
	 * @package outArea 是否不算距离筛选. 当技能打不到目标的时候 需要从能打到的人 里面选一个目标 并移动过去.这个时候就不能计算是否在攻击区域内
	 */
	public static getSkillTargetRole(instance: InstanceLogical, skill: BattleSkillData, targetData: any, out: InstanceLogical[], usedDisInstance: InstanceLogical = null, soucePos: any = null, outArea: boolean = false) {
		var rangeType = targetData.targetRange;
		var chooseType = targetData.targetGroup;
		var targetArr: InstanceLogical[];
		if (!usedDisInstance) {
			usedDisInstance = instance
		}
		var tempArr;
		var targetNumber = targetData.targetNumber;
		//复用数组的时候一定要把outlength清0.防止变量污染
		out.length = 0;
		//如果选择的是自己
		if (chooseType == ChooseTrigger.choose_self) {
			out.push(instance);
			return out;
		} else if (chooseType == ChooseTrigger.choose_selfcamp) {
			targetArr = instance.campArr;
		} else if (chooseType == ChooseTrigger.choose_tocamp) {
			targetArr = instance.toCampArr;
			//如果
			var betauntTarget: InstanceLogical = instance.beTauntTargetInfo.target
			if (betauntTarget) {
				if (betauntTarget.hp == 0) {
					if (instance.beTauntTargetInfo.buff) {
						instance.clearOneBuff(instance.beTauntTargetInfo.buff)
					}
				} else {
					//如果是选择单体技的.那么一定会走朝嘲讽的怪走
					if (targetNumber == 1) {
						tempArr = BattleFunc.getOneTempArr()
						tempArr.push(betauntTarget);
						targetArr = tempArr;
					}
				}
			}

			//选择排除自己的阵营
		} else if (chooseType == this.choose_campoutself) {
			tempArr = BattleFunc.getOneTempArr()
			for (var i = 0; i < instance.campArr.length - 1; i++) {
				var tempInstance = instance.campArr[i];
				if (tempInstance != instance) {
					tempArr.push(tempInstance);
				}
			}
			targetArr = tempArr;
			//选择包括死亡的阵营
		} else if (chooseType == this.choose_campwithdied) {
			tempArr = BattleFunc.getOneTempArr()
			if (instance.diedArr.length > 0) {
				for (var i = 0; i < instance.campArr.length; i++) {
					var tempInstance = instance.campArr[i];
					tempArr.push(tempInstance);
				}
				for (var i = 0; i < instance.diedArr.length; i++) {
					var tempInstance = instance.diedArr[i];
					tempArr.push(tempInstance);
				}
				targetArr = tempArr;
			} else {
				//降低遍历复杂度
				targetArr = instance.campArr;
			}
		} else if (chooseType == this.choose_hitself) {
			tempArr = BattleFunc.getOneTempArr();
			//如果是选攻击自己的人
			if (instance.tempBeUsedValue && instance.tempBeUsedValue[2]) {
				tempArr.push(instance.tempBeUsedValue[2]);
			}
			targetArr = tempArr
		}
		if (!soucePos) {
			soucePos = instance.pos;
		}
		//范围参数
		var rangeParams = targetData.rangeParams;
		if (!outArea) {
			//算距离
			if (rangeType == ChooseTrigger.RANGE_CIRCLE || rangeType == ChooseTrigger.RANGE_SECTOR) {
				this.chooseRoleByCircle(usedDisInstance, rangeParams[0], rangeParams[1], rangeParams[2], targetArr, -1, out, null, rangeParams[3] || 360, soucePos);
			} else if (rangeType == ChooseTrigger.RANGE_RECT) {
				this.chooseRoleByRect(usedDisInstance, rangeParams[0], rangeParams[1], rangeParams[2], rangeParams[3], targetArr, -1, out, null, soucePos);
			} else if (rangeType == ChooseTrigger.RANGE_FULLSCREEN) {
				//打全屏
				if (targetArr) {
					for (var i = 0; i < targetArr.length; i++) {
						out.push(targetArr[i]);
					}
				}
			} else {
				for (var i = 0; i < targetArr.length; i++) {
					out.push(targetArr[i]);
				}
			}
		} else {
			for (var i = 0; i < targetArr.length; i++) {
				out.push(targetArr[i]);
			}
		}


		this.initArrpriority(out)
		//排除不能被选择的人
		this.excludeUnChooseRole(instance, out);
		//这里还需要对结果最后一次筛选
		// targetChoose 放后实现
		if (out.length > 0) {
			//定义一个排序优先级
			if (targetData.targetType) {
				this.chooseByTargetType(out, targetData.targetType)
			}

			if (targetData.targetChoose) {
				var chooseCondArr: number[] = targetData.targetChoose
				for (var i = 0; i < chooseCondArr.length; i++) {
					var func = this["chooseRoleBy_" + chooseCondArr[i]];
					if (!func) {
						LogsManager.errorTag("cfgerror", "battle 没有对应的选择类型,targetId:", targetData.id, "targetChoose:", i);
					} else {
						//如果有第三个参数 那么把选择的数量也传进去
						func.call(this, instance, out);
					}
				}
			}
			//如果排除距离检测的. 那么把这些人按照距离排序.
			if (outArea) {
				this.chooseRoleBy_7(instance, out);
			}
			if (targetNumber > 0 && targetNumber < out.length) {
				out.length = targetNumber;
			}


		}
		if (tempArr) {
			BattleFunc.cacheOneTempArr(tempArr);
		}

		return out;

	}


	//获取aoe能攻击到的人
	public static getAoeTargetRole(aoeData: BattleAoeData, attacker: InstanceLogical, targetInstance: InstanceLogical, out: InstanceLogical[]) {
		this.getSkillTargetRole(attacker, null, aoeData.chooseTartgetCfg, out, targetInstance, aoeData._initTargtPos);
		return out;
	}


	//根据目标类型优先级排序
	private static chooseByTargetType(useArr: InstanceLogical[], targetType: any[]) {
		for (var i = useArr.length - 1; i >= 0; i--) {
			var role: InstanceLogical = useArr[i];
			role.tempSortValue = 100;
			for (var s = 0; s < targetType.length; s++) {
				var tempInfo = targetType[s];
				if (role.lifeType == Number(tempInfo[0])) {
					var tempPri = Number(tempInfo[1])
					//-1优先级表示要从筛选目标里面剔除
					if (tempPri == -1) {
						useArr.splice(i, 1);
					} else {
						role.tempSortValue = tempPri;
					}
					//定义排序优先级
					break;
				}
			}
			role.tempSortPriority = role.tempSortValue;
		}
		useArr.sort(this.sortByTmepValueAdd);
		return useArr;
	}

	//根据圆去选择范围
	public static chooseRoleByCircle(instance: any, r, x, z, targetArr: InstanceLogical[], chooseNums: number, out: InstanceLogical[], excludeArr: InstanceLogical[] = null, ang: number = 0, soucePos: any = null) {
		out.length = 0;
		if (!ang) {
			ang = 360;
		}
		var useSourcePos: boolean = false;
		if (!soucePos) {
			soucePos = instance.pos;
		} else {
			useSourcePos = true;
		}
		//x需要根据视图方向算偏移
		x = soucePos.x + x * instance._viewWay;
		z += soucePos.z;
		var y = instance.pos.y;
		if (instance.initOffsetY) {
			y -= instance.initOffsetY
		}

		if (chooseNums == -1) {
			chooseNums = 9999;
		}
		var spdx: number = instance.speed.x;
		var spdy: number = instance.speed.y;
		var spdz: number = instance.speed.z;
		if (useSourcePos) {
			spdx = 0;
			spdz = 0;
		}
		var radArea: number;

		var spdAbs = Math.sqrt(spdx * spdx + spdy * spdy + spdz * spdz);
		var powr = (r + spdAbs) * (r + spdAbs);
		if (ang < 360) {
			//把角度转为弧度同时除以2
			radArea = ang * BattleFunc.angletoRad / 2;
		}

		for (var i = 0; i < targetArr.length; i++) {
			var targetInstance: InstanceLogical = targetArr[i];

			//如果在排除数组里面也不执行
			if (excludeArr && excludeArr.indexOf(targetInstance) != -1) {
				continue;
			}
			// var disSpdx = (targetInstance.speed.x - spdx)
			// var disSpdz = (targetInstance.speed.z - spdz);
			// var disSpdy = (targetInstance.speed.y - spdy);
			// var disSpd = disSpdx * disSpdx + disSpdz * disSpdz * disSpdy*disSpdy;

			var disx: number = targetInstance.pos.x - x;
			var disy: number = targetInstance.pos.y - y;
			var disz: number = targetInstance.pos.z - z;
			//这里需要把对象的速度加进去做碰撞检测
			if (disx * disx + disz * disz + disy * disy <= powr) {
				//这里还需要根据扇形判断角度
				if (ang < 360) {
					var disAng = Math.atan2(disz, disx);
					if (Math.abs(disAng) > radArea) {
						continue;
					}
				}

				out.push(targetInstance);
				if (out.length == chooseNums) {
					break;
				}
			}

		}
		return out;

	}

	//根据矩形区域选择
	public static chooseRoleByRect(instance: any, w, h, x, z, targetArr: InstanceLogical[], chooseNums: number, out: InstanceLogical[], excludeArr: InstanceLogical[] = null, soucePos: any = null) {
		out.length = 0;
		var useSourcePos: boolean = false;
		if (!soucePos) {
			soucePos = instance.pos
		} else {
			useSourcePos = true;
		}
		x = soucePos.x + x * instance._viewWay;
		z = soucePos.z;

		var y = instance.pos.y;
		if (instance.initOffsetY) {
			y -= instance.initOffsetY
		}

		if (chooseNums == -1) {
			chooseNums = 9999;
		}
		var halfw = w / 2;
		var halfh = h / 2;

		var spdx: number = instance.speed.x;
		var spdy: number = instance.speed.y;
		var spdz: number = instance.speed.z;
		if (useSourcePos) {
			spdx = 0;
			spdz = 0;
		}

		for (var i = 0; i < targetArr.length; i++) {
			var targetInstance: InstanceLogical = targetArr[i];
			//如果在排除数组里面也不执行
			if (excludeArr && excludeArr.indexOf(targetInstance) != -1) {
				continue;
			}
			var disSpdx = Math.abs(targetInstance.speed.x - spdx)
			var disSpdz = Math.abs(targetInstance.speed.z - spdz);
			var disSpdy = Math.abs(targetInstance.speed.y - spdy);

			var disx: number = Math.abs(targetInstance.pos.x - x);
			var disz: number = Math.abs(targetInstance.pos.z - z);
			var disy: number = Math.abs(targetInstance.pos.y - y);
			//因为子弹速度很快.所以距离一定要加上一个速度差.
			if (disx <= halfw + disSpdx && disz <= halfh + disSpdz && disy <= h + disSpdy) {
				out.push(targetInstance);
				if (out.length == chooseNums) {
					break;
				}
			}
		}
		return out;
	}


	//获取指定阵形id的角色
	public static getRoleByFormation(formation: string, campArr: InstanceLogical[]) {
		for (var i = 0; i < campArr.length; i++) {
			var ins = campArr[i];
			if (ins.formationId == formation) {
				return ins;
			}
		}
		return null;
	}


	//获取指定阵形id的角色
	public static getPlayerById(id: string, campArr: InstanceLogical[]) {
		for (var i = 0; i < campArr.length; i++) {
			var ins = campArr[i];
			if (ins.dataId == id && ins.lifeType == BattleConst.LIFE_PLAYER) {
				return ins;
			}
		}
		return null;
	}


	public static checkCanChoose(attacker: InstanceLogical, defer: InstanceLogical) {
		var targetBit = defer.ctrlBuffBit;
		//如果不能被所有人选中
		if (targetBit & BuffTrigger.safeByAllBuffBit) {
			return false;
			//不能被对方选中
		} else if ((targetBit & BuffTrigger.safeBuffBit) && defer.camp != attacker.camp) {
			return false;
		}
		return true;

	}

	//剔除不可选中的目标
	public static excludeUnChooseRole(attacker: InstanceLogical, targetArr: InstanceLogical[]) {
		if (targetArr.length == 0) {
			return;
		}
		var len = targetArr.length;
		for (var i = len - 1; i >= 0; i--) {
			var targetRole = targetArr[i];
			if (!this.checkCanChoose(attacker, targetRole)) {
				targetArr.splice(i, 1);
			}
		}

	}


	//---------------------------------根据技能类型筛选-------------------------------------
	//---------------------------------所有筛选都是最优先的放前面-------------------------------------
	//---------------------------------根据技能类型筛选-------------------------------------

	//选择全体
	public static chooseRoleBy_1(attacker: InstanceLogical, useArr: InstanceLogical[], chooseNums: number = -1) {
		return useArr;
	}

	//对数组随机.后续需要对临时创建的数组做优化
	public static chooseRoleBy_2(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		// 随机排序. 给每个对象定义一个随机临时值
		for (var i = 0; i < useArr.length; i++) {
			var instance = useArr[i];
			instance.tempSortValue = RandomUtis.getUintRandom(BattleFunc.battleRandomIndex);
		}
		useArr.sort(this.sortByTmepValueAdd);
		return useArr;
	}

	//血量最低
	public static chooseRoleBy_3(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		useArr.sort(this.sortByHpAdd);
		return useArr;
	}

	//血量最高
	public static chooseRoleBy_4(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		useArr.sort(this.sortByHpReduce);
		return useArr;
	}

	//优先前排
	public static chooseRoleBy_5(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		this.comparePos = attacker.pos;
		useArr.sort(this.sortByFrontFormation);
		return useArr;
	}

	private static initArrpriority(useArr: InstanceLogical[]) {
		for (var i = 0; i < useArr.length; i++) {
			useArr[i].tempSortPriority = 100;
		}
	}


	//优先后排
	public static chooseRoleBy_6(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		this.comparePos = attacker.pos;
		useArr.sort(this.sortByBackFormation);
		return useArr;
	}

	//距离最近
	public static chooseRoleBy_7(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		var minDisPower: number = null;
		for (var i = 0; i < useArr.length; i++) {
			var role2: InstanceLogical = useArr[i];
			var dx = role2.pos.x - attacker.pos.x;
			var dz = role2.pos.z - attacker.pos.z;
			role2.tempSortValue = dx * dx + dz * dz;
		}
		useArr.sort(this.sortByTmepValueAdd);
		return useArr;

	}

	//距离最远
	public static chooseRoleBy_8(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		for (var i = 0; i < useArr.length; i++) {
			var role2: InstanceLogical = useArr[i];
			var dx = role2.pos.x - attacker.pos.x;
			var dz = role2.pos.z - attacker.pos.z;
			role2.tempSortValue = dx * dx + dz * dz;
		}
		useArr.sort(this.sortByTmepValueReduce);
		return useArr;

	}

	//死亡单位
	public static chooseRoleBy_9(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		for (var i = useArr.length - 1; i >= 0; i--) {
			var instance = useArr[i];
			//如果血量大于0 那么优先级放低
			if (instance.hp > 0) {
				instance.tempSortPriority += 1
			}
		}
		useArr.sort(this.sortByPriority);
		return useArr;
	}

	//血量万分比最低
	public static chooseRoleBy_10(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		useArr.sort(this.sortByHpReducePercent);
		return useArr;
	}

	//血量万分比最高
	public static chooseRoleBy_11(attacker: InstanceLogical, useArr: InstanceLogical[]) {
		useArr.sort(this.sortByHpAddPercent);
		return useArr;
	}

	//-----------------------------获取buff筛选到的人 ------------------------------------------
	public static getTargetRoleByBuff(def: InstanceLogical, buffData: BattleBuffData, outArr: InstanceLogical[]) {
		// 被buff能选到的人
		this.getSkillTargetRole(def, null, buffData.chooseTartgetCfg, outArr);
		return outArr;
	}

	//---------------------------排序算法 --------------------------------

	private static sortByPriority(r1: InstanceLogical, r2: InstanceLogical) {
		return r1.tempSortPriority - r2.tempSortPriority;
	}

	//根据血量增序排列
	private static sortByHpAdd(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			if (r1.hp > r2.hp) {
				return 1
			} else if (r1.hp == r2.hp) {
				return 0;
			} else {
				return -1;
			}
		}
		return disPri

	}

	//根据血量减序排列
	private static sortByHpReduce(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			if (r1.hp > r2.hp) {
				return -1
			} else if (r1.hp == r2.hp) {
				return 0;
			} else {
				return 1;
			}
		}
		return disPri;

	}

	//根据血量万分比减序排列
	private static sortByHpReducePercent(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			if (r1.hpPercent > r2.hpPercent) {
				return -1
			} else if (r1.hpPercent == r2.hpPercent) {
				return 0;
			} else {
				return 1;
			}
		}
		return disPri;

	}

	//根据血量增序排列
	private static sortByHpAddPercent(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			if (r1.hpPercent > r2.hpPercent) {
				return 1
			} else if (r1.hpPercent == r2.hpPercent) {
				return 0;
			} else {
				return -1;
			}
		}
		return disPri

	}

	//根据位置筛选 前排优先
	/**
	 * 如果需要从多个目标中选择，则按距离最近的规则再次筛选。
    如果距离完全相同，则随机筛选。
    如果前排完全不存在，则从后排中选择，否则即使数量不足也只选前排。
	 */
	private static comparePos: any;

	private static sortByFrontFormation(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			var disPos = r1.posType - r2.posType;
			if (disPos == 0) {
				var dis1 = ChooseTrigger.getPowerDis(r1.pos, ChooseTrigger.comparePos);
				var dis2 = ChooseTrigger.getPowerDis(r2.pos, ChooseTrigger.comparePos);
				return dis1 - dis2;
			} else {
				return disPos;
			}
		}
		return disPri;

	}

	//优先后排
	private static sortByBackFormation(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			var disPos = r2.posType - r1.posType;
			if (disPos == 0) {
				var dis1 = ChooseTrigger.getPowerDis(r1.pos, ChooseTrigger.comparePos);
				var dis2 = ChooseTrigger.getPowerDis(r2.pos, ChooseTrigger.comparePos);
				return dis1 - dis2;
			} else {
				return disPos;
			}
		}
		return disPri;

	}


	//临时变量增序排序 ,先排一下优先级
	private static sortByTmepValueAdd(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			return r1.tempSortValue - r2.tempSortValue;
		}
		return disPri;
	}

	//临时变量增序排序 ,先排一下优先级
	private static sortByTmepValueReduce(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			return r2.tempSortValue - r1.tempSortValue;
		}
		return disPri;
	}

	//同等优先级随机排序
	private static sortByRandom(r1: InstanceLogical, r2: InstanceLogical) {
		var disPri = r1.tempSortPriority - r2.tempSortPriority;
		if (disPri == 0) {
			var random = RandomUtis.getOneRandom(BattleFunc.battleRandomIndex);
			return random - 0.5;
		}
		return disPri;
	}


} 