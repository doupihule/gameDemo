import IMessage from "../../interfaces/IMessage";
import UIBaseView from "../../../../framework/components/UIBaseView";


export class BattleUI extends UIBaseView implements IMessage {

	constructor() {
		super();

	}

	public  recvMsg(cmd: string, data: any): void {
	}

}