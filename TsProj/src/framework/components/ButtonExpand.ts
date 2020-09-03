import BaseViewComponent from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import LogsManager from "../manager/LogsManager";
import { UnityEngine } from "csharp";
import { $typeof } from "puerts";
//按钮
export default class ButtonExpand extends BaseViewComponent{

	public  clickFunc:Function;
	public  clickObj:any;
	public  backParams:any;

	public __btnComp:UnityEngine.UI.Button;


	constructor(cobj) {
		super();
		this.uitype = UICompConst.comp_btn;
		if (cobj){
			this.setCObject(cobj);
		}
	}

	//设置点击事件
	public setClickFunc(func,thisObj,params){
		this.clickFunc = func;
		this.clickObj = thisObj;
		this.backParams = params;
		var thisSelf = this;
		if(!this.__btnComp){
			this.__btnComp=this.__cobject.GetComponent($typeof(UnityEngine.UI.Button)) as UnityEngine.UI.Button;
			if (!this.__btnComp){
				LogsManager.errorTag("btnCompError","这个没有按钮组件:"+this.name);
			}
			LogsManager.echo("__注册点击事件---")
			this.__btnComp.onClick.AddListener(() => {
				thisSelf.clickFunc.call(thisSelf.clickObj,thisSelf.backParams);
			})
		}
	}

}
