import Global from "../../../utils/Global";
import UserInfo from "../../../framework/common/UserInfo";

export default class PackageConfig {

	static configData = null
		
	//client version
	static client_template_version:string = "{client_template_version}"
	//target platform
	static client_template_platformId:string = "{client_template_platformId}";

	static initCfgs(){
		if(this.client_template_version != "{client_template_version}"){
			Global.client_version = this.client_template_version;
		}
		if(this.client_template_platformId != "{client_template_platformId}" ){
			UserInfo.platformId =this.client_template_platformId;
		}

	}

}

