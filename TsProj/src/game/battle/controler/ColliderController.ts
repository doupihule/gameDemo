import BattleLogicalControler from "./BattleLogicalControler";
import BattleFunc from "../../sys/func/BattleFunc";
import SoundManager from "../../../framework/manager/SoundManager";
import { MusicConst } from "../../sys/consts/MusicConst";
import {UnityEngine, System,GameUtils} from 'csharp'
import VectorTools from "../../../framework/utils/VectorTools";
import BaseCompExpand from "../../../framework/components/BaseCompExpand";
import PhysicsTools from "../../../framework/components/physics/PhysicsTools";
import ViewTools from "../../../framework/components/ViewTools";
import BaseViewExpand from "../../../framework/components/BaseViewExpand";



export default class ColliderController extends BaseCompExpand {

    public instance;
    public controller: BattleLogicalControler;

    public ray ;
    public rayHit;

    constructor() {
        super();
        this.ray =  PhysicsTools.createRay(VectorTools.createVec3(),VectorTools.createVec3());
        this.rayHit = PhysicsTools.createHitInfo()
    }
    public  initComponent(targetcomp: GameUtils.ColliderListenerExpand, owner: BaseViewExpand) {
        super.initComponent(targetcomp, owner);
        targetcomp.OnCollisionEnterDelegate = new GameUtils.CollisionDelege(this.onCollisionEnter.bind(this));
        targetcomp.OnTriggerEnterDelegate = new GameUtils.ColliderDelege(this.onTriggerEnter.bind(this));
    }


    //碰撞检测
    public onCollisionEnter(collEvent: UnityEngine.Collision): void {
        this.collisionLogic(collEvent);
    }

    public onCollisionStay(collEvent: UnityEngine.Collision): void {
    }

    public onCollisionExit(collEvent: UnityEngine.Collision): void {
    }

    //触发器检测
    public onTriggerEnter(other: UnityEngine.Collider): void {
        this.TriggerLogic(other);
    }

    //触发器碰撞停留
    public onTriggerStay(other: UnityEngine.Collider): void {

    }

    //触发器碰撞退出
    public onTriggerExit(other: UnityEngine.Collider): void {

    }

    public collisionLogic(collEvent: UnityEngine.Collision) {
        var otherView = collEvent.other.gameObject;
        var otherInstance = this.controller.getInstanceByComp(otherView);

        if (otherView.name == "role_beijing") {
            return;
        }
        if (!this.instance) {
            return;
        }
        if (this.instance.type == "Bullet") {
            this.TriggerLogic(collEvent.other as UnityEngine.Collider);
        }
        else {
            if (otherView.name.indexOf("border") != -1) {
                this.instance.controller.destoryRole(this.instance);
                return;
            }
            if (!otherInstance) {
                return;
            }
            if (otherInstance.type == "Bullet") {
                return;
            }
            if (otherInstance.param.rebound) {

            }
            if (otherInstance.type == "Target") {
                if (this.controller.roleDead(otherInstance)) {
                    SoundManager.playSE(MusicConst.SOUND_HITDIE);
                }
                return;
            }
        }
    }

    public TriggerLogic(other: UnityEngine.Collider) {
        var otherView = other.gameObject;
        var otherInstance = this.controller.getInstanceByComp(otherView);
        if (!this.instance) {
            return;
        }
        if (this.instance.type == "Bullet") {
            return;
        }
        else {

            if (otherView.name.indexOf("border") != -1) {
                this.instance.controller.destoryRole(this.instance);
                return;
            }
            if (!otherInstance) {
                return;
            }
            if (otherInstance.type == "Bullet") {
                return;
            }
            if (otherInstance.param.rebound) {
            }
            if (otherInstance.type == "Target") {
                if(this.controller.roleDead(otherInstance)){
                    SoundManager.playSE(MusicConst.SOUND_HITDIE);
                }
                return;
            }
        }
    }







}
