import { GameUtils } from 'csharp';
import { UnityEngine } from 'csharp';
import BaseViewExpand from "../components/BaseViewExpand";

export  default  class TouchManager{

	//触摸事件回调相关参数
	public static touchParams:{x,y} = {x:0,y:0};


	//注册的触摸移动数组
	/**
	 * {
	 * 	view:
	 * state: 0 是mouseup  1是触发down, 只有触发了down之后 move才会生效
	 * }
	 * 
	 */
	private static _touchMoveMap:any[] = []


	//判断能否触发move
	public static checkTouchMove(view:BaseViewExpand){
		var arr = this._touchMoveMap;
		var moveInfo = this.getTouchMoveInfo(view);
		if(!moveInfo){
			return false;
		}
		if(moveInfo.state == 1){
			return true;
		}
		return false;
	}

	//获取touchmoveInfo
	private static getTouchMoveInfo(view:BaseViewExpand){
		var arr = this._touchMoveMap;
		for(var i=0; i< arr.length;i++){
			var info:any = arr[i];
			if(info.view == view){
				return info;
			}
		}
		return null;
	}

	//移除move
	private  static removeMoveInfo(view:BaseViewExpand){
		var arr = this._touchMoveMap;
		for(var i=arr.length-1; i>=0;i--){
			var info:any = arr[i];
			if(info.view == view){
				arr.splice(i,1);
			}
		}
	}



	//所有的触摸事件回调 返回固定 (touchParams,自定义的额外参数)
	//触摸按下
	public  static  addTouchDown(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerDown,func,thisObj,params);
		
	}
	public  static  addTouchMove(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.Drag,func,thisObj,params);

	}
	public  static  addTouchUp(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerUp,func,thisObj,params);
	}
	//unity 没有touchout事件
	public  static  addTouchOut(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null ){
		// this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerUp,func,thisObj,params);
	}

	//点击事件
	public static addTouchClick(baseView:BaseViewExpand,func:Function,thisObj:any,params:any = null){
		this.registEventTriger(baseView,UnityEngine.EventSystems.EventTriggerType.PointerClick,func,thisObj,params);
	}


	private static setTouchMoveState(view:BaseViewExpand,state:number){
		var touchInfo = this.getTouchMoveInfo(view);
		if(!touchInfo){
			return;
		}
		touchInfo.state = state;
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
	public static removeAllViewTouchEvent(view:BaseViewExpand){
		GameUtils.ComponentExtension.RemoveAllCompListener(view.__cobject);
		delete view["__cacheEvent"];
	}

	

}