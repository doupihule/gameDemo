"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../ui/layaMaxUI");
class MainScene extends layaMaxUI_1.ui.MainSceneUI {
    constructor() {
        super();
        MainScene.instance = this;
    }
    recvMsg(e) {
    }
}
exports.default = MainScene;
//# sourceMappingURL=MainScene.js.map