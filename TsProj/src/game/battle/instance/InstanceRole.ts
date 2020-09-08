import InstanceMove from "./InstanceMove";
import BattleFunc from "../../sys/func/BattleFunc";
import InstanceEffect from "./InstanceEffect";
import BattleConst from "../../sys/consts/BattleConst";
import ColliderController from "../controler/ColliderController";
import RigidbodyExpand from "../../../framework/components/physics/RigidbodyExpand";
import UICompConst from "../../../framework/consts/UICompConst";
import VectorTools from "../../../framework/utils/VectorTools";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";

//车的基类 
export default class InstanceRole extends InstanceMove {

    //目前车的速度方式修改 x代表前进方向的速度. y代表 高度.z 代表换道时的速度

    public isPlayer: boolean = false;

    //翻滚的角度
    protected _flyAng: number = 0;
    protected _initFlyAng: number = 0;

    //当前的最大速度,  超车的时候 最大速度会变化 并且有持续时间
    public maxSpeed: number = 0;


    //是否达到终点
    public isEnd: boolean;

    //尾气特效
    public weiqiEff: InstanceEffect;

    //摆头角度
    protected _headRadian: number = 0

    //加速信息
    /**
     * [
     * {
     *  type: 类型
     *  value: 加速度值,
     *  frame: 剩余时间
     * }
     * ]
     */
    protected _addSpeedArr: any[];



    //能检测碰撞的道具类型
    public canHitPropBit: number;

    public type;

    public param;

    public explodeState;

    private colliderCtrl: ColliderController;

    public rigid: RigidbodyExpand;

    public patrolFlag;

    public dead = false;

    public shape;
    

    public shadow;

    constructor(controller) {
        super(controller);
    }

    public setData(data) {
        super.setData(data);
        this.type = data.type;
        this.explodeState = false;
        this.initStand();
        this.dead = false;
        var collider = this._myView.getChildByName("collider");
        if (collider) {
            collider.setActive(true);
        }
    }

    public setColl(isRigid) {
        if (isRigid) {
            if (!this.colliderCtrl) {
                this.colliderCtrl = this._myView.getComponent(UICompConst.comp_colliderListener,new  ColliderController());
                this.colliderCtrl.instance = this;
                this.colliderCtrl.controller = this.controller;
            }

            this.rigid = this._myView.getComponent(UICompConst.comp_rigidbody3d);
            if (this.rigid) {
                var wall = this._myView;
                // var shape = this.rigid.colliderShape as Laya.BoxColliderShape;
                // shape.localOffset = VectorTools.createVec3(shape.localOffset.x * this.param.transform[6], shape.localOffset.y * this.param.transform[7], shape.localOffset.z * this.param.transform[8]);

                if (this.param.weight > 0) {
                    this.rigid.mass = this.param.weight;
                    this.rigid.friction = 1;
                    this.rigid.rollingFriction = 1;
                    this.rigid.linearDamping = 0.2;
                    this.rigid.angularDamping = 0.1;
                }
                this.shape = null;
            }
        }
        else {
            var physicsCollider
            physicsCollider = this._myView.getChildByName("collider").getComponent(UICompConst.comp_collider);
            if (physicsCollider) {
                // this.rigid.isKinematic = false;
                var wall = this._myView;
                // var rigid = wall.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
                // var shape = physicsCollider.colliderShape as Laya.BoxColliderShape;
                // shape.localOffset = VectorTools.createVec3(shape.localOffset.x * this.param.transform[6], shape.localOffset.y * this.param.transform[7], shape.localOffset.z * this.param.transform[8]);
                //
                // this.shape = shape;
            }
        }

    }

    destroyPre() {
    }


    public refreshShadow(shadow:Base3dViewExpand) {
    }

    //缓动结束 销毁自己
    protected onTweenEnd() {
        this.controller.destoryRole(this);
    }

    //当被设置成缓存
    public onSetToCache() {
        super.onSetToCache();
        this._shakeInfo = null;
        if (this.weiqiEff) {
            this.weiqiEff.getView().active = false;
        }
    }

