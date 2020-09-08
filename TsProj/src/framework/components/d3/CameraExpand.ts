import Base3dViewExpand from "./Base3dViewExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
import BaseCompExpand from "../BaseCompExpand";
export default class CameraExpand extends  BaseCompExpand{
	//c摄像头对象
	public  __comp:UnityEngine.Camera
	constructor() {
		super();
	}

	public  viewPortProject(targetPos:{x,y,z},projectionViewMatrix:any,out:{x,y,z}){

	}

	public  get projectionViewMatrix(){
		return null;
	}

	public  viewportPointToRay(v2:{x,y},ray:any){
		var tempV3 = GameUtils.ViewExtensionMethods.initVec3(v2.x,v2.y,0);
		var cray:UnityEngine.Ray = this.__comp.ViewportPointToRay(tempV3);
		return cray;
	}

}