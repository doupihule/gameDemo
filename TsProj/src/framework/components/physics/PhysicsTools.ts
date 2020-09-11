import {UnityEngine, System,GameUtils} from 'csharp'
export  default class  PhysicsTools {

    //射线检测
    public  static  rayCast(origin:{x,y,z},direction:{x,y,z},hitInfo:{hitInfo},maxDistance:number,layerMask:number=0,){
        var rt = GameUtils.PhysicsExtensionMethods.rayCastHit(origin.x,origin.y,origin.z,direction.x,direction.y,direction.z,maxDistance,layerMask);
        hitInfo.hitInfo = GameUtils.PhysicsExtensionMethods.tempRayCastHit;
        return rt;
    }

    //初始化hitInfo
    public  static  createHitInfo(){
        return {hitInfo:null};
    }

    public  static  createRay(origin:any,direction:any){
        return new UnityEngine.Ray(origin,direction);
    }

}