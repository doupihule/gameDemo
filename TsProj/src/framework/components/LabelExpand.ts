import BaseViewExpand from "./BaseViewExpand";
import BaseContainer from "./BaseContainer";
import {UnityEngine, System,Spine ,GameUtils} from 'csharp'
import UICompConst from "../consts/UICompConst";
import ResourceManager from "../manager/ResourceManager";
import ResourceConst from "../../game/sys/consts/ResourceConst";
import { $typeof } from "puerts";

export default class LabelExpand extends BaseViewExpand{
	private  _text:string;
	private __textComp:UnityEngine.UI.Text;
	private __outLineComp:UnityEngine.UI.Outline;
	constructor(cobj) {
		super();
		this.uitype = UICompConst.comp_label;
		if (!cobj){
			cobj =ResourceManager.loadUIPrefab(ResourceConst.baseLabelPrefeb,ResourceConst.boundle_ui);
		}
		this.setCObject(cobj);
	}

	public  setCObject(cobj: UnityEngine.GameObject) {
		super.setCObject(cobj);
		this.__textComp =cobj.GetComponent($typeof(UnityEngine.UI.Text)) as any;
	}

	public  get text(){
		return this._text;
	}

	public  setText(str:string){
		this._text = str;
		this.__textComp.text = str;
	}

	public  set text(str:string){
		this.setText(str);
	}


	//设置颜色
	public  setColor(r,g,b,a=255){
		GameUtils.ViewExtensionMethods.SetLabelColor(this.__textComp,r,g,b,a);
	}

	//设置换行模式
	public  setWrapStyle(xSyle=0,yStyle =1){
		this.__textComp.verticalOverflow = xSyle;
		this.__textComp.horizontalOverflow = yStyle
	}

	//设置字体
	public  setFont(name:string){

	}

	//设置描边
	public setOutLine(xlen, ylen,  r, g, b,a=255){
		if(!this.__outLineComp){
			this.__outLineComp =this.__cobject.AddComponent($typeof(UnityEngine.UI.Outline)) as any;
		}

	}

	//设置投影
	public setShade(xlen, ylen, r, g, b,a:number =255){

	}

}
