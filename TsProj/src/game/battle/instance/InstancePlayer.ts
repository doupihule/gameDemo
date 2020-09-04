import LogsManager from "../../../framework/manager/LogsManager";
import BattleFunc from "../../sys/func/BattleFunc";
import Equation3d from "../../../framework/utils/Equation3d";
import SoundManager from "../../../framework/manager/SoundManager";
import InstanceRole from "./InstanceRole";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";
import { MusicConst } from "../../sys/consts/MusicConst";

//主角类
export default class InstancePlayer extends InstanceRole {

    //剩余弹药
    public leftAmmunition: number = 10;

    //关卡剩余可使用的子弹数量 -1表示无限
    public levelLeftAmmunition: number = 10;

    //最大弹药数量
    public maxAmmuntion: number = 0
    //cd 射击间隔
    public leftShootCd: number = 0;
    public shootCd: number;

    //连射cd判定
    private leftContinueCd: number;
    //连射cd间隔
    private continueCd: number;

    // 当前连射次数 
    private currentContinueCount: number = 0;
    //最大连射次数
    private maxContinueCount: number = 0;


    //目标射击点
    public targetShootPos: {x,y,z};
    //枪口距离锚点的长度单位米 ,主要用来对子弹的 
    public shootOffset: number = 2.3;
    //换弹时间
    public leftWaitCd: number = 0;
    //换弹cd
    //对应子弹的基础属性 存在这里是为了方便读取 并对配表数据进行一次转换

    //子弹信息
    public bulletInfo: any;

    public waitCd: number;
    //剩余换弹时间
    public leftChangeBulletTime: number = 0

    protected bulletSpeed: number = GlobalParamsFunc.instance.getGlobalCfgDatas("bulletFlySpeed").num / 1000 || 0.5;

    //震屏相关信息参数
    protected shakeParams: any;
    //稳定性
    protected stability: number;

    //标记是否鼠标按下
    private _istouchDown: boolean;


    //主摄像头
    private mainCamera: Laya.Camera;
    //触摸点对应的射线 
    public touchRay: Laya.Ray;

    //连击数 
    public combCount: number = 0;
    //最大连击数
    public maxCombCount: number = 16;

    //连击次数记录周期(毫秒)
    public comboRecordCycleFrame: number = 0

    //能量
    public energy: number = 0;

    //最大能量值
    public maxEnergy: number = 100


    private line;

    private rayDir = VectorTools.createVec3();

    private rayOri = VectorTools.createVec3();

    private ray = new Laya.Ray(this.rayOri, this.rayDir);

    private rayHit = new Laya.HitResult();

    private rayNoColl = 0;

    //最大的舞台y坐标
    private _maxStageYPos: number;

    constructor(controller) {
        super(controller);
        this.touchRay = new Laya.Ray(VectorTools.createVec3(0, 0, 0), VectorTools.createVec3(0, 0, 0));
        this.mainCamera = this.controller.battleCamera;
        this.targetShootPos = VectorTools.createVec3();

    }

    //重写设置数据
    public setData(data) {
        super.setData(data);
        this._istouchDown = false;
        var baseAttribute = [];
        this.combCount = 0;

        // if (!this.line) {
        this.line = this.controller.line;
        this.line.active = false;
        this._myView.addChild(this.line);
        this.line.transform.localPositionY = this.controller.bulletHeight;
        this.line.transform.localPositionZ = -this.shootOffset;
        this.initRadian();

        // this.controller.player = this;

        this.collider.collisionGroup = 64;
    }

    //重置一些属性
    private resetAttr() {

    }


    //重写ai函数
    public doAiLogical() {
        this.updateCd();
        //判断是否连续射击
        // this.checkAutoShoot();
    }

    //判断是否连续设计
    private checkAutoShoot() {
        if (!this._istouchDown) {
            return
        }
        this.checkShoot();

    }


    //更新一些cd
    public updateCd() {
        //发射频率cd
        if (this.leftShootCd > 0) {
            this.leftShootCd--;
        }
        //连射cd
        if (this.leftContinueCd > 0) {
            this.leftContinueCd--;
            if (this.leftContinueCd == 0) {
                //如果超过连续射击间隔了 那么请求当前的连续射击数
                this.currentContinueCount = 0;
                LogsManager.echo("battle 重置连射次数")
            }
        }

        //如果换弹cd大于0 
        if (this.leftWaitCd > 0) {
            this.leftWaitCd--;
            //如果换弹完毕
            if (this.leftWaitCd == 0) {
                //把弹药补满
                this.changeAmmunition(this.maxAmmuntion - this.leftAmmunition);
                SoundManager.setSoundVol(0.8, this.cfgsData.reloadSound);
                // SoundManager.playSE(this.cfgsData.reloadSound)
            }
        }
    }

