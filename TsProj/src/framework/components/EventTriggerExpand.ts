import { UnityEngine } from 'csharp';
import BaseViewExpand from "./BaseViewExpand";
import BaseCompExpand from "./BaseCompExpand";

//用来处理触摸事件
export default class EventTriggerExpand extends  BaseCompExpand{
	public __comp:UnityEngine.EventSystems.EventTrigger;
	constructor(cobj) {
		super();
	}

	//触摸按下
	public   addTouchDown(func:Function,thisObj:any,params:any = null ){
		
	}
	public   addTouchMove(func:Function,thisObj:any,params:any = null ){

	}
	public   addTouchUp(func:Function,thisObj:any,params:any = null ){

	}
	public   addTouchOut(func:Function,thisObj:any,params:any = null ){
		
	}


}
