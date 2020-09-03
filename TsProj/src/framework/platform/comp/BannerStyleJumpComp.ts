import {BannerComp} from './BannerComp';

import IMessage from "../../../game/sys/interfaces/IMessage";
import Message from "../../common/Message";
import WindowEvent from "../../event/WindowEvent";
import JumpManager from "../../manager/JumpManager";
import WindowManager from "../../manager/WindowManager";
import KariquShareConst from "../../consts/KariquShareConst";

export default class BannerStyleJumpComp implements IMessage {
	/**
	 *
	 * banner样式的互推组件
	 */
	private static _instance: BannerStyleJumpComp;

	public static get instance() {
		if (!this._instance) {
			this._instance = new BannerStyleJumpComp();
		}
		return this._instance;
	}

	//互推页的高度
	public static jumpHeight: number = 170


	//ui对应的jumpMap
	/**
	 * 0 表示底部的数据  1表示顶部的
		uiCfg:
	 *      ui名字:{
	 *          state:  1 显示, 0关闭
	 *          onErrorCallback: 没有互推数据时的回调
	 *          thisObj: this指针
	 *      }
	 * dataType:采用的数据源id
	 * ui:对应的JumpUI
	 */
	private _uiJumpMap: any[] = [
		{ui: null, uiCfg: {}, dataType: 22, jumpData: null},
		{ui: null, uiCfg: {}, dataType: 22, jumpData: null}
	]

	public constructor() {
		Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);
		var uiinfo: any = this._uiJumpMap[0];
	}

	public init() {
		if (KariquShareConst.isOpenBannerStyleJump) {
			//如果开banner转互推 那么不做banner缓存
			if (BannerComp.platformToCacheBannerNumsMap) {
				BannerComp.platformToCacheBannerNumsMap.wxgame = 0;
			}

		}

	}

	private onJumpDataBack() {

	}

	private _jumpData: any[];

	//检查ui状态
	private _checkUIState() {
		var currentUIName = WindowManager.getCurrentWindowName();
		//如果没有互推数据
		if (!this.checkHasJumpData()) {
			return;
		}

		for (var i = 0; i < this._uiJumpMap.length; i++) {
			var uiInfo = this._uiJumpMap[i];
			var uiCfg = uiInfo.uiCfg;
			var currentInfo = uiCfg[currentUIName];
			var jumpui: any = uiInfo.ui

			//如果当前界面不展示互推
			if (!currentInfo) {
				jumpui.removeSelf();
			} else {
				//如果这个ui的状态是显示的
				if (currentInfo.state == 1) {
					var ui = WindowManager.getCurrentWindow();
					ui.addChild(jumpui);
					if (!uiInfo.jumpData) {
						uiInfo.jumpData = JumpManager.getMokaDataByType(uiInfo.dataType);
						jumpui.initData(uiInfo.jumpData, ui.windowName);
					}
				} else {
					jumpui.removeSelf();
				}
			}
		}


	}

	//判断是否有互推数据
	private checkHasJumpData() {
		if (!JumpManager.data || JumpManager.data.length == 0) {
			return false;
		}
		return true;
	}


	//接受事件
	public recvMsg(cmd: string, params: any) {
		if (cmd == WindowEvent.WINDOW_EVENT_SWITCHUIFIN) {
			this._checkUIState();
		}
	}


	//显示一个 jumpUI
	/**
	 *
	 * @param parent  传入ui
	 * @param onErrorCallback 错误回调
	 * @param callbackObj
	 * @param params
	 */
	public showJump(parent, onErrorCallback = null, callbackObj = null, params: any = null) {
		this.showJumpByIndex(0, parent, onErrorCallback, callbackObj, params);
	}

	//显示 顶部jump
	public showShowTopJump(parent, onErrorCallback = null, callbackObj = null, params: any = null) {
		this.showJumpByIndex(1, parent, onErrorCallback, callbackObj, params);
	}

	//index 0是底部 ,1是顶部
	private showJumpByIndex(index: number, parent, onErrorCallback = null, callbackObj = null, params: any = null) {
		JumpManager.initJumpData(this.onJumpDataBack, this);
		var uiName = parent.windowName;
		var jumpInfo = this._uiJumpMap[index];
		var uiCfg = jumpInfo.uiCfg;
		if (!uiCfg[uiName]) {
			uiCfg[uiName] = {state: 1, onErrorCallback: onErrorCallback, thisObj: callbackObj, params: params};
		}
		this._checkUIState();
	}

	//关闭一个ui
	public closeDownJump(parent) {
		this.closeJumpByIndex(0, parent);
	}

	//关闭顶部jump
	public closeTopJump(parent) {
		this.closeJumpByIndex(1, parent);
	}

	//根据序号关闭某个界面的jump 0是底部,1是顶部
	private closeJumpByIndex(index: number, parent) {
		var uiName = parent.windowName;
		var jumpInfo = this._uiJumpMap[index];
		var uiCfg = jumpInfo.uiCfg;
		delete uiCfg[uiName];
		this._checkUIState();
	}

}