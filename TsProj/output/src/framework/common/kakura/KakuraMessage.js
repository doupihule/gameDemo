"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KakuraPackage_1 = require("./KakuraPackage");
const LogsManager_1 = require("../../manager/LogsManager");
const ErrorCode_1 = require("../../../game/sys/common/kakura/ErrorCode");
class KakuraMessage {
    constructor() {
        this.defaultAesKey = "ilo24wEFS*^^*2Ewilo24wEFS*^^*2Ew";
        //消息头的长度, 不包含messagetype .
        this.headlength = 13;
        this._lastSendTime = 0;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new KakuraMessage();
        }
        return this._instance;
    }
    //获取一个随机key
    getOneRandomAeskey(num) {
        var len = this.defaultAesKey.length;
        var resultStr = "";
        for (var i = 0; i < num; i++) {
            var index = Math.floor(Math.random() * len);
            resultStr += this.defaultAesKey.substr(index, 1);
        }
        return resultStr;
    }
    setMessageType(type) {
        this._messageType = type;
    }
    addPackage(opcode, requestId, uniqueReqId, sendData, callback, thisObj) {
        var pack = new KakuraPackage_1.default();
        pack.opcode = opcode;
        pack.requestId = (requestId);
        pack.len = sendData.length * 3; //this.countBufferLen(sendData);
        pack.uniqueReqIdLen = uniqueReqId.length;
        pack.uniqueReqId = uniqueReqId;
        pack.sendData = sendData;
        return pack;
    }
    encode(requestBuffer, aesKey, pack) {
        // 单个请求数据包 * PACKAGE * 结构:
        // 	*  _messageType [1 byte]
        //  * OPCODE 请求操作码[4 byte]
        //  * DATA_LENGTH 请求数据长度[4 byte]
        //  * REQUEST_ID 请求序列ID[4 byte]
        //  * uniqueReqIdLen 请求的唯一标识符长度(参考Client.getUniqueRequestId)
        //  * DATA 请求数据 是由 uniqueReqId+ 协议内容拼接起来的(requestBuffer)
        // * 协议采用小端
        this._lastSendTime = Laya.Browser.now();
        LogsManager_1.default.echo(requestBuffer.length, "_requestBufferlength");
        var byte = new Laya.Byte();
        LogsManager_1.default.echo("-------------------------------------------MessageType" + this._messageType);
        byte.endian = Laya.Byte.LITTLE_ENDIAN;
        byte.writeByte(this._messageType);
        var headBody = new Laya.Byte();
        headBody.endian = Laya.Byte.LITTLE_ENDIAN;
        headBody.writeUint32(pack.opcode);
        headBody.writeUint32(pack.len);
        headBody.writeUint32(pack.requestId);
        headBody.writeByte(pack.uniqueReqIdLen);
        headBody.pos = 0;
        //加密
        if (this._messageType == KakuraMessage.MESSAGE_HAS_ENC) {
            var headStr = headBody.getCustomString(headBody.length);
            var str = headStr + requestBuffer;
            var aesStr = this.encrypt(str, aesKey);
            byte.writeUTFBytes(aesStr);
        }
        else if (this._messageType == KakuraMessage.MESSAGE_DYNAMIC_ENC_NO_COMPRESS ||
            this._messageType == KakuraMessage.MESSAGE_FIX_ENC_NO_COMPRESS) {
            byte.writeArrayBuffer(headBody.buffer);
            var uniqueReqId = requestBuffer.slice(0, pack.uniqueReqIdLen);
            byte.writeUTFBytes(uniqueReqId);
            requestBuffer = requestBuffer.slice(pack.uniqueReqIdLen);
            var aesStr = this.encryptStr(requestBuffer, aesKey);
            byte.writeUTFBytes(aesStr);
        }
        else {
            byte.writeArrayBuffer(headBody.buffer);
            byte.writeUTFBytes(requestBuffer);
        }
        // byte.position = 0;
        // this.decode(aesKey,byte);
        return byte;
        //  return this.encrypt(byte.toString(), aesKey);
    }
    decode(aesKey, byte) {
        this._messageType = byte.readUint8();
        LogsManager_1.default.echo("-------------------------------------------MessageType" + this._messageType);
        var decodestr;
        var headBody = new Laya.Byte();
        if (this._messageType == KakuraMessage.MESSAGE_HAS_ENC) {
            var aesStr = byte.readUTFBytes(byte.length - 1);
            decodestr = this.decrypt(aesStr, aesKey);
            var headStr = decodestr.substr(0, this.headlength);
            headBody.endian = Laya.Byte.LITTLE_ENDIAN;
            var length = headStr.length;
            for (var i = 0; i < length; i++) {
                headBody.writeByte(headStr.charCodeAt(i));
            }
            headBody.pos = 0;
        }
        else {
            headBody = byte;
        }
        var pack = new KakuraPackage_1.default;
        pack.opcode = headBody.readUint32();
        var len = headBody.readUint32();
        pack.requestId = headBody.readUint32();
        pack.uniqueReqIdLen = headBody.readUint8();
        var data;
        var aesBody = "";
        if (this._messageType == KakuraMessage.MESSAGE_HAS_ENC) {
            if (pack.uniqueReqIdLen > 0) {
                pack.uniqueReqId = decodestr.substr(this.headlength, pack.uniqueReqIdLen);
            }
            data = decodestr.substr(this.headlength + pack.uniqueReqIdLen);
        }
        else if (this._messageType == KakuraMessage.MESSAGE_DYNAMIC_ENC_NO_COMPRESS ||
            this._messageType == KakuraMessage.MESSAGE_FIX_ENC_NO_COMPRESS) {
            if (pack.uniqueReqIdLen > 0) {
                pack.uniqueReqId = headBody.readUTFBytes(pack.uniqueReqIdLen);
            }
            aesBody = headBody.readUTFBytes(headBody.bytesAvailable);
            data = this.decryptAesStr(aesBody, aesKey);
        }
        else {
            if (pack.uniqueReqIdLen > 0) {
                pack.uniqueReqId = headBody.readUTFBytes(pack.uniqueReqIdLen);
            }
            data = headBody.readUTFBytes(headBody.bytesAvailable);
        }
        pack.len = len;
        pack.sendData = data;
        // LogsManager.echo("收到数据：", pack.sendData, pack.requestId);
        // console.log("test>>>>>>>>>>>>>" + this.testLen(pack.sendData))
        if (LogsManager_1.default.ignoreLogs.indexOf(pack.opcode + '') == -1) {
            LogsManager_1.default.echo("kakura,收到数据：", pack.sendData, pack.requestId, "costTime:", Laya.Browser.now() - this._lastSendTime);
        }
        else {
            LogsManager_1.default.echo("kakura,pack.opcode:", pack.opcode, pack.requestId, "costTime:", Laya.Browser.now() - this._lastSendTime);
        }
        var jsonData;
        //@测试代码  测试服务器返回数据异常
        // pack.sendData = "{jhasdh}"
        try {
            jsonData = JSON.parse(pack.sendData);
        }
        catch (e) {
            var backStr = "opcode:" + pack.opcode + ",len:" + pack.len + "reqId:" + pack.requestId + ",ureqId:" + pack.uniqueReqId + ",body:" + aesBody + ",data:" + pack.sendData;
            //返回一个构造数据错误 同时发送一个错误打点
            jsonData = { error: { code: ErrorCode_1.default.webOffline } };
            var errorInfo;
            errorInfo = "server back data is not json \n" + backStr;
            console.log(errorInfo, "errorInfo");
            //发送一条 数据异常到阿里云
            LogsManager_1.default.sendErrorToPlatform(errorInfo, LogsManager_1.default.errorTage_serverError, 10000);
        }
        return jsonData;
        // return JSON.parse(decodeURI(pack.sendData));
    }
    encrypt(word, aesKey) {
        // var key = CryptoJS.enc.Utf8.parse(aesKey);
        // // var cipher = CryptoJS.CipherOption
        // var srcs = word;//CryptoJS.enc.Utf8.stringify(word);
        // var params: any = {
        // 	mode: CryptoJS.mode.ECB,
        // 	padding: CryptoJS.pad.Pkcs7,
        // 	iv: this.getOneRandomAeskey(16),
        // }
        // var encrypted: CryptoJS.WordArray = CryptoJS.AES.encrypt(srcs, aesKey, params);
        // var str: string = encrypted.toString();
        return ""; //str;
    }
    encryptStr(word, aesKey) {
        var enc = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(aesKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var result = enc.toString();
        return result;
    }
    decrypt(word, aesKey) {
        // var params: any = {
        // 	mode: CryptoJS.mode.ECB,
        // 	padding: CryptoJS.pad.Pkcs7,
        // 	iv: this.getOneRandomAeskey(16),
        // }
        // var decrypt = CryptoJS.AES.decrypt(word, aesKey, params);
        return ""; //CryptoJS.enc.Utf8.stringify(decrypt);
    }
    decryptAesStr(input, aesKey) {
        var result = CryptoJS.AES.decrypt(input, CryptoJS.enc.Utf8.parse(aesKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString(CryptoJS.enc.Utf8);
    }
    countBufferLen(str) {
        var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        console.log(">>>>>>>>>u16a.buffer>>>>>>>>>>", bufView.buffer.byteLength);
        console.log(">>>>>>>>>u16a.buffer>>>>>>>>>>", bufView.byteLength);
        console.log(">>>>>>>>>u16a.buffer>>>>>>>>>>", bufView.length);
        return bufView.length;
    }
    byteToString(arr) {
        var _arr = arr.getUTFString();
        // var str = '';
        // for(var i = 0; i < _arr.length; i++) {
        // 	str += String.fromCharCode(_arr[i]);
        // }
        return _arr;
    }
    //字符串转字节序列
    stringToByte(str) {
        var bytes = new Laya.Byte();
        bytes.endian = Laya.Byte.LITTLE_ENDIAN;
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.writeByte(((c >> 18) & 0x07) | 0xF0);
                bytes.writeByte(((c >> 12) & 0x3F) | 0x80);
                bytes.writeByte(((c >> 6) & 0x3F) | 0x80);
                bytes.writeByte((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.writeByte(((c >> 12) & 0x0F) | 0xE0);
                bytes.writeByte(((c >> 6) & 0x3F) | 0x80);
                bytes.writeByte((c & 0x3F) | 0x80);
            }
            else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.writeByte(((c >> 6) & 0x1F) | 0xC0);
                bytes.writeByte((c & 0x3F) | 0x80);
            }
            else {
                bytes.writeByte(c & 0xFF);
            }
        }
        return bytes;
    }
    ToUTF16(str) {
        var result = new Array();
        var k = 0;
        for (var i = 0; i < str.length; i++) {
            var j = str[i].charCodeAt(0);
            result[k++] = j & 0xFF;
            result[k++] = j >> 8;
        }
        console.log(">>>>>>>>>ToUTF16>>>>>>>>>>", result.length);
        return result;
    }
    ToUTF8(str) {
        var result = new Array();
        var k = 0;
        for (var i = 0; i < str.length; i++) {
            var j = encodeURI(str[i]);
            if (j.length == 1) {
                // 未转换的字符
                result[k++] = j.charCodeAt(0);
            }
            else {
                // 转换成%XX形式的字符
                var bytes = j.split("%");
                for (var l = 1; l < bytes.length; l++) {
                    result[k++] = parseInt("0x" + bytes[l]);
                }
            }
        }
        return result;
    }
}
exports.default = KakuraMessage;
//32是不加密不加锁 1是加密不压缩
KakuraMessage.MESSAGE_NO_ENC = 32;
KakuraMessage.MESSAGE_FIX_ENC_NO_COMPRESS = 11;
KakuraMessage.MESSAGE_DYNAMIC_ENC_NO_COMPRESS = 12;
KakuraMessage.MESSAGE_HAS_ENC = 1;
//# sourceMappingURL=KakuraMessage.js.map