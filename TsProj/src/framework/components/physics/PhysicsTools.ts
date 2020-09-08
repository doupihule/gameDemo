import {UnityEngine, System,GameUtils} from 'csharp'
export  default class  PhysicsTools {

    //射线检测
    public  static  rayCast(origin:{x,y,z},direction:{x,y,z},hitInfo:any,maxDistance:number,layerMask:number=0,){
        var v1 = GameUtils.ViewExtensionMethods.initVec3(origin.x,origin.y,origin.z);
        var v2 =  GameUtils.ViewExtensionMethods.initVec3(direction.x,direction.y,direction.z);
        return UnityEngine.Physics.Raycast(v1,v2,hitInfo,maxDistance,layerMask);
    }

    //初始化hitInfo
    public  static  createHitInfo(){
        return new UnityEngine.RaycastHit();
    }

    public  static  createRay(origin:any,direction:any){
        return new UnityEngine.Ray(origin,direction);
    }

}