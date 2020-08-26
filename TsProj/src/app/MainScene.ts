import {ui} from "../ui/layaMaxUI";

export default class MainScene extends ui.MainSceneUI {
	//实例
	public static instance: MainScene;

	constructor() {
		super();
		MainScene.instance = this;
	}


	recvMsg(e) {

	}
}