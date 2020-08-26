
import {UnityEngine, System} from 'csharp'
import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import LogsManager from "../manager/LogsManager";
import ButtonExpand from "./ButtonExpand";
import ImageExpand from "./ImageExpand";
export default class ViewTools {
	static  cobjMap:Map<UnityEngine.GameObject,BaseViewExpand> = new Map<UnityEngine.GameObject, BaseViewExpand>();

	static autoBindingCObj(cobj:UnityEngine.GameObject){
		var baseView:BaseViewExpand = ViewTools.cobjMap.get(cobj) as BaseViewExpand;
		if (!baseView){
			 baseView = this.getBaseViewByCobj(cobj);
			ViewTools.cobjMap.set(cobj,baseView);
		}

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
			}
		}

		return null

	}

}
