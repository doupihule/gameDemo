import Message from "../common/Message";
import {LoadingUI} from "../../game/sys/view/loading/LoadingUI";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import LogsManager from "./LogsManager";
import Global from "../../utils/Global";
import {LoadManager} from "./LoadManager";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import WindowEvent from "../event/WindowEvent";
import LogsErrorCode from "../consts/LogsErrorCode";
import GuideManager from "../../game/sys/manager/GuideManager";
import UserInfo from "../common/UserInfo";
import AlertNewLocalUI from "../view/tip/AlertNewLocalUI";
import PoolTools from "../utils/PoolTools";
import JumpManager from "./JumpManager";

export default class WindowManager {


	private static _currentFullWindow: Laya.Sprite;

	public static rootLayer: Laya.Sprite

	public static commonUILayer: Laya.Sprite;
	public static topUILayer: Laya.Sprite;
	public static guideLayer: Laya.Sprite;        //引导层 会盖住topuilayer.
	public static highLayer: Laya.Sprite;           //部分特殊的界面需要盖住引导层级
	public static toolsLayer: Laya.Sprite;  //组件层 比如头条录屏按钮.  部分常驻的组件按钮放这一层. 这个界面的宽高不做特殊设置. 不阻挡点击事件穿透.
	public static maskLayer: Laya.Sprite;       //点击屏蔽遮罩层
	public static tipsLayer: Laya.Sprite;       //tip层，不允许开启触摸捕捉
	//调试层级.最高. 比如日志窗口
	public static debugLayer: Laya.Sprite;

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
	private static _currentWindow: Laya.Sprite;
	private static _currentWindowName: string = "";
	private static _allWindowMap: any[] = [];
	public static UIInstance = {};

	public static OpenUI(UIName: string, params = null) {
		// LogsManager.echo("WindowManager OpenUI:", UIName);
		WindowManager.SwitchUIAPI(UIName, null, null, params);
	}

	public static SwitchUI(openUINames: any, closeUINames: any, ...args) {
		WindowManager.SwitchUIAPI(openUINames, null, closeUINames, ...args);
	}

	public static SwitchUIAPI(openUINames: any, rootNodes: any, closeUINames: any, ...args) {
		this.SwitchMaskUI(true);
		if (openUINames) {
			if (typeof (openUINames) == "string") {
				openUINames = [openUINames];
			}
		} else
			openUINames = [];

		if (rootNodes) {
			if (typeof (rootNodes) == "object" && rootNodes.length == null) {
				rootNodes = [rootNodes];
			}
		} else
			rootNodes = [];

		if (closeUINames) {
			if (typeof (closeUINames) == "string") {
				closeUINames = [closeUINames];
			}
		} else
			closeUINames = [];
		var resAll = [];
		var packArr = [];
		var res3DAll = [];

		for (var openUIName of openUINames) {
			// LogsManager.echo("WindowManager Switch OpenUI:", openUIName);
			var uiCfgs = this.getWindowCfgs(openUIName);
			var res = uiCfgs.group || [];
			for (var url of res) {
				resAll.push(url);
			}
			var subPackage = this.getUIPackage(openUIName);
			if (subPackage) {
				for (var url of subPackage) {
					packArr.push(url);
				}
			}
			var res3D = uiCfgs.group3d || [];
			for (var url of res3D) {
				res3DAll.push(url);
			}
		}
		for (var closeUIName of closeUINames) {
			var uiView = WindowManager.UIInstance[closeUIName]
			if (uiView) uiView.mouseEnabled = false;

		}

		LoadManager.instance.loadPacgeAndRes(packArr, resAll, Laya.Handler.create(WindowManager, (openUINames, rootNodes, closeUINames, params) => {
				LoadManager.instance.create(res3DAll, Laya.Handler.create(WindowManager, WindowManager.SwitchUIComplete, [openUINames, rootNodes, closeUINames, args]));
			},
			[openUINames, rootNodes, closeUINames, args]), null, null, true);
	}

