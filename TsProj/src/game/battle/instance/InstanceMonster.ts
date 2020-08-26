import BattleFunc from "../../sys/func/BattleFunc";
import InstanceHero from "./InstanceHero";
import InstanceMove from "./InstanceMove";
import InstanceLogical from "./InstanceLogical";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFormulaTrigger from "../trigger/BattleFormulaTrigger";
import DataResourceFunc, { DataResourceType } from "../../sys/func/DataResourceFunc";
import PoolTools from "../../../framework/utils/PoolTools";


export default class InstanceMonster extends InstanceLogical {

    //ai类型 Npc车辆AI类型（1只会直行，2会变道，3会超车，4都会）
    public aiType: number;

    private _changeTrackCd: number = 0;

    protected _roleCar: InstanceHero;

    //是否是睡眠状态
    protected _isSleep: boolean = false;


    //移动
    protected _cfg_moveAiParams: any[];
    protected _cfg_turnAiParams: any[];
    //ai类型
    protected _moveAiType: number;

    //金币图标目标点
    private static _goldPos: any
    private static _tempPos: Laya.Point = new Laya.Point()

    //随机运动的参数
    /**
     * index: 序号 当前随机运动了多少次
     * frame: 当前运动的剩余时间 
     * speed: 当前运动行为的速度 
     */
    protected _randomMoveParams: any;

    //ai翻滚的帧数
    protected _aiFlyFrame: number = 0;
    //飞金币的缓存参数,缓存起来重复利用
    private _goldTweenParams: any;

    //存活时间
    private _liveFrame:number;
    constructor(controler) {
        super(controler);
        this.isAutoSKill = true
        this.classModel = BattleConst.model_monster;
        this._goldTweenParams = {}
    }

    //设置存活时间
    public setLiveFrame(value:number){
        this._liveFrame = value;
        if(this._liveFrame>0){
            this.controler.setCallBack(this._liveFrame,this.doDiedLogical,this)
        }
    }
}