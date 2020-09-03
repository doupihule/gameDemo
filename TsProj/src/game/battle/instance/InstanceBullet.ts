import InstanceMove from "./InstanceMove";
import InstanceLogical from "./InstanceLogical";
import BattleFunc from "../../sys/func/BattleFunc";
import BattleConst from "../../sys/consts/BattleConst";
import SkillActionData from "../data/SkillActionData";

import ChooseTrigger from "../trigger/ChooseTrigger";
import SkillActionTrigger from "../trigger/SkillActionTrigger";
import RandomUtis from "../../../framework/utils/RandomUtis";
import PoolTools from "../../../framework/utils/PoolTools";
import BattleAoeData from "../data/BattleAoeData";
import PoolCode from "../../sys/consts/PoolCode";

//子弹基类
export default class InstanceBullet extends InstanceMove {

	public owner: InstanceLogical;
	public skillAction: SkillActionData
	public cfgData: any;
	public moveSpeed: number = 0;
	public moveLength: number = 0;
	//剩余检测碰撞次数
	public leftCollisionTimes: number = 1;
	private _hasHitNums: number = 0;

	//重复检测帧数
	private _repeatCheckFrame: number = 0;

	//运动时长
	public moveFrame: number = 0;

	private _chooseTargetArr: InstanceLogical[];

	private collisionType: number;   //碰撞类型
	private collisionParams: any[]

	private skillActionArr: SkillActionData[];
	private hitLandActionArr: SkillActionData[]
	//命中过的人数组缓存起来防止重复检测
	private _mingzhongArr: InstanceLogical[]

	//旋转角度样式
	private _rotationStyle: number

	//碰撞后的行为
	private _collisionParams: number[];
	//当前跟随的role
	private _followRole: InstanceLogical;

	private _bulletMoveType: number;

	//初始y坐标偏移
	public initOffsetY: number = 0;


	constructor(controler) {
		super(controler);
		this.classModel = BattleConst.model_bullet;
	}

	//初始化数据
	public setData(data: any) {
		if (!this._mingzhongArr) {
			this._mingzhongArr = []
		} else {
			this._mingzhongArr.length = 0;
		}
		super.setData(data);
		this._followRole = null
		this.setViewWay(1);
		this.setRotation(0);
		this.cfgData = BattleFunc.instance.getCfgDatas("Bullet", data.id);
		this.collisionType = this.cfgData.collisionRange;
		this.collisionParams = this.cfgData.rangeParams;
		if (!this.skillActionArr) {
			this.skillActionArr = []
		}
		if (!this.hitLandActionArr) {
			this.hitLandActionArr = []
		}

		// this.skillActionArr =[];

	}

	//设置数据 rotation角度
	public setOwner(owner: InstanceLogical, skillAction: SkillActionData, rotation: number, targetRole: InstanceLogical) {
		this.owner = owner;
		this.cfgScale = owner.cfgScale
		this.skillAction = skillAction;
		this._rotationStyle = rotation;
		var collisionParams = this.cfgData.collisionAction;
		var tagStr = "Bullet:" + this.dataId;
		if (collisionParams) {
			this._collisionParams = [];
			this._collisionParams[0] = Number(collisionParams[0]);
			//执行碰撞行为的概率
			this._collisionParams[1] = this.skillAction.skill.getSkillValue(collisionParams[1], tagStr);

			//如果是反弹的 默认重复检测间隔为60帧
			if (this._collisionParams[0] == BattleConst.bullet_hit_bounce) {
				this._repeatCheckFrame = 60
			} else {
				this._repeatCheckFrame = Number(collisionParams[2]);
				if (this._repeatCheckFrame > 0) {
					this._repeatCheckFrame = BattleFunc.instance.turnMinisecondToframe(this._repeatCheckFrame);
				}
			}

		}
		if (this._myView) {
			this._myView.play(0, true, true);
		}
		//记录y坐标差
		this.initOffsetY = this.pos.y - owner.pos.y;
		//如果主角是有多个视图的 那么放多个子弹
		if (owner._myView && this._myView) {
			this._myView.setSpace(owner._myView._xSpace, owner._myView._ySpace);
			this._myView.changeViewNums(owner._myView.currentViewNums);
		}

		//根据运动类型决定 怎么运动
		//如果是按直线运动了
		this.leftCollisionTimes = Number(this.cfgData.collisionTimes);
		this._hasHitNums = 0;
		var targetType = this.cfgData.targetType;
		if (targetType == 1) {
			if (!targetRole) {
				LogsManager.errorTag("bulletError", "没有传入目标角色");
				this._chooseTargetArr = []
			} else {
				this._chooseTargetArr = [targetRole];
			}

		} else if (targetType == 2) {
			this._chooseTargetArr = owner.campArr;
		} else {
			this._chooseTargetArr = owner.toCampArr;
		}

		var skillEff = this.cfgData.skillEffect;
		if (skillEff) {
			for (var i = 0; i < skillEff.length; i++) {
				if (!this.skillActionArr[i]) {
					var skillAction = new SkillActionData(String(skillEff[i]), owner, skillAction.skill, 0, 0, 0, 0, 0);
					this.skillActionArr[i] = skillAction;
				} else {
					//刷新数据即可
					this.skillActionArr[i].updateData(owner, skillAction.skill);
				}

			}
		}

		this.resetMoveAct(targetRole)
		var offset = this.cfgData.offset || 0;
		if (offset) {
			this.adjustInitPos(targetRole);
			this.initOffsetY = this.pos.y - owner.pos.y;
			this.resetMoveAct(targetRole)
		}


	}