	private static SwitchUIComplete(openUINames: any, rootNodes: any, closeUINames: any, args) {
		this.SwitchMaskUI(false);
		Message.instance.send(WindowEvent.WINDOW_EVENT_SWITCHUISTART, {
			openUINames: openUINames,
			closeUINames: closeUINames
		});
		for (var index in openUINames) {
			var uiname = openUINames[index]

			var targetUI = WindowManager.UIInstance[uiname]
			var uiCfgs = this.getWindowCfgs(uiname);
			if (targetUI == null) {
				var classIntance = uiCfgs.path;
				targetUI = new classIntance();
				if (!rootNodes || rootNodes.length == 0) {
					targetUI.width = ScreenAdapterTools.width;
					targetUI.height = ScreenAdapterTools.height;
				}

				WindowManager.UIInstance[uiname] = targetUI;
			}

			if (rootNodes[index]) {
				rootNodes[index].addChild(targetUI);
			} else {
				var ctn = this.getWindowCtn(openUINames[index]);
				ctn.mouseEnabled = true;
				ctn.addChild(targetUI);
			}
			//给ui赋值属性windowName
			targetUI.windowName = uiname;
			//如果是开启模态的 而且是非全屏ui
			if (uiCfgs.modal == 1 && !uiCfgs.full) {
				if (!targetUI.__modalView) {
					targetUI.__modalView = this.createModalView(targetUI, uiCfgs.modalAlpha)

				}

			}

			this._currentWindow = targetUI;
			this._currentWindowName = uiname;
			this._insertWindow(targetUI);
			LogsManager.echo("WindowManager  OpenUI Complete:", uiname, "currentWindow:", this.getCurrentWindowName());

			targetUI.mouseEnabled = true;
			targetUI.setData(args[index]);
			targetUI.name = openUINames[index];

			// WindowManager.commonUILayer.addChild(WindowManager.UIInstance[openUIName]);
		}
		for (var closeUIName of closeUINames) {
			// LogsManager.echo("WindowManager Switch CloseUI:", closeUIName);
			if (closeUIName == WindowCfgs.LoadingUI) {
				WindowManager.CloseLoadingUI();
			} else {
				WindowManager.CloseUIAPI(closeUIName);
			}
			this._removeOneWindow(closeUIName);
			LogsManager.echo("WindowManager close  Complete:", closeUIName, "currentWindow:", this.getCurrentWindowName());
		}
		this.updateUiVisible();
		Message.instance.send(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, {
			openUINames: openUINames,
			closeUINames: closeUINames
		});

	}

	//创建模态
	private static createModalView(ctn: Laya.Sprite, alpha: number = 1) {
		if (alpha == null) {
			alpha = 0.3;
		}
		var modalView = new Laya.Sprite();
		modalView.graphics.drawRect(0, 0, ScreenAdapterTools.width, ScreenAdapterTools.height, "#000000", null, 0);
		modalView.width = ScreenAdapterTools.width;
		modalView.height = ScreenAdapterTools.height;
		modalView.mouseEnabled = true;
		modalView.mouseThrough = false;
		modalView.alpha = alpha;
		ctn.addChildAt(modalView, 0);
		return modalView
	}


	public adjustUI(view: Laya.Sprite) {
		view.width = ScreenAdapterTools.width;
		view.height = ScreenAdapterTools.height;
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
		if (Global.isGameDestory) {
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
		// WindowManager.OpenUI(WindowCfgs.AlertUILocal, data);
		// Message.instance.send(MsgCMD.MODULE_SHOW, { windowName: WindowCfgs.SUREPOPUP, data: data });
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
			Laya.timer.once(args.timeout, this, () => {
				this.tipsCount--;
				WindowManager.expandTipsObject.push(tip);
				WindowManager.tipsLayer.removeChild(tip);
				if (this.expandTipsContent.length > 0) {
					WindowManager.expandTipComplete(this.expandTipsContent.shift());
				}
			});
		}
	}

