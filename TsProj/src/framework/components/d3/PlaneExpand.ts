
import BaseCompExpand from "../BaseCompExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
import VectorTools from "../../utils/VectorTools";
import BaseViewExpand from "../BaseViewExpand";

export  default  class PlaneExpand extends  BaseCompExpand{
	public  __comp:UnityEngine.Plane;
	private  _normalVec:{x,y,z};
	constructor() {
		super();
		this._normalVec = VectorTools.createVec3();

	}
	public  initComponent(targetcomp: UnityEngine.Component, owner: BaseViewExpand) {
		super.initComponent(targetcomp, owner);
		var normal = this.__comp.normal;
		VectorTools.cloneTo(normal,this._normalVec);
	}

	public  get normal():{x,y,z}{
		return this._normalVec
	}
	public  get distance(){
		return this.__comp.distance;
	}
}