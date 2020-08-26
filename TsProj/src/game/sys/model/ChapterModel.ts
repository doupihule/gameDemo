import BaseModel from "./BaseModel";
import ChapterFunc from "../func/ChapterFunc";
import UserModel from "./UserModel";

/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
export default class ChapterModel extends BaseModel {
	public constructor() {
		super();
	}

	private static _instance: ChapterModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new ChapterModel()
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);
	}

	getData(): SCChapterData {
		return this._data;
	}

	/**获取某章某个位置的宝箱是否领取 */
	getChapterRewardBox(chapterId, index) {
		var data = this.getData();
		return data && data.rewardBox && data.rewardBox[chapterId] && data.rewardBox[chapterId][index]
	}

	getRewardByChapter(chapterId) {
		var data = this.getData();
		return data && data.rewardBox && data.rewardBox[chapterId]
	}

	/**是否显示领取奖励红点 */
	getIsShowRedByChapter(chapter) {
		var canReceive = 0
		var box = ChapterFunc.instance.getCfgDatasByKey("Chapter", chapter, "box");
		var level = UserModel.instance.getMaxBattleLevel();
		var map = ChapterFunc.instance.getUnlockTab();
		for (var i = 0; i < box.length; i++) {
			var item = box[i].split(",");
			if (Number(item[2]) + map[chapter] <= level) {
				canReceive += 1;
			}
		}
		var modelData = ChapterModel.instance.getRewardByChapter(chapter);
		if (!modelData) {
			if (canReceive > 0) return true;
		} else {
			if (canReceive > Object.keys(modelData).length) {
				return true;
			}
		}
		return false;
	}
}
