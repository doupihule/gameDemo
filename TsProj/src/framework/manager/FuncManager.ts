import BaseFunc from "../func/BaseFunc";
import ErrCodeManager from "./ErrCodeManager";
import {LoadManager} from "./LoadManager";
import {LoadZipManager} from "./LoadZipManager";
import LogsManager from "./LogsManager";
import FileUtils from "../utils/FileUtils";
import VersionManager from "./VersionManager";
import SubPackageManager from "./SubPackageManager";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import GameUtils from "../../utils/GameUtils";

export default class FuncManager {
	public static init(callback, thisobj): void {
		var t1 = Laya.Browser.now();
		var onZipComeplete = () => {
			var congfigName = BaseFunc._globalConfigsName;
			if (GameUtils.isReview) {
				congfigName = BaseFunc._globalConfigsReviewName;
			}
			LoadManager.instance.load([congfigName], Laya.Handler.create(this, () => {
				BaseFunc.onConfigGroupLoadComplete();
				BaseFunc.onTranslateGroupLoadComplete();
				ErrCodeManager.ins.initConfig();
				if (callback) {
					callback.call(thisobj);
				}
				LogsManager.echo("xd__下载加解析配表总耗时", Laya.Browser.now() - t1);
			}), null, Laya.Loader.JSON);

		}
		//如果使用zip压缩功能的
		if (FileUtils.checkIsUseZip()) {
			LoadZipManager.instance.loadZip("json.zip", VersionManager.ZIP_MODEL_KEY_CONFIG, new Laya.Handler(this, onZipComeplete), null);
		} else {
			var packName_json = SubPackageConst.packName_json;
			if (GameUtils.isReview) {
				packName_json = SubPackageConst.packName_jsonreview;
			}
			//如果是走分包的
			if (SubPackageManager.getModelFileStyle(packName_json) == SubPackageConst.PATH_STYLE_SUBPACK) {
				SubPackageManager.loadSubPackage(packName_json, onZipComeplete, this, true);
			} else {
				onZipComeplete();
			}

		}


		// LoadZipManager.instance.loadZip("megrefiles.zip","dasdasd",null,null);


	}
}