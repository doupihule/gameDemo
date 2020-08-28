import BaseContainer from "../../../../framework/components/BaseContainer";
import ViewTools from "../../../../framework/components/ViewTools";

;

export default class ReqLoadingUI extends BaseContainer {
	public static res = null;
	private rollAsset;

	constructor() {
		super();
		this.rollAsset = ViewTools.createLabel("loading...");
		this.rollAsset.color = "#ffffff";
		this.rollAsset.fontSize = 24;
		this.rollAsset.x = GlobalEnv.uiRoot.width - 150;
		this.rollAsset.y = GlobalEnv.uiRoot.height - 50;
		this.addChild(this.rollAsset);

		this.mouseEnabled = true;
		this.mouseThrough = false;
		this.setSize(640,1136);
	}

	public setData(data): void {
		this.rollAsset.visible = false;
		Laya.timer.once(1, this, () => {
			this.rollAsset.visible = true;
			this.rollAsset.alpha = 0;
			Laya.Tween.to(this.rollAsset, {alpha: 1}, 500, null, Laya.Handler.create(this, this.onTween1));
		});
	}

	private onTween1(): void {
		this.rollAsset.alpha = 1;
		Laya.Tween.to(this.rollAsset, {alpha: 0}, 2000, null, Laya.Handler.create(this, this.onTween2));
		Laya.Tween.clearTween(this.onTween1);
	}

	private onTween2(): void {
		this.rollAsset.alpha = 0;
		Laya.Tween.to(this.rollAsset, {alpha: 1}, 2000, null, Laya.Handler.create(this, this.onTween1));
		Laya.Tween.clearTween(this.onTween2);
	}
}