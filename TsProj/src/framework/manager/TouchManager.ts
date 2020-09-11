import { GameUtils } from 'csharp';
import { UnityEngine } from 'csharp';
import BaseViewExpand from "../components/BaseViewExpand";

export  default  class TouchManager{

	//触摸事件回调相关参数
	public static touchParams:{x,y} = {x:0,y:0};

	//所有的触摸事件回调 返回固定 (touchParams,自定义的额外参数)
	//触摸按下
	public  static  addTouchDown(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerDown,func,thisObj,params);

	}
	public  static  addTouchMove(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		// this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.MouseMove,func,thisObj,params);
	}
	public  static  addTouchUp(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerUp,func,thisObj,params);
	}
	public  static  addTouchOut(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerUp,func,thisObj,params);
	}

	//点击事件
	public static addTouchClick(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerClick,func,thisObj,params);
	}

	private static registEventTriger(baseView:BaseViewExpand,eventType:number, func:Function,thisObj:any,params:any = null){
		
		//触摸事件存储格式
		/**
		 * __cacheEvent:{
		 * 		[eventType]:{
		 * 			func
		 * 			thisObj
		 * 			parans
		 * 			delegeFunc
		 * 		}
		 * }
		 * 
		 */
		var cacheMap = baseView["__cacheEvent"];
		if(!cacheMap){
			cacheMap = {};
			baseView["__cacheEvent"] = cacheMap;
		}

		
		var __tempMap = cacheMap[eventType];
		if(!__tempMap){
			__tempMap = {}
			cacheMap[eventType] = __tempMap;
			var delegeFunc = new GameUtils.ComponentEventDelege( 
					(event:UnityEngine.EventSystems.BaseEventData)=>{
						var mousePos = UnityEngine.Input.mousePosition;
						TouchManager.touchParams.x = mousePos.x
						TouchManager.touchParams.y = mousePos.y
						LogsManager.echo("event:",TouchManager.touchParams.x,TouchManager.touchParams.y,"_type:",eventType);
						__tempMap.func && __tempMap.func.call(__tempMap.thisObj, TouchManager.touchParams, params);
					}
			)
			//存着委托对象
			__tempMap.delegeFunc = delegeFunc;
			GameUtils.ComponentExtension.AddCompListener(baseView.__cobject,eventType,delegeFunc);
		}
		__tempMap.func = func;
		__tempMap.thisObj = thisObj;
		__tempMap.params = params


	}

	//移除对象的点击事件
	public static removeViewTouchEvent(view:BaseViewExpand){
		
	}

}