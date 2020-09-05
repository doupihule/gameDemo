import InstanceMove from "./InstanceMove";
import InstancePlayer from "./InstancePlayer";
import TableUtils from "../../../framework/utils/TableUtils";
import InstanceRole from "./InstanceRole";
import ColliderController from "../controler/ColliderController";
import BattleFunc from "../../sys/func/BattleFunc";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import BattleConst from "../../sys/consts/BattleConst";
import SoundManager from "../../../framework/manager/SoundManager";
import { MusicConst } from "../../sys/consts/MusicConst";
import UICompConst from "../../../framework/consts/UICompConst";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";
import ViewTools from "../../../framework/components/ViewTools";
import RigidbodyExpand from "../../../framework/components/physics/RigidbodyExpand";
import PhysicsTools from "../../../framework/components/physics/PhysicsTools";
import VectorTools from "../../../framework/utils/VectorTools";

export default class InstanceBullet extends InstanceMove {

    //是谁发出的子弹
    public owner: InstancePlayer;
    //攻击力
    public attack: number = 1;
    //穿透值 碰到一个人减少1点穿透值
    public throuthLenth: number = 1;
    //速度的平方. 是为了碰撞检测时 减少计算量
    private speedSqure: number = 0;

    //速度大小
    public speedAbs: number;

    //边界数组 [minx,maxx,miny,maxy];
    private _borderPos: any[];

    public type = "Bullet"

    //击中过的人数组
    protected hitedArr: InstanceRole[];

    private colliderCtrl: ColliderController;

    public rigid: RigidbodyExpand;

    private  ray:any;

    private  rayOrigin:{x,y,z};
    private  rayDirection:{x,y,z};

    private rayHit;

    private coll;

    public isSimulate;

    public fakeSpeed = 100;

    constructor(controller) {
        super(controller);
        this.ray = PhysicsTools.createRay(this.pos, this.speed);
        this.rayOrigin = VectorTools.cloneTo(this.pos);
        this.rayDirection = VectorTools.cloneTo(this.speed);
        this.rayHit = PhysicsTools.createHitInfo()
        this.hitedArr = [];
    }

    //设置数据
    public setData(data) {
        super.setData(data);
        // this.cfgsData = BattleFunc.instance.getCfgDatas("Bullet", this.dataId);
        this.knockSizeBox = TableUtils.copyOneArr([600, 3500]);
        //单位转化
        this.knockSizeBox[0] /= 10000;
        this.knockSizeBox[1] /= 10000;

        this.coll = null;


        //清空击中过的怪
        this.hitedArr.splice(0, this.hitedArr.length);
        // this._borderPos = BattleFunc.borderPos;
        if (!this.colliderCtrl) {
            this.rigid = this._myView.getComponent(UICompConst.comp_rigidbody3d);
            this.colliderCtrl = this._myView.addComponent(ColliderController);
            this.colliderCtrl.instance = this;
            this.colliderCtrl.controller = this.controller;
            // this.rigid.overrideGravity = true;
            this.rigid.canCollideWith = 16 | 32;

            this.rigid.collisionGroup = 64;
            // this.rigid.ccdMotionThreshold = 0.00001;
            // this.rigid.isKinematic = true;
        }

    }

    //设置速度
    public setSpeedByAng(spd, rx, ry, rz) {
        this.initMove(spd * rx, spd * ry, spd * rz);
    }

    //初始化运动 ,子类可根据这个继承,并改变视图的朝向或者 动作显示
    // initMove(x: number = 0, y: number = 0, z: number = 0) {
    //     this.speed.x = x;
    //     this.speed.y = y;
    //     this.speed.z = z;
    //     (this.rigid as Laya.Rigidbody3D).applyImpulse(VectorTools.createVec3(x, y, z));

    // }

    //设置角度
    public setAngBySpeed() {
        var ang = 1;
        if (this.speed.z) {
            ang = Math.atan(this.speed.x / this.speed.z);
        }
        this.setRadian(0, ang, 0);
    }

    //实现坐标
    realShowView() {
        if (!this._myView) {
            return
        }
        var sp: Base3dViewExpand;

        //@xd_test
        // this.pos = this._myView.transform.position;
        this._myView.set3dPos(this.pos.x,this.pos.y,this.pos.z);
        // this._myView.transform.x = this.pos.x;
        // this._myView.transform.y = this.pos.y;
        // this._myView.transform.z = this.pos.z;
    }

