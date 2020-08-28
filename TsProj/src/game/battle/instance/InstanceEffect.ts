import InstanceBasic from "./InstanceBasic";
import BattleControler from "../controler/BattleControler";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFunc from "../../sys/func/BattleFunc";
import InstanceLife from "./InstanceLife";
import SkillExpandTrigger from "../trigger/SkillExpandTrigger";
import VectorTools from "../../../framework/utils/VectorTools";

/**
 * 游戏中的特效基类
 */
export default class InstanceEffect extends InstanceBasic {
	public constructor(controler: BattleControler) {
		super(controler);
		this.classModel = BattleConst.model_effect;
		this._followOffset = VectorTools.createVec3();
	}

	public effectName: string;
	//跟随目标
	public _followTarget: any;

	private _followOffset: {x,y,z};

	//所在的层级 1后景  2和角色平级, 3前景
	public layerIndex: number = 2;

	//是否跟随目标修改朝向
	public withTargetWay: number = 0;

	//扩展参数
	public expandParams: any;

	//设置数据
	public setData(data: any) {
		super.setData(data);
		this.ignoreTimeScale = null;
		this.effectName = data.id;
		this.zorderOffset = 0;
		this._followOffset.x = this._followOffset.y = this._followOffset.z;
		this.expandParams = null;
		this._myView.scale(1, 1, true);

	}

	//设置时间缩放
	public setIgnoreScale() {
		this.ignoreTimeScale = this.expandParams.ignoreScale;
		this.setAniPlaySpeed(this._aniPlaySpeed);
	}

	//设置持续帧数,指定帧数后销毁自己
	public setLastFrame(frame: number) {
		this.controler.clearCallBack(this, this.delayClearSelf);
		if (frame > 0) {
			this.controler.setCallBack(Math.round(frame / this._aniPlaySpeed), this.delayClearSelf, this);
		}
	}

	public doAiLogical() {
		if (this._followTarget) {
			this.dofollowTarget()
		}
		//如果是连线特效 
		if (this.expandParams) {
			this.checkLineFollowTarget();
		}

	}

	//执行跟随
	private dofollowTarget() {
		if (this._followTarget.hp <= 0) {
			// this._followTarget = null;
			return;
		}
		this.pos.x = this._followTarget.pos.x + this._followOffset.x * this._followTarget._viewWay;
		this.pos.y = this._followTarget.pos.y + this._followOffset.y;
		this.pos.z = this._followTarget.pos.z + this._followOffset.z;
		if (this.updateCount % 30 == 0) {
			this._updateZorderByTarget()
			if (this.withTargetWay == 0) {
				this.setViewWay(this._followTarget._viewWay);
			}
		}

	}

	//更新zorder
	private _updateZorderByTarget() {
		//如果是
		if (this.layerIndex == 2) {
			this.zorderOffset = this._followTarget.zorderOffset - 1;
		} else if (this.layerIndex == 3 || this.layerIndex == 5) {
			this.zorderOffset = this._followTarget.zorderOffset + 1;
		}
		this.updateViewZorder();
	}

	public setFollowOffest(ofx: number, ofy: number, ofz: number) {
		this._followOffset.x = ofx
		this._followOffset.y = ofy
		this._followOffset.z = ofz
	}

	//设置跟随目标
	public setFollowTarget(target: InstanceBasic, ofx: number, ofy: number, ofz: number, layer: number, withTargetWay: number = 0) {
		this._followTarget = target;
		this._followOffset.x = ofx
		this._followOffset.y = ofy
		this._followOffset.z = ofz
		this.layerIndex = layer;
		this.withTargetWay = withTargetWay;
		this.updateCount = 0;
		this.dofollowTarget();
	}

	//延迟销毁自己
	private delayClearSelf() {
		this.controler.destoryEffect(this);
	}

	//循环播放动画 
	public playSpecialSysAction(actionName: any, sysTime: number, startTime: number, endTime: number, actionLength: number = 0, aniSpeed: number = 1) {
		var len = super.playSpecialSysAction(actionName, sysTime, startTime, endTime, actionLength, aniSpeed);
		this.setLastFrame(len);
		return len;
	}

	//设置特殊参数 [类型,参数,....]
	public setExpandParams(info: any) {
		this.expandParams = info;
		//后续在这里扩展. 目前对特效只做匀速拉伸
		this.doTweenAniScale();
		this.setIgnoreScale();


	}

	private _tweenParams: any;

	//缓动特效
	private doTweenAniScale() {
		if (this.expandParams.type != SkillExpandTrigger.EXPAND_TYLE_LINEEFFECT) {
			return
		}
		this.expandParams.totalFrame = this.expandParams.frame
		var targetRole: InstanceLife = this.expandParams.role
		this.expandParams.sourceX = targetRole.pos.x
		this.expandParams.sourceZ = targetRole.pos.z
		this.setViewWay(1);
		this.controler.insterInstanceToArr(this);
		this.checkLineFollowTarget();
		// 把自己插入到数组里面

		//这里暂时不能用tweencontroler去实现缩放.  因为只缩放
		// Laya.Tween.to(this._myView,this._tweenParams,tweenTime);
	}

	//判断连线跟随目标
	private checkLineFollowTarget() {
		if (!this.expandParams.type) {
			return;
		}
		//参数分别对应 0类型,  1初始长度,2缓动时长(毫秒), 3目标x坐标 4目标z坐标
		var sourceWid = this.expandParams.length;
		var tweenFrame = this.expandParams.frame;
		var targetRole: InstanceLife = this.expandParams.role
		//必须目标角色 hp>0

		if (!targetRole || targetRole.hp <= 0) {
			//需要清空role. 因为这个role会复用或者复活
			this.expandParams.role = null;
		} else {
			this.expandParams.sourceX = targetRole.pos.x
			this.expandParams.sourceZ = targetRole.pos.z
			this.expandParams.sourceY = targetRole.pos.y
		}


		var targetx = this.expandParams.sourceX
		var targetz = this.expandParams.sourceZ
		var targety = this.expandParams.sourceY

		var disx = targetx - this.pos.x;
		var disz = (targety + targetz) - (this.pos.z + this.pos.y) + this._followOffset.y;
		var ang = Math.atan2(disz, disx);
		var targetWid = Math.sqrt(disx * disx + disz * disz);

		var scale = targetWid / sourceWid
		if (scale < 0.3) {
			scale = 0.3;
		}
		this.setRotation(ang * BattleFunc.radtoAngle);
		if (tweenFrame > 0) {
			scale = scale * (1 - tweenFrame / this.expandParams.totalFrame);
		}
		this._myView.scale(scale, 1, true);
		this.expandParams.frame--;
	}


	public onSetToCache() {
		super.onSetToCache();
		if (this._followTarget && this._followTarget.clearEffByName) {
			var target = this._followTarget
			this._followTarget = null;
			target.clearEffByName(this.cacheId, true)
		}
		this._followTarget = null;
	}


}
