import Message from "../common/Message";
import {LoadingUI} from "../../game/sys/view/loading/LoadingUI";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import GlobalData from "../utils/GlobalData";
import {LoadManager} from "./LoadManager";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import WindowEvent from "../event/WindowEvent";
import LogsErrorCode from "../consts/LogsErrorCode";
import GuideManager from "../../game/sys/manager/GuideManager";
import UserInfo from "../common/UserInfo";
import AlertNewLocalUI from "../view/tip/AlertNewLocalUI";
import PoolTools from "../utils/PoolTools";
import JumpManager from "./JumpManager";
import BaseContainer from "../components/BaseContainer";
import ViewTools from "../components/ViewTools";
import TimerManager from "./TimerManager";
import ResourceManager from "./ResourceManager";
import ResourceConst from "../../game/sys/consts/ResourceConst";
import UIBaseView from "../components/UIBaseView";
import ResourceCommonConst from "../consts/ResourceCommonConst";

export default class WindowManager {


	private static _currentFullWindow: BaseContainer;

	public static rootLayer: BaseContainer

	public static commonUILayer: BaseContainer;
	public static topUILayer: BaseContainer;
	public static guideLayer: BaseContainer;        //引导层 会盖住topuilayer.
	public static highLayer: BaseContainer;           //部分特殊的界面需要盖住引导层级
	public static toolsLayer: BaseContainer;  //组件层 比如头条录屏按钮.  部分常驻的组件按钮放这一层. 这个界面的宽高不做特殊设置. 不阻挡点击事件穿透.
	public static maskLayer: BaseContainer;       //点击屏蔽遮罩层
	public static tipsLayer: BaseContainer;       //tip层，不允许开启触摸捕捉
	//调试层级.最高. 比如日志窗口
	public static debugLayer: BaseContainer;

	public static tipsContent = [];
	public static tipsObject = [];
	public static expandTipsContent = [];
	public static expandTipsObject = [];
	public static tipsCount = 0;

	public static updateTipsContent = [];
	public static updateTipsObject = [];
	public static updateTipsCount = 0;

	public static maskCount = 0;
	public static maskAlpha = 0;

	public static isShowUpdateTip = false;
	private static _allWindowMap: any[] = [];
	public static UIInstance = {};

	public static OpenUI(UIName: string, params = null) {
		WindowManager.SwitchUIAPI(UIName, null, null, params);
	}

	public static SwitchUI(openUIName: any, closeUIName: any, args = null) {
		WindowManager.SwitchUIAPI(openUIName, null, closeUIName, args);
	}

	public static SwitchUIAPI(openUIName: any, rootNode: any, closeUIName: any, args=null) {
		// this.SwitchMaskUI(true);
		WindowManager.SwitchUIComplete(openUIName, rootNode, closeUIName, args);
	}

	private static SwitchUIComplete(openUIName: any, rootNode: any, closeUIName: any, args) {
		// this.SwitchMaskUI(false);
		// Message.instance.send(WindowEvent.WINDOW_EVENT_SWITCHUISTART, {
		// 	openUIName: openUIName,
		// 	closeUIName: closeUIName
		// });
		//如果有打开某个界面
		if (openUIName){
			var targetUI:UIBaseView = WindowManager.UIInstance[openUIName]
			var uiCfgs = this.getWindowCfgs(openUIName);
			if (targetUI == null) {
				var classIntance = uiCfgs.path;
				targetUI = new classIntance() as UIBaseView;
				var uiCobj =ResourceManager.loadUIPrefab(uiCfgs.prefabPath+"/"+ openUIName,ResourceCommonConst.boundle_ui);
				targetUI.setCObject(uiCobj);
				if (!rootNode) {
					// targetUI.setSize(ScreenAdapterTools.width,ScreenAdapterTools.height);
				}
				WindowManager.UIInstance[openUIName] = targetUI;
			}

			if (rootNode) {
				rootNode.addChild(targetUI);
			} else {
				var ctn = this.getWindowCtn(openUIName);
				ctn.addChild(targetUI);
			}
			//给ui赋值属性windowName
			targetUI.setWindowName(openUIName);
			//如果是开启模态的 而且是非全屏ui
			if (uiCfgs.modal == 1 && !uiCfgs.full) {
				if (!targetUI.__modalView) {
					targetUI.__modalView = this.createModalView(targetUI, uiCfgs.modalAlpha)

				}

			}

			this._insertWindow(targetUI);
			LogsManager.echo("WindowManager  OpenUI Complete:", openUIName, "currentWindow:", this.getCurrentWindowName());

			targetUI.mouseEnabled = true;
			targetUI.setData(args);
		}

		if (closeUIName){
			if (closeUIName == WindowCfgs.LoadingUI) {
				WindowManager.CloseLoadingUI();
			} else {
				WindowManager.CloseUIAPI(closeUIName);
			}
			this._removeOneWindow(closeUIName);
			LogsManager.echo("WindowManager close  Complete:", closeUIName, "currentWindow:", this.getCurrentWindowName());
		}

		this.updateUiVisible();
		// Message.instance.send(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, {
		// 	openUINames: openUIName,
		// 	closeUINames: closeUIName
		// });

	}

