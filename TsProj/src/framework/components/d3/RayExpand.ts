
import {UnityEngine, System,GameUtils} from 'csharp'
import VectorTools from '../../utils/VectorTools';
export default class RayExpand{
    public __comp:UnityEngine.Ray;
    public origin:{x,y,z};
    public direction:{x,y,z};

    public initRay(origin,direction){
        this.origin = origin;
        this.direction = direction;
        this.__comp = new UnityEngine.Ray(VectorTools.turnV3ToNativeV3(origin),VectorTools.turnV3ToNativeV3(direction));
        return this;
    }

}