    //开始射击
    public onClick() {

    }

    //触摸按下
    public onToucheDown(stagex, stagey) {
        this._istouchDown = true;
        this.countGunRotate(stagex, stagey);

        this.line.active = true;
        this.checkHit();

    }

    //移动
    public onTouchMove(stagex, stagey) {
        this.countGunRotate(stagex, stagey);
    }


    //计算枪的角度 
    public countGunRotate(stagex, stagey) {
        //计算射线
        var temp: any = new Laya.Vector2();
        temp.x = stagex
        temp.y = stagey
        this.mainCamera.viewportPointToRay(temp, this.touchRay);
        //计算射线和 游戏平面的交点
        var rt = Equation3d.intersectsRayAndPlaneRP(this.touchRay, this.controller.gamePlane, this.targetShootPos);
        if (!rt) {
            LogsManager.errorTag(null, "_为什么这个点和平面没有焦点?....");
        }

        // rt = Equation3d.intersectsRayAndPlaneRP(this.touchRay, this.controller.monsterPlane, temp);
        var angY = Math.PI / 4 + Math.atan2(temp.z - this.pos.z, temp.x - this.pos.x);
        // 这个时候在开始算枪的角度
        var dx = this.targetShootPos.x - this.pos.x;
        var dy = this.targetShootPos.y - this.pos.y;
        var dz = this.targetShootPos.z - this.pos.z;

        var ang = Math.atan2(-dx, -dz);

        this.rayOri.x = this.pos.x;
        this.rayOri.y = this.pos.y + this.line.transform.localPositionY;
        this.rayOri.z = this.pos.z;
        this.rayDir.x = dx;
        this.rayDir.y = 0;
        this.rayDir.z = dz;
        VectorTools.normalize(this.rayDir, this.rayDir)
        // this.ray.direction = this.rayDir;


        //设置目标角度z
        this.setRadian(0, ang, 0);
        //设置y
        //这里y角度单独设置 不作为逻辑依据
        var rotateyCtn: Base3dViewExpand = this._myView//.getChildAt(0).getChildAt(0);

        // this.line.transform.localScaleY = Math.sqrt(dx * dx + dz * dz) / 2;
        // this.checkHit();


        // rotateyCtn.transform.localRotationEulerY = angY * BattleFunc.radtoAngle

        //设置目标角度y
        // this.setRadian(null, ang, null);

        this.checkHit();

        Laya.timer.clear(this, this.checkHit);
        Laya.timer.loop(1, this, this.checkHit);

    }

    //碰撞检测
    public checkHit(tmp?) {
        this.controller.battleScene.physicsSimulation.rayCast(this.ray, this.rayHit, 300, 16, 16);
        if (!this.line.active) return;
        if (this.rayHit.succeeded) {
            var dx = this.rayHit.point.x - this.pos.x;
            var dz = this.rayHit.point.z - this.pos.z;
            this.line.transform.localScaleY = Math.sqrt(dx * dx + dz * dz) - this.shootOffset;

            this.rayNoColl = 0;
        } else {
            if (this.rayNoColl >= 3) {
                this.line.transform.localScaleY = 200;
            }
            this.rayNoColl++;
        }
    }

    // private lineSprite: Laya.PixelLineSprite3D;



    //触摸结束
    public onTouchEnd(stagex, stagey) {
        if (this._istouchDown) {

            this.countGunRotate(stagex, stagey);
            //取消点击
            this._istouchDown = false;

            this.checkHit(1);

            Laya.timer.clear(this, this.checkHit);
            this.line.active = false;

            this.checkShoot();
        }
    }


    //开始准备射击
    public checkShoot() {
        if (this.controller.bulletNum > 0 && !this.controller.battleEnd) {
            this.createBullet([1, 0, 0, this._myView.transform.localRotationEulerY]);
            this.controller.bulletNum--;
            this.controller.battleUi.refreshBullet();
        }
        else {
            this.controller.bulletArr;
        }
        return;
    }


