import BaseModel from "../../game/sys/model/BaseModel";
import Client from "../common/kakura/Client";
import UserModel from "../../game/sys/model/UserModel";
import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import GlobalData from "../utils/GlobalData";
import SingleCommonServer from "../server/SingleCommonServer";


export default class UserGlobalModel extends BaseModel {
	private static _instance: UserGlobalModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new UserGlobalModel();
		}
		return this._instance;
	}

	// 新增字段必须在此处进行添加
	public static dataField = ['shareInfo', 'shareCount'];

	private checkHasInit() {
		if (!this._data) {
			this._data = {shareCount: GlobalParamsFunc.instance.getGlobalCfgDatas("beginHumanShareNmb")['num']}
			LogsManager.errorTag('user_glboal_model_not_load', 'error UserGlobalModel not init----use defaultData---------' + JSON.stringify(this._data));
		}
		return true;
	}

	initData(data) {
		if (!data) {
			data = {};
		}
		super.initData(data);
	}

	/**
	 * 获取邀请列表
	 */
	public getInviteInfo() {
		if (!this.checkHasInit()) {
			return {};
		}
		return this._data.shareInfo || {};
	}

	/**
	 * 更新全局数据
	 * @param callback 刷新后回调
	 * @param thisObj
	 */
	public flushGlobalData(callback: Function = null, thisObj = null, params: any = null) {
		if (UserModel.instance.getUserRid() != 'nologin') {
			if (GlobalData.checkIsSingleMode()) {
				Client.instance.getCloudGlobalData({
					query: UserGlobalModel.dataField,
					id: UserModel.instance.getUserRid(),
				}, this.flushGlobalDataCallback, this, {callback: callback, thisObj: thisObj, params: params});
			} else {
				var info = UserModel.instance.getData().shareCount
				if (info) {
					this.initData({shareCount: Number(info)})
				} else {
					this.initData(null)
				}
				callback && callback.call(thisObj, params);
			}
		} else {
			// 没有登录不同步数据
			callback && callback.call(thisObj, params);
		}
	}

	/**
	 * 刷新全局数据回调
	 */
	private flushGlobalDataCallback(response, addParam) {
		if (response.result) {
			// 刷新数据用覆盖方式
			this.initData(response.result.data);
		}
		if (addParam.callback) {
			addParam.callback.call(addParam.thisObj, addParam.params);
		}
	}


	/**
	 * 获取剩余分享次数
	 */
	public getShareNum() {
		if (!this.checkHasInit()) {
			return 1;
		}
		return this._data.shareCount || 1;
	}

	/**
	 * 设置剩余分享数目
	 * @param shareNum 分享次数变更值 例如3为加3次，-3为减3次
	 * @param id 要设置的用户id，为空取当前用户id
	 */
	public setShareNum(shareNumAdd) {
		if (!this.checkHasInit()) {
			return;
		}

		var newShareNum;
		// 更新自己的数据
		if (this._data.shareCount == undefined) {
			var beginShareCount = GlobalParamsFunc.instance.getGlobalCfgDatas("beginHumanShareNmb")['num'];
			this._data.shareCount = 0;
			this._data.shareCount += beginShareCount;
		}
		this._data.shareCount += shareNumAdd;
		if (this._data.shareCount <= 0) {
			this._data.shareCount = 0
		}
		if (UserModel.instance.getUserRid() == 'nologin') {
			return;
		}
		if (GlobalData.checkIsSingleMode()) {
			Client.instance.setCloudGlobalData({
				clientDirty: {
					'u': {
						shareCount: this._data.shareCount,
					}
				},
				id: UserModel.instance.getUserRid(),
			});
		} else {
			SingleCommonServer.sendNoAliCloudData({
				clientDirty: {
					'u': {
						shareCount: this._data.shareCount,
					}
				},
			})
		}

	}

	/**
	 * 更新别人的分享剩余次数
	 */
	static setOtherShareNum(id, shareNumAdd) {
		LogsManager.echo("设置他人分享计数信息----id:" + id + "shareNumAdd:" + shareNumAdd,);

		var params = {
			query: ['shareCount'],
			id: id
		};
		// 更新别人数据
		Client.instance.getCloudGlobalData(params, (response) => {
			if (response && response.result) {
				if (response.result.data && response.result.data.shareCount) {
					var newShareNum = response.result.data.shareCount + shareNumAdd
				} else {
					var newShareNum = shareNumAdd
				}
				if (newShareNum <= 0) {
					if (newShareNum < 0) {
						LogsManager.errorTag('otherUser_shareCount_error', 'error othersharecountNum');
					}
					newShareNum = 0
				}
				if (id != 'nologin') {
					Client.instance.setCloudGlobalData({
						clientDirty: {
							'u': {
								shareCount: newShareNum,
							}
						},
						id: id,
					});
				}
			} else {
				LogsManager.echo('获取全局用户数据失败', "params:" + JSON.stringify(params) + "response:" + response);
			}
		});

	}

	/**
	 * 设置邀请信息
	 * @param id 发起邀请的人的id
	 */
	static setInviteUser(inviterId) {
		if (inviterId == 'nologin') {
			return;
		}
		var shareInfos = {};
		shareInfos[UserModel.instance.getUserRid()] = {active: 1};
		var param = {
			clientDirty: {
				"u": {
					shareInfo: shareInfos
				}
			},
			id: inviterId,
		};
		LogsManager.echo("设置我被别人邀请的标识----param:" + JSON.stringify(param));
		Client.instance.setCloudGlobalData(param);
	};

	/**获取体力邀请info */
	getInviteCount() {
		return this._data.shareInfo || {};
	}
}
