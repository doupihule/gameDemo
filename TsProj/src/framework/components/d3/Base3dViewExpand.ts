import BaseViewExpand from "../BaseViewExpand";
import UICompConst from "../../consts/UICompConst";
import {UnityEngine, System,GameUtils} from 'csharp'
import VectorTools from "../../utils/VectorTools";
export  default  class  Base3dViewExpand extends  BaseViewExpand{

	public  _rotation3D:{x,y,z};
	constructor() {
		super();
		this._rotation3D = VectorTools.createVec3();
		//坐标样式是 1 3d坐标
		this.posStyle =UICompConst.posStyle_3d;
		this.uitype = UICompConst.comp_base3d;
	}

	public  setCObject(cobj: UnityEngine.GameObject) {
		super.setCObject(cobj);
		//初始化3d旋转视野
		var vec = this.__ctransform.eulerAngles;
		var ratotion3d = this._rotation3D
		ratotion3d.x = vec.x;
		ratotion3d.y = vec.y;
		ratotion3d.z = vec.z;
		return this;
	}


	//获取3d旋转视角
	public  get3dRotation(){
		var vec = this.__ctransform.eulerAngles;
		var ratotion3d = this._rotation3D
		ratotion3d.x = vec.x;
		ratotion3d.y = vec.y;
		ratotion3d.z = vec.z;
		return ratotion3d;
	}
	//设置3d坐标
	public  set3dPos(x:number,y:number,z:number){
		this.positionTrans.x = x;
		this.positionTrans.y = y;
		this.positionTrans.z = z;
		GameUtils.ViewExtensionMethods.SetObj3dPos(this.__ctransform, x,y,z);
	}

	//设置3d旋转视角
	public  set3dRotation(x,y,z){
		this._rotation3D.x = x;
		this._rotation3D.y = y;
		this._rotation3D.z = z;
		this.__ctransform.eulerAngles =  GameUtils.ViewExtensionMethods.initVec3(x,y,z);
	}


}