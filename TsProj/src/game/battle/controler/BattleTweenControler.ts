import BattleLogicalControler from "./BattleLogicalControler";
import BattleConst from "../../sys/consts/BattleConst";
import InstanceBasic from "../instance/InstanceBasic";
/**
 * 战斗缓存行为控制器
 * 
 */

export default class BattleTweenControler  {
   
    public controller:BattleLogicalControler;

    //缓动信息表 根据游戏类型自己扩展 运动行为 初步只封装基础的 匀速运动.旋转

    /**
     * [
     *  {
     *      type: 缓动方式   支持多种组合
     *      instance: 对应的InstanceBasic
     *      frame: 已经运行的时间
     *      totalFrame:总时间
     *      callBack: 缓动回调
     *      thisObj: 回调函数指针
     *      //初始信息
     *      startParams:{
     *          x,y,sx,sy,rx,ry, tf(总时间)
     *      }
     *      //目标信息
     *      targetParams:{
     *       }
     * 
     *  }
     * ]
     * 
     * 
     */

    private _tweenInfoMap:any[]

    constructor(controller){
        this.controller = controller;
        this._tweenInfoMap = [];
    }

    public setData(){
        this._tweenInfoMap = [];
        this.controller.registObjUpdate(this.updateFrame,this);
    }

    //由主控制器 控制
    public updateFrame(){
        for(var i = this._tweenInfoMap.length-1; i >=0 ; i --){
            var info = this._tweenInfoMap[i];
            var isEnd = this.updateOneTween(info);
            if(isEnd){
                this._tweenInfoMap.splice(i,1);
            }
        }
    }

    //更新一个tween
    protected updateOneTween(tweenInfo){
        var type = tweenInfo.type;
        tweenInfo.frame++;
        var ratio = tweenInfo.frame/tweenInfo.totalFrame;
        
        //暂时给匀速运动
        var startParams = tweenInfo.startParams;
        var targetParams = tweenInfo.targetParams;
        var disParams = tweenInfo.disParams;
        var instance:InstanceBasic = tweenInfo.instance;
        //如果是有运动行为的
        if(this.checkHasType(type,BattleConst.TWEEN_MOVE)){
            var targetx:number,targety:number,targetz:number;
            disParams.x == 0 ? targetx = instance.pos.x :targetx = startParams.x+ disParams.x*ratio
            disParams.y == 0 ? targety = instance.pos.y :targety = startParams.y+ disParams.y*ratio
            disParams.z == 0 ? targetz = instance.pos.z :targetz = startParams.z+ disParams.z*ratio
            instance.setPos(targetx,targety,targetz);
        }

        if(this.checkHasType(type,BattleConst.TWEEN_ROTATE)){
            var rx:number,ry:number,rz:number;
            disParams.rx == 0 ? rx = instance.rotationRad.x :rx =startParams.rx+ disParams.rx*ratio;
            disParams.ry == 0 ? ry = instance.rotationRad.y :ry =startParams.ry+ disParams.ry*ratio;
            disParams.rz == 0 ? rz = instance.rotationRad.z :rz =startParams.rz+ disParams.rz*ratio;
            instance.setRadian(rx,ry,rz)
        }
        if(this.checkHasType(type,BattleConst.TWEEN_SCALE)){
            instance.setViewScale(startParams.s+disParams.s*ratio)
        }
        //如果到达最后一帧了
        if(tweenInfo.frame == tweenInfo.totalFrame){
            if(tweenInfo.callBack){
                tweenInfo.callBack.call(tweenInfo.thisObj);
            }
            return true;
        }
        return false;
        
    }

    //设置一个缓动信息
    /**
     * 
     * @param frame 运动时间
     * @param targetParams:  {x:1,y:1,z:1,s:1,rx:1,ry:1,rz:1};
     * x,y,z 必须同时配,  rx,ry,rz 也必须同时配
     */
    public setOneTween(frame,instance:InstanceBasic, targetParams, type, callBack = null,thisObj = null  ){
        

        var startParams = {x:instance.pos.x,y:instance.pos.y,z:instance.pos.z,s:instance.viewScale,
            rx:instance.rotationRad.x,ry:instance.rotationRad.y,rz:instance.rotationRad.z };

        var disParams:any ={}
        if(this.checkHasType(type,BattleConst.TWEEN_MOVE)){
            disParams.x = this.adjustNumber( targetParams.x- startParams.x)
            disParams.y = this.adjustNumber(targetParams.y- startParams.y)
            disParams.z = this.adjustNumber(targetParams.z- startParams.z)
        }

        if(this.checkHasType(type,BattleConst.TWEEN_ROTATE)){
            disParams.rx = this.adjustNumber(targetParams.rx- startParams.rx)
            disParams.ry = this.adjustNumber(targetParams.ry- startParams.ry)
            disParams.rz = this.adjustNumber(targetParams.rz- startParams.rz)
        }

        if(this.checkHasType(type,BattleConst.TWEEN_SCALE)){
            disParams.s = targetParams.s - startParams.s
        }

        var tweenInfo = {
            startParams:startParams,
            targetParams:targetParams,
            type:type,
            callBack:callBack,
            thisObj:thisObj,
            instance:instance,
            frame:0,
            totalFrame:frame,
            disParams:disParams,    //差值
        }

        this._tweenInfoMap.push(tweenInfo);
    }

    //销毁一个tween
    public clearOneTween(instance:InstanceBasic){
        for(var i = this._tweenInfoMap.length-1; i >=0 ; i --){
            var info =  this._tweenInfoMap[i];
            if(info.instance == instance){
                //移除这个tween
                this._tweenInfoMap.splice(i,1);
            }
        }
    }



    //判断是否有某一个类型
    private checkHasType(bit,type){
        return (bit & type)!=0;
    }
    

    //对number 进行接近0的判断
    protected adjustNumber(value){
        if(Math.abs(value)< 0.0001){
            return 0;
        }
        return value;
    }
   
    


}