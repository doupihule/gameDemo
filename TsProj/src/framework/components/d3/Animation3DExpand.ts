import { UnityEngine } from 'csharp';
import BaseCompExpand from "../BaseCompExpand";

export  default  class Animation3DExpand extends  BaseCompExpand{
	public __comp:UnityEngine.Animator;
	public  play(label:string,loop:boolean =false){
		this.__comp.Play(label);
	}
}