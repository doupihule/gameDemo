import LogsManager from "../manager/LogsManager";
import TableUtils from "./TableUtils";

export default class RandomUtis {
	public constructor() {
	}

	private static _yinziToIndexDic = {};

	private static RANDOM_MAX = 2147483647;

	private static MIDDLEVALUE = 127773;

	private static OFFSETVALUE = 2836;

	private static MODVALUE = Math.floor(RandomUtis.RANDOM_MAX / RandomUtis.MIDDLEVALUE);

	private static TABLE = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

	/**
	 * 散列函数
	 */
	static hashi_func(num) {
		var hash = this.crc32(num + '') >> 16 & 0x7fff;
		return hash * 4;
	}

	static crc32(str: string, crc?: number) {
		if (crc == null) crc = 0;
		var n = 0; //a number between 0 and 255  
		var x = 0; //an hex number  
		crc = crc ^ (-1);
		for (var i = 0, iTop = str.length; i < iTop; i++) {
			n = (crc ^ str.charCodeAt(i)) & 0xFF;
			x = Number("0x" + this.TABLE.substr(n * 9, 8));
			crc = (crc >>> 8) ^ x;
		}
		return crc ^ (-1);
	}

	static setOneRandomYinzi(yinzi, step = 0, index = 0) {
		var randomObj = this.newYinzi();
		randomObj['initR'] = this.hashi_func(yinzi);
		this._yinziToIndexDic[index] = randomObj;
		this.gotoTargetStep(step, index)
	}

	static gotoTargetStep(step, index = 0) {
		this._yinziToIndexDic[index]['r'] = this._yinziToIndexDic[index]['initR'];
		this._yinziToIndexDic[index]['step'] = 0;
		for (var i = 1; i <= step; i++) {
			this.yinziGetNext(index);
		}
	}

	//获取随机0-1随机数
	static yinziGetNext(index = 0) {
		var t = this.yinziGetOriginUint(index);
		return (t % (this.RANDOM_MAX + 1)) / this.RANDOM_MAX;
	}

	//获取随机因子整数, 提高效率 0-2^64
	static yinziGetOriginUint(index = 0) {
		var quotient = Math.floor(this._yinziToIndexDic[index]['r'] / this.MIDDLEVALUE);
		var remainder = this._yinziToIndexDic[index]['r'] % this.MIDDLEVALUE + 1;

		var t = this.MODVALUE * remainder - this.OFFSETVALUE * quotient;
		if (t <= 0) {
			t = t + this.RANDOM_MAX;  //确保随机出的数为正整数
		}
		this._yinziToIndexDic[index]['r'] = t;
		this._yinziToIndexDic[index]['step'] += 1;
		return t
	}

	static newYinzi() {
		return {
			'initR': 0,
			'r': 0,
			'step': 0
		};
	}

	//获取随机数
	static getOneRandom(index = 0) {
		if (!this._yinziToIndexDic[index]) {
			this._yinziToIndexDic[index] = this.newYinzi();
		}
		var result = this.yinziGetNext(index);
		return result;
	}

	//获取原始0-2^64随机数
	static getUintRandom(index = 0) {
		if (!this._yinziToIndexDic[index]) {
			this._yinziToIndexDic[index] = this.newYinzi();
		}
		var result = this.yinziGetOriginUint(index);
		return result;
	}

	static getOneRandomFromArea(startNum, endNum, index = 0, damic = 0) {
		//如果起始值大于终止值，交换起始值与终止值
		if (startNum > endNum) {
			var tempValue = startNum;
			startNum = endNum;
			endNum = tempValue;
		}

		var random = this.getOneRandom(index);

		var k = (endNum - startNum) / (1 - 0);
		var result = k * random - k * 0 + startNum;

		result = result < startNum ? startNum : result;
		result = result > endNum ? endNum : result;


		var powNum = Math.pow(10, damic);
		result = Math.round(result * powNum) / powNum;

		if (damic == 0) {
			result = parseInt(result);
		}
		return result;
	}

	//传入一个int 获取等于这个int-1的指定数量且不重复的数组
	//通常用来获取 从0-(n-1)随机取nums个不重复的数
	static getOneGroupIndex(restrict: number, nums: number, index: number = 0) {
		if (!nums) {
			nums = restrict;
		}
		var resultArr: number[] = [];
		var tempArr: number[] = []
		for (var i = 0; i < restrict; i++) {
			tempArr[i] = i
		}
		var pushIndex = 1;
		for (var i = restrict - 1; i >= restrict - nums; i--) {
			var randomInt: number = this.getOneRandomInt(i, 0, index);

			var value_1: number = tempArr[randomInt];
			var value_2: number = tempArr[i];
			// resultArr[i-1] = value_1;
			resultArr.push(value_1);
			pushIndex += 1;
			tempArr[randomInt] = value_2;
			tempArr[i] = value_1;
		}
		return resultArr;
	}

	//--获取一个随机的int		最大值(不包括这个值)	最小值	排除某个数
	static getOneRandomInt(restrict, min: number = 0, index: number = 0) {
		var nums = restrict - min;
		var random = this.getOneRandom(index) * nums
		var result = Math.floor(random)
		result += min;
		return result;
	}

	/**
	 * //这个是权重数组,获取的数量
	 * arr = [
	 * 	weight
	 * ]
	 * nums 获取的数的数量
	 */
	static getOneIndexByWeight(arr: number[], index: number = 0) {
		var totalValue: number = 0;
		var tempArr: number[] = []
		for (var i = 0; i < arr.length; i++) {
			totalValue = totalValue + arr[i];
			tempArr.push(totalValue);
		}

		//获取一个随机数
		var random: number = this.getOneRandom(index);
		random *= totalValue;

		for (var i = 0; i < tempArr.length; i++) {
			if (random < tempArr[i]) {
				return i;
			}
		}
		return tempArr.length - 1;

	}

	//获取一系列权重数序号
	static getIndexArrByWeight(arr: number[], nums: number = 1, index: number = 0) {
		var randomArr: number[] = []
		var cloneArr: any[] = TableUtils.copyOneArr(arr);
		var resultArr: number[] = [];
		var num = arr.length;
		if (num < nums) {
			LogsManager.errorTag(null, 'getIndexArrByWeight  ````  arr长度小于nums！！');
			nums = num;
		}
		for (var i = 0; i < nums; i++) {
			var rt = this.getOneIndexByWeight(cloneArr, index);
			//获取一个数后就把这个权重设置为0
			cloneArr[rt] = 0;
			resultArr.push(rt);

		}
		return resultArr;
	}

	//随机一个数组
	static randomOneGroup(arr: any[], index: number = 0) {
		var resultArr = [];
		this.randomOneGroupToOut(arr, resultArr, index);
		return resultArr;
	}

	//随机一个数组 输出目标数组 原数组和输出数组不能是同一个.否则会出错
	static randomOneGroupToOut(arr: any[], resultArr: any[], index: number = 0) {
		var nums: number = arr.length;
		var indexArr: any[] = this.getOneGroupIndex(nums, nums, index);
		if (!resultArr) {
			resultArr = []
		}
		for (var i = 0; i < nums; i++) {
			resultArr[i] = arr[indexArr[i]];
		}
		return resultArr;
	}
}