
import {UnityEngine, System} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import ButtonExpand from "./ButtonExpand";
import ImageExpand from "./ImageExpand";
import ListExpand from "./ListExpand";
import BaseContainer from "./BaseContainer";
import LabelExpand from "./LabelExpand";
import SpineGraphicExpand from "./SpineGraphicExpand";
import ResourceCommonConst from "../consts/ResourceCommonConst";
import ResourceManager from "../manager/ResourceManager";
import Base3dViewExpand from "./d3/Base3dViewExpand";
import UIBaseView from "./UIBaseView";
import PlaneExpand from "./d3/PlaneExpand";
import CameraExpand from "./d3/CameraExpand";
import PhysicsColliderExpand from "./physics/PhysicsColliderExpand";
import Animation3DExpand from "./d3/Animation3DExpand";
import Particle3dExpand from "./d3/Particle3dExpand";
import RigidbodyExpand from "./physics/RigidbodyExpand";

export default class ViewTools {

	static  compClassMap:any = {
		base:{cl: BaseViewExpand,cname:"GameObject"},
		btn: {cl:ButtonExpand,cname:"Button"},
		img: {cl:ImageExpand,cname:"Image"},
		ctn: {cl:BaseContainer,cname:"GameObject"},
		label: {cl:LabelExpand,cname:"Label"},
		input:{cl: LabelExpand,cname:"Label"},
		list: {cl:ListExpand,cname:"List"},
		spine: {cl:SpineGraphicExpand,cname:"SpineGraphic"},
		ui: {cl:UIBaseView,cname:"GameObject"},
		base3d:{cl:Base3dViewExpand,cname:"GameObject"},
		camera:{cl:CameraExpand,cname:"Camera"},
		plane:{cl:PlaneExpand,cname:"Plane"},
		animator3d:{cl:Animation3DExpand,cname:"Animator"},
		particle3d:{cl:Particle3dExpand,cname:"Particle"},
		collider:{cl:PhysicsColliderExpand,cname:"Collider"},
		rigidbody3d:{cl:RigidbodyExpand,cname:"Rigidbody"},
		colliderListener:{cname:"ColliderListenerExpand"},

	}

	static  cobjMap:Map<UnityEngine.GameObject,BaseViewExpand> = new Map<UnityEngine.GameObject, BaseViewExpand>();
	//自动绑定cobj
	static autoBindingCObj(cobj:UnityEngine.GameObject,forceBinding:boolean =false,targetCompType:string =null){
		var baseView:BaseViewExpand = ViewTools.cobjMap.get(cobj) as BaseViewExpand;
		if (!baseView){
			 baseView = this.createBaseViewByCobj(cobj,forceBinding,targetCompType);
			 if (baseView){
				 ViewTools.cobjMap.set(cobj,baseView);
			 }
		}
		return baseView;
	}
	static  init(){}


	//绑定c对象和 baseview
	static  bindCobjToBaseView(cobj,baseView:BaseViewExpand){
		ViewTools.cobjMap.set(cobj,baseView);
	}
	//清理c对象和baseview
	static  clearCobjToBaseView(cobj){
		ViewTools.cobjMap.delete(cobj);
	}

	static  getBaseViewByCobj(cobj:UnityEngine.GameObject){
		return ViewTools.cobjMap.get(cobj);
	}