	//创建模态
	private static createModalView(ctn: UIBaseView, alpha: number = 1) {
		if (alpha == null) {
			alpha = 0.3;
		}
		var modalView = ViewTools.createContainer(ctn.windowName+"_modal");
		modalView.mouseEnabled = true;
		modalView.mouseThrough = false;
		modalView.alpha = alpha;
		ctn.addChild(modalView, 0);
		return modalView
	}


	public adjustUI(view: BaseContainer) {
		view.setSize(ScreenAdapterTools.width,ScreenAdapterTools.height);
		view.mouseEnabled = true;
	}

	/**
	 * 文本描述弹出框
	 * @param type 1是只有确认按钮，2有确认和取消按钮
	 * @param content
	 * @param callBack 确认返回
	 * @param thisObj
	 * @param titleName 默认为“提示”
	 */
	public static setPopupTip(type: number, content: string, callBack?: any, thisObj?: any, titleName: string = null, closeBack: any = null): void {
		if (GlobalData.isGameDestory) {
			return;
		}

		var data: any = {
			type: type,
			title: titleName,
			msg: content,
			callBack: callBack,
			thisObj: thisObj,
			closeBack: closeBack
		};

		//先从缓存拿
		var ui = PoolTools.getItem("AlertNewLocalUI", "sys");
		LogsManager.echo("-----------setPopupTip---------", ui == null);
		if (!ui) {
			ui = new AlertNewLocalUI();
		}
		WindowManager.highLayer.addChild(ui);
		ui.setData(data);
	}

	public static ShowExpandTip(data, timeout = 1500) {
		// var subPackage = this.getUIPackage(WindowCfgs.TipsUI);
		// LoadManager.instance.loadPacgeAndRes(subPackage, this.getUILoadGroup(WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.TipComplete, [{ text: text, timeout: timeout }]));
		WindowManager.expandTipComplete({data: data, timeout: timeout});

	}

	private static expandTipComplete(args) {
		if (this.tipsCount >= 3) {
			this.expandTipsContent.push(args);
		} else {
			var tip;
			if (WindowManager.expandTipsObject.length > 0) {
				tip = WindowManager.expandTipsObject.pop();
			} else {
				tip = this.getUIClass("ExpandTipsUI");
				tip.width = ScreenAdapterTools.width;
				tip.height = ScreenAdapterTools.height;
			}
			this.tipsCount++;
			tip.setData(args.data);
			WindowManager.tipsLayer.addChild(tip);
			TimerManager.instance.add( () => {
				this.tipsCount--;
				WindowManager.expandTipsObject.push(tip);
				WindowManager.tipsLayer.removeChild(tip);
				if (this.expandTipsContent.length > 0) {
					WindowManager.expandTipComplete(this.expandTipsContent.shift());
				}
			},this,args.timeout,1);
		}
	}

	public static ShowTip(text, timeout = 1500) {
		WindowManager.TipComplete({text: text, timeout: timeout});

	}

