import BaseViewExpand from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";
import ResourceManager from "../manager/ResourceManager";
import {UnityEngine, System,Spine} from 'csharp'
import {$typeof} from 'puerts'


export default class SpineGraphicExpand extends  BaseViewExpand{
	public  label:string;
	//当前播放速率
	public  timeScale:number = 1;
	private  __spineAniComp:Spine.Unity.SkeletonGraphic;
	private  __animationState:Spine.AnimationState;
	constructor(name, boundlePath, cobj=null) {
		super();
		this.uitype = UICompConst.comp_spine;
		if (!cobj){
			cobj =ResourceManager.loadSpinePrefab(name,boundlePath);;
		}
		this.label = "";
		this.timeScale = 1;
		this.setCObject(cobj);
		this.__spineAniComp = cobj.GetComponent($typeof(Spine.Unity.SkeletonGraphic));
		this.__animationState = this.__spineAniComp.AnimationState;
	}

	//播放动画
	public  play(label, loop, force=false, start =0, tsvar_end=0){
		if (!force){
			if (this.label == label){
				return;
			}
		}
		this.label = label;
		var trackEntity;
		if (typeof(label) == "number"){
			trackEntity = this.__animationState.SetAnimationByIndex(0, label, loop);
		} else{
			trackEntity = this.__animationState.SetAnimation(0, label, loop);
		}
		//如果是指定播放位置的
		if (tsvar_end > 0){
			trackEntity.AnimationStart = start;
			trackEntity.AnimationEnd = tsvar_end;
		}
		//每次播放动画都需要重置下TimeScale;
		this.__animationState.TimeScale =this.timeScale;
	}

	//设置播放速率
	public  setTimeScale(value:number){
		if (this.timeScale == value){
			return
		}
		this.timeScale = value;
		this.__animationState.TimeScale = value;
	}

	//停止动画
	public  stop(){
		this.__spineAniComp.freeze = true;
		this.__animationState.TimeScale = 0;
	}
	//复原动画
	public  resume(){
		this.__animationState.TimeScale = this.timeScale;
	}
	public  showOrHideSlot(slotName, value){

	}

	//销毁动画
	public dispose(){
		super.dispose()
		this.__spineAniComp = null;
		this.__animationState = null;
	}

}
