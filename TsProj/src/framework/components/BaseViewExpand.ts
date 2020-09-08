import {UnityEngine, System,GameUtils} from 'csharp'
import {$ref, $unref, $generic, $promise, $typeof} from 'puerts'


import ViewTools from "./ViewTools";
import UICompConst from "../consts/UICompConst";
import BaseCompExpand from "./BaseCompExpand";
import CameraExpand from "./d3/CameraExpand";
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

	//坐标样式 1是2d, 2是3d
	public  posStyle:number = 1;

	//组件map表  {key:value,}
	private  _compMap:{[key:string]:BaseCompExpand} = {}


	constructor() {
		this.uitype ="base";
	}

	//绑定c对象
	public  setCObject(cobj:UnityEngine.GameObject){
		this.__cobject = cobj;
		this.__ctransform = cobj.transform as UnityEngine.RectTransform;
		ViewTools.bindCobjToBaseView(cobj,this);
		return this;
	}


	//-------------------------------------------------------------------------------------
	//---------------------------坐标旋转缩放透明度-----------------------------------------
	//-------------------------------------------------------------------------------------

	

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
		// this.__ctransform.anchoredPosition = this.positionTrans;
		GameUtils.ViewExtensionMethods.SetObj2dPos(this.__ctransform, x,y);
	}

	//设置3d坐标
	public  set3dPos(x:number,y:number,z:number){
		this.positionTrans.x = x;
		this.positionTrans.y = y;
		this.positionTrans.z = z;
		GameUtils.ViewExtensionMethods.SetObj3dPos(this.__ctransform, x,y,z);
	}


	//设置2d旋转
	public  set2dRotation(value:number){
		this.rotationTrans.z = value;
		this.__ctransform.eulerAngles = GameUtils.ViewExtensionMethods.initVec3(0,0,this.rotationTrans.z);
	}
	//获取2d旋转
	public  get2dRotation(){
		return this.rotationTrans.z;
	}


	//设置缩放
	public  setScale(sx:number,sy:number,sz:number =1){
		var trans = this.scaleTrans;
		trans.x = sx;
		trans.y = sy;
		trans.z = sz;
		GameUtils.ViewExtensionMethods.SetObjScale(this.__ctransform,sx,sy,sz);
	}

	public  getScale(){
		return this.scaleTrans;
	}

	public  set3dRotation(x,y,z){
		this.rotationTrans.x = x;
		this.rotationTrans.y = y;
		this.rotationTrans.z = z;
		this.__ctransform.eulerAngles = GameUtils.ViewExtensionMethods.initVec3(x,y,z);
	}

	public  get3dRotation(){
		return this.rotationTrans
	}

	//设置锚点
	public  setAnchor(x,y){
		this.__ctransform.pivot = GameUtils.ViewExtensionMethods.initVec2(x,y);
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
		childView.__ctransform.SetParent(this.__ctransform,false);
		if (index >=0){
			childView.__ctransform.SetSiblingIndex(index);
		}
	}

	//移除子对象
	public  removeChild(childView:BaseViewExpand){
		childView.__ctransform.SetParent(null);
	}
	//移除自己
	public  removeSelf(){
		this.__ctransform.SetParent(null);
	}

	public  get numChildren(){
		return this.__ctransform.childCount;
	}

	//移除所有子对象
	public  removeChildren(){
		GameUtils.ViewExtensionMethods.RemoveAllChild(this.__ctransform);
	}

	//获取子对象 targetCompType是否指定绑定类型
	public  getChildAt(index:number,targetCompType:string = null){
		var childTrans:UnityEngine.Transform = this.__ctransform.GetChild(index);
		if (targetCompType == null){
			targetCompType = this.getDefaultCompType()
		}
		//绑定lua和c对象
		if (childTrans){
			//如果是需要bangding对象的
			return ViewTools.autoBindingCObj(childTrans.gameObject,true,targetCompType);
		}
		return  null;
	}

	private  getDefaultCompType(){
		if (this.posStyle == UICompConst.posStyle_3d){
			return  UICompConst.comp_base3d;
		} else{
			return UICompConst.comp_base;
		}
	}


	//获取子对象 根据名字
	public  getChildByName(name:string,targetCompType:string = null){
		var childObj = GameUtils.ViewExtensionMethods.GetChildByName(this.__ctransform,name);
		if (targetCompType == null){
			targetCompType = this.getDefaultCompType()
		}
		if (childObj){
			//如果是需要bangding对象的
			return ViewTools.autoBindingCObj(childObj,true,targetCompType);
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

	public  getViewRect(){
		return this.__ctransform.sizeDelta
	}

	private  static  _tempVew2 = {x:0,y:0};

	public  setSize(w,h){
		if (this.posStyle == UICompConst.posStyle_3d){
			window["LogsManager"].errorTag("setSizewrong","3d对象禁止设置2dsize");
			return;
		}
		//设置尺寸
		 this.__ctransform.sizeDelta = GameUtils.ViewExtensionMethods.initVec2(w,h);
	}

	//设置是否可见
	public  setActive(value:boolean){
		this.__cobject.SetActive(value);
	}

	public isActive(){
		return this.__cobject.active;
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

	//获取组件 一定要配置绑定哪个类型
	public  getComponent(comp:string,compExpand:BaseCompExpand = null):any{
		if(this._compMap[comp]){
			return this._compMap[comp];
		}
		var info =  ViewTools.compClassMap[comp];
		if(!info){
			LogsManager.warn("组件类型错误:",this.name,",comp:", comp);
			return null
		}
		var cobjcomp = this.__cobject.GetComponent(info.cname);
		if(!cobjcomp){
			LogsManager.warn("没有找到组件:",this.name,",cname:", info.cname);
			return null;
		}

		//如果没有传 组件继承. 那么就采用默认的组件
		if(!compExpand){
			var classObj = info.cl
			compExpand = new classObj();
		}
		compExpand.initComponent(cobjcomp,this);
		this._compMap[comp] = compExpand;
		return compExpand
	}

	//获取原生组件类型
	public  getOriginComponent(comp:string){
		return   this.__cobject.GetComponent
	}

	public  clone(){
		return ViewTools.cloneOneView(this.__cobject,this.uitype);
	}

	//销毁函数
	public  dispose(){
		this.__ctransform =null;
		this.__cobject = null;
		this.__canvasGroupComp =null;
	}


}
