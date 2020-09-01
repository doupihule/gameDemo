
import DisplayUtils from "../../../framework/utils/DisplayUtils";
import ResourceManager from "../../../framework/manager/ResourceManager";
import ResourceConst from "../../sys/consts/ResourceConst";
import LogsManager from "../../../framework/manager/LogsManager";
import TimerManager from "../../../framework/manager/TimerManager";
import UserInfo from "../../../framework/common/UserInfo";
import BaseContainer from "../../../framework/components/BaseContainer";
import ImageExpand from "../../../framework/components/ImageExpand";
import ViewTools from "../../../framework/components/ViewTools";
import SpineGraphicExpand from "../../../framework/components/SpineGraphicExpand";

//战中角色视图类封装 嵌套一层容器的原因是为了方便缩放和计算
export default class BattleRoleView extends BaseContainer {

	//是否开启动画状态调试. 默认关闭. 只有在做性能优化的时候才开启
	//目的是检测游戏各个阶段还有哪些在后台播放的动画
	public static isOpenAniDebug = false;

	public aniScale: number = 1;
	//当前动画对象
	public currentAni: SpineGraphicExpand;
	private _viewIndex: number = 0

	private _childViewArr: SpineGraphicExpand[]
	private _viewScale: number = 1;
	//当前的视图数量
	public currentViewNums: number = 1;

	private _aniMode: number;
	private _viewName: string;

	public _xSpace: number = 0;
	public _ySpace: number = 0;

	//影子数组
	public _shadeViewArr: ImageExpand[];

	private _useShade: boolean = false;
	private _shadeScale: number = 1;

	public tagStr: string = ""
	private static hasRegistUpdate = false;

