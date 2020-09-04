import BattleFunc from "../../sys/func/BattleFunc";
import BattleLogicalControler from "./BattleLogicalControler";
import VectorTools from "../../../framework/utils/VectorTools";

export default class CameraControler {
    //摄像机实例
    public camera: Laya.Camera;
    public controller: BattleLogicalControler;

    //相机的初始位置
    private _initCameraPos: {x,y,z};
    public targetCamerePos: {x,y,z};

    public shakeFrame: number = 0;
    public shakeStyle: string;
    public shakeStrength: number;
    public shakeIntervel: number = 2;

    private _shakeOffest: {x,y,z}
    private _followOffsetPos: {x,y,z};

    //是否是跟随主角的
    public isFollowPlayer: boolean = true;


    //当前旋转的角度
    private _cameraRotation: {x,y,z}
    //上一次存储的角度,用来做缓动
    private _lastRotation:{x,y,z};


    constructor(controller) {
        this.controller = controller;

        this._initCameraPos = VectorTools.createVec3();
        this.targetCamerePos = VectorTools.createVec3();
        this._shakeOffest = VectorTools.createVec3(0, 0, 0);
        //记录初始位置

        this._followOffsetPos = VectorTools.createVec3();

        this._cameraRotation = VectorTools.createVec3();
        this._lastRotation = VectorTools.createVec3();
        VectorTools.cloneTo(BattleFunc.cameraFollowRotation,this._cameraRotation);
        VectorTools.cloneTo(BattleFunc.cameraFollowRotation,this._lastRotation);
    }

    //初始化数据
    public setData() {
        this.camera = this.controller.battleCamera;
        this.targetCamerePos.x = this.controller.player.pos.x + this._followOffsetPos.x;
        this.targetCamerePos.y = this._followOffsetPos.y;
        this.targetCamerePos.z = this.controller.player.pos.z + this._followOffsetPos.z;
        this.camera.transform.localPosition = this.targetCamerePos;
        this.isFollowPlayer = true;

        this.camera.transform.localPosition.cloneTo(this._initCameraPos);
        this.controller.registObjUpdate(this.updateFrame,this);
    }


    //刷新函数
    public updateFrame() {
        //followplayer
        // this.followPlayer();
        this.updateShake();
        
    }

    public updateShake() {
        if (this.shakeFrame == 0) {
            return;
        }
        this.shakeFrame--;
        var shakeWay: number
        var index = Math.ceil(this.shakeFrame / this.shakeIntervel);
        var yushu = this.shakeFrame % this.shakeIntervel
        if (yushu != 0 && this.shakeFrame > 0) {
            return;
        }
        if (index % 2 == 1) {
            shakeWay = 1;
        } else {
            shakeWay = -1
        }
        //把像素转化成米
        var shakeValue = this.shakeStrength * shakeWay;
        var x: number = 0;
        var y: number = 0;
        //如果为0了 那么就会把偏移量还原
        if (this.shakeFrame > 0) {
            if (this.shakeStyle == "x") {
                x = shakeValue;
            } else if (this.shakeStyle == "y") {
                y = shakeValue;
            } else {
                x = shakeValue;
                y = shakeValue;
            }
        }

        this._shakeOffest.x = x;
        this._shakeOffest.x = y;
        //设置摄像机坐标
        this.targetCamerePos.x = x + this._initCameraPos.x
        this.targetCamerePos.y = y + this._initCameraPos.y

    }

    //震动摄像机 震动时长,  震动方式,style: x(只x方向震动),y(只y方向震动),xy(xy方向同时震动),strength: 振幅 单位万分之一米 intervel震动间隔 默认2帧减一次
    public shakeCamera(shakeFrame, style: string = "xy", strength: number = 3, intervel: number = 2): void {
        this.shakeFrame = shakeFrame;
        this.shakeStyle = style;
        this.shakeStrength = strength * BattleFunc.pixelToMi;
        this.shakeIntervel = intervel;
    }


}