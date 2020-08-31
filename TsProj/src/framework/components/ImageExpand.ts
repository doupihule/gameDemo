import BaseContainer from "./BaseContainer";
import { UnityEngine,GameUtils } from "csharp";
import UICompConst from "../consts/UICompConst";
import ResourceManager from "../manager/ResourceManager";
import GameConsts from "../../game/sys/consts/GameConsts";
import ResourceConst from "../../game/sys/consts/ResourceConst";

export default class ImageExpand extends BaseContainer{

	constructor(obj:UnityEngine.GameObject) {
		super(obj);
		this.uitype = UICompConst.comp_img;
	}

	public  setColor(r, g, b, a) {

	}

	//设置皮肤 最好手动指定boundlename
	public  setSkin(url,boundlename:string = ResourceConst.boundle_uiimage,adjustSize:boolean =false){
		if (!url || url =="" ){
			this.__imageComp.sprite = null
		} else{
			var sp:any =  ResourceManager.loadSprite(url,boundlename);
			this.__imageComp.sprite = sp;
			if (adjustSize){
				var size = sp.bounds.size
				this.setSize(size.x*GameConsts.uiMitoPixelRatio,size.y*GameConsts.uiMitoPixelRatio);
			}
		}
	}

	//设置九宫格信息
	public  setSizeGrid(a,b,c,d){

	}
}
