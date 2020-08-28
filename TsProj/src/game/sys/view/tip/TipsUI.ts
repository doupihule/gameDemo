import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import BaseContainer from "../../../../framework/components/BaseContainer";
import UIBaseView from "../../../../framework/components/UIBaseView";
import ViewTools from "../../../../framework/components/ViewTools";
import LabelExpand from "../../../../framework/components/LabelExpand";

export default class TipsUI extends UIBaseView {
	private showList;
	private tipsbg: BaseContainer;
	private tips: LabelExpand;

	public static res = [];

	constructor() {
		super();
		this.tipsbg = ViewTools.createContainer();
		this.tipsbg.alpha = 0.5;
		this.tipsbg.mouseEnabled = true;
		this.tipsbg.mouseThrough = false;
		this.tipsbg.setSize(543, 97);
		this.tipsbg.y = 1207;
		this.addChild(this.tipsbg);
		this.tips = ViewTools.createLabel("",100,50,30)
		this.tips.setColor(0xff,0xff,0xff)
		this.tips.setPos(this.tipsbg.width / 2, 30);
		this.tipsbg.addChild(this.tips);
	}

	// private ignoreSound = ["购买成功"];

	public setData(data): void {
		// if (this.ignoreSound.indexOf(data) == -1)
		//     SoundManager.playSE(MusicConst.SOUND_ERROR_TIPS);
		//TODO 适配
		this.tipsbg.y = ScreenAdapterTools.designHeight * 0.5;
		this.tipsbg.alpha = 0;
		Laya.Tween.to(this.tipsbg, {alpha: 1, y: ScreenAdapterTools.designHeight * 0.5 - 100}, 500);
		this.tips.text = data;
		var wid = (this.tips.width + 100) > 455 ? (this.tips.width + 100) : 455;
		this.tipsbg.setSize(wid,this.tipsbg.height);
		this.tipsbg.x = ScreenAdapterTools.width / 2 - this.tipsbg.width / 2;
		this.tips.x = this.tipsbg.width * 0.5;
		Laya.timer.once(1000, this, () => {
			Laya.Tween.to(this.tipsbg, {alpha: 0}, 500);
		})
	}
}