	//forceBinding 是否强制绑定.主要是针对没有定义名字的对象. 比如有时也需要通过getChildAt获取
	static  createBaseViewByCobj(cobj:UnityEngine.GameObject,forceBinding:boolean =false,targetCompType:string = null){
		var name:string = cobj.name
		var uiType:string ;
		//如果手动指定组件类型
		if (targetCompType){
			uiType = targetCompType
		} else{
			uiType = name.split("_")[0];
		}
		var viewClassName = this.compClassMap[uiType];
		if (!viewClassName){
			if (forceBinding){
				LogsManager.echo("这个对象没有指定合法命名",name);
				var baseView = new BaseViewExpand();
				baseView.setCObject(cobj);
				return baseView
			}
			return null;
		} else{
			//如果是按钮
			if (uiType == UICompConst.comp_btn){
				return  new ButtonExpand(cobj);
			} else if(uiType == UICompConst.comp_img){
				return  new ImageExpand(cobj);
			} else if(uiType == UICompConst.comp_ctn){
				return  new BaseContainer(cobj);
			} else if(uiType == UICompConst.comp_label){
				return  new LabelExpand(cobj);
			} else if(uiType == UICompConst.comp_list){
				return  new ListExpand(cobj);
			} else if(uiType == UICompConst.comp_input){
				return  new LabelExpand(cobj);
			} else if(uiType == UICompConst.comp_spine){
				return  new SpineGraphicExpand(null,null,cobj);
			} else if(uiType == UICompConst.comp_base3d){
				return  new Base3dViewExpand().setCObject(cobj);
			} else if(uiType == UICompConst.comp_ui){
				return  new UIBaseView().setCObject(cobj);
			} else if(uiType == UICompConst.comp_base){
				return new BaseViewExpand().setCObject(cobj);
			}
		}
		LogsManager.warn("没有找到对应的类型--",name,uiType);
		return null

	}

	static  createContainer(name:string){
		var ctn = new BaseContainer();
		ctn.name = name;
		return ctn;
	}

	//第一次创建图片的时候 必定 调整尺寸
	static  createImage(url:string ="",boundleName:string = ResourceCommonConst.boundle_uiimage){
		var img =  new ImageExpand(null);
		if (url ){
			img.setSkin(url,boundleName,true)
		}
		return img
	}

	/**
	 *   align 对齐方式 0左上,1中上,2右上,3左中,4中中,5右中,6左下,7中下,8右下 默认4 中中
		 FontStyle 0 normal,  1 bold(加黑)  2 Italic(斜体), 3 BoldAndItalic
		 supportRichText是否开启富文本 默认不开启
		 lineSpace 行间距默认是1 建议值在1-1.2之间
	 */

	static  createLabel(str:string, wid:number =100, hei:number =50, fontSize = 24, align=4, supportRichText=false, fontStyle=0, lineSpace =1){
		return new LabelExpand(null);
	}

	//创建一个平面
	static  createPlaneBy3p(v1,v2,v3){
		var plane = new PlaneExpand();
		return plane
	}

	//创建一个3d容器
	static  create3dContainer(name){
		var ctn = new Base3dViewExpand();
		var cobj = new UnityEngine.GameObject();
		ctn.setCObject(cobj);
		ctn.name = name;
		
		return ctn;

	}




	//创建3d模型 role1, role目录
	static create3DModel(modelName,shortPath:string , boundlename:string=ResourceCommonConst.boundle_model3d, outclone:boolean =false, compType:string = UICompConst.comp_base3d):any{
		var cobj:any = ResourceManager.get3dmodelRes(modelName,shortPath,boundlename,outclone);
		var basiView:BaseViewExpand =  this.autoBindingCObj(cobj,true,compType) ;
		//初始化设置取消激活
		basiView.setActive(false);
		return basiView as any;
	}


	//clone一个对象 compType为空 会使用obj的uitype
	static  cloneOneView(obj:any,compType:string = null ){
		var cloneCobj ;
		if (compType == null){
			compType = obj.uitype;
		}
		//如果是baseview
		if (obj.__cobject){
			cloneCobj = UnityEngine.GameObject.Instantiate(obj.__cobject);
		} else{
			cloneCobj = UnityEngine.GameObject.Instantiate(obj) as any;
		}
		return this.autoBindingCObj(cloneCobj,true, compType);
	}

	//全局搜索查找对象
	static findObject(name:string,compType:string = null){
		var cobj = UnityEngine.GameObject.Find(name);
		if(!cobj){
			LogsManager.warn("没有找到对象:",name);
			return null
		}

		return this.autoBindingCObj(cobj,true, compType);
	}


}
