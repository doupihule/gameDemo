import CacheManager from "../../../framework/manager/CacheManager";
import GameConsts from "./GameConsts";

export default class StorageCode {

	//本地缓存的vms版本号
	public static storage_vmsversion: string = "storage_vmsversion";
	public static storage_wxGuide: string = "wxGuide";
	public static storage_isNewPlayer: string = "isNewPlayer";
	public static storage_isOldPlayer: string = "isOldPlayer";//打点用，区分新老用户
	public static storage_deviceStr: string = "deviceStr";
	/**来源缓存的KEY */
	public static COMEFROM_CACHE: string = "COMEFROM_CACHE";
	/**首次启动参数 */
	public static storage_firstrun_data: string = "storage_firstrun_data";
	//缓存的 zip文件路径 是 一个json串
	public static storage_zip_file: string = "storage_zip_file"

	public  static  platformId:string;

	//存储用户名
	public static get storage_acount() {
		if (this.platformId == "web") {
			return GameConsts.gameCode + "_" + this.platformId  + "_count"
		}
		return "acount"

	}

	// 离线收益领取次数缓存
	public static storage_offlineCoinCount: string = "offlineCoinCount";
	// 结算奖励领取次数缓存
	public static storage_battleResultCount: string = "battleResultCount";
	//迷雾战斗结算奖励
	public static storage_fogBattleResultCount: string = "fogBattleResultCount";

	//这里需要做一个判断 如果是dev 那么 userInfo是动态的 拼上 userName .如果是其他平台就是固定的
	static get storage_userinfo(): string {
		var key = GameConsts.gameCode + "_" + this.platformId + "_" + CacheManager.instance.getGlobalCache(StorageCode.storage_acount) || "";
		return "storage_userinfo" + key;
	}

	constructor() {

	}

}