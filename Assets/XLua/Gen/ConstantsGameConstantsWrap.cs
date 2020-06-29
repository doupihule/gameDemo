#if USE_UNI_LUA
using LuaAPI = UniLua.Lua;
using RealStatePtr = UniLua.ILuaState;
using LuaCSFunction = UniLua.CSharpFunctionDelegate;
#else
using LuaAPI = XLua.LuaDLL.Lua;
using RealStatePtr = System.IntPtr;
using LuaCSFunction = XLua.LuaDLL.lua_CSFunction;
#endif

using XLua;
using System.Collections.Generic;


namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class ConstantsGameConstantsWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Constants.GameConstants);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 11, 1, 1);
			
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "SERVER_URL_BRANCH", Constants.GameConstants.SERVER_URL_BRANCH);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ZIP_SECRET_KEY", Constants.GameConstants.ZIP_SECRET_KEY);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BUNDLE_EXT_NAME", Constants.GameConstants.BUNDLE_EXT_NAME);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BUNDLE_MANIFEST", Constants.GameConstants.BUNDLE_MANIFEST);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "LOCAL_ZIP_TIMETAMP_PATH", Constants.GameConstants.LOCAL_ZIP_TIMETAMP_PATH);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "LOCAL_BYTE_TIMETAMP_PATH", Constants.GameConstants.LOCAL_BYTE_TIMETAMP_PATH);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ZIP_FILE_LIST_DAT", Constants.GameConstants.ZIP_FILE_LIST_DAT);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BYTE_FILE_LIST_DAT", Constants.GameConstants.BYTE_FILE_LIST_DAT);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "VERSION_FILE_NAME", Constants.GameConstants.VERSION_FILE_NAME);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "DOWN_LOAD_COMPLETE_MARK", Constants.GameConstants.DOWN_LOAD_COMPLETE_MARK);
            
			Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "LoadAssetByEditor", _g_get_LoadAssetByEditor);
            
			Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "LoadAssetByEditor", _s_set_LoadAssetByEditor);
            
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Constants.GameConstants gen_ret = new Constants.GameConstants();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Constants.GameConstants constructor!");
            
        }
        
		
        
		
        
        
        
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_LoadAssetByEditor(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushboolean(L, Constants.GameConstants.LoadAssetByEditor);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_LoadAssetByEditor(RealStatePtr L)
        {
		    try {
                
			    Constants.GameConstants.LoadAssetByEditor = LuaAPI.lua_toboolean(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
