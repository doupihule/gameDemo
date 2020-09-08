import BaseCompExpand from "../BaseCompExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
export  default  class PhysicsColliderExpand extends  BaseCompExpand{

	public  __comp:UnityEngine.Collider;

	public  set ccdMotionThreshold(value){

	}

	public  set collisionGroup(value){
		this.__owner.__cobject.layer = value;
	}

	public getBoxSize():{x,y,z}{
		return (this.__comp as UnityEngine.BoxCollider).size
	}
}