    //设置坐标
    setPos(x: number = 0, y: number = 0, z: number = 0) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
        if (this.rigid) {
            this.rigid.isKinematic = true;

            this._myView.set3dPos(x,y,z);
            this.realShowView()
        }
    }

    //设置主人 
    public setOwner(owner: InstancePlayer) {
        this.owner = owner;
        this.throuthLenth = 100;
        //定义子弹速度大小
        this.speedAbs = 100;
        //拿到攻击力
        this.attack = 100;

    }

    //执行子弹ai逻辑
    public doAiLogical() {
        //碰撞检测
        this.checkHit();
        //边界检测
        this.checkBorder();
    }

    //碰撞检测
    private checkHit() {
        var flag = false;
        this.isSimulate = false;
        VectorTools.cloneTo(this.pos,this.rayOrigin);
        VectorTools.cloneTo(this.speed,this.rayDirection);
        var length = VectorTools.scalarLength(this.speed) * 0.999
        PhysicsTools.rayCast(this.rayOrigin, this.rayDirection, this.rayHit, 300, 32, 16 | 32);
        if (!this.rayHit.succeeded) return;
        if (this.rayHit.collider) {
            var tempVector3_1 = VectorTools.createVec3();
            var tempVector3_2 = VectorTools.createVec3();
            var tempVector3_3 = VectorTools.createVec3();
            var tempVector3_4 = VectorTools.createVec3();
            VectorTools.subtract(this.rayHit.point, this.rayOrigin, tempVector3_1)
            if (VectorTools.distance(this.rayOrigin, this.rayHit.point) < length) {

                if (this.coll == this.rayHit.collider) {
                    this.coll = null;
                    return;
                }
                else {
                    // this.pos = this.rayHit.point;
                    this.coll = this.rayHit.collider;
                }
                if (this.rayHit.collider.owner.name.indexOf("border") != -1) {
                    this.controller.destoryBullet(this);
                    return;
                }

                var collObj = this.rayHit.collider.owner && this.rayHit.collider.owner["instance"];
                if (collObj) {
                    if (collObj.type == "Target") {
                        if (collObj.param.pierce) {

                        }
                        else {
                            this.controller.destoryBullet(this);
                        }
                        if (this.controller.roleDead(collObj, true, this.speed)) {
                            SoundManager.playSE(MusicConst.SOUND_HITDIE);
                            collObj.collider.collisionGroup = 64;
                            flag = true;
                        }
                        // this.controller.checkResult();
                    }
                    if (collObj.param.portalIn) {
                        for (var index in this.controller.roleArr) {
                            var roleInstance = this.controller.roleArr[index];
                            if (roleInstance == collObj) continue;
                            if (roleInstance.param.portalOut && roleInstance.param.portalId == collObj.param.portalId) {
                                VectorTools.normalize(this.speed, tempVector3_1);
                                var time = this.speed.x / tempVector3_1.x;

                                this.ray.origin = this.pos;
                                this.ray.direction = this.speed;
                                PhysicsTools.rayCast(this.ray, this.rayHit, 300);

                                var normal = this.rayHit.normal;

                                VectorTools.scale(normal, -2 * (VectorTools.dot(tempVector3_1, normal)), tempVector3_2)
                                VectorTools.add(tempVector3_1, tempVector3_2, tempVector3_3);
                                VectorTools.scale(tempVector3_3, time, tempVector3_4);

                                if (Math.pow(tempVector3_4.x - this.speed.x, 2) + Math.pow(tempVector3_4.y - this.speed.y, 2) + Math.pow(tempVector3_4.z - this.speed.z, 2) > 0.001) {
                                    this.speed.x = tempVector3_4.x;
                                    this.speed.y = tempVector3_4.y;
                                    this.speed.z = tempVector3_4.z;

                                    var deltaRotY = roleInstance._myView.transform.localRotationEulerY - collObj._myView.transform.localRotationEulerY;

                                    // var c = 1;
                                    // if (this.instance.speed.z) {
                                    //     ang = Math.atan(this.instance.speed.x / this.instance.speed.z);
                                    // }
                                    // ang += deltaRotY * BattleFunc.angletoRad;
                                    // var speed = Math.sqrt(Math.pow(this.instance.speed.x, 2) + Math.pow(this.instance.speed.z, 2));
                                    // var xdis = this.instance.speed.x / Math.abs(this.instance.speed.x)
                                    // var zdis = this.instance.speed.z / Math.abs(this.instance.speed.z)
                                    // this.instance.speed.x = xdis * speed * Math.abs(Math.sin(ang));
                                    // this.instance.speed.z = zdis * speed * Math.abs(Math.cos(ang));

                                    var ang = -deltaRotY * BattleFunc.angletoRad;
                                    var speed = Math.sqrt(Math.pow(this.speed.x, 2) + Math.pow(this.speed.z, 2));
                                    var x = this.speed.x / speed
                                    var z = this.speed.z / speed
                                    this.speed.x = speed * (x * Math.cos(ang) - z * Math.sin(ang));
                                    this.speed.z = speed * (x * Math.sin(ang) + z * Math.cos(ang));

                                    var detlaPos = VectorTools.createVec3;
                                    VectorTools.subtract(this.rayHit.point, collObj.pos, detlaPos);
                                    detlaPos.x /= collObj._myView.transform.localScaleX;
                                    detlaPos.y /= collObj._myView.transform.localScaleY;
                                    detlaPos.z /= collObj._myView.transform.localScaleZ;


                                    x = detlaPos.x
                                    z = detlaPos.z
                                    detlaPos.x = 1 * (x * Math.cos(ang) - z * Math.sin(ang));
                                    detlaPos.z = 1 * (x * Math.sin(ang) + z * Math.cos(ang));

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

                                    this.pos.x = detlaPos.x + roleInstance.pos.x;
                                    this.pos.y = detlaPos.y + roleInstance.pos.y;
                                    this.pos.z = detlaPos.z + roleInstance.pos.z;

                                    // flag = true;
                                    this.isSimulate = true;
                                    break;
                                }
                                else {

                                }

                            }
                        }
                    }
                    else if (collObj.param.rebound) {
                        if (collObj.param.move) {
                            var collObj2 = collObj.getView()
                            VectorTools.scale(this.speed, this.fakeSpeed, tempVector3_2)

                            collObj2.getComponent(Laya.Rigidbody3D).applyImpulse(tempVector3_2);
                        }
                        this.ray.origin = this.pos;
                        // VectorTools.scale(this.speed, 1, this.ray.origin);
                        // VectorTools.subtract(this.pos, this.speed, this.ray.origin);
                        this.ray.direction = this.speed;
                        this.controller.battleScene.physicsSimulation.rayCast(this.ray, this.rayHit, 300, 16, 16);

                        VectorTools.normalize(this.speed, tempVector3_1);
                        var time = this.speed.x / tempVector3_1.x;
                        var normal = this.rayHit.normal;
                        VectorTools.scale(normal, -2 * (VectorTools.dot(tempVector3_1, normal)), tempVector3_2)
                        VectorTools.add(tempVector3_1, tempVector3_2, tempVector3_3);
                        VectorTools.scale(tempVector3_3, time, tempVector3_4);

                        if (Math.pow(tempVector3_4.x - this.speed.x, 2) + Math.pow(tempVector3_4.y - this.speed.y, 2) + Math.pow(tempVector3_4.z - this.speed.z, 2) > 0.001) {
                            this.initMove(tempVector3_4.x, tempVector3_4.y, tempVector3_4.z)
                            this.setAngBySpeed();
                        }


                        VectorTools.scale(this.speed, 0.0001, tempVector3_4)
                        VectorTools.subtract(this.rayHit.point, tempVector3_4, this.pos)
                        this.isSimulate = true;

                        SoundManager.playSE(MusicConst.SOUND_CRASH);
                        // this.pos = this.rayHit.point;
                    } else {
                        if (collObj.param.pierce) {

                        }
                        else {
                            if (collObj.param.move) {
                                var collObj2 = collObj.getView()
                                VectorTools.scale(this.speed, this.fakeSpeed, tempVector3_2)

                                collObj2.getComponent(Laya.Rigidbody3D).applyImpulse(tempVector3_2);
                            }
                            this.controller.destoryBullet(this);

                        }
                    }
                    if (collObj.param.explodeButton) {
                        for (var index in this.controller.roleArr) {
                            var role = this.controller.roleArr[index];
                            if (role.param.explodeBox) {
                                if (collObj.param.explodeId == role.param.explodeId) {
                                    role.explode();
                                }
                            }
                        }
                        // this.controller.destoryRole(otherInstance);
                    }
                    if (collObj.param.break) {
                        this.controller.destoryRole(collObj);
                    }
                }

            }
        }
        if (flag) {
            this.checkHit();
        }
        this.setAngBySpeed();
    }

    //重写运动函数 主要是更新坐标
    movePos() {
        //如果是激活旋转的 那么让view的第一去旋转这么多角度
        if (this.isSimulate) {
            return;
        }
        if (this.enbleRotate) {
            //设置弧度
            this.setRadian(this.rotationRad.x + this.rotateSpeed.x, this.rotationRad.y + this.rotateSpeed.y, this.rotationRad.z + this.rotateSpeed.z);
        }
        //stand状态不执行
        if (this._myState == BattleConst.state_stand) {
            return;
        }
        this.pos.x += this.speed.x + this.blookSpeed.x;
        this.pos.y += this.speed.y + this.blookSpeed.y;
        this.pos.z += this.speed.z + this.blookSpeed.z;
        //如果坐标小于0 而且是朝地面运动状态  而且是受重力影响的 那么才会去检测落地
        if (this.speed.y < 0 && this.pos.y <= this.landPos && this._myState == BattleConst.state_move && this.gravityAble) {
            this.onHitLand();
        }


    }


    //判断边界
    protected checkBorder() {
        var isOutScreen = false
        var border = this._borderPos;
        // if (this.pos.x < border[0] || this.pos.x > border[1]) {
        //     isOutScreen = true
        // } else if (this.pos.y < border[2] || this.pos.y > border[3]) {
        //     isOutScreen = true;
        // }

        //如果移除屏幕了 那么
        if (isOutScreen) {
            this.controller.destoryBullet(this);
        }
    }

    //重写着陆函数. 同时控制器销毁自己
    protected onHitLand() {
        this.controller.destoryBullet(this);
    }

    //碰到怪物了 dx,dy 是用来做击退位移效果的
    protected onHitMonster(monster: InstanceRole, dx, dy) {
        if (this.throuthLenth == 0) {
            this.controller.destoryBullet(this);
            return;
        }
        this.throuthLenth--;
        this.hitedArr.push(monster);
        // monster.onBeHited(this);
        //创建击中特效
        this.createEfect(this.cfgsData.hitEffect, this.pos.x, this.pos.y, 1.3, true, 60);
    }
}