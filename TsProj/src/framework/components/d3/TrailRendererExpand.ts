import { UnityEngine } from 'csharp';
import BaseCompExpand from "../BaseCompExpand";

export default class TrailRendererExpand extends BaseCompExpand{
    public __comp:UnityEngine.TrailRenderer;

    //清理拖尾
    public clear(){
        this.__comp.Clear();
        this.__comp.enabled = false;
        this.__comp.enabled = true;
        
    }

}