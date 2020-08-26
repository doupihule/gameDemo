import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import TimerManager from "../../../../framework/manager/TimerManager";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import TweenAniManager from "../../manager/TweenAniManager";

/**迷雾街区入场漫画 */
export default class FogCartoonPicUI extends ui.gameui.cartoon.FogCartoonPicUI implements IMessage {

	private curIndex = 1;
	private totalNum = 7;
	private timeOffest = 500;
	private timeOut = 0;

	constructor() {
		super();
		this.initBtn();
	}

	initBtn() {
		//  this.on(Laya.Event.MOUSE_DOWN, this, this.onClickBg);
		new ButtonUtils(this.skipTxt, this.onClickSkip, this);
	}

	//初始化
	setData() {
		this.skipTxt.visible = false;

		this.timeOffest = 1500;//GlobalParamsFunc.instance.getDataNum("comicPlayTime");
		this.curIndex = 1;
		this.timeOut = 0;
		this.loadResBack();
	}

	loadResBack() {
		//界面内容初始化
		for (var i = 1; i <= this.totalNum; i++) {
			var item = this.picCtn.getChildByName("item" + i) as Laya.Image;
			item.alpha = 0;
			var txt = item.getChildByName("txt" + i) as Laya.Image;
			if (txt) {
				txt.alpha = 0;
			}

			//自动出现
			TimerManager.instance.setTimeout((data) => {
				var delay = 0
				if (this.curIndex != 1) {
					delay = this.timeOffest - 500;
				}

				if (data.item.alpha == 0 && data.item.skin != "") {
					TweenAniManager.instance.fadeInAni(data.item, null, delay);
				}

				if (this.curIndex == this.totalNum) {
					TimerManager.instance.setTimeout(this.onClickSkip, this, 3000);
				}
			}, this, this.timeOut, {item: item});
			this.timeOut += this.timeOffest;
			TimerManager.instance.setTimeout((txt) => {
				if (txt.alpha == 0) {
					TweenAniManager.instance.fadeInAni(txt, null, this.timeOffest - 500);
					this.curIndex += 1;
				}
			}, this, this.timeOut, txt);
			this.timeOut += this.timeOffest;

		}

		TimerManager.instance.setTimeout(() => {
			this.skipTxt.visible = true;
		}, this, 1000);
	}

	//点击出现下一张
	onClickBg() {
		if (this.curIndex >= this.totalNum) {
			this.onClickSkip();
			return;
		}

		this.curIndex += 1;
		var item = this.picCtn.getChildByName("item" + this.curIndex) as Laya.Image;
		item.alpha = 1;
		var txt = item.getChildByName("txt" + this.curIndex) as Laya.Image;
		if (txt) {
			TweenAniManager.instance.fadeInAni(txt, null, 2000);
		}
	}

	//点击跳过，直接打开入场初始化角色界面
	onClickSkip() {
		if ("FogCartoonPicUI" == WindowManager.getCurrentWindowName()) {
			WindowManager.SwitchUI([WindowCfgs.FogMainUI, WindowCfgs.FogInitRoleUI], [WindowCfgs.FogCartoonPicUI]);
		}
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogCartoonPicUI);
	}

	clear() {

	}

	dispose() {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

}