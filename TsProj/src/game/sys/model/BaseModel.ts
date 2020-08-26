
/**
 * 所有数据类的鸡肋
 */

export default class BaseModel {
	/**
	  * 每个模块需要在这里吧对应的数据内容 在对应的model里面详细列出来方便查看
	  */
	protected _data: any;

	//缓存上一次更新过的数据,方便子系统获取
	public lastUpdateData: any;
	//每个子类都需要重写并super 这个initData
	initData(data) {
		this._data = data;
	}
	//获取数据
	getData() {
		return this._data;
	}

	//模块数据发生变化,子类根据需要继承这个方法 并super.
	updateData(d: any) {
		TableUtils.deepMerge(this._data, d);
		this.lastUpdateData = d;
		//根据需要发送事件
	}
	//模块数据发生删除
	deleteData(d: any) {
		TableUtils.deepDelete(this._data, d);
	}
}
import TableUtils from "../../../framework/utils/TableUtils";