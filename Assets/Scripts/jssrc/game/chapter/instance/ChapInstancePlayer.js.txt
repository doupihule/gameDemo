"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChapterInstanceMove_1 = require("./ChapterInstanceMove");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const ChapterFunc_1 = require("../../sys/func/ChapterFunc");
/**主角 */
class ChapInstancePlayer extends ChapterInstanceMove_1.default {
    constructor(fogControler) {
        super(fogControler);
        this.moveArr = [];
    }
    setData(data) {
        this.initStand();
    }
    /**移动到指定的点 */
    moveToTargetPos(target) {
        this.moveCount = 0;
        this.moveArr = target;
        this._myView.play(BattleConst_1.default.LABEL_WALK, true);
        this.moveToGroupPoints(target, ChapterFunc_1.default.playerSpeed, this.resetAni, this);
    }
    resetAni() {
        this._myView.play(BattleConst_1.default.LABEL_IDLE, true);
    }
    //到达一个点转身
    onArriveOnePoint() {
        this.setViewWay(-this.moveArr[this.moveCount].viewWay);
    }
    onArriveOne(type) {
    }
    //销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
    dispose() {
        this.removeSelf();
    }
    //从舞台移除
    onSetToCache() {
        this.removeSelf();
    }
}
exports.default = ChapInstancePlayer;
//# sourceMappingURL=ChapInstancePlayer.js.map