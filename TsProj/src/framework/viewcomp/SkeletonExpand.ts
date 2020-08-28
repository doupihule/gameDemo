import SubPackageManager from "../manager/SubPackageManager";
import ResourceManager from "../manager/ResourceManager";
import {LoadManager} from "../manager/LoadManager";
import LogsManager from "../manager/LogsManager";
import BaseContainer from "../components/BaseContainer";

export default class SkeletonExpand extends BaseContainer {
	//

	//缓存动画加载完成回调
	/**
	 * 动画名, 创建的数量
	 * animae:{nums:, templet:any }
	 *
	 *
	 */
	public static cacheAniCompleteMap: any = {}

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

	private _cacheAniMode: number = 0


	//缓存加载完成后的回调
	/**
	 * callFunc,
	 * thisObj,
	 * paramsArr, 采用apply方式回调
	 *
	 */
	private _cacheCompleteParams: any[];


	public shortSkeletonName: string;

	constructor() {
		super();
		this._cacheCompleteParams = []
	}

	//开始加载
	public startLoadByShortName(shortName: string) {
		this.shortSkeletonName = shortName;
		SubPackageManager.loadDynamics(ResourceManager.getSpineSubpack(shortName), ResourceManager.getSpinePath(shortName), this.onSubPackComplete, this);
	}

	//分包加载完成
	private onSubPackComplete() {
	}

	//重写update
	private _update() {
		if (!this["_player"]) {
			return;
		}
		super["_update"]()
	}



	//给整个view换一个texture
	public changWholeViewTexture(url: string) {


	}
	public  paused(){

	}
	public  resume(){

	}
	public  setPlayerSpeed(value){

	}
	//换装图片加载完成
	private onImageCompelte() {



	}

	public play(nameOrIndex: any, loop: boolean, force?: boolean, start?: number, end?: number, freshSkin?: boolean, playAudio?: boolean) {

	}


	//显示或者隐藏slot
	public showOrHideSlot(slotName: string, value: boolean) {


	}

	//获取动画的长度 如果这个动画没有加载完成 返回-1
	public static getAniFrame(aniName: string, aniIndex: number = 0) {
		if (!this.cacheAniCompleteMap[aniName]) {
			return -1;
		}
		return -1

	}

	public stop() {
	}


}