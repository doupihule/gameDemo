import LogsManager from "../../../framework/manager/LogsManager";

export default class BattleLogsManager{

    static _instance:BattleLogsManager;
    
    //是否显示战斗日志
    static isShowBattleLog:boolean =true;

    static debugRoleIDs:string[];

    static get instance(){
        if(!this._instance){
            this._instance = new BattleLogsManager();
        }
        return this._instance;
    }

    //战斗中的输出管理
    static battleEcho(message?: any, ...optionalParams: any[]){
        if(!this.isShowBattleLog){
            return;
        }
        LogsManager.echo(message,...optionalParams);
    }

    static battleWarn(message?: any, ...optionalParams: any[]){
        if(!this.isShowBattleLog){
            return;
        }
        LogsManager.warn(message,...optionalParams);
    }

    //调试某个角色相关的日志
    static debugByRole(roleId,message?: any, ...optionalParams: any[]){
        if(!this.debugRoleIDs){
            return;
        }  
        //0表示调试所有角色
        if( this.debugRoleIDs.length>0){
            //如果不在调试列表里.不执行
            if(this.debugRoleIDs.indexOf(roleId) == -1){
                return;
            }
        }
        
        this.battleEcho(message,...optionalParams);

    }


    static battleError(...optionalParams:any){
        LogsManager.errorTag(...optionalParams);
    }

}