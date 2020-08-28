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
import Client from "../common/kakura/Client";

export default class FuncManager {
	public static init(callback, thisobj): void {
		var t1 =Client.instance.miniserverTime
		BaseFunc.onConfigGroupLoadComplete();
		BaseFunc.onTranslateGroupLoadComplete();
		ErrCodeManager.ins.initConfig();
		if (callback) {
			callback.call(thisobj);
		}


		// LoadZipManager.instance.loadZip("megrefiles.zip","dasdasd",null,null);


	}
}