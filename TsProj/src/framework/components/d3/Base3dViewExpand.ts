import BaseViewExpand from "../BaseViewExpand";
import UICompConst from "../../consts/UICompConst";
import {UnityEngine, System,GameUtils} from 'csharp'
export  default  class  Base3dViewExpand extends  BaseViewExpand{

	constructor() {
		super();
		//坐标样式是 1 3d坐标
		this.posStyle =UICompConst.posStyle_3d;
		this.uitype = UICompConst.comp_base3d;
	}

	public  setCObject(cobj: UnityEngine.GameObject) {
		super.setCObject(cobj);
		//初始化3d旋转视野
		var vec = this.__ctransform.eulerAngles;
		var ratotion3d = this.rotationTrans;
		ratotion3d.x = vec.x;
		ratotion3d.y = vec.y;
		ratotion3d.z = vec.z;
		return this;
	}





}