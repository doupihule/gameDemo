"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const ChapterFunc_1 = require("../func/ChapterFunc");
const UserModel_1 = require("./UserModel");
/*
* Author: TODO
* Date:2019-06-27
* Description: TODO
*/
class ChapterModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new ChapterModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    getData() {
        return this._data;
    }
    /**获取某章某个位置的宝箱是否领取 */
    getChapterRewardBox(chapterId, index) {
        var data = this.getData();
        return data && data.rewardBox && data.rewardBox[chapterId] && data.rewardBox[chapterId][index];
    }
    getRewardByChapter(chapterId) {
        var data = this.getData();
        return data && data.rewardBox && data.rewardBox[chapterId];
    }
    /**是否显示领取奖励红点 */
    getIsShowRedByChapter(chapter) {
        var canReceive = 0;
        var box = ChapterFunc_1.default.instance.getCfgDatasByKey("Chapter", chapter, "box");
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var map = ChapterFunc_1.default.instance.getUnlockTab();
        for (var i = 0; i < box.length; i++) {
            var item = box[i].split(",");
            if (Number(item[2]) + map[chapter] <= level) {
                canReceive += 1;
            }
        }
        var modelData = ChapterModel.instance.getRewardByChapter(chapter);
        if (!modelData) {
            if (canReceive > 0)
                return true;
        }
        else {
            if (canReceive > Object.keys(modelData).length) {
                return true;
            }
        }
        return false;
    }
}
exports.default = ChapterModel;
//# sourceMappingURL=ChapterModel.js.map