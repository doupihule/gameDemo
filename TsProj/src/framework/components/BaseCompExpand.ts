//基础组件类
import {UnityEngine, System,GameUtils} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
export  default  class BaseCompExpand {
	public  __comp:any;
	public  __owner:BaseViewExpand
	//组件基类 一个对象可以绑定n个组件
	constructor() {

	}
	//初始化组件
	public  initComponent(targetcomp:UnityEngine.Component,owner:BaseViewExpand){
		this.__comp = targetcomp;
		this.__owner = owner;
	}

	public  dispose(){
		this.__owner = null;
		this.__comp = null;
	}

}