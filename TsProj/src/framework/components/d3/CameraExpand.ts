import Base3dViewExpand from "./Base3dViewExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
import BaseCompExpand from "../BaseCompExpand";
import ScreenAdapterTools from "../../utils/ScreenAdapterTools";
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

	public  viewportPointToRay(v2:{x,y},ray:{origin,direction}):{origin,direction}{
		var tempV3 = GameUtils.ViewExtensionMethods.initVec3(v2.x/ScreenAdapterTools.screenWidth,v2.y/ScreenAdapterTools.screenHeight,0);
		var cray:UnityEngine.Ray = this.__comp.ViewportPointToRay(tempV3);
		var origin = cray.origin;
		var direction = cray.direction;
		ray.origin.x = origin.x;
		ray.origin.y = origin.y;
		ray.origin.z = origin.z;

		ray.direction.x = direction.x;
		ray.direction.y = direction.y;
		ray.direction.z = direction.z;
		return ray;
	}

}