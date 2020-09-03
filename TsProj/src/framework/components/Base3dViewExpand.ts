import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import {UnityEngine, System,GameUtils} from 'csharp'
export  default  class  Base3dViewExpand extends  BaseViewExpand{


	constructor() {
		super();
		console.log("初始化3d");
		//坐标样式是 1 3d坐标
		this.posStyle =UICompConst.posStyle_3d;
		this.uitype = UICompConst.comp_base3d;
	}

	public  setCObject(cobj: UnityEngine.GameObject) {
		super.setCObject(cobj);
		return this;
	}


}