	private static TipComplete(args) {
		if (this.tipsCount >= 3) {
			this.tipsContent.push(args);
		} else {
			var tip;
			if (WindowManager.tipsObject.length > 0) {
				tip = WindowManager.tipsObject.pop();
			} else {
				tip = this.getUIClass(WindowCfgs.TipsUI);
				tip.width = ScreenAdapterTools.width;
				tip.height = ScreenAdapterTools.height;
			}
			this.tipsCount++;
			tip.setData(args.text);
			WindowManager.tipsLayer.addChild(tip);
			TimerManager.instance.add(() => {
				this.tipsCount--;
				WindowManager.tipsObject.push(tip);
				WindowManager.tipsLayer.removeChild(tip);
				if (this.tipsContent.length > 0) {
					WindowManager.TipComplete(this.tipsContent.shift());
				}
			},this,args.timeout,1)
		}
	}



	public static CloseUIAPI(UIName: string) {
		if (WindowManager.UIInstance[UIName] != null) {
			LogsManager.echo("WindowManager CloseUI:", UIName);
			var uiView = WindowManager.UIInstance[UIName]
			uiView.onClose && uiView.onClose();
			var parent: BaseContainer = uiView.parent
			if (parent) {
				parent.removeChild(uiView)
				if (parent.numChildren == 0) {
					parent.mouseEnabled = false;
				}
			}
		}
	}

	public static CloseUI(UIName: string) {
		WindowManager.SwitchUIAPI(null, null, UIName);
	}


	/*
	判断某个界面是否开启着
	*/
	public static isUIOpened(UIName: string) {
		if (WindowManager.UIInstance[UIName] != null) {
			return WindowManager.UIInstance[UIName].activeInHierarchy;
		}
		return false;
	}

	//获取某个ui
	public static getUIByName(UIName: string) {
		return WindowManager.UIInstance[UIName];
	}

	//** 通用UI界面 -end- */

	/* **************************新手引导界面************************************** */

	public static OpenGuideUI(UIName: string, params) {
		// WindowManager.rootLayer.addChild(WindowManager.guideLayer);
		WindowManager.guideLayer.visible = true
		var loadRes = this.getUILoadGroup(UIName);
		if (WindowManager.UIInstance[UIName] == null) {
			WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
			WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
			WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
		}

		WindowManager.UIInstance[UIName].mouseEnabled = true;
		WindowManager.guideLayer.addChild(WindowManager.UIInstance[UIName]);
		WindowManager.UIInstance[UIName].setData(params);


	}


	public static CloseGuideUI(UIName: string) {
		GuideManager.ins.nowGuideId = null;
		if (WindowManager.UIInstance[UIName] != null) {
			WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
			WindowManager.guideLayer.removeChild(WindowManager.UIInstance[UIName]);
		}
		if (!WindowManager.guideLayer.numChildren) WindowManager.guideLayer.visible = false;
		// WindowManager.rootLayer.removeChild(WindowManager.guideLayer);

		var jumpItemList = JumpManager.getMainJumpItems();
		for (var index in jumpItemList) {
			jumpItemList[index].visible = true;
		}
	}

	public static OpenSubGuideUI(node, UIName: string, params) {
		WindowManager.SubGuideUIComplete(node, UIName, params);
	}

	private static SubGuideUIComplete(node, UIName, params) {
		if (WindowManager.UIInstance[UIName] == null) {
			WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
			WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
			WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
		}
		WindowManager.UIInstance[UIName].mouseEnabled = true;
		WindowManager.UIInstance[UIName].setData(params);
		node.addChild(WindowManager.UIInstance[UIName]);
	}

	public static CloseSubGuideUI(node, UIName: string) {
		if (WindowManager.UIInstance[UIName] != null) {
			WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
			node.removeChild(WindowManager.UIInstance[UIName]);
		}
	}


	/* ****************************子界面************************************ */


	public static OpenSubUI(UIName: string, rootNode: any, params = null) {
		// LogsManager.echo("WindowManager OpenSubUI:", UIName);
		WindowManager.SwitchUIAPI(UIName, rootNode, null, params);
	}

