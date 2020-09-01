import {UnityEngine, System} from 'csharp'
import {$ref, $unref, $generic, $promise, $typeof} from 'puerts'
const CS = require('csharp');


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

	//绑定c对象
	public  setCObject(cobj:UnityEngine.GameObject){
		this.__cobject = cobj;
		this.__ctransform = cobj.transform as UnityEngine.RectTransform;
		ViewTools.bindCobjToBaseView(cobj,this);
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
	public  set2dPos(x:number,y:number){
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

	public  get scale(){
		return this.scaleTrans.x;
	}

	public  get rotation(){
		return this.__ctransform.rotation
	}

	//设置锚点
	public  setAnchor(x,y){
		BaseViewExpand._tempVew2.x = x;
		BaseViewExpand._tempVew2.y = y;
		this.__ctransform.pivot = BaseViewExpand._tempVew2 as UnityEngine.Vector2;
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
	//获取parent
	public  get parent(){
		return this.__ctransform.parent;
	}

	private  _visible:boolean =true;
	public  get visible(){
		return this._visible;
	}
	public  set visible(value){
		this._visible =value;
	}


	//添加子对象
	public  addChild(childView:BaseViewExpand,index:number = -1){
		childView.__ctransform.parent =childView.__ctransform.parent;
		if (index >=0){
			childView.__ctransform.SetSiblingIndex(index);
		}
	}

	//移除子对象
	public  removeChild(childView:BaseViewExpand){
		childView.__ctransform.parent = null;
	}
	//移除自己
	public  removeSelf(){
		this.__ctransform.parent =null;
	}

	public  get numChildren(){
		return this.__ctransform.childCount;
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


	//设置颜色 子类重写
	public  setColor(r,g,b,a){

	}


	//2d对象才有这个属性3d对象禁止访问
	public  get width(){
		return this.__ctransform.sizeDelta.x;
	}
	public  get height(){
		return this.__ctransform.sizeDelta.y;
	}

	private  static  _tempVew2 = {x:0,y:0};

	public  setSize(w,h){
		BaseViewExpand._tempVew2.x = w;
		BaseViewExpand._tempVew2.y = h;
		this.__ctransform.sizeDelta =BaseViewExpand._tempVew2 as UnityEngine.Vector2;
	}

	//设置是否可见
	public  setActive(value:boolean){
		this.__cobject.SetActive(value);
	}
	//设置深度
	public  setZorder(value){

	}

	public  get name(){
		return this.__ctransform.name;
	}

	public  set name(value:string){
		this.__ctransform.name = value;
	}



	//--触摸事件相关
	protected  _mouseEnabled:boolean =false;
	public  set mouseEnabled(value){
		this._mouseEnabled = value;
	}
	public  get mouseEnabled(){
		return this._mouseEnabled;
	}

	//是否穿透
	protected  _mouseThrough:boolean =false;
	public  set mouseThrough(value){
		this._mouseThrough = value;
	}
	public  get mouseThrough(){
		return this._mouseThrough;
	}


	//销毁函数
	public  dispose(){
		this.__ctransform =null;
		this.__cobject = null;
		this.__canvasGroupComp =null;
	}


}