    //创建子弹
    private createBullet(info) {
        var id = info[0];
        //角度偏移
        var angleOffset = info[2];
        if (angleOffset != 0) {
            //角度转弧度
            angleOffset = angleOffset * BattleFunc.angletoRad;
        }

        var ang = info[3] / BattleFunc.radtoAngle;

        //计算子弹偏移量
        //X=rand(-10,10)*连射次数*连射稳定参数1/(连射稳定参数2+枪稳定性)
        var offsetx;
        var continueCount = this.currentContinueCount - 1;
        var targetRotation: number;
        if (continueCount == 0) {
            targetRotation = this.rotationRad.z + angleOffset
        } else {
            // var params = GlobalParamsFunc.instance.getGlobalCfgDatas("stabilityParams").arr;
            // var p1 = Number(params[0]);
            // var p2 = Number(params[1]);
            // var random = RandomUtis.getOneRandomFromArea(-10, 10, BattleFunc.battleRandomIndex, 4)
            // offsetx = random * continueCount * p1 / (p2 + this.stability) / 10000;
            // targetx += offsetx;

            //重新算角度
            var dx = this.targetShootPos.x + 0 - this.pos.x;
            var dy = this.targetShootPos.y - this.pos.y;

            targetRotation = Math.atan2(dy, dx) + angleOffset;
        }

        var cosa = Math.cos(ang)
        var sina = Math.sin(ang);

        var targetx = this.pos.x - sina * this.shootOffset

        var targetz = this.pos.z - cosa * this.shootOffset

        // LogsManager.echo("_创建子弹",id,"angle:",targetRotation)
        var bullet = this.controller.createBullet({ id: id });
        bullet.setPos(targetx, this.controller.bulletHeight, targetz);
        bullet.setOwner(this);
        //设置子弹角度
        bullet.setRadian(0, ang, 0);
        //设置子弹速度
        bullet.setSpeedByAng(this.bulletSpeed, -sina, 0, -cosa);

        bullet.setViewScale(12);

        SoundManager.playSE(MusicConst.SOUND_SHOOT);
        var shootEffect;
        if (this.controller.shootEffectArr.length) {
            shootEffect = this.controller.shootEffectArr.pop();
        }
        else {
            shootEffect = this.controller.shootEffect.clone();
        }
        this.controller.activeShootEffectArr.push(shootEffect);

        this.controller.battleScene.addChild(shootEffect);
        shootEffect.transform.position.x = bullet.pos.x;
        shootEffect.transform.position.y = bullet.pos.y - 1.3;
        shootEffect.transform.position.z = bullet.pos.z;
        shootEffect.transform.position = shootEffect.transform.position;
        shootEffect.transform.rotationEuler = bullet.rotation;

        shootEffect.transform.setWorldLossyScale(shootEffect.transform.getWorldLossyScale());
        // shootEffect.active = false;
        shootEffect.active = true;

    }

    //改变弹药数量
    public changeAmmunition(value, isInit = false) {



        if (value > 0) {
            if (this.levelLeftAmmunition != -1) {
                if (value > this.levelLeftAmmunition) {
                    value = this.levelLeftAmmunition;
                }
                this.levelLeftAmmunition -= value;
            }
        }
        this.leftAmmunition += value;
        //通知战斗界面刷新显示
        if (!isInit) {
            // this.controller.battleUi.updateAmmunition();
        }

    }

    // //击杀一个怪
    // public onKillMonster(monster: InstanceMonster) {
    //     //连击数+1
    //     this.combCount++;
    //     if (this.combCount > this.maxCombCount) {
    //         this.combCount = this.maxCombCount;
    //     }

    //     this.controller.clearCallBack(this, this.changeCombCount);
    //     //一定时间后重置连击数 ,用这种方式的好处就是不用循环在updateframe里面去计算cd了 ,但是一定要记得清除 
    //     this.controller.setCallBack(this.comboRecordCycleFrame, this.changeCombCount, this, 0);
    //     //计算得分
    //     var comInfo = BattleFunc.instance.getCfgDatas("Combo", String(this.combCount))
    //     var ratio = comInfo.scoreScale / 10000
    //     var ratioEnergy = comInfo.energyScale / 10000

    //     var score = Math.round(monster.baseScore * (1 + ratio))
    //     //计算能量
    //     this.changeEnergy(this.energy + Math.round(monster.baseEnergy * (1 + ratioEnergy)));
    //     //更新分数
    //     this.controller.changeScore(score);


    // }

    //改变能量值
    public changeEnergy(value) {
        this.energy = value;
        if (this.energy > this.maxEnergy) {
            this.energy = this.maxEnergy;
        }
    }

    //改变连击数
    public changeCombCount(value: number) {
        this.combCount = value;
    }


}