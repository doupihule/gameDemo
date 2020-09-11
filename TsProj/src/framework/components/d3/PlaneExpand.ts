
import BaseCompExpand from "../BaseCompExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
import VectorTools from "../../utils/VectorTools";
import BaseViewExpand from "../BaseViewExpand";

//plane
export  default  class PlaneExpand {
	public  __comp:UnityEngine.Plane;
	private  _normalVec:{x,y,z};
	constructor() {
		this._normalVec = VectorTools.createVec3();

	}

	public initWith3P(v1,v2,v3){
		var p1 = GameUtils.ViewExtensionMethods.initVec3(v1.x,v1.y,v1.z);
		var p2 = GameUtils.ViewExtensionMethods.initVec3(v2.x,v2.y,v2.z);
		var p3 = GameUtils.ViewExtensionMethods.initVec3(v3.x,v3.y,v3.z);
		this.__comp = new UnityEngine.Plane(p1,p2,p3);
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