import InstanceLife from "../instance/InstanceLife";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../../sys/consts/PoolCode";
import BaseContainer from "../../../framework/components/BaseContainer";
import ImageExpand from "../../../framework/components/ImageExpand";
import ViewTools from "../../../framework/components/ViewTools";

export default class RoleBuffBar extends BaseContainer {

	public owner: InstanceLife;
	public srollImage: ImageExpand;
	public shieldImage: ImageExpand;
	public backImage: ImageExpand;

	private _initWidth: number = 80;
	private _initHeight: number = 8;
	private _offsetY: number = 0;

	private buffIconListUp = [];
	private buffIconListDown = [];

	private maxIcon = 5;

	constructor() {
		super();

	}

	public setData(owner: InstanceLife, ctn) {
		this.owner = owner;
		this._offsetY = -this.owner.cfgData.size[0] * this.owner.cfgScale - 50;
		//判断是否缓存

		ctn.addChild(this);
		this.onBuffChange();
		this.visible = false;

	}

	//当buff变化，删除全部，重新生成
	public onBuffChange(buff?) {
		var allBuffInfo = this.owner.buffInfo;
		this.visible = true;
		this.removeAll();
		for (var index in allBuffInfo) {
			var someBuffInfo = allBuffInfo[index];
			for (var index2 in someBuffInfo) {
				var buffInfo = someBuffInfo[index2].cfgData;
				var flag = false;
				if (buffInfo.icon) {
					var buffIconList = this.buffIconListUp;
					var offsetY = 0;
					switch (Number(buffInfo.icon[0])) {
						case 1:
							offsetY = 0;
							buffIconList = this.buffIconListUp;
							break;
						case 2:
							offsetY = 50;
							buffIconList = this.buffIconListDown;
							break;
					}
					for (var index3 in buffIconList) {
						if (buffIconList[index3] == buffInfo.icon[1]) {
							flag = true;
							break;
						}
					}
					if (!flag) {
						if (buffIconList.length < this.maxIcon) {
							var cacheItem: ImageExpand = PoolTools.getItem(PoolCode.POOL_BUFFICON + buffInfo.icon[1]);
							if (!cacheItem) {
								cacheItem = ViewTools.createImage("uisource/bufficon/bufficon/" + buffInfo.icon[1] + ".png");
							}
							this.addChild(cacheItem);
							cacheItem.x = 25 * (buffIconList.length - this.maxIcon / 2);
							cacheItem.y = offsetY;
							buffIconList.push(buffInfo.icon[1]);
						}
					}
				}
			}
		}


	}

	//跟随目标
	public followTarget() {
		this.x = this.owner._myView.x;
		this.y = this.owner._myView.y + this._offsetY;
	}

	removeAll() {
		for (var index in this.buffIconListUp) {
			PoolTools.cacheItem(PoolCode.POOL_BUFFICON + this.buffIconListUp[index], this.getChildAt(Number(index)));
		}
		for (var index in this.buffIconListDown) {
			PoolTools.cacheItem(PoolCode.POOL_BUFFICON + this.buffIconListDown[index], this.getChildAt(Number(index)));
		}
		this.buffIconListUp = [];
		this.buffIconListDown = [];
		this.removeChildren();
	}

	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.owner = null;
		this.backImage = null;
		this.srollImage = null;
		this.removeSelf();
		this.removeAll();
	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}