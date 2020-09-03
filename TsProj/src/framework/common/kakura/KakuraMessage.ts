import KakuraPackage from "./KakuraPackage";

export default class KakuraMessage {

	private static _instance: KakuraMessage;
	//32是不加密不加锁 1是加密不压缩
	static MESSAGE_NO_ENC: number = 32;
	static MESSAGE_FIX_ENC_NO_COMPRESS = 11;
	static MESSAGE_DYNAMIC_ENC_NO_COMPRESS = 12;
	static MESSAGE_HAS_ENC: number = 1;

	private _messageType: number;

	private defaultAesKey: string = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";

	//消息头的长度, 不包含messagetype .
	private headlength: number = 13;
	private _lastSendTime: number = 0;

	public constructor() {
	}

	static get instance(): KakuraMessage {
		if (!this._instance) {
			this._instance = new KakuraMessage();
		}

		return this._instance;
	}

	//获取一个随机key
	private getOneRandomAeskey(num: number) {
		var len: number = this.defaultAesKey.length;
		var resultStr: string = "";
		for (var i = 0; i < num; i++) {
			var index: number = Math.floor(Math.random() * len);
			resultStr += this.defaultAesKey.substr(index, 1);
		}
		return resultStr;
	}

	setMessageType(type: number): void {
		this._messageType = type;
	}

	addPackage(opcode: number, requestId: number, uniqueReqId: string, sendData: string, callback?: any, thisObj?: any) {
		var pack: KakuraPackage = new KakuraPackage();
		pack.opcode = opcode;
		pack.requestId = (requestId);

		pack.len = sendData.length * 3;//this.countBufferLen(sendData);
		pack.uniqueReqIdLen = uniqueReqId.length;
		pack.uniqueReqId = uniqueReqId;
		pack.sendData = sendData;
		return pack;

	}


	encode(requestBuffer: string, aesKey: string, pack: KakuraPackage) {
		// 单个请求数据包 * PACKAGE * 结构:
		// 	*  _messageType [1 byte]
		//  * OPCODE 请求操作码[4 byte]
		//  * DATA_LENGTH 请求数据长度[4 byte]
		//  * REQUEST_ID 请求序列ID[4 byte]
		//  * uniqueReqIdLen 请求的唯一标识符长度(参考Client.getUniqueRequestId)
		//  * DATA 请求数据 是由 uniqueReqId+ 协议内容拼接起来的(requestBuffer)
		// * 协议采用小端
		return requestBuffer;


	}

	decode(aesKey: string, byte: any) {



		return byte
	}

	encrypt(word, aesKey) {
		return "";//str;
	}

	encryptStr(word, aesKey) {
		var enc: CryptoJS.WordArray = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(aesKey), {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		var result: string = enc.toString();
		return result
	}

	decrypt(word, aesKey) {
		return "";
	}

	decryptAesStr(input, aesKey) {

		var result = CryptoJS.AES.decrypt(input, CryptoJS.enc.Utf8.parse(aesKey), {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return result.toString(CryptoJS.enc.Utf8);
	}

}