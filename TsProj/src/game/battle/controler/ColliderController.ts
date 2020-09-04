import BattleLogicalControler from "./BattleLogicalControler";
import BattleFunc from "../../sys/func/BattleFunc";
import SoundManager from "../../../framework/manager/SoundManager";
import { MusicConst } from "../../sys/consts/MusicConst";
import VectorTools from "../../../framework/utils/VectorTools";
import BaseCompExpand from "../../../framework/components/BaseCompExpand";


export default class ColliderController extends BaseCompExpand {

    public instance;
    public controller: BattleLogicalControler;
    public tempVector3_1 = VectorTools.createVec3();
    public tempVector3_2 = VectorTools.createVec3();
    public tempVector3_3 = VectorTools.createVec3();
    public tempVector3_4 = VectorTools.createVec3();

    public ray = new Laya.Ray(null, null);
    public rayHit = new Laya.HitResult();

    constructor() {
        super();
    }

    public onAwake(): void {
        // console.log("krma. onAwake")
    }

    //碰撞检测
    public onCollisionEnter(collEvent: Laya.Collision): void {
        // console.log("krma. onCollisionEnter")
        super.onCollisionEnter(collEvent);
        this.collisionLogic(collEvent);
    }

    public onCollisionStay(collEvent: Laya.Collision): void {
        // console.log("krma. onCollisionStay")
        super.onCollisionStay(collEvent);
        // this.collisionLogic(collEvent);
    }

    public onCollisionExit(collEvent: Laya.Collision): void {
        // console.log("krma. onCollisionExit")
        super.onCollisionExit(collEvent);
        // this.collisionLogic(collEvent);
    }

    //触发器检测
    public onTriggerEnter(other: Laya.PhysicsComponent): void {
        // console.log("krma. onTriggerEnter")
        super.onTriggerEnter(other);
        this.TriggerLogic(other);



    }

    //触发器碰撞停留
    public onTriggerStay(other: Laya.PhysicsComponent): void {
        // console.log("krma. onTriggerStay")
        super.onTriggerStay(other);

    }

    //触发器碰撞退出
    public onTriggerExit(other: Laya.PhysicsComponent): void {
        // console.log("krma. onTriggerExit")
        super.onTriggerExit(other);

    }

