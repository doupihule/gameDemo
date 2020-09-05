import {UnityEngine, System,GameUtils} from 'csharp'
export  default class  PhysicsTools {

    //射线检测
    public  static  rayCast(origin:{x,y,z},direction:{x,y,z},hitInfo:any,maxDistance:number,layerMask:number=-1,layerMask2:number=-1){

    }

    //初始化hitInfo
    public  static  createHitInfo(){
        return new UnityEngine.RaycastHit();
    }

    public  static  createRay(origin:any,direction:any){
        return new UnityEngine.Ray(origin,direction);
    }

}