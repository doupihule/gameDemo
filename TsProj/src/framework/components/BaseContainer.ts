import BaseViewExpand from "./BaseViewExpand";
import ResourceManager from "../manager/ResourceManager";
import { UnityEngine,GameUtils } from "csharp";
import { $typeof } from "puerts";
import ResourceCommonConst from "../consts/ResourceCommonConst";


export default class BaseContainer extends BaseViewExpand{
	public  __imageComp:UnityEngine.UI.Image;

	private  static _tempColor:{r,g,b,a} = {r:255,g:255,b:255,a:255};

	constructor(cobj=null) {
		super();
		if (!cobj){
			cobj = ResourceManager.loadUIPrefab(ResourceCommonConst.baseContainerPrefeb, ResourceCommonConst.boundle_ui);
		}
		this.setCObject(cobj);
	}
		public  setCObject(cobj: UnityEngine.GameObject) {
		super.setCObject(cobj);
		this.__imageComp = cobj.GetComponent($typeof(UnityEngine.UI.Image)) as any ;
		return this
	}

	public  setColor(r, g, b, a =255) {
		GameUtils.ViewExtensionMethods.SetImageColor(this.__imageComp,r,g,b,a);
	}
	public  dispose() {
		super.dispose();
		this.__imageComp = null;
	}

}
