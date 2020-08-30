import FogInstanceBasic from "../../fog/instance/FogInstanceBasic";
import ChapterConst from "../../sys/consts/ChapterConst";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import ChapterFunc from "../../sys/func/ChapterFunc";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import ShareTvOrderFunc from "../../sys/func/ShareTvOrderFunc";
import ImageExpand from "../../../framework/components/ImageExpand";

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
	}

	/**刷新宝箱状态 */
	freshInfo() {
	}

	//销毁函数.
	public dispose() {

	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}