"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../func/BaseFunc");
const ErrCodeManager_1 = require("./ErrCodeManager");
const LoadManager_1 = require("./LoadManager");
const LoadZipManager_1 = require("./LoadZipManager");
const LogsManager_1 = require("./LogsManager");
const FileUtils_1 = require("../utils/FileUtils");
const VersionManager_1 = require("./VersionManager");
const SubPackageManager_1 = require("./SubPackageManager");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
const GameUtils_1 = require("../../utils/GameUtils");
class FuncManager {
    static init(callback, thisobj) {
        var t1 = Laya.Browser.now();
        var onZipComeplete = () => {
            var congfigName = BaseFunc_1.default._globalConfigsName;
            if (GameUtils_1.default.isReview) {
                congfigName = BaseFunc_1.default._globalConfigsReviewName;
            }
            LoadManager_1.LoadManager.instance.load([congfigName], Laya.Handler.create(this, () => {
                BaseFunc_1.default.onConfigGroupLoadComplete();
                BaseFunc_1.default.onTranslateGroupLoadComplete();
                ErrCodeManager_1.default.ins.initConfig();
                if (callback) {
                    callback.call(thisobj);
                }
                LogsManager_1.default.echo("xd__下载加解析配表总耗时", Laya.Browser.now() - t1);
            }), null, Laya.Loader.JSON);
        };
        //如果使用zip压缩功能的
        if (FileUtils_1.default.checkIsUseZip()) {
            LoadZipManager_1.LoadZipManager.instance.loadZip("json.zip", VersionManager_1.default.ZIP_MODEL_KEY_CONFIG, new Laya.Handler(this, onZipComeplete), null);
        }
        else {
            var packName_json = SubPackageConst_1.default.packName_json;
            if (GameUtils_1.default.isReview) {
                packName_json = SubPackageConst_1.default.packName_jsonreview;
            }
            //如果是走分包的 
            if (SubPackageManager_1.default.getModelFileStyle(packName_json) == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
                SubPackageManager_1.default.loadSubPackage(packName_json, onZipComeplete, this, true);
            }
            else {
                onZipComeplete();
            }
        }
        // LoadZipManager.instance.loadZip("megrefiles.zip","dasdasd",null,null);
    }
}
exports.default = FuncManager;
//# sourceMappingURL=FuncManager.js.map