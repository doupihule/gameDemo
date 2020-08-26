"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DisplayUtils_1 = require("../../../framework/utils/DisplayUtils");
const ResourceManager_1 = require("../../../framework/manager/ResourceManager");
const ResourceConst_1 = require("../../sys/consts/ResourceConst");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const UserInfo_1 = require("../../../framework/common/UserInfo");
//战中角色视图类封装 嵌套一层容器的原因是为了方便缩放和计算
class BattleRoleView extends Laya.Sprite {
    //tag一个动画标签.代表这个动画是从哪个ui界面或者模块传递进来的. 必须传入. 用来做动画的状态追踪用的
    constructor(viewName, scale = 1, viewIndex = 0, tag = "") {
        super();
        this.aniScale = 1;
        this._viewIndex = 0;
        this._viewScale = 1;
        //当前的视图数量
        this.currentViewNums = 1;
        this._xSpace = 0;
        this._ySpace = 0;
        this._useShade = false;
        this._shadeScale = 1;
        this.tagStr = "";
        this.aniScale = scale;
        this._childViewArr = [];
        var aniMode = 0;
        if (viewIndex > 0) {
            aniMode = 1;
        }
        this._viewName = viewName;
        this._aniMode = aniMode;
        this._viewIndex = viewIndex;
        this.currentViewNums = 1;
        this._viewScale = scale;
        this.currentAni = this.cloneOneChildAni();
        if (!tag) {
            LogsManager_1.default.errorTag("没有传入tag");
        }
        this.tagStr = tag;
        //只有web版开启动画调试
        if (BattleRoleView.isOpenAniDebug && UserInfo_1.default.isWeb()) {
            if (!BattleRoleView.hasRegistUpdate) {
                BattleRoleView.hasRegistUpdate = true;
                //开启调试 后台5秒打印一次激活的动画数据
                TimerManager_1.default.instance.add(BattleRoleView.getActiveAniNums, BattleRoleView, 5000);
            }
            BattleRoleView._cacheAllAniArr.push(this);
        }
    }
    //设置间距
    setSpace(xSpace, ySpace) {
        this._xSpace = xSpace;
        this._ySpace = ySpace;
    }
    //设置影子要在 设置视图数量之后
    setShade(scale = 0) {
        this._useShade = true;
        if (scale) {
            this._shadeScale = scale;
        }
        this.sortChildView();
    }
    //显示或者隐藏阴影
    showOrHideShade(value) {
        if (!this._shadeViewArr) {
            return;
        }
        for (var i = 0; i < this._shadeViewArr.length; i++) {
            this._shadeViewArr[i].visible = value;
        }
    }
    //改变视图数量
    changeViewNums(value) {
        this.currentViewNums = value;
        if (this._childViewArr.length < this.currentViewNums) {
            for (var i = this._childViewArr.length; i < this.currentViewNums; i++) {
                this.cloneOneChildAni();
            }
        }
        for (var i = this.currentViewNums; i < this._childViewArr.length; i++) {
            this._childViewArr[i].visible = false;
            this._childViewArr[i].stop();
        }
        //排列iew
        this.sortChildView();
    }
    static getPosArrByViewNums(viewNums) {
        return BattleRoleView._childSortFormation[viewNums - 1];
    }
    sortChildView() {
        var formationArr = BattleRoleView._childSortFormation[this.currentViewNums - 1];
        if (this._useShade) {
            if (!this._shadeViewArr) {
                this._shadeViewArr = [];
            }
        }
        for (var i = 0; i < formationArr.length; i++) {
            var posArr = formationArr[i];
            var view = this._childViewArr[i];
            view.pos(posArr[0] * this._xSpace, posArr[1] * this._ySpace);
            if (this._useShade) {
                var shaderView = this._shadeViewArr[i];
                if (!shaderView) {
                    shaderView = new Laya.Image(ResourceConst_1.default.BATTLE_SHADE);
                    shaderView.scale(this._shadeScale, this._shadeScale, true);
                    shaderView.anchorX = 0.5;
                    shaderView.anchorY = 0.5;
                    this.addChildAt(shaderView, 0);
                    this._shadeViewArr[i] = shaderView;
                }
                shaderView.x = view.x + 2;
                shaderView.y = view.y + 3;
            }
        }
    }
    //克隆一个子动画
    cloneOneChildAni() {
        var ani = DisplayUtils_1.default.createSkeletonExpand(this._viewName, this._aniMode);
        ani.scale(this._viewScale, this._viewScale);
        this._childViewArr.push(ani);
        //如果是有换装的
        if (this._viewIndex > 0) {
            var spinePath = ResourceManager_1.default.getSpinePath(this._viewName);
            ani.changWholeViewTexture(spinePath + this._viewName + "_" + this._viewIndex + ".png");
        }
        this.addChild(ani);
        // ani.showOrHideSlot("body",false);
        return ani;
    }
    //用于读取出缓存的角色设置缩放
    setItemViewScale(scale) {
        this._viewScale = scale;
        this.currentAni.scale(scale, scale);
    }
    //暂停播放
    stop() {
        for (var i = 0; i < this.currentViewNums; i++) {
            this._childViewArr[i].paused();
        }
    }
    play(nameOrIndex, loop, force, start, end, freshSkin, playAudio) {
        for (var i = 0; i < this.currentViewNums; i++) {
            this._childViewArr[i].play(nameOrIndex, loop, force, start, end, freshSkin, playAudio);
        }
    }
    resume() {
        for (var i = 0; i < this.currentViewNums; i++) {
            this._childViewArr[i].resume();
        }
    }
    //设置播放速率 必须等待动画播放完成
    setPlaySpeed(value) {
        for (var i = 0; i < this.currentViewNums; i++) {
            var childAni = this._childViewArr[i];
            if (childAni.player) {
                childAni.player.playbackRate = value;
            }
        }
    }
    //设置子对象的视图
    setChildViewPos(x, y) {
        for (var i = 0; i < this.currentViewNums; i++) {
            var childAni = this._childViewArr[i];
            childAni.pos(x, y, true);
        }
    }
    //隐藏插槽
    showOrHideSlot(slotName, value = false) {
        for (var i = 0; i < this.currentViewNums; i++) {
            var childAni = this._childViewArr[i];
            childAni.showOrHideSlot(slotName, value);
        }
    }
    //获取当前激活的动画
    static getActiveAniNums() {
        var resultArr = [];
        var runAniNums = 0;
        for (var i = 0; i < this._cacheAllAniArr.length; i++) {
            var ani = this._cacheAllAniArr[i].currentAni;
            if (ani["_pause"] != true) {
                resultArr.push(ani);
                if (ani.displayedInStage) {
                    runAniNums++;
                }
                // 还在激活中的ani 表示这个动画状态是play.还没有调用stop.  displayedInStage是否在舞台: 如果displayedInStage输出为true. 表示这个动画还在进行计算. 
                LogsManager_1.default.echo("还在激活中的ani", this._cacheAllAniArr[i]._viewName, this._cacheAllAniArr[i].tagStr, "是否在舞台:", ani.displayedInStage);
            }
        }
        LogsManager_1.default.echo("当前激活中的动画数量", resultArr.length, "在舞台并计算的动画数量:", runAniNums);
        return resultArr;
    }
}
exports.default = BattleRoleView;
//是否开启动画状态调试. 默认关闭. 只有在做性能优化的时候才开启
//目的是检测游戏各个阶段还有哪些在后台播放的动画
BattleRoleView.isOpenAniDebug = false;
BattleRoleView.hasRegistUpdate = false;
BattleRoleView._childSortFormation = [
    //只有1个人的时候
    [
        [0, 0],
    ],
    //2个人 上下站开0.5
    [
        [-0.75, 0], [0.75, 0],
    ],
    [
        [0, -1],
        [-0.75, 0], [0.75, 0],
    ],
    [
        [-1, -1], [1, -1],
        [-1, 0], [0.5, 0]
    ],
    [
        [0, -1], [1, -1],
        [-1, 0.5],
        [0, 0], [1, 0]
    ],
    [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [0, 0], [1, 0]
    ],
];
BattleRoleView._cacheAllAniArr = [];
//# sourceMappingURL=BattleRoleView.js.map