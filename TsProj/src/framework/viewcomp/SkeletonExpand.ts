import SubPackageManager from "../manager/SubPackageManager";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import ResourceManager from "../manager/ResourceManager";
import {LoadManager} from "../manager/LoadManager";
import LogsManager from "../manager/LogsManager";
import TableUtils from "../utils/TableUtils";

export default class SkeletonExpand extends Laya.Skeleton {
    //

    //缓存动画加载完成回调 
    /**
     * 动画名, 创建的数量
     * animae:{nums:, templet:any }
     * 
     * 
     */
    public static cacheAniCompleteMap:any = {}

    //状态  0 表示未加载完成 1表示加载完成
    private _state: number = 0;

    public completeBackFunc: any;
    public completeThisObj: any;
    public completeExpandParams: any;

    //换纹理的url地址
    private _changeTextureUrl: string
    //换装状态 0 不需要换装 1 换装纹理加载中  2 换装完成
    private _changeTextureState: number = 0;

    //缓存播放数据
    private _cachePlayParams;


    //缓存暂停数据
    private _cacheStopParams;

    //缓存的纹理
    private static _textureCache: any = {};

    private _cacheAniMode:number=0


    //缓存加载完成后的回调
    /**
     * callFunc,
     * thisObj,
     * paramsArr, 采用apply方式回调
     * 
     */
    private _cacheCompleteParams:any[];

    

    public shortSkeletonName: string;
    constructor(templet?: Laya.Templet, aniMode?: number) {
        super(templet, aniMode);
        this._cacheAniMode  = aniMode
        this._cacheCompleteParams = []
    }

    //开始加载
    public startLoadByShortName(shortName: string) {
        this.shortSkeletonName = shortName;
        SubPackageManager.loadDynamics(ResourceManager.getSpineSubpack(shortName), ResourceManager.getSpinePath(shortName), this.onSubPackComplete, this);
    }

    //分包加载完成
    private onSubPackComplete() {
        this.load(ResourceManager.getSpineSkUrl(this.shortSkeletonName), new Laya.Handler(this, this.onLoadComplete),this._cacheAniMode);
    }

    //重写update
    private _update(){
        if(!this["_player"]){
            return;
        }
        super["_update"]()
    }

    //spine加载完成
    private onLoadComplete() {
        this._state = 1;
        if (this._cachePlayParams) {
            this.play.apply(this, this._cachePlayParams);
            this._cachePlayParams = null;
        }
        if(this._cacheStopParams){
            this.stop();
            this._cacheStopParams = null;
        }
        //如果是有换装行为的
        if (this._changeTextureState == 1) {
            this.changWholeViewTexture(this._changeTextureUrl);
        } 

        //如果有缓存回调函数的 执行缓存回调函数
        for(var i=0; i < this._cacheCompleteParams.length;i++){
            var info = this._cacheCompleteParams[i];
            info.callBack.apply(info.thisObj,info.params);
        }
        this._cacheCompleteParams.length =0;

        if (this.completeBackFunc) {
            this.completeBackFunc.call(this.completeThisObj, this.completeExpandParams);
        }

        if(!SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName]){
            SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName] = {nums:0,
                //把模版存起来
                templet:this.templet,
            };
        }

        SkeletonExpand.cacheAniCompleteMap[this.shortSkeletonName].nums++;
    }


    //给整个view换一个texture 
    public changWholeViewTexture(url: string) {
        this._changeTextureState = 1;
        this.visible =false;
        if (this._state == 0) {
            
            this._changeTextureUrl = url
            return;
        }
        LoadManager.instance.load(url, Laya.Handler.create(this, this.onImageCompelte));


    }
    //换装图片加载完成
    private onImageCompelte() {
        this._changeTextureState = 2;
        var tex: Laya.Texture = Laya.Loader.getRes(this._changeTextureUrl);
        var boneSlotArr: Laya.BoneSlot[] = this["_boneSlotArray"];
        for (var i = 0; i < boneSlotArr.length; i++) {
            var slot: Laya.BoneSlot = boneSlotArr[i];
            //这里需要构建texture
            var currentTex = slot.currTexture;
            slot.replaceSkin(SkeletonExpand.createSlotTexture(this._changeTextureUrl +slot.name,tex, slot));
        }
        this.visible = true;
        //清除缓冲区
        this["_clearCache"]();
        

    }

    //创建一个texture
    private static createSlotTexture(key, sourceTexture:Laya.Texture, slot:Laya.BoneSlot) {
        if (this._textureCache[key]) {
            return this._textureCache[key];
        } else {
            var uvs;
            var texture: Laya.Texture = new Laya.Texture(sourceTexture.bitmap, uvs);
            if(!slot.currSlotData){
                LogsManager.warn("SlotTextureWarn,slot:",slot.name,"没有插槽数据");
                this._textureCache[key] = texture;
                return texture;
            }
            var displayData:Laya.SkinSlotDisplayData = slot.currSlotData.displayArr[0];
            if(!displayData){
                LogsManager.warn("SlotTextureWarn,slot:",slot.name,"没有显示对象.可能是空插槽");
                this._textureCache[key] = texture;
                return texture;
            }
             uvs = displayData.uvs;
            
            texture.uv = uvs
            this._textureCache[key] = texture;
            return texture;
        }
    }

    public play(nameOrIndex: any, loop: boolean, force?: boolean, start?: number, end?: number, freshSkin?: boolean, playAudio?: boolean) {
        //如果没有加载完成 renturn
        if (!this["_player"] && this._state == 0) {
            this._cacheStopParams =null;
            this._cachePlayParams = [nameOrIndex, loop, force, start, end, freshSkin, playAudio];
            return;
        }
        super.play(nameOrIndex, loop, force, start, end, freshSkin, playAudio);
        
    }


    //显示或者隐藏slot
    public showOrHideSlot(slotName:string,value:boolean){
        //如果没有加载完成 把这个func 存入缓存队列
        if (this._state == 0) {
            var tempObj = {
                callBack:this.showOrHideSlot,
                thisObj:this,
                params:[slotName]
            }
            this._cacheCompleteParams.push(tempObj)
            return;
        }
        var slot:Laya.BoneSlot=this.getSlotByName(slotName);
        if(!slot){
            LogsManager.warn("没有这个slot:",slotName);
            return;
        }
        if(value == true){
            slot.replaceDisplayByIndex(0,null);
        } else{
            //否则就是隐藏
            slot.replaceDisplayByIndex(0,-1);
        }
        this["_clearCache"]();
        


    }

    //获取动画的长度 如果这个动画没有加载完成 返回-1
    public static getAniFrame(aniName:string,aniIndex:number=0){
        if(!this.cacheAniCompleteMap[aniName]){
            return -1;
        }
        var templet:Laya.Templet = this.cacheAniCompleteMap[aniName].templet;
        if(aniIndex < 0){
            return  -1
        }
        if(aniIndex >= templet.getAnimationCount()){
            LogsManager.errorTag("aniError", "aniIndex错误,ani:",aniName,"动画数量:",templet.getAnimationCount(),"目标aniIndex:",aniIndex)
            return -1
        }
        return Math.round(templet.getAniDuration(aniIndex)/1000*templet.rate);

    }

    public stop(){
        if(this._state ==0){
            this._cacheStopParams =true;
            this._cachePlayParams= null;
            return;
        }
        super.stop();
    }


}