	//调整初始位置
	private adjustInitPos(targetRole: InstanceLogical) {
		var offset = (this.cfgData.offset || 0) * this.cfgScale;
		if (!offset) {
			return;
		}

		var spdAbs = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y + this.speed.z * this.speed.z);
		if (spdAbs == 0) {
			return;
		}
		var ofx = this.speed.x / spdAbs * offset
		var ofy = this.speed.y / spdAbs * offset
		var ofz = this.speed.z / spdAbs * offset
		this.setPos(this.pos.x + ofx, this.pos.y + ofy, this.pos.z + ofz);

		var disX1 = targetRole.pos.x - this.owner.pos.x;
		var disZ1 = targetRole.pos.z - this.owner.pos.z;

		var disX2 = this.pos.x - this.owner.pos.x
		var disZ2 = this.pos.z - this.owner.pos.z

		var disSq1 = disX1 * disX1 + disZ1 * disZ1;
		var disSq2 = disX2 * disX2 + disZ2 * disZ2;
		//如果敌人在我和子弹中间.  那么把我调整到 中间去
		if (disSq2 > disSq1) {
			this.setPos((targetRole.pos.x + this.owner.pos.x) / 2, this.pos.y, (targetRole.pos.z + this.owner.pos.z) / 2)
		}


	}


	//执行ai逻辑
	public doAiLogical() {


		//判断调整速度
		this.checkAdjustAngle()
		//判断跟随
		this.checkFollowRole();
		//检测碰人ai
		this.checkAttack(this.skillActionArr);

		//判断子弹是否销毁
		this.updateLeftTime();

		//判断落地
		this.checkHitLandAction();

	}

	//判断逻辑行为
	private checkHitLandAction() {
		if (this.speed.y <= 0) {
			return;
		}

		//落地成功
		if (this.pos.y - this.speed.y <= 10) {
			return;
		}
		this.speed.y = 0;

		var fallEffect = this.cfgData.fallEffect
		if (fallEffect) {
			for (var i = 0; i < fallEffect.length; i++) {
				var aoeId = fallEffect[i];
				var aoeData: BattleAoeData = PoolTools.getItem(PoolCode.POOL_AOEDATA + aoeId);
				if (!aoeData) {
					aoeData = new BattleAoeData(aoeId);
				}
				aoeData.setData(this.skillActionArr[0], this.owner);
				//开始执行aoe效果
				aoeData.doAoeAction(this.owner, this.pos, this);
			}
		}

		// this.checkAttack(this.hitLandActionArr);
		//销毁自己
		this.controler.destroyBullet(this);

	}


	//判断抛物线调整角度
	private checkAdjustAngle() {
		if (this._myState != BattleConst.state_jump) {
			return;
		}
		//每2帧调整一次
		if (this.updateCount % 2 == 0) {
			return;
		}

		var ang = Math.atan2(this.speed.z + this.speed.y, this.speed.x);
		this.setRotationRad(ang);

	}


	//判断跟随角色
	private checkFollowRole() {
		if (!this._followRole) {
			return;
		}
		//如果已经挂了 也不执行
		if (this._followRole.hp <= 0) {
			this._followRole = null;
			this.controler.destroyBullet(this);
			return;
		}

		this.resetMoveAct(this._followRole);

	}

	//检测攻击. 子弹因为速度快.所以需要每帧都计算 注意运算效率
	private checkAttack(skillActionArr: SkillActionData[]) {
		if (this.leftCollisionTimes == 0) {
			return;
		}
		//检测距离
		var tempArr = BattleFunc.getOneTempArr();
		//
		if (this.collisionType == ChooseTrigger.RANGE_CIRCLE) {
			ChooseTrigger.chooseRoleByCircle(this, this.collisionParams[0] * this.cfgScale, 0, 0, this._chooseTargetArr, 1, tempArr, this._mingzhongArr);
		} else if (this.collisionType == ChooseTrigger.RANGE_RECT) {
			ChooseTrigger.chooseRoleByRect(this, this.collisionParams[0] * this.cfgScale, this.collisionParams[1] * this.cfgScale, 0, 0, this._chooseTargetArr, 1, tempArr, this._mingzhongArr);
		}
		//剔除掉不能被选中的人
		ChooseTrigger.excludeUnChooseRole(this.owner, tempArr);

		//对碰到的人执行效果
		if (tempArr.length > 0) {
			this.leftCollisionTimes--;
			this._hasHitNums++;
			for (var i = 0; i < tempArr.length; i++) {
				this._mingzhongArr.push(tempArr[i]);
			}

			var hitRatio = 0;
			if (this.cfgData.collisionDamage) {
				hitRatio = this.cfgData.collisionDamage[this._hasHitNums - 2] || 0;

			}

			//遍历所有的技能效果执行
			for (var s = 0; s < skillActionArr.length; s++) {
				//读取碰撞伤害率
				// var value = this.d
				if (hitRatio != 0) {
					//那么增加最终伤害
					this.owner.attrData.changeOneTempAttr(BattleConst.attr_final_damage, hitRatio, 0);
				}
				SkillActionTrigger.checkSkillAction(this.owner, skillActionArr[s], tempArr);
			}

			if (this._repeatCheckFrame > 0) {
				this.controler.setCallBack(this._repeatCheckFrame, this.clearHitArr, this);
			}
			//如果没有可攻击的人了 就销毁子弹
			if (this.leftCollisionTimes == 0) {
				this.controler.destroyBullet(this);
			} else {
				//执行碰到后行为
				this.doAfterHit();
			}

		}
		BattleFunc.cacheOneTempArr(tempArr);
	}

	//清除击中过的人
	private clearHitArr() {
		this._mingzhongArr.length = 0;
	}

	//碰撞后做的事情
	private doAfterHit() {
		if (!this._collisionParams) {
			return;
		}
		var type = this._collisionParams[0];
		//0穿透 1 弹射, 2返回
		if (type == BattleConst.bullet_hit_through) {
			return;
		} else if (type == BattleConst.bullet_hit_bounce) {


			if (!this.checkHitRatio()) {
				this._followRole = null;
				//销毁子弹
				this.controler.destroyBullet(this);
				return
			}

			//选择最近的一个目标
			var nearRole = ChooseTrigger.chooseAbsNearRole(this, this._chooseTargetArr, this._mingzhongArr, this.cfgData.pathParams[1]);
			if (nearRole) {
				this.resetMoveAct(nearRole);
			} else {
				//如果没有最近的目标 而且命中目标人数超过2人. 那么重新选上一次命中过的人
				if (this._mingzhongArr.length >= 2) {
					this._mingzhongArr.splice(0, this._mingzhongArr.length - 1);
					nearRole = ChooseTrigger.chooseAbsNearRole(this, this._chooseTargetArr, this._mingzhongArr, this.cfgData.pathParams[1]);
					//那么再选一次
					if (nearRole) {
						this.resetMoveAct(nearRole);
						return;
					}
				}

				this._followRole = null;
			}
			if (!nearRole) {
				this.controler.destroyBullet(this);
			}

		} else if (type == BattleConst.bullet_hit_back) {
			//如果不满足碰后概率
			if (!this.checkHitRatio()) {
				return
			}
			//那么回到发射者那里去
			this.resetMoveAct(this.owner);
		}

	}

	//判断是否满足碰撞后的概率
	private checkHitRatio() {
		var raqtio = this._collisionParams[1];
		if (!raqtio) {
			return true;
		}
		var random = RandomUtis.getOneRandom();
		if (random * 10000 > raqtio) {
			return false;
		}
		return true
	}

	//重置朝目标移动
	private resetMoveAct(targetRole: InstanceLogical) {
		var rotation = this._rotationStyle;
		var moveType = this.cfgData.type
		this._bulletMoveType = moveType;
		var xspd: number;
		var yspd: number = 0;
		var zspd: number;
		var ang: number;
		var spdValue = BattleFunc.instance.turnSpeedToFrame(this.cfgData.pathParams[0]);
		var dy: number = targetRole.pos.y - this.pos.y + this.initOffsetY;
		var dx: number = targetRole.pos.x - this.pos.x;
		var dz: number = targetRole.pos.z - this.pos.z;
		var absDy = Math.abs(dy);
		var dis

		var pathParams = this.cfgData.pathParams;
		var tempArr
		//如果是空中单位.那么抛物线强制改成 直线运动
		if (targetRole.lifeType == BattleConst.LIFE_AIRHERO) {
			moveType = BattleConst.BULLET_MOVE_LINE;
			//这里需要把抛物线运动参数转化成直线运动
			tempArr = BattleFunc.getOneTempArr();
			tempArr[0] = pathParams[0] * 1.2
			tempArr[1] = 1000
			pathParams = tempArr
		}

		if (moveType == BattleConst.BULLET_MOVE_LINE) {

			//水平运动子弹不受重力
			this.gravityAble = false;
			//如果角度是-1 那么根据敌人算角度
			if (rotation == -1) {
				if (absDy > 10) {
					//那么要计算实际y坐标
					dis = Math.sqrt(dx * dx + dz * dz + dy * dy);
					var spdperDis = spdValue / dis;
					yspd = dy * spdperDis;
					xspd = dx * spdperDis;
					zspd = dz * spdperDis;
				} else {
					dis = Math.sqrt(dx * dx + dz * dz);
					var spdperDis = spdValue / dis;
					xspd = dx * spdperDis;
					zspd = dz * spdperDis;
				}
				var r = Math.atan2(yspd + zspd, xspd);
				ang = r;
				rotation = r * BattleFunc.radtoAngle;

			} else {
				//如果是反向运动的
				if (this.owner._viewWay == -1) {
					rotation = 180 - rotation;
					this.setViewWay(-1)
				}
				ang = rotation * BattleFunc.angletoRad;
				xspd = Math.cos(ang) * spdValue;
				zspd = Math.sin(ang) * spdValue;
			}
			if (this.owner._viewWay == -1) {
				this.setRotation(rotation + 180);
			} else {
				this.setRotation(rotation);
			}
			//因为子弹没有设置scale -1
			//如果不存在跟随目标或者本次跟随目标不等于上次的目标再重算移动距离
			if (!this._followRole || this._followRole != targetRole) {
				//移动时长
				this.moveFrame = Math.floor(pathParams[1] / spdValue)
			}
			//忽略调整方向
			this.initMove(xspd, yspd, zspd, true);
			//如果是反弹的子弹 那么一定会跟随目标
			if (this._collisionParams[0] == BattleConst.bullet_hit_bounce) {
				this._followRole = targetRole;
			}
		} else if (moveType == BattleConst.BULLET_MOVE_CURVE) {
			this.gravityAble = true;
			dis = Math.sqrt(dx * dx + dz * dz);
			var flyDisTance = pathParams[1] / 10000 * dis;
			var maxFlyDis = pathParams[2]
			if (flyDisTance > maxFlyDis) {
				flyDisTance = maxFlyDis;
			}
			this.moveFrame = Math.ceil(dis / spdValue);
			var ang = Math.atan2(dz, dx);
			xspd = Math.cos(ang) * spdValue;
			zspd = Math.sin(ang) * spdValue;
			//忽略调整方向
			this.initMove(xspd, 0, zspd, true);
			var halft = this.moveFrame / 2;
			//计算y速度
			this.addSpeed.y = flyDisTance * 2 / (halft * halft);
			//初始化跳跃
			this.initJump(-this.addSpeed.y * halft)
			this.moveFrame += 120;

		}
		if (tempArr) {
			BattleFunc.cacheOneTempArr(tempArr);
		}
	}

	//更新剩余存活时间
	private updateLeftTime() {
		if (!this.checkIsUsing()) {
			return
		}
		this.moveFrame--;
		if (this.moveFrame == 0) {
			this.controler.destroyBullet(this);
		}
	}
}