	public static CloseSubUI(UIName: string, rootNode: any) {
		if (WindowManager.UIInstance[UIName] != null) {
			WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
			rootNode.removeChild(WindowManager.UIInstance[UIName]);
		}
	}

	public static uiMaker: typeof LoadingUI = LoadingUI;

	//********************************加载界面****************************************/
	public static loadingUI: LoadingUI;
	private static loadingHandler: any;

	public static ShowLoadingUI(args): void {
		WindowManager.loadingHandler = args;
		WindowManager.LoadingUIAtlasComplete();
	}

	private static LoadingUIAtlasComplete(): void {

		if (WindowManager.loadingUI == null) {
			WindowManager.loadingUI = new LoadingUI();
			// WindowManager.loadingUI.width = ScreenAdapterTools.width;
			// WindowManager.loadingUI.height = ScreenAdapterTools.height;
		}
		UserInfo.platform.setLoadingProgress(100);
		UserInfo.platform.hideLoadingProgress();
		// WindowManager.commonUILayer.addChild(WindowManager.loadingUI);
		// WindowManager.loadingUI.mouseEnabled = true;
		WindowManager.loadingUI.showLoading();
		WindowManager.loadingUI.setData();

		if (WindowManager.loadingHandler != null) {
			WindowManager.loadingHandler()
		}
	}

	public static CloseLoadingUI(): void {
		if (WindowManager.loadingUI != null) {
			LogsManager.echo("WindowManager CloseLoadingUI");
			WindowManager.loadingUI.hideLoading();
			// WindowManager.commonUILayer.removeChild(WindowManager.loadingUI);
		}
	}

	public static SwitchUIFromLoading(openUIName: string, params) {
		if (LoadingUI.instance)
			LoadingUI.instance.addProgress(100);
		TimerManager.instance.add(() => {
			WindowManager.SwitchUI(openUIName, WindowCfgs.LoadingUI, params);
		},this,100,1);
	}


	public static SwitchMaskUI(isOpen, alpha = 0) {

	}

	public static CloseMaskUI() {
	}

	static initMaskUI() {
		var mask = ViewTools.createContainer("admask");
		var background = ViewTools.createContainer("admaskbg");

		mask.addChild(background);

		//画矩形
		background.alpha = 1;

		return mask;
	}

	//获取一个ui对应的容器
	static getWindowCtn(winName: string) {
		var cfgs = this.getWindowCfgs(winName);
		var ctn;
		if (!cfgs.parent) {
			return WindowManager.commonUILayer;
		} else if (cfgs.parent == WindowCfgs.UILAYER) {
			return WindowManager.commonUILayer;
		} else if (cfgs.parent == WindowCfgs.HIGHLAYER) {
			return WindowManager.highLayer;
		} else if (cfgs.parent == WindowCfgs.DEBUGLAYER) {
			return WindowManager.debugLayer;
		} else {
			LogsManager.echo("打开toplayer", winName)
			return WindowManager.topUILayer;
		}
		// return WindowManager.commonUILayer;
	}

	//判断一个窗口是否需要缓存
	static checkCacheWindow(winName: string) {
		var cfg = this.getWindowCfgs(winName);
		if (cfg.cache) {
			return true;
		}
		return false
	}


	//获取某一个窗口的ui配置
	static getWindowCfgs(winName: string) {
		// if(!this.windowcfgs[winName]){
		// 	return  this.commonCfgs;
		// }
		var obj: any = WindowCfgs.windowcfgs[winName];
		if (!obj) {
			return WindowCfgs.commonCfgs;
		}
		if (obj.modal == null) {
			obj.modal = 1;
		}
		if ( obj.modalAlpha == null) {
			obj.modalAlpha = 0.6;
		}
		if (!obj.parent) {
			obj.parent = WindowCfgs.UILAYER;
		}
		if (obj.showType == null) {
			obj.showType = 0;
		}
		return obj;
	}

	//获取一个ui需要加载的group
	static getUILoadGroup(winName: string) {
		var cfgs = this.getWindowCfgs(winName);
		return cfgs.group;
	}

