"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubPackageManager_1 = require("../manager/SubPackageManager");
const ResourceManager_1 = require("../manager/ResourceManager");
const LoadManager_1 = require("../manager/LoadManager");
const LogsManager_1 = require("../manager/LogsManager");
class SkeletonExpand extends Laya.Skeleton {
    constructor(templet, aniMode) {
        super(templet, aniMode);
        //状态  0 表示未加载完成 1表示加载完成
        this._state = 0;
        //换装状态 0 不需要换装 1 换装纹理加载中  2 换装完成
        this._changeTextureState = 0;
        this._cacheAniMode = 0;
        this._cacheAniMode = aniMode;
        this._cacheCompleteParams = [];
    }
    //开始加载
    startLoadByShortName(shortName) {
        this.shortSkeletonName = shortName;
        SubPackageManager_1.default.loadDynamics(ResourceManager_1.default.getSpineSubpack(shortName), ResourceManager_1.default.getSpinePath(shortName), this.onSubPackComplete, this);
    }
    //分包加载完成
    onSubPackComplete() {
        this.load(ResourceManager_1.default.getSpineSkUrl(this.shortSkeletonName), new Laya.Handler(this, this.onLoadComplete), this._cacheAniMode);
    }
    //重写update
    _update() {
        if (!this["_player"]) {
            return;
        }
        super["_update"]();
    }
    //spine加载完成
    onLoadComplete() {
        this._state = 1;
        if (this._cachePlayParams) {
            this.play.apply(this, this._cachePlayParams);
            this._cachePlayParams = null;
        }
        if (this._cacheStopParams) {
            this.stop();
            this._cacheStopParams = null;
        }
        //如果是有换装行为的
        if (this._changeTextureState == 1) {
            this.changWholeViewTexture(this._changeTextureUrl);
        }
        //如果有缓存回调函数的 执行缓存回调函数
        for (var i = 0; i < this._cacheCompleteParams.length; i++) {
            var info = this._cacheCompleteParams[i];
            info.callBack.apply(info.thisObj, info.params);
        }
        this._cacheCompleteParams.length = 0;
        if (this.completeBackFunc) {
            this.completeBackFunc.call(this.completeThisObj, this.completeExpandParams);
        }
        if (!SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName]) {
            SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName] = { nums: 0,
                //把模版存起来
                templet: this.templet,
            };
        }
        SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName].nums++;
    }
    //给整个view换一个texture 
    changWholeViewTexture(url) {
        this._changeTextureState = 1;
        this.visible = false;
        if (this._state == 0) {
            this._changeTextureUrl = url;
            return;
        }
        LoadManager_1.LoadManager.instance.load(url, Laya.Handler.create(this, this.onImageCompelte));
    }
    //换装图片加载完成
    onImageCompelte() {
        this._changeTextureState = 2;
        var tex = Laya.Loader.getRes(this._changeTextureUrl);
        var boneSlotArr = this["_boneSlotArray"];
        for (var i = 0; i < boneSlotArr.length; i++) {
            var slot = boneSlotArr[i];
            //这里需要构建texture
            var currentTex = slot.currTexture;
            slot.replaceSkin(SkeletonExpand.createSlotTexture(this._changeTextureUrl + slot.name, tex, slot));
        }
        this.visible = true;
        //清除缓冲区
        this["_clearCache"]();
    }
    //创建一个texture
    static createSlotTexture(key, sourceTexture, slot) {
        if (this._textureCache[key]) {
            return this._textureCache[key];
        }
        else {
            var uvs;
            var texture = new Laya.Texture(sourceTexture.bitmap, uvs);
            if (!slot.currSlotData) {
                LogsManager_1.default.warn("SlotTextureWarn,slot:", slot.name, "没有插槽数据");
                this._textureCache[key] = texture;
                return texture;
            }
            var displayData = slot.currSlotData.displayArr[0];
            if (!displayData) {
                LogsManager_1.default.warn("SlotTextureWarn,slot:", slot.name, "没有显示对象.可能是空插槽");
                this._textureCache[key] = texture;
                return texture;
            }
            uvs = displayData.uvs;
            texture.uv = uvs;
            this._textureCache[key] = texture;
            return texture;
        }
    }
    play(nameOrIndex, loop, force, start, end, freshSkin, playAudio) {
        //如果没有加载完成 renturn
        if (!this["_player"] && this._state == 0) {
            this._cacheStopParams = null;
            this._cachePlayParams = [nameOrIndex, loop, force, start, end, freshSkin, playAudio];
            return;
        }
        super.play(nameOrIndex, loop, force, start, end, freshSkin, playAudio);
    }
    //显示或者隐藏slot
    showOrHideSlot(slotName, value) {
        //如果没有加载完成 把这个func 存入缓存队列
        if (this._state == 0) {
            var tempObj = {
                callBack: this.showOrHideSlot,
                thisObj: this,
                params: [slotName]
            };
            this._cacheCompleteParams.push(tempObj);
            return;
        }
        var slot = this.getSlotByName(slotName);
        if (!slot) {
            LogsManager_1.default.warn("没有这个slot:", slotName);
            return;
        }
        if (value == true) {
            slot.replaceDisplayByIndex(0, null);
        }
        else {
            //否则就是隐藏
            slot.replaceDisplayByIndex(0, -1);
        }
        this["_clearCache"]();
    }
    //获取动画的长度 如果这个动画没有加载完成 返回-1
    static getAniFrame(aniName, aniIndex = 0) {
        if (!this.cacheAniCompleteMap[aniName]) {
            return -1;
        }
        var templet = this.cacheAniCompleteMap[aniName].templet;
        if (aniIndex < 0) {
            return -1;
        }
        if (aniIndex >= templet.getAnimationCount()) {
            LogsManager_1.default.errorTag("aniError", "aniIndex错误,ani:", aniName, "动画数量:", templet.getAnimationCount(), "目标aniIndex:", aniIndex);
            return -1;
        }
        return Math.round(templet.getAniDuration(aniIndex) / 1000 * templet.rate);
    }
    stop() {
        if (this._state == 0) {
            this._cacheStopParams = true;
            this._cachePlayParams = null;
            return;
        }
        super.stop();
    }
}
exports.default = SkeletonExpand;
//
//缓存动画加载完成回调 
/**
 * 动画名, 创建的数量
 * animae:{nums:, templet:any }
 *
 *
 */
SkeletonExpand.cacheAniCompleteMap = {};
//缓存的纹理
SkeletonExpand._textureCache = {};
//# sourceMappingURL=SkeletonExpand.js.map