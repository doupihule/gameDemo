"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleConst_1 = require("../../sys/consts/BattleConst");
/**
 * author:xd
 * 游戏中所有对象的基类. 具备坐标.视图.和刷新 逻辑
 */
class InstanceBasic {
    constructor(controler) {
        //使用状态 0 使用中   1 缓存 2销毁
        this.useState = 0;
        this.zorderOffset = 0; //zorder 显示层级偏移 比如黑屏或者特殊情况 会修改这值
        this.updateCount = 0;
        this.instanceId = 0;
        //视图缩放系数
        this.viewScale = 1;
        //视图方位
        this._viewWay = 1;
        //动画播放的速度
        this._aniPlaySpeed = 1;
        //我自身的时间缩放值 1是正常速度 <1减速 >1加速
        this.upTimeScale = 1;
        //当前弧度
        this.radian = 0;
        //
        this.runWithSkill = false;
        //是否忽略游戏中的减速或加速
        this.ignoreTimeScale = false;
        this.leftFrameTime = 0;
        this.laterFrameTime = 0;
        //拿到游戏控制器和数据
        this.controler = controler;
        this.pos = new Laya.Vector3();
        InstanceBasic._instanceCount++;
        this.instanceId = InstanceBasic._instanceCount;
        this.rotation = new Laya.Vector3();
        this.rotationRad = new Laya.Vector3();
    }
    //设置数据
    setData(data) {
        this._viewWay = 1;
        this.upTimeScale = 1;
        this.ignoreTimeScale = false;
        this.useState = BattleConst_1.default.instance_use_normal;
        this.resetProperty();
        this._data = data;
        if (data && data.id) {
            this.dataId = data.id;
        }
    }
    //设置我自身的时间缩放值
    setUpTimeScale(scale) {
        this.upTimeScale = scale;
        this.leftFrameTime = 0;
        this.laterFrameTime = 0;
        this.setAniPlaySpeed(this._aniPlaySpeed);
    }
    //重置属性 针对复用的情况
    resetProperty() {
        this.updateCount = 0;
    }
    //获取数据
    getData() {
        return this._data;
    }
    //自身数据发生变化
    //changeData 变化的数据 
    //供子类重写
    onDataChange(changeData) {
        //数据发生变化需要刷新视图
        this.updateView();
    }
    //更新视图供子类重写
    updateView() {
    }
    //设置视图
    setView(view, x = 0, y = 0, z = 0, parent = null) {
        if (this._myView != view) {
            this.disposeView();
        }
        this._myView = view;
        this.setPos(x, y, z);
        this.updateView();
        //初始化设置为1倍速
        this.setAniPlaySpeed(1);
    }
    //设置视图2,这个调用一定要在setview之前. 
    setView2(view) {
        this._myView2 = view;
    }
    setViewName(value) {
        this.viewName = value;
    }
    //设置坐标
    setPos(x = 0, y = 0, z = 0) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
        this.realShowView();
    }
    //逐帧刷新函数
    updateFrame() {
        this.leftFrameTime += this.upTimeScale;
        var i = 0;
        for (i = 0; i < this.leftFrameTime; i++) {
            this.updateCount++;
            //这里写一些空函数,供子类重写.
            this.doAiLogical();
            this.updateSpeed();
        }
        this.leftFrameTime = this.leftFrameTime - i;
    }
    //循环外刷新 先所有对象执行updateframe  后 在执行updateFrameLater
    updateFrameLater() {
        this.laterFrameTime += this.upTimeScale;
        var i = 0;
        for (i = 0; i < this.laterFrameTime; i++) {
            this.movePos();
            this.realShowView();
        }
        this.laterFrameTime = this.laterFrameTime - i;
    }
    //执行ai逻辑
    doAiLogical() {
    }
    //更新速度
    updateSpeed() {
    }
    //子类重写运动函数
    movePos() {
    }
    //实现坐标
    realShowView() {
        if (!this._myView) {
            return;
        }
        var x = this.pos.x;
        var y = this.pos.y + this.pos.z;
        this._myView.pos(x, y, true);
        if (this._myView2) {
            this._myView2.pos(x, y, true);
        }
    }
    //设置旋转角度
    setRotation(value) {
        this.radian = BattleFunc_1.default.angletoRad * value;
        if (this._myView) {
            this._myView.rotation = value;
        }
        if (this._myView2) {
            this._myView2.rotation = value;
        }
    }
    //设置弧度
    setRotationRad(value) {
        this.radian = BattleFunc_1.default.angletoRad * value;
        var ang = BattleFunc_1.default.radtoAngle * value;
        if (this._myView) {
            this._myView.rotation = ang;
        }
        if (this._myView2) {
            this._myView2.rotation = ang;
        }
    }
    //设置视图方位
    setViewWay(value) {
        if (this._viewWay == value && this._myView && this._myView.scaleX == this.viewScale * this._viewWay) {
            return;
        }
        this._viewWay = value;
        this.setViewScale(this.viewScale);
    }
    //设置视图缩放
    setViewScale(scale) {
        this.viewScale = scale;
        if (this._myView) {
            this._myView.scale(this._viewWay * scale, scale);
        }
        if (this._myView2) {
            this._myView2.scale(this._viewWay * scale, scale);
        }
    }
    //设置透明度
    setViewAlpha(alpha) {
        if (this._myView) {
            this._myView.alpha = alpha;
        }
        if (this._myView2) {
            this._myView2.alpha = alpha;
        }
    }
    getView() {
        return this._myView;
    }
    //判断示例是否在使用中
    checkIsUsing() {
        return this.useState == BattleConst_1.default.instance_use_normal;
    }
    //设置zorder偏移
    setZorderOffset(value) {
        this.zorderOffset = value;
    }
    //更新视图的zorder
    updateViewZorder() {
        if (!this._myView) {
            return;
        }
        this._myView.zOrder = Math.round(this.pos.z) * 10 + this.zorderOffset;
        //第二个视图层级要比第一个高4. 中间的3个位置是给特效预留的
        if (this._myView2) {
            this._myView2.zOrder = Math.round(this.pos.z) * 10 + this.zorderOffset + 4;
        }
    }
    //是否受技能大招暂停
    isRunWithSkillPause() {
        return this.runWithSkill;
    }
    //恢复动画播放
    resumeAction() {
    }
    //停止动画
    stopAction() {
    }
    //设置动画播放速率
    setAniPlaySpeed(value) {
        this._aniPlaySpeed = value;
        if (!this.ignoreTimeScale) {
            value = value * this.upTimeScale * this.controler.updateScale;
        }
        if (this._myView) {
            this._myView.setPlaySpeed(value);
        }
    }
    //创建特效 默认-1 表示存在时间以后自动缓存 .根据特效长度去定义. 
    //layerIndex  层级 1是地面层级  永久显示在地面的特效, 2是跟随主角做深度排列.但是 在主角后面. 3是跟随主角做深度排列.但是在主角前面;
    //withTargetWay 是否跟随目标的朝向而修改自己的朝向. 比如文字特效就不能修改朝向. -1 永远反向  0 永远跟随目标朝向 1永远朝右
    //aniSpeed特效播放速度 默认是1
    createEfect(effectName, aniIndex = 0, isLoop, ofx, ofy, ofz, isFollow = true, layerIndex = 2, withTargetWay = 0, frame = -1, aniSpeed = 1) {
        var eff = this.controler.createEffect({ id: effectName, index: aniIndex });
        //暂定只有非跟随的特效 不做限制
        if (!isFollow) {
            this.controler.performanceControler.setCacheEffect(eff, eff.cacheId);
        }
        if (!this.controler.layerControler) {
            LogsManager_1.default.errorTag("battleEffectError", "战斗销毁了还在创建特效-");
            return null;
        }
        var ctnIndex = layerIndex;
        //如果是需要和主角做深度排列的  那么让特效层级+1
        if (layerIndex == 2) {
            eff.zorderOffset = this.zorderOffset - 1;
            ctnIndex = 2;
        }
        else if (layerIndex == 3 || layerIndex == 5) {
            eff.zorderOffset = this.zorderOffset + 1;
            ctnIndex = 2;
        }
        //跟随效果的坐标肯定会和角色的朝向相关
        eff.setPos(this.pos.x + ofx * this._viewWay, this.pos.y + ofy, this.pos.z + ofz);
        if (isFollow || layerIndex == 5) {
            eff.setFollowTarget(this, ofx, ofy, ofz, layerIndex, withTargetWay);
        }
        else {
            eff.setFollowOffest(ofx, ofy, ofz);
        }
        //如果是 跟随的 那么需要把他放到刷新数组队列里面去
        this.controler.insterInstanceToArr(eff);
        if (withTargetWay == 0) {
            eff.setViewWay(this._viewWay);
        }
        else {
            eff.setViewWay(withTargetWay);
        }
        eff.getView().play(aniIndex, isLoop, true);
        eff.setAniPlaySpeed(aniSpeed);
        eff.setLastFrame(frame);
        //特效一定是强制播放
        if (ctnIndex > 3) {
            ctnIndex = 3;
        }
        var layerCtn = this.controler.layerControler["a2" + ctnIndex];
        layerCtn.addChild(eff.getView());
        //更新view的zorder
        eff.updateViewZorder();
        // ctn.addChild(eff.getView());
        return eff;
    }
    //控制一个动画 起步,循环,结束 返回动画持续的总帧数
    playSpecialSysAction(actionName, sysTime, startTime, endTime, actionLength = 0, aniSpeed = 1) {
        if (!this._tempAnimObj) {
            this._tempAnimObj = {};
        }
        this._tempAnimObj.startTime = startTime;
        this._tempAnimObj.sysTime = sysTime;
        this._tempAnimObj.endTime = endTime;
        this._tempAnimObj.actionName = actionName;
        if (this._myView) {
            this._myView.play(this._tempAnimObj.actionName, false, true);
        }
        var frame = BattleFunc_1.default.instance.turnMinisecondToframe(startTime);
        var sysFrame = BattleFunc_1.default.instance.turnMinisecondToframe(sysTime);
        var endFrame = BattleFunc_1.default.instance.turnMinisecondToframe(endTime);
        this.controler.setCallBack(Math.round(frame / aniSpeed), this.onStartActionComp, this);
        this.controler.setCallBack(Math.round((frame + sysFrame) / aniSpeed), this.onSysActionComp, this);
        return actionLength + sysFrame + frame - endFrame;
    }
    //第一步完成
    onStartActionComp() {
        if (!this._myView)
            return;
        var aniParams = this._tempAnimObj;
        this._myView.play(this._tempAnimObj.actionName, true, true, aniParams.startTime, aniParams.endTime);
    }
    //循环部分完成. 播放最后一部分
    onSysActionComp() {
        if (!this._myView)
            return;
        var aniParams = this._tempAnimObj;
        this._myView.play(this._tempAnimObj.actionName, false, true, aniParams.endTime);
    }
    //重置循环动画 
    resetSysAction() {
        this.controler.clearCallBack(this, this.onStartActionComp);
        this.controler.clearCallBack(this, this.onSysActionComp);
    }
    //当被设置到缓存里面了 子类重写
    onSetToCache() {
        var view = this._myView;
        if (view) {
            view.removeSelf();
            if (view.stop) {
                view.stop();
            }
            view.scale(1, 1, true);
        }
        if (this._myView2) {
            this._myView2.removeSelf();
            this._myView2.stop();
            view.scale(1, 1, true);
        }
        //清除自身注册的所有回调 防止因为复用时 还注册了回调导致报错
        this.controler.clearCallBack(this);
        this.useState = BattleConst_1.default.instance_use_cache;
    }
    //销毁
    dispose() {
        if (this.useState == BattleConst_1.default.instance_use_destory) {
            return;
        }
        this.useState = BattleConst_1.default.instance_use_destory;
        this.disposeView();
    }
    //销毁视图对象 如果有特殊销毁.给子类重写,龙骨动画需要手动dispos
    //如果有缓存需求,也可以让子类重写
    disposeView() {
        if (this._myView) {
            if (this._myView.parent) {
                this._myView.parent.removeChild(this._myView);
            }
            this._myView = null;
            if (this._myView2) {
                if (this._myView2.parent) {
                    this._myView2.parent.removeChild(this._myView2);
                }
                this._myView2 = null;
            }
        }
    }
}
exports.default = InstanceBasic;
InstanceBasic._instanceCount = 0;
//# sourceMappingURL=InstanceBasic.js.map