    public collisionLogic(collEvent) {
        var otherView = collEvent.other.owner;
        var otherInstance = collEvent.other.owner["instance"];

        if (otherView.name == "role_beijing") {
            return;
        }
        if (!this.instance) {
            return;
        }
        if (this.instance.type == "Bullet") {
            this.TriggerLogic(collEvent.other);
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
                // VectorTools.normalize(this.instance.speed, this.tempVector3_1);
                // var time = this.instance.speed.x / this.tempVector3_1.x;
                // var normal = collEvent.contacts[collEvent.contacts.length - 1].normal;
                // VectorTools.scale(normal, -2 * (VectorTools.dot(this.tempVector3_1, normal)), this.tempVector3_2)
                // VectorTools.add(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
                // VectorTools.scale(this.tempVector3_3, time, this.tempVector3_4);

                // if (Math.pow(this.tempVector3_4.x - this.instance.speed.x, 2) + Math.pow(this.tempVector3_4.y - this.instance.speed.y, 2) + Math.pow(this.tempVector3_4.z - this.instance.speed.z, 2) > 0.001) {
                //     this.instance.speed.x = this.tempVector3_4.x;
                //     this.instance.speed.y = this.tempVector3_4.y;
                //     this.instance.speed.z = this.tempVector3_4.z;
                // }
                // else {
                //     var tmp = 1;
                // }

            }
            if (otherInstance.type == "Target") {
                // this.controller.destoryBullet(this.instance);
                if (this.controller.roleDead(otherInstance)) {
                    SoundManager.playSE(MusicConst.SOUND_HITDIE);
                }
                // this.controller.checkResult();
                return;
            }
        }
    }

    public TriggerLogic(other: Laya.PhysicsComponent) {
        var otherView = other.owner;
        var otherInstance = other.owner["instance"];
        if (!this.instance) {
            return;
        }
        if (this.instance.type == "Bullet") {
            return;
            if (otherView.name.indexOf("border") != -1) {
                this.instance.controller.destoryBullet(this.instance);
                return;
            }
            if (!otherInstance) {
                return;
            }
            if (otherInstance.type == "Player") {
                return;
            }
            if (otherInstance.type == "Target") {
                if (otherInstance.param.pierce) {

                }
                else {
                    this.controller.destoryBullet(this.instance);
                }
                if(this.controller.roleDead(otherInstance, true, this.instance.speed)){
                    SoundManager.playSE(MusicConst.SOUND_HITDIE);
                }
                // this.controller.checkResult();
                return;
            }

            if (otherInstance.param) {
                if (otherInstance.param.move) {
                    // if (otherInstance.param.autoMoveSpeed) {
                    //     otherInstance.rigid.isKinematic = false;
                    // }
                    // var rigid: Laya.Rigidbody3D = otherInstance.getView().getComponent(Laya.Rigidbody3D);
                    // var weight = otherInstance.param.weight || 1;
                    // otherInstance.initMove(this.instance.speed.x / weight, this.instance.speed.y / weight, this.instance.speed.z / weight)
                    // rigid.applyImpulse();
                    // this.controller.destoryRole(otherInstance);
                }
                if (otherInstance.param.portalIn) {
                    for (var index in this.controller.roleArr) {
                        var roleInstance = this.controller.roleArr[index];
                        if (roleInstance == otherInstance) continue;
                        if (roleInstance.param.portalOut && roleInstance.param.portalId == otherInstance.param.portalId) {
                            VectorTools.normalize(this.instance.speed, this.tempVector3_1);
                            var time = this.instance.speed.x / this.tempVector3_1.x;

                            this.ray.origin = this.instance.pos;
                            this.ray.direction = this.instance.speed;
                            this.controller.battleScene.physicsSimulation.rayCast(this.ray, this.rayHit, 300);

                            var normal = this.rayHit.normal;

                            VectorTools.scale(normal, -2 * (VectorTools.dot(this.tempVector3_1, normal)), this.tempVector3_2)
                            VectorTools.add(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
                            VectorTools.scale(this.tempVector3_3, time, this.tempVector3_4);
                            if (Math.pow(this.tempVector3_4.x - this.instance.speed.x, 2) + Math.pow(this.tempVector3_4.y - this.instance.speed.y, 2) + Math.pow(this.tempVector3_4.z - this.instance.speed.z, 2) > 0.001) {
                                this.instance.speed.x = this.tempVector3_4.x;
                                this.instance.speed.y = this.tempVector3_4.y;
                                this.instance.speed.z = this.tempVector3_4.z;

                                var deltaRotY = roleInstance._myView.transform.localRotationEulerY - otherInstance._myView.transform.localRotationEulerY;


                                var ang = -deltaRotY * BattleFunc.angletoRad;
                                var speed = Math.sqrt(Math.pow(this.instance.speed.x, 2) + Math.pow(this.instance.speed.z, 2));
                                var x = this.instance.speed.x / speed
                                var z = this.instance.speed.z / speed
                                this.instance.speed.x = speed * (x * Math.cos(ang) - z * Math.sin(ang));
                                this.instance.speed.z = speed * (x * Math.sin(ang) - z * Math.cos(ang));

                                var detlaPos = VectorTools.createVec3();
                                VectorTools.subtract(this.instance.pos, otherInstance.pos, detlaPos);
                                detlaPos.x /= otherInstance._myView.transform.localScaleX;
                                detlaPos.y /= otherInstance._myView.transform.localScaleY;
                                detlaPos.z /= otherInstance._myView.transform.localScaleZ;


                                x = detlaPos.x
                                z = detlaPos.z
                                detlaPos.x = 1 * (x * Math.cos(ang) - z * Math.sin(ang));
                                detlaPos.z = 1 * (x * Math.sin(ang) - z * Math.cos(ang));

                                // var ang = 1;
                                // if (detlaPos.z) {
                                //     ang = Math.atan(detlaPos.x / detlaPos.z);
                                // }
                                // ang += deltaRotY * BattleFunc.angletoRad;
                                // xdis = detlaPos.x / Math.abs(detlaPos.x)
                                // zdis = detlaPos.z / Math.abs(detlaPos.z)
                                // var DeltaDis = Math.sqrt(Math.pow(detlaPos.x, 2) + Math.pow(detlaPos.z, 2));
                                // detlaPos.x = xdis * DeltaDis * Math.abs(Math.sin(ang));
                                // detlaPos.z = zdis * DeltaDis * Math.abs(Math.cos(ang));

                                detlaPos.x *= roleInstance._myView.transform.localScaleX;
                                detlaPos.y *= roleInstance._myView.transform.localScaleY;
                                detlaPos.z *= roleInstance._myView.transform.localScaleZ;

                                this.instance.pos.x = detlaPos.x + roleInstance.pos.x;
                                this.instance.pos.y = detlaPos.y + roleInstance.pos.y;
                                this.instance.pos.z = detlaPos.z + roleInstance.pos.z;

                                break;
                            }
                            else {
                                var tmp = 1;
                            }

                        }
                    }
                }
                else if (otherInstance.param.rebound && !otherInstance.param.move) {
                    // this.ray.origin = VectorTools.createVec3();

                    // VectorTools.scale(this.instance.speed, 2, this.ray.origin);
                    // VectorTools.subtract(this.instance.pos, this.ray.origin, this.ray.origin);
                    // this.ray.direction = this.instance.speed;
                    // this.controller.battleScene.physicsSimulation.rayCast(this.ray, this.rayHit, 300, 16, 16);

                    // VectorTools.normalize(this.instance.speed, this.tempVector3_1);
                    // var time = this.instance.speed.x / this.tempVector3_1.x;
                    // var normal = this.rayHit.normal;
                    // VectorTools.scale(normal, -2 * (VectorTools.dot(this.tempVector3_1, normal)), this.tempVector3_2)
                    // VectorTools.add(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
                    // VectorTools.scale(this.tempVector3_3, time, this.tempVector3_4);

                    // if (Math.pow(this.tempVector3_4.x - this.instance.speed.x, 2) + Math.pow(this.tempVector3_4.y - this.instance.speed.y, 2) + Math.pow(this.tempVector3_4.z - this.instance.speed.z, 2) > 0.001) {
                    //     this.instance.initMove(this.tempVector3_4.x, this.tempVector3_4.y, this.tempVector3_4.z)
                    //     this.instance.setAngBySpeed();
                    // }


                }
                else {
                    if (otherInstance.param.pierce) {

                    }
                    else {
                        this.controller.destoryBullet(this.instance);
                    }
                }
                if (otherInstance.param.explodeButton) {
                    for (var index in this.controller.roleArr) {
                        var role = this.controller.roleArr[index];
                        if (role.param.explodeBox) {
                            if (otherInstance.param.explodeId == role.param.explodeId) {
                                role.explode();
                            }
                        }
                    }
                    // this.controller.destoryRole(otherInstance);
                }
                if (otherInstance.param.break) {
                    this.controller.destoryRole(otherInstance);
                }


            }

            // this.instance.speed.x = this.tempVector3_4.x;
            // this.instance.speed.y = this.tempVector3_4.y;
            // this.instance.speed.z = this.tempVector3_4.z;

            this.instance.setAngBySpeed();
        }
        else {

            if (otherView.name.indexOf("border") != -1) {
                this.instance.controller.destoryRole(this.instance);
                return;
            }
            //if (this.instance.param.move && this.instance.param.autoMoveSpeed) {
            //    if (otherView.name == "bulletColl")
            //        this.instance.rigid.isKinematic = false;
            //}
            if (!otherInstance) {
                return;
            }
            if (otherInstance.type == "Bullet") {
                return;
            }
            if (otherInstance.param.rebound) {
                // VectorTools.normalize(this.instance.speed, this.tempVector3_1);
                // var time = this.instance.speed.x / this.tempVector3_1.x;
                // var normal = collEvent.contacts[collEvent.contacts.length - 1].normal;
                // VectorTools.scale(normal, -2 * (VectorTools.dot(this.tempVector3_1, normal)), this.tempVector3_2)
                // VectorTools.add(this.tempVector3_1, this.tempVector3_2, this.tempVector3_3);
                // VectorTools.scale(this.tempVector3_3, time, this.tempVector3_4);


                // if (Math.pow(this.tempVector3_4.x - this.instance.speed.x, 2) + Math.pow(this.tempVector3_4.y - this.instance.speed.y, 2) + Math.pow(this.tempVector3_4.z - this.instance.speed.z, 2) > 0.001) {
                //     this.instance.speed.x = this.tempVector3_4.x;
                //     this.instance.speed.y = this.tempVector3_4.y;
                //     this.instance.speed.z = this.tempVector3_4.z;
                // }
                // else {
                //     var tmp = 1;
                // }

            }
            if (otherInstance.type == "Target") {
                // this.controller.destoryBullet(this.instance);
                if(this.controller.roleDead(otherInstance)){
                    SoundManager.playSE(MusicConst.SOUND_HITDIE);
                }
                // this.controller.checkResult();
                return;
            }
        }
    }
}
