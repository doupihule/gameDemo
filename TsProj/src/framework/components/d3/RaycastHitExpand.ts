import { UnityEngine } from 'csharp';
export default class RaycastHitExpand{

    public __comp:UnityEngine.RaycastHit;

    public initHit(){
        this.__comp =new UnityEngine.RaycastHit();
    }

}