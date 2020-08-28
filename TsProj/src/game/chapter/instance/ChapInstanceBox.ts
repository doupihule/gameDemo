import FogInstanceBasic from "../../fog/instance/FogInstanceBasic";
import {ButtonUtils} from "../../../framework/utils/ButtonUtils";
import UserModel from "../../sys/model/UserModel";
import ResourceConst from "../../sys/consts/ResourceConst";
import ChapterModel from "../../sys/model/ChapterModel";
import ChapterConst from "../../sys/consts/ChapterConst";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import ChapterFunc from "../../sys/func/ChapterFunc";
import TimerManager from "../../../framework/manager/TimerManager";
import ChapterServer from "../../sys/server/ChapterServer";
import TweenAniManager from "../../sys/manager/TweenAniManager";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import {DataResourceConst} from "../../sys/func/DataResourceFunc";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import ShareTvOrderFunc from "../../sys/func/ShareTvOrderFunc";

/**章节宝箱 */
export default class ChapInstanceBox extends FogInstanceBasic {
	private boxImg: ImageExpand;
	private redImg: ImageExpand;
	private boxIndex: number;
	public type: number;
	private reward: any[];
	private passLevel: string;
	public levelId: number;
	private timeCode = 0;
	public viewWay: number;
	private boxId: any;
	private boxParent: ImageExpand;

	constructor(fogControler) {
		super(fogControler);
		this.anchorX = 0.5;
		this.anchorY = 1;
		this.width = 200;
		this.height = 200;
		this.boxImg = ViewTools.createImage();
		this.boxImg.anchorX = 0.5;
		this.boxImg.anchorY = 0.5;
		this.boxImg.width = 79;
		this.boxImg.height = 95;
		this.boxImg.x = this.width / 2;
		this.boxImg.y = this.height - this.boxImg.height / 2;
		this.boxParent = ViewTools.createImage();
		this.boxParent.anchorX = 0.5;
		this.boxParent.anchorY = 1;
		this.boxParent.width = 200;
		this.boxParent.height = 200;
		this.redImg = ViewTools.createImage(ResourceConst.COMMON_REDPOINT);
		this.redImg.x = this.boxImg.x + this.boxImg.width / 2;
		this.redImg.y = this.boxImg.y - this.boxImg.height / 2;
		this.boxParent.x = this.width / 2;
		this.boxParent.y = this.height
		this.boxParent.addChild(this.boxImg)
		this.addChild(this.boxParent)
		this.addChild(this.redImg)
		new ButtonUtils(this, this.onClickItem, this)

	}

	public setData(data) {
		this.boxIndex = data.index;
		this.boxId = data.boxId;
		this.reward = ChapterFunc.instance.getCfgDatasByKey("ChapterBox", this.boxId, "reward");
		this.passLevel = this.fogControler.chapterId + "-" + data.startIndex;
		this.type = ChapterConst.Chapter_boxState_lock;
		this.levelId = data.levelId;
		this.freshInfo();

	}

	/**设置方向 */
	public setItemViewWay(value) {
		this.viewWay = value;
		this.boxParent.scaleX = value
	}

	onClickItem() {
		var desc = TranslateFunc.instance.getTranslate("#tid_chapter_boxReceiveTip", null, this.passLevel)
		WindowManager.OpenUI(WindowCfgs.ChapterBoxRewardUI, {
			shareName: ShareTvOrderFunc.SHARELINE_CHAPTERBOX_REWARD,
			doubleRate: ChapterFunc.ChapterBoxDouble,
			type: this.type,
			desc: desc,
			reward: this.reward,
			thisObj: this,
			callBack: this.receiveReward,
			params: {chapterId: this.fogControler.chapterId, boxId: this.boxId}
		})
	}

	//记录宝箱的领取状态
	receiveReward() {
		ChapterServer.updateBoxState({
			chapterId: this.fogControler.chapterId,
			boxId: this.boxIndex
		}, this.freshInfo, this);
		this.fogControler.doPlayerMove();
		this.doFly();
	}

	doFly() {
		var fromX = this.x - (ScreenAdapterTools.maxWidth - ScreenAdapterTools.designWidth) / 2 + ScreenAdapterTools.UIOffsetX + ScreenAdapterTools.sceneOffsetX;
		var fromY = this.y + this.fogControler.chapterLayerControler.a2.y
		var target;
		var txt;
		var ui = this.fogControler.chapMapUI
		for (var i = 0; i < this.reward.length; i++) {
			var item = this.reward[i].split(",")
			if (Number(item[0]) == DataResourceConst.COIN) {
				target = ui.coinImg
				txt = ui.coinNum
			} else if (Number(item[0]) == DataResourceConst.GOLD) {
				target = ui.goldImg
				txt = ui.goldNum

			} else if (Number(item[0]) == DataResourceConst.SP) {
				target = ui.spImg
				txt = ui.powerCountLab
			}
			TweenAniManager.instance.resourceFlyAni(item, fromX, fromY, ui, target, txt)
		}
	}

	/**刷新宝箱状态 */
	freshInfo() {
		this.boxImg.skin = ResourceConst.CHAPTER_REWARD_BOXCLOSE;
		this.redImg.visible = false;
		TimerManager.instance.remove(this.timeCode);
		Laya.Tween.clearTween(this.boxImg);
		this.boxImg.rotation = 0;
		if (this.levelId <= UserModel.instance.getMaxBattleLevel()) {
			//已解锁
			var isReceive = ChapterModel.instance.getChapterRewardBox(this.fogControler.chapterId, this.boxIndex);
			if (isReceive) {
				//已领取
				this.boxImg.skin = ResourceConst.CHAPTER_REWARD_BOXOPEN;
				this.type = ChapterConst.Chapter_boxState_receive;
			} else {
				//未领取
				this.redImg.visible = true;
				this.type = ChapterConst.Chapter_boxState_unlock;
				this.timeCode = TimerManager.instance.add(this.fogControler.scaleAni, this, 1400, Number.MAX_VALUE, false, [this.boxImg])
			}
		}
	}

	//销毁函数.
	public dispose() {
		TimerManager.instance.remove(this.timeCode);
		Laya.Tween.clearTween(this.boxImg);
		this.removeSelf();
		this.fogControler = null;

	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}