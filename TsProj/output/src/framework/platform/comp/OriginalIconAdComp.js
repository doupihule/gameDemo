"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OriginalAdBaseComp_1 = require("./OriginalAdBaseComp");
const ChannelConst_1 = require("../../../game/sys/consts/ChannelConst");
const UserInfo_1 = require("../../common/UserInfo");
const GameSwitch_1 = require("../../common/GameSwitch");
class OriginalIconAdComp extends OriginalAdBaseComp_1.default {
    constructor() {
        super(...arguments);
        this.logName = 'original_icon';
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new OriginalIconAdComp();
        }
        return this._instance;
    }
    get adOriginalIds() {
        if (!this._adOriginalIds) {
            if (ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adOriginalIconIds) {
                this._adOriginalIds = (String(ChannelConst_1.default.getChannelConst(UserInfo_1.default.platformId).adOriginalIconIds)).split("|");
            }
            if (GameSwitch_1.default.getSwitchState(GameSwitch_1.default.ORIGIN_ICON_ID)) {
                this._adOriginalIds = (String(GameSwitch_1.default.getSwitchState(GameSwitch_1.default.ORIGIN_ICON_ID))).split("|");
                ;
            }
        }
        return this._adOriginalIds;
    }
}
exports.default = OriginalIconAdComp;
//# sourceMappingURL=OriginalIconAdComp.js.map