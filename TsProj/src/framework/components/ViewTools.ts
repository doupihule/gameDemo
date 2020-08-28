
import {UnityEngine, System} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import LogsManager from "../manager/LogsManager";
import ButtonExpand from "./ButtonExpand";
import ImageExpand from "./ImageExpand";
import ListExpand from "./ListExpand";
import BaseContainer from "./BaseContainer";
import LabelExpand from "./LabelExpand";
import SpineGraphicExpand from "./SpineGraphicExpand";
export default class ViewTools {
	static  cobjMap:Map<UnityEngine.GameObject,BaseViewExpand> = new Map<UnityEngine.GameObject, BaseViewExpand>();
	//自动绑定cobj
	static autoBindingCObj(cobj:UnityEngine.GameObject){
		var baseView:BaseViewExpand = ViewTools.cobjMap.get(cobj) as BaseViewExpand;
		if (!baseView){
			 baseView = this.getBaseViewByCobj(cobj);
			 if (baseView){
				 ViewTools.cobjMap.set(cobj,baseView);
			 }
		}
		return baseView;
	}

	//绑定c对象和 baseview
	static  bindCobjToBaseView(cobj,baseView:BaseViewExpand){
		ViewTools.cobjMap.set(cobj,baseView);
	}
	//清理c对象和baseview
	static  clearCobjToBaseView(cobj){
		ViewTools.cobjMap.delete(cobj);
	}


	//forceBinding 是否强制绑定.主要是针对没有定义名字的对象. 比如有时也需要通过getChildAt获取
	static  getBaseViewByCobj(cobj:UnityEngine.GameObject,forceBinding:boolean =false){
		var name:string = cobj.name
		var uiType:string = name.split("_")[0];
		var viewClassName = UICompConst.classMap[uiType];
		if (!viewClassName){
			if (forceBinding){
				LogsManager.echo("这个对象没有指定合法命名",name);
				return new BaseViewExpand();
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
			}else if(uiType == UICompConst.comp_spine){
				return  new SpineGraphicExpand(null,null,cobj);
			}
		}

		return null

	}

	static  createContainer(){
		return new BaseContainer();
	}

	static  createImage(url:string =""){
		return new ImageExpand(null);
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

}