	//tag一个动画标签.代表这个动画是从哪个ui界面或者模块传递进来的. 必须传入. 用来做动画的状态追踪用的
	public constructor(viewName: string, scale: number = 1, viewIndex: number = 0, tag: string = "") {
		super()
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
			LogsManager.errorTag("没有传入tag");
		}
		this.tagStr = tag;
		//只有web版开启动画调试
		if (BattleRoleView.isOpenAniDebug && UserInfo.isWeb()) {
			if (!BattleRoleView.hasRegistUpdate) {
				BattleRoleView.hasRegistUpdate = true;
				//开启调试 后台5秒打印一次激活的动画数据
				TimerManager.instance.add(BattleRoleView.getActiveAniNums, BattleRoleView, 5000);
			}
			BattleRoleView._cacheAllAniArr.push(this);
		}


	}

	//设置间距
	public setSpace(xSpace, ySpace) {
		this._xSpace = xSpace;
		this._ySpace = ySpace;
	}


	//设置影子要在 设置视图数量之后
	public setShade(scale: number = 0) {
		this._useShade = true;
		if (scale) {
			this._shadeScale = scale;
		}

		this.sortChildView();
	}

	//显示或者隐藏阴影
	public showOrHideShade(value: boolean) {
		if (!this._shadeViewArr) {
			return;
		}
		for (var i = 0; i < this._shadeViewArr.length; i++) {
			this._shadeViewArr[i].visible = value;
		}
	}

	//改变视图数量
	public changeViewNums(value) {
		this.currentViewNums = value;
		if (this._childViewArr.length < this.currentViewNums) {
			for (var i = this._childViewArr.length; i < this.currentViewNums; i++) {
				this.cloneOneChildAni();
			}
		}
		for (var i = this.currentViewNums; i < this._childViewArr.length; i++) {
			this._childViewArr[i].visible = false;
			this._childViewArr[i].stop()
		}
		//排列iew
		this.sortChildView();

	}

	private static _childSortFormation = [
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
	]


	public static getPosArrByViewNums(viewNums: number) {
		return BattleRoleView._childSortFormation[viewNums - 1]
	}


	private sortChildView() {
		var formationArr = BattleRoleView._childSortFormation[this.currentViewNums - 1];
		if (this._useShade) {
			if (!this._shadeViewArr) {
				this._shadeViewArr = []
			}
		}
		for (var i = 0; i < formationArr.length; i++) {
			var posArr = formationArr[i];
			var view = this._childViewArr[i];
			view.set2dPos(posArr[0] * this._xSpace, posArr[1] * this._ySpace);
			if (this._useShade) {
				var shaderView = this._shadeViewArr[i];
				if (!shaderView) {
					shaderView = ViewTools.createImage(ResourceConst.BATTLE_SHADE);
					shaderView.scale(this._shadeScale, this._shadeScale, true);
					shaderView.setAnchor(0.5,0.5);
					this.addChild(shaderView, 0);
					this._shadeViewArr[i] = shaderView
				}
				shaderView.x = view.x + 2;
				shaderView.y = view.y + 3;
			}


		}
	}

	//克隆一个子动画
	private cloneOneChildAni() {
		var ani = DisplayUtils.createSkeletonExpand(this._viewName, this._aniMode);
		ani.scale(this._viewScale, this._viewScale);

		this._childViewArr.push(ani);
		//如果是有换装的
		if (this._viewIndex > 0) {
			var spinePath = ResourceManager.getSpinePath(this._viewName);
			ani.changWholeViewTexture(spinePath + this._viewName + "_" + this._viewIndex + ".png");
		}
		this.addChild(ani);
		// ani.showOrHideSlot("body",false);

		return ani
	}

	//用于读取出缓存的角色设置缩放
	public setItemViewScale(scale) {
		this._viewScale = scale;
		this.currentAni.scale(scale, scale);
	}

	//暂停播放
	public stop() {
		for (var i = 0; i < this.currentViewNums; i++) {
			this._childViewArr[i].stop();
		}
	}

	public play(nameOrIndex: any, loop: boolean, force?: boolean, start?: number, end?: number, freshSkin?: boolean, playAudio?: boolean) {

		for (var i = 0; i < this.currentViewNums; i++) {
			this._childViewArr[i].play(nameOrIndex, loop, force, start, end);
		}
	}

	public resume() {
		for (var i = 0; i < this.currentViewNums; i++) {
			this._childViewArr[i].resume();
		}
	}

	//设置播放速率 必须等待动画播放完成
	public setPlaySpeed(value: number) {
		for (var i = 0; i < this.currentViewNums; i++) {
			var childAni = this._childViewArr[i];
			childAni.setTimeScale(value);
		}
	}

	//设置子对象的视图
	public setChildViewPos(x, y) {
		for (var i = 0; i < this.currentViewNums; i++) {
			var childAni = this._childViewArr[i];
			childAni.set2dPos(x, y);
		}
	}

	//隐藏插槽
	public showOrHideSlot(slotName: string, value: boolean = false) {
		for (var i = 0; i < this.currentViewNums; i++) {
			var childAni = this._childViewArr[i];
			childAni.showOrHideSlot(slotName, value);
		}
	}

	private static _cacheAllAniArr: BattleRoleView[] = []

	//获取当前激活的动画
	private static getActiveAniNums() {
		var resultArr = [];
		var runAniNums: number = 0;
		for (var i = 0; i < this._cacheAllAniArr.length; i++) {
			var ani = this._cacheAllAniArr[i].currentAni;
			if (ani["_pause"] != true) {
				resultArr.push(ani);
				if (ani.parent) {
					runAniNums++;
				}
				// 还在激活中的ani 表示这个动画状态是play.还没有调用stop.  displayedInStage是否在舞台: 如果displayedInStage输出为true. 表示这个动画还在进行计算.
				LogsManager.echo("还在激活中的ani", this._cacheAllAniArr[i]._viewName, this._cacheAllAniArr[i].tagStr )
			}
		}
		LogsManager.echo("当前激活中的动画数量", resultArr.length, "在舞台并计算的动画数量:", runAniNums)
		return resultArr;
	}
}