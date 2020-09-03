import ResourceManager from "../manager/ResourceManager";
import BaseViewExpand from "../components/BaseViewExpand";

//动态的3dsprite扩展.  对于一些不需要操作子对象的3d模型来说.这个方法很适合. 非阻塞的创建3d模型

export default class Sprite3DExpand extends BaseViewExpand {

	//真实显示的view对象
	public currentView: Sprite3DExpand;

	//显示的视图数据. 考虑到 一个3d场景里面有多个模型. 加载完成之后只会显示viewArr数组里面的对象.并把其他的对象active设置为false;
	//如果配置为null , 那么表示完整显示.    [ "child1.child12", "child2","child3",...   ] . 支持配置多级嵌套子对象
	protected showViewArr: string[];
	protected originShowViewArr: string[];
	//对应的3d模型名称 比如 rolecar_01
	public modelName: string;
	protected _onCompleteBack: any;

	protected _childMap: {};

	public constructor() {
		super();
		this._childMap = [];
	}

	//开始加载model
	public startLoadModel(modelName: string, completeFunc: any = null, thisObj: any = null, args: any[] = null) {
		this.modelName = modelName;
		if (completeFunc) {
			this._onCompleteBack = completeFunc;
		}
		ResourceManager.load3dmodel(modelName, false, this.onLoadComplete, this);
	}

	//给一个子对象赋一个包含路径的全名.applyfullname;
	protected applyChildFullName(view: Sprite3DExpand, path: string = "") {
	}

	//获取子对象.根据全路径 必须要等加载完成之后才能获取.否则为空
	public getChildViewByFullName(fullname) {
		return this._childMap[fullname];
	}

	//加载成功回调
	public onLoadComplete() {
	}

	//子类重写 .比如需要播放特效的
	protected doExpandOnShow() {

	}


	//显示子对象
	protected showChildView() {
		for (var i in this._childMap) {
			var view = this._childMap[i];
			var needShow = false;
			if (this.showViewArr) {
				for (var s = 0; s < this.showViewArr.length; s++) {
					var tempUrl = this.showViewArr[s];
					//如果路径前缀互相包含就直接显示
					if (i.slice(0, tempUrl.length) == tempUrl || tempUrl.slice(0, i.length) == i) {
						needShow = true;
						break;
					}
				}
			} else {
				needShow = true;
			}

			view.active = needShow;
		}
	}

	//设置showViewArr  传空表示显示所有子对象
	public setShowViewArr(showViewArr: string[]) {
		//这里需要动态
		if (this.showViewArr == showViewArr) {
			return;
		}
		this.showViewArr = showViewArr;
		//如果还没加载完 不执行
		if (!this.currentView) {
			return;
		}
		this.showChildView();
	}

	//销毁
	public destroy() {
		this._childMap = null;
		if (this._onCompleteBack) {
			delete this._onCompleteBack;
		}
		this.showViewArr = null;
		//移除自己
		if (this.currentView) {
			this.currentView.removeSelf();
		}
		this.currentView = null;
		if (this.parent) {
			this.removeSelf();
		}
	}


}
