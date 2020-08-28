import BaseViewExpand from "./BaseViewExpand";


export default class BaseContainer extends BaseViewExpand{
	constructor(cobj=null) {
		super();
		if (cobj){
			this.setCObject(cobj);
		} else{

		}
	}
}
