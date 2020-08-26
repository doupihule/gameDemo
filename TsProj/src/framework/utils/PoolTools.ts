import PoolCode from "../../game/sys/consts/PoolCode";

export default class PoolTools {


	//缓存对象
	private static _pools: any = {
		battle: {},
		sys: {},
		scene: {}
	}


	//获取模块数组
	static getItems(sign: string, model: string = PoolCode.pool_model_battle) {
		var pools: any[] = this._pools[model][sign];
		return pools;
	}

	//获取一个模块的所有缓存
	static getModelItems(model: string = PoolCode.pool_model_battle) {
		return this._pools[model];
	}


	/**
	 * 根据对象类型获取对象，没有则为null
	 * {
	 *  model{
	 *  key:[item,...]
	 * }
	 *
	 * }
	 */
	static getItem(sign: string, model: string = PoolCode.pool_model_battle) {
		var pools: any[] = this._pools[model][sign];
		if (pools != undefined) {
			return pools.shift();
		}
		return null;
	}

	/**
	 * 将对象放入对应类型的对象池中
	 */
	static cacheItem(sign: string, item: any, model: string = PoolCode.pool_model_battle) {
		var poolModel = this._pools[model]
		var pools: any[] = poolModel[sign];
		if (pools == undefined) {
			pools = [item];
			poolModel[sign] = pools;
		} else {
			if (pools.indexOf(item) != -1) {
				window["LogsManager"].warn("对象已在缓存列表,sign", sign)
			} else {
				pools.push(item);
			}
		}
	}

	//判断一个item是否已经缓存了 true表示已经缓存
	static checkItemHasCache(sign: string, item, model: string = PoolCode.pool_model_battle) {
		var poolModel = this._pools[model]
		var pools: any[] = poolModel[sign];
		if (pools == undefined) {
			return false;
		} else {
			if (pools.indexOf(item) != -1) {
				return true;
			}
		}
		return false;
	}


	//清除一个模块的缓存
	static clearOneModelPool(model: string = PoolCode.pool_model_battle) {
		var poolModel = this._pools[model];
		for (var i in poolModel) {
			this.clearOnePool(i, model);
		}
	}

	//清除一个缓存
	static clearOnePool(key: string, model: string = PoolCode.pool_model_battle) {
		var poolModel = this._pools[model];
		var arr = poolModel[key];
		if (!arr || arr.length == 0) {
			return;
		}
		for (var ii = 0; ii < arr.length; ii++) {
			var item = arr[ii];
			if (item.dispose) {
				item.dispose()
			} else if (item.removeSelf) {
				item.removeSelf();
			}
		}
		arr.splice(0, arr.length);

	}


}