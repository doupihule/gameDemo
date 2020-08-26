import LogsManager from "../manager/LogsManager";

export default class NativeTools {


	public static downLoadFile(url, callBack: Function, thisObj: any, isBin: boolean = false, progressFunc: Function = null) {

		var conFileCl = window["conch_File"]
		var conFileReaderCl = window["conch_FileReader"]

		var f = new conFileCl(url);
		var fr = new conFileReaderCl();
		fr.setIgnoreError(true);
		fr.onload = () => {
			callBack.call(thisObj, fr.result);
		};
		fr.onerror = (e) => {
			LogsManager.warn('downLoadERROR ', e);
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