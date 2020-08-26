import BaseFunc from "../../../framework/func/BaseFunc";
import GlobalParamsFunc from "./GlobalParamsFunc";
import BattleFunc from "./BattleFunc";


export default class ChapterFunc extends BaseFunc {

	private unlockLevel: any;
	//章节列表上角色spine缩放
	public static chapterListScale = 0.75;
	//章节地图上角色spine
	public static chapterMapScale = 1.5;
	public static ChapterBoxDouble = 2;
	public static playerSpeed = 180;

	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Chapter_json"},
			{name: "ChapterSite_json"},
			{name: "ChapterBox_json"}
		];
	}

	static _instance: ChapterFunc;
	static get instance() {
		if (!this._instance) {
			this._instance = new ChapterFunc();
			this.initGlobalParams();
		}
		return this._instance;
	}

	/**获取章节开启关卡 */
	getUnlockLevelByChapter(chapter) {
		if (!this.unlockLevel) {
			this.unlockLevel = {};
			var data = this.getAllCfgData("Chapter");
			var unlockLevel = 0;
			for (var key in data) {
				var element = data[key];
				this.unlockLevel[key] = unlockLevel;
				unlockLevel += element.levelNumber;
			}
		}
		return this.unlockLevel[chapter];

	}

	getUnlockTab() {
		if (!this.unlockLevel) {
			this.getUnlockLevelByChapter(1);
		}
		return this.unlockLevel;
	}

	//初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
	public static initGlobalParams() {
		this.chapterListScale = GlobalParamsFunc.instance.getDataNum("roleSizeInChapterList") / 10000;
		this.chapterMapScale = GlobalParamsFunc.instance.getDataNum("roleSizeInChapter") / 10000;
		this.ChapterBoxDouble = GlobalParamsFunc.instance.getDataNum("chapterBoxDouble");
		this.playerSpeed = BattleFunc.instance.turnSpeedToFrame(GlobalParamsFunc.instance.getDataNum("playerSpeed"));
	}

	/**根据等级得到开启条件 */
	getOpenConditionByLevel(level) {
		this.getUnlockTab();
		var result = "";
		var chapter;
		for (var key in this.unlockLevel) {
			var curLevel = this.unlockLevel[key];
			if (level > curLevel) {
				if (this.unlockLevel[Number(key) + 1]) {
					if (level <= this.unlockLevel[Number(key) + 1]) {
						chapter = key;
					}
				} else {
					chapter = key;
				}
			}
		}
		result = chapter + "-" + (level - this.unlockLevel[chapter])
		return result;
	}

}
