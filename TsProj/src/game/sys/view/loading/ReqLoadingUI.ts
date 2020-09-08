import BaseContainer from "../../../../framework/components/BaseContainer";
import ViewTools from "../../../../framework/components/ViewTools";
import TweenTools from "../../../../framework/components/TweenTools";
import TimerManager from "../../../../framework/manager/TimerManager";
import GlobalData from "../../../../framework/utils/GlobalData";
import LabelExpand from "../../../../framework/components/LabelExpand";


export default class ReqLoadingUI extends BaseContainer {
	public static res = null;
	private rollAsset:LabelExpand;

	constructor() {
		super();
		this.rollAsset = ViewTools.createLabel("loading...",100,30,24);
		this.rollAsset.setColor(0xff,0xff,0xff);
		this.rollAsset.set2dPos(GlobalData.uiRoot.width - 150,GlobalData.uiRoot.height - 50);
		this.addChild(this.rollAsset);

		this.mouseEnabled = true;
		this.mouseThrough = false;
		this.setSize(640,1136);
	}

	public setData(data): void {
		this.rollAsset.visible = false;
		TimerManager.instance.setTimeout(() => {
			this.rollAsset.visible = true;
			this.rollAsset.alpha = 0;
			TweenTools.tweenTo(this.rollAsset, {alpha: 1}, 500, null, this.onTween1,this);
		},this,1);
	}

	private onTween1(): void {
		this.rollAsset.alpha = 1;
		TweenTools.tweenTo(this.rollAsset, {alpha: 0}, 2000, null,this.onTween2,this);
		TweenTools.clearTween(this.onTween1);
	}

	private onTween2(): void {
		this.rollAsset.alpha = 0;
		TweenTools.tweenTo(this.rollAsset, {alpha: 1}, 2000, null,this.onTween1,this);
		TweenTools.clearTween(this.onTween2);
	}
}