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

}