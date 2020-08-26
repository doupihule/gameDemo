"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
const BattleFunc_1 = require("./BattleFunc");
class ChapterFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Chapter_json" },
            { name: "ChapterSite_json" },
            { name: "ChapterBox_json" }
        ];
    }
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
    static initGlobalParams() {
        this.chapterListScale = GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInChapterList") / 10000;
        this.chapterMapScale = GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInChapter") / 10000;
        this.ChapterBoxDouble = GlobalParamsFunc_1.default.instance.getDataNum("chapterBoxDouble");
        this.playerSpeed = BattleFunc_1.default.instance.turnSpeedToFrame(GlobalParamsFunc_1.default.instance.getDataNum("playerSpeed"));
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
                }
                else {
                    chapter = key;
                }
            }
        }
        result = chapter + "-" + (level - this.unlockLevel[chapter]);
        return result;
    }
}
exports.default = ChapterFunc;
//章节列表上角色spine缩放
ChapterFunc.chapterListScale = 0.75;
//章节地图上角色spine
ChapterFunc.chapterMapScale = 1.5;
ChapterFunc.ChapterBoxDouble = 2;
ChapterFunc.playerSpeed = 180;
//# sourceMappingURL=ChapterFunc.js.map