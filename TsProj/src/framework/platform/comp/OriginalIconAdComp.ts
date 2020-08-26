import OriginalAdBaseComp from "./OriginalAdBaseComp";
import ChannelConst from "../../../game/sys/consts/ChannelConst";
import UserInfo from "../../common/UserInfo";
import GameSwitch from "../../common/GameSwitch";

export default class OriginalIconAdComp extends OriginalAdBaseComp {
	protected logName = 'original_icon';

	protected static _instance: OriginalIconAdComp;

	static get instance(): OriginalIconAdComp {
		if (!this._instance) {
			this._instance = new OriginalIconAdComp();
		}
		return this._instance;
	}

	public get adOriginalIds(): string {
		if (!this._adOriginalIds) {
			if (ChannelConst.getChannelConst(UserInfo.platformId).adOriginalIconIds) {
				this._adOriginalIds = (String(ChannelConst.getChannelConst(UserInfo.platformId).adOriginalIconIds)).split("|");
			}

			if (GameSwitch.getSwitchState(GameSwitch.ORIGIN_ICON_ID)) {
				this._adOriginalIds = (String(GameSwitch.getSwitchState(GameSwitch.ORIGIN_ICON_ID))).split("|");
				;
			}
		}
		return this._adOriginalIds;
	}

}
