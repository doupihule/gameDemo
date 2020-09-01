import BaseViewComponent from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
//按钮
export default class ButtonExpand extends BaseViewComponent{

	public  clickFunc:Function;
	public  clickObj:any;
	public  backParams:any;

	public __btnComp:any;


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
			this.__btnComp=this.__cobject.GetComponent("Button");
			this.__btnComp.onClick.AddListener(function () {
				thisSelf.clickFunc.call(thisSelf.clickObj,thisSelf.backParams);
			})
		}
	}

}