	//获取一个ui对应的class对象
	static getUIClass(winName: string) {
		var cfgs = this.getWindowCfgs(winName);
		var path = cfgs.path;
		if (!path) {
			LogsManager.errorTag(LogsErrorCode.WINDOW_ERROR, "_没有给这个窗口配置类对象:", winName);
			return null;
		}
		return new path();
	}

	/**获取一个ui需要加载的资源包 */
	static getUIPackage(winName: string) {
		var cfgs = this.getWindowCfgs(winName);
		return cfgs.subPackage;
	}

	static openAdvMask() {
		var UIName = "advMaskUI";
		LogsManager.echo("zm 打开蒙版--------------------------")
		WindowManager.maskLayer.visible = true;
		if (WindowManager.UIInstance[UIName] == null) {
			WindowManager.UIInstance[UIName] = this.initMaskUI();
			WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
			WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
		}
		WindowManager.UIInstance[UIName].mouseEnabled = true;
		WindowManager.UIInstance[UIName].alpha = 0.5;
		WindowManager.maskLayer.mouseEnabled = true;
		WindowManager.maskLayer.mouseThrough = false;
		WindowManager.maskLayer.addChild(WindowManager.UIInstance[UIName]);
	}

	static closeAdvMask() {
		LogsManager.echo("zm 关闭蒙版--------------------------")
		var UIName = "advMaskUI";
		if (WindowManager.UIInstance[UIName] != null) {
			WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
			WindowManager.maskLayer.removeChild(WindowManager.UIInstance[UIName]);
		}
		if (!WindowManager.maskLayer.numChildren)
			WindowManager.maskLayer.visible = false;
	}

	//插入一个window
	private static _insertWindow(view) {
		var index = this._allWindowMap.indexOf(view)
		if (index != -1) {
			this._allWindowMap.splice(index, 1);
		}
		this._allWindowMap.push(view);
	}

	//更新ui显示
	private static updateUiVisible() {
		var len: number = this._allWindowMap.length;
		this._currentFullWindow = null;
		for (var i = len - 1; i >= 0; i--) {
			var win: any = this._allWindowMap[i];
			//显示这个ui 和他对应的modal
			win.visible = true;
			var cfg = this.getWindowCfgs(win.windowName);
			if (cfg.full) {
				this._currentFullWindow = win;
				for (var ii = i - 1; ii >= 0; ii--) {
					var childWindow: any = this._allWindowMap[ii];
					if (childWindow.parent && win.parent && childWindow.parent == win.parent) {
						childWindow.visible = false;
					}
				}
				break;
			}
		}
		var win: any = this._allWindowMap[len - 1];

	}

	//移除一个window
	private static _removeOneWindow(windowName) {
		for (var i = this._allWindowMap.length - 1; i >= 0; i--) {
			var window = this._allWindowMap[i];
			if (window.windowName == windowName) {
				this._allWindowMap.splice(i, 1);
			}
		}
	}

	static isUICached(windowName) {
		for (var index = 0; index < this._allWindowMap.length; index++) {
			if (this._allWindowMap[index].windowName == windowName) {
				return true;
			}
		}
		return false;
	}

	//取当前的windowName
	static getCurrentWindowName() {
		if (this._allWindowMap.length == 0) {
			return null;
		}
		return this._allWindowMap[this._allWindowMap.length - 1].windowName;
	}

	//获取最顶层的全屏ui 可能为空
	static getCurrentFullWindow() {
		return this._currentFullWindow
	}


	//取当前的window
	static getCurrentWindow() {
		if (this._allWindowMap.length == 0) {
			return null;
		}
		return this._allWindowMap[this._allWindowMap.length - 1]
	}

	//获取当前打开的所有界面
	static getallWindowMap() {
		return this._allWindowMap;
	}

	//在一个节点上创建View
	public static CreateViewOnNode(windowName, node, pararms: any = {}) {
		var windowClass: any = WindowCfgs.windowcfgs[windowName].path;
		var view = new windowClass();
		view.setData(pararms);
		node.addChild(view);
		return view;
	}
}

