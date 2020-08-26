import {UnityEngine, System} from 'csharp'
import {$ref, $unref, $generic, $promise, $typeof} from 'puerts'
import ViewTools from "./ViewTools";
export default class BaseViewExpand {
	//对应的c对象
	public __cobject:UnityEngine.GameObject;
	public  __ctransform:UnityEngine.RectTransform;
	public  positionTrans:any = {x:0,y:0,z:0};
	//旋转
	public rotationTrans:any = {x:0,y:0,z:0};
	// 缩放
	public  scaleTrans:any = {x:0,y:0,z:0};
	private  _alpha:number =1;

	public  __canvasGroupComp:any;

	//对应的ui类型
	public  uitype:string;

	constructor() {
		this.uitype ="base";
	}


	public  setCObject(cobj:UnityEngine.GameObject){
		this.__cobject = cobj;
		this.__ctransform = cobj.transform as UnityEngine.RectTransform;
	}


	//-------------------------------------------------------------------------------------
	//---------------------------坐标旋转缩放透明度-----------------------------------------
	//-------------------------------------------------------------------------------------

	public  set x(value:number){
		this.positionTrans.x = value;
	}
	public  set y(value:number){
		this.positionTrans.y = value;
	}
	public  set z(value:number){
		this.positionTrans.z = value;
	}

	public  get x(){
		return this.positionTrans.x;
	}
	public  get y(){
		return this.positionTrans.y;
	}
	public  get z(){
		return this.positionTrans.z;
	}

	//设置2d坐标
	public  setPos(x:number,y:number){
		this.positionTrans.x = x;
		this.positionTrans.y = y;
		this.__ctransform.anchoredPosition = this.positionTrans;
	}

	//设置3d坐标
	public  set3dPos(x:number,y:number,z:number){
		this.positionTrans.x = x;
		this.positionTrans.y = y;
		this.positionTrans.z = z;
		this.__ctransform.localPosition = this.positionTrans;
	}


	//设置2d旋转
	public  set2dRotation(value:number){
		this.rotationTrans.z = value;
		this.__ctransform.eulerAngles = this.rotationTrans;
	}

	//设置缩放
	public  setScale(sx:number,sy:number,sz:number =1){
		var trans = this.scaleTrans;
		trans.x = sx;
		trans.y = sy;
		trans.z = sz;
		this.__ctransform.localScale = trans;
	}

	//获取透明度
	public  get alpha(){
		return this._alpha;
	}

	//设置透明度
	public  set alpha(value){
		var  canvasGroup = this.__canvasGroupComp;
		if (! canvasGroup){
			canvasGroup = this.__cobject.AddComponent($typeof(UnityEngine.CanvasGroup))
			this.__canvasGroupComp = canvasGroup;
		}
		canvasGroup.alpha = value;
	}


	//-------------------------------------------------------------------------------------
	//---------------------------显示相关-----------------------------------------
	//-------------------------------------------------------------------------------------
	//添加子对象
	public  addChild(childView:BaseViewExpand,index:number = -1){
		childView.__ctransform.parent =childView.__ctransform.parent;
		if (index >=0){
			childView.__ctransform.SetSiblingIndex(index);
		}
	}

	//移除所有子对象
	public  removeChildren(){
		var trans = this.__ctransform;
		var childNums = trans.childCount;
		for (var s=childNums-1;s>=0;s--){
			var childTrans:UnityEngine.Transform = trans.GetChild(s);
			childTrans.SetParent(null);

		}
	}

	//获取子对象
	public  getChildAt(index:number,withBinding:boolean =false){
		var childTrans:UnityEngine.Transform = this.__ctransform.GetChild(index);
		//绑定lua和c对象
		if (childTrans){
			//如果是需要bangding对象的
			if (withBinding){
				return ViewTools.autoBindingCObj(childTrans.gameObject);
			}
			return childTrans;
		}
		return  null;
	}


	//设置是否可见
	public  setActive(value:boolean){
		this.__cobject.SetActive(value);
	}




	//销毁函数
	public  dispose(){
		this.__ctransform =null;
		this.__cobject = null;
		this.__canvasGroupComp =null;
	}


}
