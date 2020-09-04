import InstanceBasic from "./InstanceBasic";
import BattleControler from "../controler/BattleControler";

/**
 * 游戏中的特效基类
 */
export default class InstanceEffect extends InstanceBasic {
	public constructor(controller:BattleControler) {
		super(controller);
	}
	public effectName:string;
	private _followTarget:InstanceBasic;

	private _followOffset:{x,y,z};
	//是否需要跟随旋转
	private _withRotate:boolean;

	//设置数据
	public setData(data:any){
		super.setData(data);
		this.effectName = data.id;
		this._followOffset = VectorTools.createVec3()
		
	}

	//设置持续帧数,指定帧数后销毁自己
	public setLastFrame(frame:number){
		this.controller.clearCallBack(this);
		if(frame > 0){
			this.controller.setCallBack(frame,this.delayClearSelf,this);
		}
	}

	public doAiLogical(){
		if(this._followTarget){
			this.dofollowTarget()
		}
	}
	
	//执行跟随
	private dofollowTarget(){
		this.pos.x = this._followTarget.pos.x +this._followOffset.x;
		this.pos.y = this._followTarget.pos.y+this._followOffset.y;
		this.pos.z = this._followTarget.pos.z+this._followOffset.z;
		if(this._withRotate){
			this.setRadian(this._followTarget.rotationRad.x,this._followTarget.rotationRad.y,this._followTarget.rotationRad.z);
		}
	}

	//设置跟随目标
	public setFollowTarget(target,withRotate:boolean,ofx,ofy,ofz){
		this._followTarget = target;
		this._followOffset.x = ofx
		this._followOffset.y = ofy
		this._followOffset.z = ofz
		this._withRotate = withRotate
		this.dofollowTarget();
	}

	//延迟销毁自己
	private delayClearSelf(){
		this.controller.destoryEffect(this);
	}



}
