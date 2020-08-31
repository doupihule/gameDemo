import UserInfo from "../../../framework/common/UserInfo";


export default class GameConsts {
	static  GAMEENGING_UNITY:string = "unity";

	//游戏引擎是unity
	static  gameEngine:string =GameConsts.GAMEENGING_UNITY

	//UI一米对应项目比例 100;
	static  uiMitoPixelRatio:number  =100;


	//默认分配的物理内存, 这个值 不能设置大,否则部分设备初始化 物理引擎会报错
	static defaultPhysicsMemory: number = 16;
	//游戏帧率
	static gameFrameRate: number = 60;
	//是否使用物理引擎
	static isUsePhysics: boolean = false;

	//游戏代号
	static gameCode: string = "flat"
	/**
	 * 游戏名称[分渠道]
	 */
	private static _gameName = {
		_default: '奇葩公寓',
	}
	//定一个一个空函数
	static emptyFunc: Function = () => {
	}

	//资源平台  后续会扩展 ios android
	static resplatform: string = "Conventional";

	/** 梦嘉互推参数：apiSecret (不同游戏均相同) */
	static JUMP_MENGJIA_APISECRET = '0ceaf4f01e84e726c6603b9f9575a7d5'
	/** 梦嘉互推参数：apikey (不同游戏均相同)*/
	static JUMP_MENGJIA_APIKEY = '61b59ba885d90188169f17dbacd29d74'
	/** 梦嘉互推参数：appkey (不同游戏不同appkey)*/
	static JUMP_MENGJIA_APPKEY = "6ca73d4463ff49c675c8f0b3e402fef5";

	/** 奇幻梦想互推参数：appkey (不同游戏不同appkey)*/
	static JUMP_FANTASY_APPKEY = "flat";
	/** 奇幻梦想互推参数：url*/
	static JUMP_FANTASY_URL = "http://172.16.1.190/project/hifive_global/index.php?mod=http";


	// /**卡日曲互推 查固定位多个跳转游戏信息 参数：url */
	static get JUMP_KARIQU_REDIRECT_LIST_URL() {
		if (UserInfo.isTT()) {
			return "https://wxxyx.17tcw.com:8500/qpgy_douyin/redirect/list";
		}
		return "https://wxxyx.17tcw.com:8500/qpgy/redirect/list";
	}

	/**卡日曲互推 保存跳转记录 参数：url */
	static JUMP_KARIQU_SAVEJUMP_URL = "https://xyx.17tcw.com:5201/xyx/statis/reqSaveRedirect";

	/**卡日曲互推 导出确认 */
	static get JUMP_KARIQU_CONFIRM_URL() {
		if (UserInfo.isTT()) {
			return "https://wxxyx.17tcw.com:8500/qpgy_douyin/redirect/confirm";
		}
		return "https://wxxyx.17tcw.com:8500/qpgy/redirect/confirm";
	}


	/**加密偏移 */
	static GAME_OFFEST = 13;

	/**游戏appId */
	static get GAME_APPID() {
		if (UserInfo.isTT()) {
			return "ttb5a0c31d2a9ac192"
		}
		return "wx037985b586671eee"
	}


	//卡日曲的相关url 在main.ts里面 调用 KariquShareConst.initKariquUrl()
	static get kariquUrlMap() {
		return {}

	}


	//混淆sha1串后的值. 每个游戏不一样.
	/**
	 * 每个游戏 在Main.ts里面单独调用下面这段测试代码就可以生成混淆后的sha1串
	 * var str = "C5:19:61:2D:35:23:34:B5:27:EB:A5:37:B5:CA:27:30:75:65:2C:A4"
		StringUtils.encodeSign(str);
	 *
	 * 把debug包的sha1也设置为合法的sha1串 多个sha1串用 | 分割,不能带空格
	 */
	static ENCODE_SHA1: string = "PhmdlmidmeQmfhmefmfgmOhmejmROmNhmfjmOhmPNmejmfcmjhmihmePmNg|kQmOPmSOmkgmljmcimcgmjemedmejmORmNjmNkmefmecmjimkdmQgmifmei"

	/**
	 * 返回游戏名称
	 */
	static get gameName() {
		if (GameConsts._gameName[UserInfo.platformId]) {
			return GameConsts._gameName[UserInfo.platformId]
		} else {
			return GameConsts._gameName._default;
		}
	}
}