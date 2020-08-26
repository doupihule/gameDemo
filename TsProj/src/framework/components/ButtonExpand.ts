import BaseViewComponent from "./BaseViewExpand";
import UICompConst from "../consts/UICompConst";

//按钮
export default class ButtonExpand extends BaseViewComponent{

	constructor(cobj) {
		super();
		this.uitype = UICompConst.comp_btn;
		if (cobj){
			this.setCObject(cobj);
		}
	}
}
