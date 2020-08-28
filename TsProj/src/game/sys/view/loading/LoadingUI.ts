import WindowManager from "../../../../framework/manager/WindowManager";
import IMessage from "../../interfaces/IMessage";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import BaseContainer from "../../../../framework/components/BaseContainer";
import ImageExpand from "../../../../framework/components/ImageExpand";
import LabelExpand from "../../../../framework/components/LabelExpand";

export class LoadingUI implements IMessage {
	private progress: number = 0;
	private isShowWxInfo: boolean = false;
	public static instance: LoadingUI;
	private alphaFlag = 1;

	constructor() {
		LoadingUI.instance = this;
		this.initView();
		this.mainbg.mouseThrough = false;
		this.mainbg.mouseEnabled = true;
	}

	public mainbg: ImageExpand;
	public clientVersionTxt: LabelExpand;
	public powerlaya: LabelExpand;
	public profgBg: ImageExpand;
	public profg: ImageExpand;
	public profgmask: BaseContainer;
	public loadingtips: LabelExpand;
	public loadingstar: ImageExpand;
	public loadingicon: ImageExpand;
	private aniGroup: ImageExpand;
	private roleAni;

	/**显示loading */
	showLoading() {
		if (this.mainbg) {
			WindowManager.topUILayer.addChild(this.mainbg);
		}
		if (WindowManager.topUILayer.numChildren > 0) {
			WindowManager.topUILayer.mouseEnabled = true;
		}
	}

	/**隐藏loading */
	hideLoading() {
		if (this.mainbg) {
			WindowManager.topUILayer.removeChild(this.mainbg);
		}
		if (WindowManager.topUILayer.numChildren == 0) {
			WindowManager.topUILayer.mouseEnabled = false;
		}
	}

	public initView() {

	}

	public setData(): void {
	}

	private loadingFlash() {
		if (this.alphaFlag) {
			this.loadingtips.alpha -= 0.1;
		} else {
			this.loadingtips.alpha += 0.1;
		}
		if (this.loadingtips.alpha >= 0.95) {
			this.alphaFlag = 1;
		}
		if (this.loadingtips.alpha <= 0.05) {
			this.alphaFlag = 0;
		}
	}

	private onLoop(): void {
		if (this.progress + 1 < 95) {
			this.progress += 1;
		}


		if (this.progress >= 100) {
			this.progress = 100;
			Laya.timer.clearAll(LoadingUI.instance);
		} else {
		}

	}


	public setProgress(progress: number): void {
		console.log("Loading Progress is : " + progress);
		this.progress = (Number)((progress * 100).toFixed(2));
		this.onLoop();
	}

	public addProgress(progress) {
		this.progress += progress;
	}

	public getProgress() {
		return this.progress;
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
		}
	}

	/**获取竖直方向上坐标差 */
	getVerticalOffset() {
		var offset = (1400 - ScreenAdapterTools.height) * 0.5;
		if (offset < 0) {
			offset = 0;
		}
		return offset;
	}

	/**获取水平方向上坐标差 */
	getHorizontalOffset() {
		var offset = (768 - ScreenAdapterTools.width) * 0.5;
		if (offset < 0) {
			offset = 0;
		}
		return offset;
	}

}