    public explode() {
        this.tweenExplode();
        this.controller.createExplode(this.pos, this.param.explodeRange);
    }

    tweenExplode() {
        // if (!this.colliderCtrl) {
        //     this.colliderCtrl = this._myView.addComponent(ColliderController);
        //     this.colliderCtrl.instance = this;
        //     this.colliderCtrl.controller = this.controller;
        // }
        // this.explodeState = true;
        // var transform = this._myView.transform;
        // VectorTools.scale(transform.scale, 5, transform.scale);
        // transform.scale = transform.scale;
        // TimerManager.instance.setTimeout(() => {
        //     this.controller.destoryRole(this)
        // }, this, 500);
    }

    //重写执行逻辑函数
    public doAiLogical() {
        this.checkMoveEnd();
        if (this._myState == BattleConst.state_move) {

            this.checkHit();
        }
    }

    //碰撞检测
    public checkHit() {
        //做碰撞检测 
        var arr: InstanceRole[] = this.controller.roleArr
        var speedSquared
        var hasHit = false;
        //倒序遍历 防止中途删除怪物导致卡死
        for (var i = arr.length - 1; i >= 0; i--) {
            var monster = arr[i];

            if (!monster.collider) {
                continue;
            }

            if (monster == this) {
                continue;
            }

            // if (!monster.checkCanBeHited()) {
            //     continue;
            // }
            //如果已经击中过怪物了 不能继续打了
            // if (this.hitedArr.indexOf(monster) != -1) {
            //     continue;
            // }
            //计算距离
            // var disSqure =  VectorTools.distanceSquared(this.pos,monster.pos);
            var dx = monster.pos.x - this.pos.x;
            var dy = monster.pos.z - this.pos.z;
            var wid = 6.6//monster.collider.colliderShape.sizeX//monster.knockSizeBox[0];
            var hei = 1//monster.collider.colliderShape.sizeZ//monster.knockSizeBox[1];
            //
            if (dx <= wid / 2 && dx >= -wid / 2 && dy < hei && dy > -hei) {
                // LogsManager.echo("battle __打中怪物")
                // this.onHitMonster(monster, dx, dy)
                // hasHit = true;
                this.param;
                // this.initStand();
            }

            // if(disSqure < wid/2  || disSqure)
        }
        // //如果击中了怪物 那么震动 .放到外面的原因是防止 因为同时击中2个怪调用2次震动
        // if (hasHit) {
        //     //震屏
        //     UserInfo.platform.vibrate(false);
        // }
    }

    //实现坐标
    realShowView() {
        if (!this._myView) {
            return
        }
        var sp: Base3dViewExpand;
        if (!this.rigid || this.rigid.isKinematic) {
            this._myView.set3dPos(this.pos.x,this.pos.y,this.pos.z);
        }
    }

    private patrol() {
        if (this) {
            if (this.param.autoMoveSpeed) {
                var speed = this.param.autoMoveSpeed * 0.05;
                var dis = Math.sqrt(Math.pow(this.param.x2 - this.param.x1, 2) + Math.pow(this.param.y2 - this.param.y1, 2) + Math.pow(this.param.z2 - this.param.z1, 2));
                if (!this.patrolFlag) {
                    this.initMove((this.param.x2 - this.param.x1) / dis * speed, (this.param.y2 - this.param.y1) / dis * speed, (this.param.z2 - this.param.z1) / dis * speed)
                    
                    if (this.pos.x > this.param.x2) {
                        this.patrolFlag = true;
                    }
                }
                else {

                    this.initMove((this.param.x1 - this.param.x2) / dis * speed, (this.param.y1 - this.param.y2) / dis * speed, (this.param.z1 - this.param.z2) / dis * speed)
                   
                    if (this.pos.x < this.param.x1) {
                        this.patrolFlag = false;
                    }
                }
            }
        }

        // if(this.param.patrolRotate){

        // }
    }
}