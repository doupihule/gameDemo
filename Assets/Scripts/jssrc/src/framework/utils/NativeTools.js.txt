"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../manager/LogsManager");
class NativeTools {
    static downLoadFile(url, callBack, thisObj, isBin = false, progressFunc = null) {
        var conFileCl = window["conch_File"];
        var conFileReaderCl = window["conch_FileReader"];
        var f = new conFileCl(url);
        var fr = new conFileReaderCl();
        fr.setIgnoreError(true);
        fr.onload = () => {
            callBack.call(thisObj, fr.result);
        };
        fr.onerror = (e) => {
            LogsManager_1.default.warn('downLoadERROR ', e);
            //if (reject)
            //    reject(e); 
            // resolve(null);
            callBack.call(thisObj, null);
        };
        fr.onprogress = progressFunc;
        if (isBin)
            fr.readAsArrayBuffer(f);
        else
            fr.readAsText(f);
    }
}
exports.default = NativeTools;
//# sourceMappingURL=NativeTools.js.map