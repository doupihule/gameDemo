import BaseFunc from "../../../framework/func/BaseFunc";
import TranslateFunc from "../../../framework/func/TranslateFunc";

export default class AnaFunc extends BaseFunc {
	static _instance: AnaFunc;

	public static getInstance(): AnaFunc {
		if (!this._instance) {
			this._instance = new AnaFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "Ana_json"},
			{name: "TranslateAna_json"}
		]
	}

	// 获取一条随机的格言编号
	public getRandomAnaId() {
		return 1 + Math.round(Math.random() * 21);
	}

	// 根据id获取格言
	public getSentenceById(id: number) {
		var keys = this.getAnaDataByDoubleId(id, "sentence");
		return TranslateFunc.instance.getTranslate(keys, "TranslateAna_json")
	}

	// 根据id获取格言作者
	public getSpeakerById(id: number) {
		var keys = this.getAnaDataByDoubleId(id, "speaker");
		return TranslateFunc.instance.getTranslate(keys, "TranslateAna_json")

	}

	//获取字符串
	public getWordById(id: string) {
		return TranslateFunc.instance.getTranslate(id, "TranslateAna_json")
	}

	/**根据id获取配表内容 */
	getAnaDataByDoubleId(id, id2) {
		return this.getCfgDatasByKey("Ana_json", id, id2);
	}
}