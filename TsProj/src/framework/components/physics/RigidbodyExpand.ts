import BaseCompExpand from "../BaseCompExpand";
import {UnityEngine, System,GameUtils} from 'csharp'
//刚体
export default  class RigidbodyExpand extends  BaseCompExpand{
    public  __comp:UnityEngine.Rigidbody;
    public  set canCollideWith(value){
    }

    public  set collisionGroup(value){
        this.__owner.__cobject.layer = value;
    }

    public  set isKinematic(value:boolean){
        this.__comp.isKinematic =value;
    }
    //给与冲量
    public  applyImpulse(vec3:{x,y,z}){
        this.__comp
    }

    public  set mass(value:number){
        this.__comp.mass = value;
    }

    public  set friction(value:number){
        // this.__comp.drag = value;
    }

    public  set rollingFriction(value:number){
        // this.__comp.angularDrag =value;
    }

    public  set linearDamping(value:number){
        this.__comp.drag = value;
    }

    public  set angularDamping(value:number){
        this.__comp.angularDrag =value;
    }
}