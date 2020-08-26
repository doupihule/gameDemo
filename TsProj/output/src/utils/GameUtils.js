"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../game/sys/func/GlobalParamsFunc");
const GameConsts_1 = require("../game/sys/consts/GameConsts");
class GameUtils {
    /**
     * 转换时间
     * @param time 时间(秒)
     * @param type 0(时分秒)  1(06:59:59)
     */
    static convertTime(time, type = 1, showAll = true, showHour = true) {
        var day = Math.floor(time / 86400);
        var $day = day * 86400;
        var hour = Math.floor((time - $day) / 3600);
        var $hour = hour * 3600;
        var min = Math.floor((time - $day - $hour) / 60);
        var $min = min * 60;
        var sen = Math.floor(time - $day - $hour - $min);
        var str = "";
        if (type == 2) {
            if (showHour) {
                hour += day * 24;
                if (hour > 0) {
                    str += hour.toString() + "小时";
                }
            }
            if (min > 0) {
                str += min.toString() + "分钟";
            }
            if (sen > 0) {
                str += sen.toString() + "秒";
            }
            if (hour == 0 && min == 0 && sen == 0) {
                str += "0秒";
            }
        }
        else if (type == 1) {
            if (showHour) {
                hour += day * 24;
                if (hour > 0) {
                    if (hour < 10) {
                        str += "0";
                    }
                    str += hour.toString() + ":";
                }
                else {
                    if (showAll)
                        str += "00:";
                }
            }
            if (min > 0) {
                if (min < 10) {
                    str += "0";
                }
                str += min.toString() + ":";
            }
            else {
                str += "00:";
            }
            if (sen > 0) {
                if (sen < 10) {
                    str += "0";
                }
                str += sen.toString() + "";
            }
            else {
                str += "00";
            }
        }
        return str;
    }
    /**
     * 将时间戳转换为 '09-20 19:22' 格式
     * @param time 时间戳(秒)，不传默认当前时间
     * @param isSecond 是否显示秒
     */
    static getMDTime(time = (new Date()).valueOf(), onlyTime = false, onlyMD = false) {
        var date = new Date(time);
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        if (onlyTime) {
            return h + m;
        }
        if (onlyMD) {
            return M + D;
        }
        return M + D + h + m;
    }
    /**获取下一个刷新时间点01分的时间戳 */
    static getNextRefreshTByTime(nextTime, time = Client_1.default.instance.serverTime) {
        var date = new Date(time * 1000);
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        time = time - ((((h * 60) + m) * 60) + s);
        var refreshT = nextTime * 3600 + 60; //服务器刷新时间，4小时01分
        if (h < nextTime) {
            time = time + refreshT;
        }
        else {
            time = time + 24 * 3600 + refreshT;
        }
        return time;
    }
    /**获取数组中的随机值 */
    static getRandomInArr(arr) {
        var randomNum = this.getRandomInt(0, arr.length - 1);
        return { index: randomNum, result: arr[randomNum] };
    }
    /**
     * 获取从min到max之间的随机整数，[min,max]
     * @param min 最小数
     * @param max 最大数
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * 根据权重获取随出来的drop
     * 传入数组，数组内每个元素为
     * "0,0,9500"，最后一个数为权重
     * "0,9500"，最后一个数为权重
     */
    static getWeightItem(weightArr) {
        var weightSum = 0;
        for (var i = 0; i < weightArr.length; i++) {
            if (typeof weightArr[i] == "string") {
                var itemArr = weightArr[i].split(",");
                weightSum += Number(itemArr[itemArr.length - 1]);
            }
            else {
                weightSum += Number(weightArr[i][weightArr[i].length - 1]);
            }
        }
        var randomNum = this.getRandomInt(0, weightSum - 1);
        var curWeight = 0;
        for (var i = 0; i < weightArr.length; i++) {
            if (typeof weightArr[i] == "string") {
                var itemArr = weightArr[i].split(",");
                curWeight += Number(itemArr[itemArr.length - 1]);
            }
            else {
                curWeight += Number(weightArr[i][weightArr[i].length - 1]);
            }
            if (randomNum < curWeight) {
                if (typeof weightArr[i] == "string") {
                    return itemArr;
                }
                else {
                    return weightArr[i];
                }
            }
        }
        return {};
    }
    /**
     * 传入字符串，获取headImage
     * 如果带有localres:，则从之后截取
     * 如果带有http:或https:，则直接返回
     */
    static getHeadImg(imgStr) {
        var imagHead = "localres:";
        var path = imgStr;
        if (imgStr.indexOf(imagHead) > -1) {
            path = imgStr.substring(imagHead.length);
        }
        else if (imgStr.indexOf('http:') > -1 || imgStr.indexOf('https:') > -1) {
            path = imgStr;
        }
        return path;
    }
    static setVector3(vector, x, y, z) {
        vector.x = x;
        vector.y = y;
        vector.z = z;
        return vector;
    }
    /**
        * 获取要显示的数字
        * @param 传入实际数字
        */
    static getShowNum(num) {
        var units = GlobalParamsFunc_1.default.instance.getDataByTwoId("reducedUnit", "string");
        units = units.split(",");
        if (!units) {
            units = ['k', 'M', 'B', 'T'];
        }
        var decimal;
        for (var i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);
            if (num <= -decimal || num >= decimal) {
                return Math.floor((num / decimal) * 10) / 10 + units[i];
            }
        }
        return Math.floor(num) + "";
    }
    static getRewardAndIndex(weightArr) {
        var weightSum = 0;
        for (var i = 0; i < weightArr.length; i++) {
            var itemArr = weightArr[i].split(",");
            weightSum += Number(itemArr[itemArr.length - 1]);
        }
        var randomNum = this.getRandomInt(0, weightSum - 1);
        var curWeight = 0;
        for (var i = 0; i < weightArr.length; i++) {
            var itemArr = weightArr[i].split(",");
            curWeight += Number(itemArr[itemArr.length - 1]);
            if (randomNum < curWeight) {
                return { arr: itemArr, index: i };
            }
        }
        return { arr: null, index: null };
    }
    static getRewardAndIndexByVector(weightVec) {
        var weightSum = 0;
        for (var i = 0; i < weightVec.length; i++) {
            var itemArr = weightVec[i];
            weightSum += Number(itemArr[itemArr.length - 1]);
        }
        var randomNum = this.getRandomInt(0, weightSum - 1);
        var curWeight = 0;
        for (var i = 0; i < weightVec.length; i++) {
            var itemArr = weightVec[i];
            curWeight += Number(itemArr[itemArr.length - 1]);
            if (randomNum < curWeight) {
                return { arr: itemArr, index: i };
            }
        }
        return { arr: null, index: null };
    }
    /**打乱数组顺序 */
    static shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len; i++) {
            var end = len - 1;
            var index = (Math.random() * (end + 1)) >> 0;
            var t = a[end];
            a[end] = a[index];
            a[index] = t;
        }
        return a;
    }
    ;
    /**
     * 反解密字符串
     * @param firstStr 加密字符串
     */
    static decryptStr(firstStr) {
        if (!firstStr || typeof firstStr != "string")
            return firstStr;
        var str = firstStr.split("$$");
        if (!str[1])
            return firstStr;
        if (!this.lastMapping) {
            this.getLastmapping();
        }
        var lastStr = this.changeStr(str[0] + str[1]);
        return lastStr;
    }
    /**初始化映射表 */
    static getLastmapping() {
        var offest = GameConsts_1.default.GAME_OFFEST;
        this.lastMapping = {};
        for (var i = 0; i < this.firestMap.length; i++) {
            var item = this.firestMap[i];
            var lastStr;
            var asciiNum = item.charCodeAt(0);
            if (item >= "A" && item <= "Z") {
                //ABC
                if (asciiNum - offest >= 65) {
                    lastStr = String.fromCharCode(asciiNum - offest);
                }
                else {
                    lastStr = String.fromCharCode(91 - (offest - asciiNum + 65));
                }
            }
            else if (item >= "a" && item <= "z") {
                //abc
                if (asciiNum - offest >= 97) {
                    lastStr = String.fromCharCode(asciiNum - offest);
                }
                else {
                    lastStr = String.fromCharCode(123 - (offest - asciiNum + 97));
                }
            }
            this.lastMapping[item] = lastStr;
        }
    }
    /**改变字符串 */
    static changeStr(str) {
        var lastStr = "";
        for (var i = 0; i < str.length; i++) {
            lastStr += this.lastMapping[str[i]];
        }
        return lastStr;
    }
    /**
    * 将数字转换成固定格式的字符串
    * @param num 当前数字
    * @param figuresCountAfterPoint 小数点后保留的个数，为0时不保留小数点
    * @returns {string} 22将转换成22.0 1.2345 将转化成1.2
    */
    static numberToString(num, figuresCountAfterPoint = 1) {
        var numStr;
        num = Math.floor(num * Math.pow(10, figuresCountAfterPoint)) / Math.pow(10, figuresCountAfterPoint);
        numStr = num.toString();
        if (numStr.indexOf(".") == -1) {
            numStr += ".";
            for (var i = 0; i < figuresCountAfterPoint; i++) {
                numStr += "0";
            }
        }
        return numStr;
    }
    /**
    * 获取数组中随机不重复的n个数
    * @param count 需要获取的个数
    */
    static getRandomArrayElements(arr, count = 0) {
        var out = [];
        if (arr.length <= count) {
            out = arr;
        }
        else {
            var randomNum;
            for (var i = 0; i < count; i++) {
                randomNum = this.getRandomInt(0, arr.length - 1);
                if (out.indexOf(arr[randomNum]) == -1) {
                    out.push(arr[randomNum]);
                }
                else {
                    i--;
                }
            }
        }
        return out;
    }
    static createArrBetweenTwo(min, max) {
        var arr = [];
        for (var i = min; i <= max; i++) {
            arr.push(i);
        }
        return arr;
    }
}
exports.default = GameUtils;
/**是否能看视频 */
GameUtils.canVideo = true;
/**是否能分享 */
GameUtils.canShare = true;
/**是否显示banner */
GameUtils.canQuickBanner = true;
/**是否显示诱导banner */
GameUtils.canLeadBanner = false;
/**是否显示神秘礼包 */
GameUtils.canGift = false;
/**是否是审核模式 */
GameUtils.isReview = false;
GameUtils.firestMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789";
//# sourceMappingURL=GameUtils.js.map