	public static ShowTip(text, timeout = 1500) {
		// var subPackage = this.getUIPackage(WindowCfgs.TipsUI);
		// LoadManager.instance.loadPacgeAndRes(subPackage, this.getUILoadGroup(WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.TipComplete, [{ text: text, timeout: timeout }]));
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
			Laya.timer.once(args.timeout, this, () => {
				this.tipsCount--;
				WindowManager.tipsObject.push(tip);
				WindowManager.tipsLayer.removeChild(tip);
				if (this.tipsContent.length > 0) {
					WindowManager.TipComplete(this.tipsContent.shift());
				}
			});
		}
	}

	public static ShowUpdateTip(text, timeout = 1500) {
		//暂时废弃
		if (WindowManager.isShowUpdateTip)
			LoadManager.instance.load(this.getUILoadGroup(WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.UpdateTipComplete, [{
				text: text,
				timeout: timeout
			}]));
	}

	private static UpdateTipComplete(args) {
		if (this.updateTipsCount >= 1) {
			this.updateTipsContent.push(args);
		} else {
			var tip;
			if (WindowManager.updateTipsObject.length > 0) {
				tip = WindowManager.updateTipsObject.pop();
			} else {
				tip = this.getUIClass(WindowCfgs.TipsUI);
				tip.width = ScreenAdapterTools.width;
				tip.height = ScreenAdapterTools.height;
			}
			this.updateTipsCount++;
			tip.setData(args.text);
			WindowManager.commonUILayer.addChild(tip);
			Laya.timer.once(args.timeout, this, () => {
				this.updateTipsCount--;
				WindowManager.updateTipsObject.push(tip);
				WindowManager.commonUILayer.removeChild(tip);
				if (this.updateTipsContent.length > 0) {
					WindowManager.TipComplete(this.updateTipsContent.shift());
				}
			});
		}
	}

	public static CloseUIAPI(UIName: string) {
		if (WindowManager.UIInstance[UIName] != null) {
			LogsManager.echo("WindowManager CloseUI:", UIName);
			var uiView = WindowManager.UIInstance[UIName]
			uiView.onClose && uiView.onClose();
			var parent: Laya.Sprite = uiView.parent
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
		if (loadRes && loadRes.length > 0) {
			var subPackage = this.getUIPackage(UIName);
			LoadManager.instance.loadPacgeAndRes(subPackage, loadRes, Laya.Handler.create(WindowManager, (UIName, params) => {
					var res3D = WindowManager.getWindowCfgs(UIName).group3d;
					if (res3D == null)
						WindowManager.GuideUIComplete(UIName, params);
					else
						Laya.loader.create(res3D, Laya.Handler.create(WindowManager, WindowManager.GuideUIComplete, [UIName, params]));
				},
				[UIName, params]), null, null, true);
		} else {
			if (WindowManager.UIInstance[UIName] == null) {
				WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
				WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
				WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
			}

			WindowManager.UIInstance[UIName].mouseEnabled = true;
			WindowManager.UIInstance[UIName].setData(params);
			WindowManager.guideLayer.addChild(WindowManager.UIInstance[UIName]);
		}
	}

	private static GuideUIComplete(UIName, params) {
		if (WindowManager.UIInstance[UIName] == null) {
			WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
			WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
			WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
		}
		WindowManager.UIInstance[UIName].mouseEnabled = true;
		Laya.timer.callLater(this, () => {
			WindowManager.UIInstance[UIName].setData(params);
			WindowManager.guideLayer.addChild(WindowManager.UIInstance[UIName]);
		});
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
		var loadGroup = WindowManager.getUILoadGroup(UIName);
		if (loadGroup && loadGroup.length > 0) {
			var subPackage = this.getUIPackage(UIName);
			LoadManager.instance.loadPacgeAndRes(subPackage, loadGroup, Laya.Handler.create(WindowManager, (node, UIName, params) => {
					var res3D = WindowManager.getWindowCfgs(UIName).group3d;
					if (res3D == null)
						WindowManager.SubGuideUIComplete(node, UIName, params);
					else
						LoadManager.instance.create(res3D, Laya.Handler.create(WindowManager, WindowManager.SubGuideUIComplete, [node, UIName, params]), null, null, true);
				},
				[node, UIName, params]), null, null, true);
		} else {
			WindowManager.SubGuideUIComplete(node, UIName, params);
		}
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
		// if (!WindowManager.guideLayer.numChildren) WindowManager.guideLayer.visible = false;
		// node.removeChild(WindowManager.guideLayer);
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
	private static loadingHandler: Laya.Handler;

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
			WindowManager.loadingHandler.run();
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
		Laya.timer.once(100, this, () => {
			WindowManager.SwitchUI(openUIName, WindowCfgs.LoadingUI, params);
		});
	}

	public static SwitchMaskUI(isOpen, alpha = 0) {
		var UIName = "maskUI";
		if (isOpen) {
			// LogsManager.echo("krma. openMask");
			this.maskCount++;
			WindowManager.maskLayer.visible = true;
			if (WindowManager.UIInstance[UIName] == null) {
				WindowManager.UIInstance[UIName] = this.initMaskUI();
				WindowManager.UIInstance[UIName].width = ScreenAdapterTools.width;
				WindowManager.UIInstance[UIName].height = ScreenAdapterTools.height;
			}
			WindowManager.UIInstance[UIName].mouseEnabled = true;
			if (alpha > this.maskAlpha)
				this.maskAlpha = alpha;
			WindowManager.UIInstance[UIName].alpha = this.maskAlpha;
			WindowManager.maskLayer.mouseEnabled = true;
			WindowManager.maskLayer.mouseThrough = false;
			WindowManager.maskLayer.addChild(WindowManager.UIInstance[UIName]);
		} else {
			this.maskCount--;
			if (this.maskCount <= 0) {
				// LogsManager.echo("krma. closeMask");
				this.maskCount = 0;
				if (WindowManager.UIInstance[UIName] != null) {
					WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
					WindowManager.maskLayer.removeChild(WindowManager.UIInstance[UIName]);
				}
				if (!WindowManager.maskLayer.numChildren)
					WindowManager.maskLayer.visible = false;
				this.maskAlpha = 0;
			}
		}
		Laya.timer.clear(this, this.CloseMaskUI);
		if (this.maskCount > 0) {
			Laya.timer.once(5000, this, this.CloseMaskUI);
		}
	}

	public static CloseMaskUI() {
		var UIName = "maskUI";
		this.maskCount = 0;
		if (WindowManager.UIInstance[UIName] != null) {
			WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
			WindowManager.maskLayer.removeChild(WindowManager.UIInstance[UIName]);
		}
		if (!WindowManager.maskLayer.numChildren)
			WindowManager.maskLayer.visible = false;
		this.maskAlpha = 0;
	}

	static initMaskUI() {
		var mask = new Laya.Image();
		var background = new Laya.Sprite();

		mask.addChild(background);

		//画矩形
		background.graphics.drawRect(0, 0, ScreenAdapterTools.width, ScreenAdapterTools.height, 0);
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
		if (obj.modalAlpha == undefined || obj.modalAlpha == null) {
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
