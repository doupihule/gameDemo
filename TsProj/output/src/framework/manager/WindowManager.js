"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../common/Message");
const LoadingUI_1 = require("../../game/sys/view/loading/LoadingUI");
const ScreenAdapterTools_1 = require("../utils/ScreenAdapterTools");
const LogsManager_1 = require("./LogsManager");
const Global_1 = require("../../utils/Global");
const LoadManager_1 = require("./LoadManager");
const WindowCfgs_1 = require("../../game/sys/consts/WindowCfgs");
const WindowEvent_1 = require("../event/WindowEvent");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const GuideManager_1 = require("../../game/sys/manager/GuideManager");
const UserInfo_1 = require("../common/UserInfo");
const AlertNewLocalUI_1 = require("../view/tip/AlertNewLocalUI");
const PoolTools_1 = require("../utils/PoolTools");
const JumpManager_1 = require("./JumpManager");
class WindowManager {
    static OpenUI(UIName, params = null) {
        // LogsManager.echo("WindowManager OpenUI:", UIName);
        WindowManager.SwitchUIAPI(UIName, null, null, params);
    }
    static SwitchUI(openUINames, closeUINames, ...args) {
        WindowManager.SwitchUIAPI(openUINames, null, closeUINames, ...args);
    }
    static SwitchUIAPI(openUINames, rootNodes, closeUINames, ...args) {
        this.SwitchMaskUI(true);
        if (openUINames) {
            if (typeof (openUINames) == "string") {
                openUINames = [openUINames];
            }
        }
        else
            openUINames = [];
        if (rootNodes) {
            if (typeof (rootNodes) == "object" && rootNodes.length == null) {
                rootNodes = [rootNodes];
            }
        }
        else
            rootNodes = [];
        if (closeUINames) {
            if (typeof (closeUINames) == "string") {
                closeUINames = [closeUINames];
            }
        }
        else
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
            var uiView = WindowManager.UIInstance[closeUIName];
            if (uiView)
                uiView.mouseEnabled = false;
        }
        LoadManager_1.LoadManager.instance.loadPacgeAndRes(packArr, resAll, Laya.Handler.create(WindowManager, (openUINames, rootNodes, closeUINames, params) => {
            LoadManager_1.LoadManager.instance.create(res3DAll, Laya.Handler.create(WindowManager, WindowManager.SwitchUIComplete, [openUINames, rootNodes, closeUINames, args]));
        }, [openUINames, rootNodes, closeUINames, args]), null, null, true);
    }
    static SwitchUIComplete(openUINames, rootNodes, closeUINames, args) {
        this.SwitchMaskUI(false);
        Message_1.default.instance.send(WindowEvent_1.default.WINDOW_EVENT_SWITCHUISTART, { openUINames: openUINames, closeUINames: closeUINames });
        for (var index in openUINames) {
            var uiname = openUINames[index];
            var targetUI = WindowManager.UIInstance[uiname];
            var uiCfgs = this.getWindowCfgs(uiname);
            if (targetUI == null) {
                var classIntance = uiCfgs.path;
                targetUI = new classIntance();
                if (!rootNodes || rootNodes.length == 0) {
                    targetUI.width = ScreenAdapterTools_1.default.width;
                    targetUI.height = ScreenAdapterTools_1.default.height;
                }
                WindowManager.UIInstance[uiname] = targetUI;
            }
            if (rootNodes[index]) {
                rootNodes[index].addChild(targetUI);
            }
            else {
                var ctn = this.getWindowCtn(openUINames[index]);
                ctn.mouseEnabled = true;
                ctn.addChild(targetUI);
            }
            //给ui赋值属性windowName
            targetUI.windowName = uiname;
            //如果是开启模态的 而且是非全屏ui
            if (uiCfgs.modal == 1 && !uiCfgs.full) {
                if (!targetUI.__modalView) {
                    targetUI.__modalView = this.createModalView(targetUI, uiCfgs.modalAlpha);
                }
            }
            this._currentWindow = targetUI;
            this._currentWindowName = uiname;
            this._insertWindow(targetUI);
            LogsManager_1.default.echo("WindowManager  OpenUI Complete:", uiname, "currentWindow:", this.getCurrentWindowName());
            targetUI.mouseEnabled = true;
            targetUI.setData(args[index]);
            targetUI.name = openUINames[index];
            // WindowManager.commonUILayer.addChild(WindowManager.UIInstance[openUIName]);
        }
        for (var closeUIName of closeUINames) {
            // LogsManager.echo("WindowManager Switch CloseUI:", closeUIName);
            if (closeUIName == WindowCfgs_1.WindowCfgs.LoadingUI) {
                WindowManager.CloseLoadingUI();
            }
            else {
                WindowManager.CloseUIAPI(closeUIName);
            }
            this._removeOneWindow(closeUIName);
            LogsManager_1.default.echo("WindowManager close  Complete:", closeUIName, "currentWindow:", this.getCurrentWindowName());
        }
        this.updateUiVisible();
        Message_1.default.instance.send(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, { openUINames: openUINames, closeUINames: closeUINames });
    }
    //创建模态
    static createModalView(ctn, alpha = 1) {
        if (alpha == null) {
            alpha = 0.3;
        }
        var modalView = new Laya.Sprite();
        modalView.graphics.drawRect(0, 0, ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height, "#000000", null, 0);
        modalView.width = ScreenAdapterTools_1.default.width;
        modalView.height = ScreenAdapterTools_1.default.height;
        modalView.mouseEnabled = true;
        modalView.mouseThrough = false;
        modalView.alpha = alpha;
        ctn.addChildAt(modalView, 0);
        return modalView;
    }
    adjustUI(view) {
        view.width = ScreenAdapterTools_1.default.width;
        view.height = ScreenAdapterTools_1.default.height;
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
    static setPopupTip(type, content, callBack, thisObj, titleName = null, closeBack = null) {
        if (Global_1.default.isGameDestory) {
            return;
        }
        var data = { type: type, title: titleName, msg: content, callBack: callBack, thisObj: thisObj, closeBack: closeBack };
        //先从缓存拿
        var ui = PoolTools_1.default.getItem("AlertNewLocalUI", "sys");
        LogsManager_1.default.echo("-----------setPopupTip---------", ui == null);
        if (!ui) {
            ui = new AlertNewLocalUI_1.default();
        }
        WindowManager.highLayer.addChild(ui);
        ui.setData(data);
        // WindowManager.OpenUI(WindowCfgs.AlertUILocal, data);
        // Message.instance.send(MsgCMD.MODULE_SHOW, { windowName: WindowCfgs.SUREPOPUP, data: data });
    }
    static ShowExpandTip(data, timeout = 1500) {
        // var subPackage = this.getUIPackage(WindowCfgs.TipsUI);
        // LoadManager.instance.loadPacgeAndRes(subPackage, this.getUILoadGroup(WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.TipComplete, [{ text: text, timeout: timeout }]));
        WindowManager.expandTipComplete({ data: data, timeout: timeout });
    }
    static expandTipComplete(args) {
        if (this.tipsCount >= 3) {
            this.expandTipsContent.push(args);
        }
        else {
            var tip;
            if (WindowManager.expandTipsObject.length > 0) {
                tip = WindowManager.expandTipsObject.pop();
            }
            else {
                tip = this.getUIClass("ExpandTipsUI");
                tip.width = ScreenAdapterTools_1.default.width;
                tip.height = ScreenAdapterTools_1.default.height;
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
    static ShowTip(text, timeout = 1500) {
        // var subPackage = this.getUIPackage(WindowCfgs.TipsUI);
        // LoadManager.instance.loadPacgeAndRes(subPackage, this.getUILoadGroup(WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.TipComplete, [{ text: text, timeout: timeout }]));
        WindowManager.TipComplete({ text: text, timeout: timeout });
    }
    static TipComplete(args) {
        if (this.tipsCount >= 3) {
            this.tipsContent.push(args);
        }
        else {
            var tip;
            if (WindowManager.tipsObject.length > 0) {
                tip = WindowManager.tipsObject.pop();
            }
            else {
                tip = this.getUIClass(WindowCfgs_1.WindowCfgs.TipsUI);
                tip.width = ScreenAdapterTools_1.default.width;
                tip.height = ScreenAdapterTools_1.default.height;
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
    static ShowUpdateTip(text, timeout = 1500) {
        //暂时废弃
        if (WindowManager.isShowUpdateTip)
            LoadManager_1.LoadManager.instance.load(this.getUILoadGroup(WindowCfgs_1.WindowCfgs.TipsUI), Laya.Handler.create(WindowManager, WindowManager.UpdateTipComplete, [{ text: text, timeout: timeout }]));
    }
    static UpdateTipComplete(args) {
        if (this.updateTipsCount >= 1) {
            this.updateTipsContent.push(args);
        }
        else {
            var tip;
            if (WindowManager.updateTipsObject.length > 0) {
                tip = WindowManager.updateTipsObject.pop();
            }
            else {
                tip = this.getUIClass(WindowCfgs_1.WindowCfgs.TipsUI);
                tip.width = ScreenAdapterTools_1.default.width;
                tip.height = ScreenAdapterTools_1.default.height;
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
    static CloseUIAPI(UIName) {
        if (WindowManager.UIInstance[UIName] != null) {
            LogsManager_1.default.echo("WindowManager CloseUI:", UIName);
            var uiView = WindowManager.UIInstance[UIName];
            uiView.onClose && uiView.onClose();
            var parent = uiView.parent;
            if (parent) {
                parent.removeChild(uiView);
                if (parent.numChildren == 0) {
                    parent.mouseEnabled = false;
                }
            }
        }
    }
    static CloseUI(UIName) {
        WindowManager.SwitchUIAPI(null, null, UIName);
    }
    /*
    判断某个界面是否开启着
    */
    static isUIOpened(UIName) {
        if (WindowManager.UIInstance[UIName] != null) {
            return WindowManager.UIInstance[UIName].activeInHierarchy;
        }
        return false;
    }
    //获取某个ui
    static getUIByName(UIName) {
        return WindowManager.UIInstance[UIName];
    }
    //** 通用UI界面 -end- */
    /* **************************新手引导界面************************************** */
    static OpenGuideUI(UIName, params) {
        // WindowManager.rootLayer.addChild(WindowManager.guideLayer);
        WindowManager.guideLayer.visible = true;
        var loadRes = this.getUILoadGroup(UIName);
        if (loadRes && loadRes.length > 0) {
            var subPackage = this.getUIPackage(UIName);
            LoadManager_1.LoadManager.instance.loadPacgeAndRes(subPackage, loadRes, Laya.Handler.create(WindowManager, (UIName, params) => {
                var res3D = WindowManager.getWindowCfgs(UIName).group3d;
                if (res3D == null)
                    WindowManager.GuideUIComplete(UIName, params);
                else
                    Laya.loader.create(res3D, Laya.Handler.create(WindowManager, WindowManager.GuideUIComplete, [UIName, params]));
            }, [UIName, params]), null, null, true);
        }
        else {
            if (WindowManager.UIInstance[UIName] == null) {
                WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
                WindowManager.UIInstance[UIName].width = ScreenAdapterTools_1.default.width;
                WindowManager.UIInstance[UIName].height = ScreenAdapterTools_1.default.height;
            }
            WindowManager.UIInstance[UIName].mouseEnabled = true;
            WindowManager.UIInstance[UIName].setData(params);
            WindowManager.guideLayer.addChild(WindowManager.UIInstance[UIName]);
        }
    }
    static GuideUIComplete(UIName, params) {
        if (WindowManager.UIInstance[UIName] == null) {
            WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
            WindowManager.UIInstance[UIName].width = ScreenAdapterTools_1.default.width;
            WindowManager.UIInstance[UIName].height = ScreenAdapterTools_1.default.height;
        }
        WindowManager.UIInstance[UIName].mouseEnabled = true;
        Laya.timer.callLater(this, () => {
            WindowManager.UIInstance[UIName].setData(params);
            WindowManager.guideLayer.addChild(WindowManager.UIInstance[UIName]);
        });
    }
    static CloseGuideUI(UIName) {
        GuideManager_1.default.ins.nowGuideId = null;
        if (WindowManager.UIInstance[UIName] != null) {
            WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
            WindowManager.guideLayer.removeChild(WindowManager.UIInstance[UIName]);
        }
        if (!WindowManager.guideLayer.numChildren)
            WindowManager.guideLayer.visible = false;
        // WindowManager.rootLayer.removeChild(WindowManager.guideLayer);
        var jumpItemList = JumpManager_1.default.getMainJumpItems();
        for (var index in jumpItemList) {
            jumpItemList[index].visible = true;
        }
    }
    static OpenSubGuideUI(node, UIName, params) {
        var loadGroup = WindowManager.getUILoadGroup(UIName);
        if (loadGroup && loadGroup.length > 0) {
            var subPackage = this.getUIPackage(UIName);
            LoadManager_1.LoadManager.instance.loadPacgeAndRes(subPackage, loadGroup, Laya.Handler.create(WindowManager, (node, UIName, params) => {
                var res3D = WindowManager.getWindowCfgs(UIName).group3d;
                if (res3D == null)
                    WindowManager.SubGuideUIComplete(node, UIName, params);
                else
                    LoadManager_1.LoadManager.instance.create(res3D, Laya.Handler.create(WindowManager, WindowManager.SubGuideUIComplete, [node, UIName, params]), null, null, true);
            }, [node, UIName, params]), null, null, true);
        }
        else {
            WindowManager.SubGuideUIComplete(node, UIName, params);
        }
    }
    static SubGuideUIComplete(node, UIName, params) {
        if (WindowManager.UIInstance[UIName] == null) {
            WindowManager.UIInstance[UIName] = WindowManager.getUIClass(UIName);
            WindowManager.UIInstance[UIName].width = ScreenAdapterTools_1.default.width;
            WindowManager.UIInstance[UIName].height = ScreenAdapterTools_1.default.height;
        }
        WindowManager.UIInstance[UIName].mouseEnabled = true;
        WindowManager.UIInstance[UIName].setData(params);
        node.addChild(WindowManager.UIInstance[UIName]);
    }
    static CloseSubGuideUI(node, UIName) {
        if (WindowManager.UIInstance[UIName] != null) {
            WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
            node.removeChild(WindowManager.UIInstance[UIName]);
        }
        // if (!WindowManager.guideLayer.numChildren) WindowManager.guideLayer.visible = false;
        // node.removeChild(WindowManager.guideLayer);
    }
    /* ****************************子界面************************************ */
    static OpenSubUI(UIName, rootNode, params = null) {
        // LogsManager.echo("WindowManager OpenSubUI:", UIName);
        WindowManager.SwitchUIAPI(UIName, rootNode, null, params);
    }
    static CloseSubUI(UIName, rootNode) {
        if (WindowManager.UIInstance[UIName] != null) {
            WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
            rootNode.removeChild(WindowManager.UIInstance[UIName]);
        }
    }
    static ShowLoadingUI(args) {
        WindowManager.loadingHandler = args;
        WindowManager.LoadingUIAtlasComplete();
    }
    static LoadingUIAtlasComplete() {
        if (WindowManager.loadingUI == null) {
            WindowManager.loadingUI = new LoadingUI_1.LoadingUI();
            // WindowManager.loadingUI.width = ScreenAdapterTools.width;
            // WindowManager.loadingUI.height = ScreenAdapterTools.height;
        }
        UserInfo_1.default.platform.setLoadingProgress(100);
        UserInfo_1.default.platform.hideLoadingProgress();
        // WindowManager.commonUILayer.addChild(WindowManager.loadingUI);
        // WindowManager.loadingUI.mouseEnabled = true;
        WindowManager.loadingUI.showLoading();
        WindowManager.loadingUI.setData();
        if (WindowManager.loadingHandler != null) {
            WindowManager.loadingHandler.run();
        }
    }
    static CloseLoadingUI() {
        if (WindowManager.loadingUI != null) {
            LogsManager_1.default.echo("WindowManager CloseLoadingUI");
            WindowManager.loadingUI.hideLoading();
            // WindowManager.commonUILayer.removeChild(WindowManager.loadingUI);
        }
    }
    static SwitchUIFromLoading(openUIName, params) {
        if (LoadingUI_1.LoadingUI.instance)
            LoadingUI_1.LoadingUI.instance.addProgress(100);
        Laya.timer.once(100, this, () => {
            WindowManager.SwitchUI(openUIName, WindowCfgs_1.WindowCfgs.LoadingUI, params);
        });
    }
    static SwitchMaskUI(isOpen, alpha = 0) {
        var UIName = "maskUI";
        if (isOpen) {
            // LogsManager.echo("krma. openMask");
            this.maskCount++;
            WindowManager.maskLayer.visible = true;
            if (WindowManager.UIInstance[UIName] == null) {
                WindowManager.UIInstance[UIName] = this.initMaskUI();
                WindowManager.UIInstance[UIName].width = ScreenAdapterTools_1.default.width;
                WindowManager.UIInstance[UIName].height = ScreenAdapterTools_1.default.height;
            }
            WindowManager.UIInstance[UIName].mouseEnabled = true;
            if (alpha > this.maskAlpha)
                this.maskAlpha = alpha;
            WindowManager.UIInstance[UIName].alpha = this.maskAlpha;
            WindowManager.maskLayer.mouseEnabled = true;
            WindowManager.maskLayer.mouseThrough = false;
            WindowManager.maskLayer.addChild(WindowManager.UIInstance[UIName]);
        }
        else {
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
    static CloseMaskUI() {
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
        background.graphics.drawRect(0, 0, ScreenAdapterTools_1.default.width, ScreenAdapterTools_1.default.height, 0);
        background.alpha = 1;
        return mask;
    }
    //获取一个ui对应的容器
    static getWindowCtn(winName) {
        var cfgs = this.getWindowCfgs(winName);
        var ctn;
        if (!cfgs.parent) {
            return WindowManager.commonUILayer;
        }
        else if (cfgs.parent == WindowCfgs_1.WindowCfgs.UILAYER) {
            return WindowManager.commonUILayer;
        }
        else if (cfgs.parent == WindowCfgs_1.WindowCfgs.HIGHLAYER) {
            return WindowManager.highLayer;
        }
        else if (cfgs.parent == WindowCfgs_1.WindowCfgs.DEBUGLAYER) {
            return WindowManager.debugLayer;
        }
        else {
            LogsManager_1.default.echo("打开toplayer", winName);
            return WindowManager.topUILayer;
        }
        // return WindowManager.commonUILayer;
    }
    //判断一个窗口是否需要缓存
    static checkCacheWindow(winName) {
        var cfg = this.getWindowCfgs(winName);
        if (cfg.cache) {
            return true;
        }
        return false;
    }
    //获取某一个窗口的ui配置
    static getWindowCfgs(winName) {
        // if(!this.windowcfgs[winName]){
        // 	return  this.commonCfgs;
        // }
        var obj = WindowCfgs_1.WindowCfgs.windowcfgs[winName];
        if (!obj) {
            return WindowCfgs_1.WindowCfgs.commonCfgs;
        }
        if (obj.modal == null) {
            obj.modal = 1;
        }
        if (obj.modalAlpha == undefined || obj.modalAlpha == null) {
            obj.modalAlpha = 0.6;
        }
        if (!obj.parent) {
            obj.parent = WindowCfgs_1.WindowCfgs.UILAYER;
        }
        if (obj.showType == null) {
            obj.showType = 0;
        }
        return obj;
    }
    //获取一个ui需要加载的group
    static getUILoadGroup(winName) {
        var cfgs = this.getWindowCfgs(winName);
        return cfgs.group;
    }
    //获取一个ui对应的class对象
    static getUIClass(winName) {
        var cfgs = this.getWindowCfgs(winName);
        var path = cfgs.path;
        if (!path) {
            LogsManager_1.default.errorTag(LogsErrorCode_1.default.WINDOW_ERROR, "_没有给这个窗口配置类对象:", winName);
            return null;
        }
        return new path();
    }
    /**获取一个ui需要加载的资源包 */
    static getUIPackage(winName) {
        var cfgs = this.getWindowCfgs(winName);
        return cfgs.subPackage;
    }
    static openAdvMask() {
        var UIName = "advMaskUI";
        LogsManager_1.default.echo("zm 打开蒙版--------------------------");
        WindowManager.maskLayer.visible = true;
        if (WindowManager.UIInstance[UIName] == null) {
            WindowManager.UIInstance[UIName] = this.initMaskUI();
            WindowManager.UIInstance[UIName].width = ScreenAdapterTools_1.default.width;
            WindowManager.UIInstance[UIName].height = ScreenAdapterTools_1.default.height;
        }
        WindowManager.UIInstance[UIName].mouseEnabled = true;
        WindowManager.UIInstance[UIName].alpha = 0.5;
        WindowManager.maskLayer.mouseEnabled = true;
        WindowManager.maskLayer.mouseThrough = false;
        WindowManager.maskLayer.addChild(WindowManager.UIInstance[UIName]);
    }
    static closeAdvMask() {
        LogsManager_1.default.echo("zm 关闭蒙版--------------------------");
        var UIName = "advMaskUI";
        if (WindowManager.UIInstance[UIName] != null) {
            WindowManager.UIInstance[UIName].onClose && WindowManager.UIInstance[UIName].onClose();
            WindowManager.maskLayer.removeChild(WindowManager.UIInstance[UIName]);
        }
        if (!WindowManager.maskLayer.numChildren)
            WindowManager.maskLayer.visible = false;
    }
    //插入一个window
    static _insertWindow(view) {
        var index = this._allWindowMap.indexOf(view);
        if (index != -1) {
            this._allWindowMap.splice(index, 1);
        }
        this._allWindowMap.push(view);
    }
    //更新ui显示
    static updateUiVisible() {
        var len = this._allWindowMap.length;
        this._currentFullWindow = null;
        for (var i = len - 1; i >= 0; i--) {
            var win = this._allWindowMap[i];
            //显示这个ui 和他对应的modal
            win.visible = true;
            var cfg = this.getWindowCfgs(win.windowName);
            if (cfg.full) {
                this._currentFullWindow = win;
                for (var ii = i - 1; ii >= 0; ii--) {
                    var childWindow = this._allWindowMap[ii];
                    if (childWindow.parent && win.parent && childWindow.parent == win.parent) {
                        childWindow.visible = false;
                    }
                }
                break;
            }
        }
        var win = this._allWindowMap[len - 1];
    }
    //移除一个window
    static _removeOneWindow(windowName) {
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
        return this._currentFullWindow;
    }
    //取当前的window
    static getCurrentWindow() {
        if (this._allWindowMap.length == 0) {
            return null;
        }
        return this._allWindowMap[this._allWindowMap.length - 1];
    }
    //获取当前打开的所有界面
    static getallWindowMap() {
        return this._allWindowMap;
    }
    //在一个节点上创建View
    static CreateViewOnNode(windowName, node, pararms = {}) {
        var windowClass = WindowCfgs_1.WindowCfgs.windowcfgs[windowName].path;
        var view = new windowClass();
        view.setData(pararms);
        node.addChild(view);
        return view;
    }
}
exports.default = WindowManager;
WindowManager.tipsContent = [];
WindowManager.tipsObject = [];
WindowManager.expandTipsContent = [];
WindowManager.expandTipsObject = [];
WindowManager.tipsCount = 0;
WindowManager.updateTipsContent = [];
WindowManager.updateTipsObject = [];
WindowManager.updateTipsCount = 0;
WindowManager.maskCount = 0;
WindowManager.maskAlpha = 0;
WindowManager.isShowUpdateTip = false;
WindowManager._currentWindowName = "";
WindowManager._allWindowMap = [];
WindowManager.UIInstance = {};
WindowManager.uiMaker = LoadingUI_1.LoadingUI;
//# sourceMappingURL=WindowManager.js.map