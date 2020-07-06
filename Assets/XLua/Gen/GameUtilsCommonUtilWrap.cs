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
    public class GameUtilsCommonUtilWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(GameUtils.CommonUtil);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 7, 1, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GetPlatformString", _m_GetPlatformString_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "EncodingToMd5", _m_EncodingToMd5_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ReverseBytes", _m_ReverseBytes_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetTimeStamp", _m_GetTimeStamp_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetTimeMiniStamp", _m_GetTimeMiniStamp_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "DebugLogByteArrayContent", _m_DebugLogByteArrayContent_xlua_st_);
            
			
            
			Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "IsIphoneX", _g_get_IsIphoneX);
            
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					GameUtils.CommonUtil gen_ret = new GameUtils.CommonUtil();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.CommonUtil constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetPlatformString_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        string gen_ret = GameUtils.CommonUtil.GetPlatformString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_EncodingToMd5_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _data = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.CommonUtil.EncodingToMd5( _data );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ReverseBytes_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    byte[] _inArray = LuaAPI.lua_tobytes(L, 1);
                    
                        byte[] gen_ret = GameUtils.CommonUtil.ReverseBytes( _inArray );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetTimeStamp_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        string gen_ret = GameUtils.CommonUtil.GetTimeStamp(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetTimeMiniStamp_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        long gen_ret = GameUtils.CommonUtil.GetTimeMiniStamp(  );
                        LuaAPI.lua_pushint64(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DebugLogByteArrayContent_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    byte[] _data = LuaAPI.lua_tobytes(L, 1);
                    int _length = LuaAPI.xlua_tointeger(L, 2);
                    string _name = LuaAPI.lua_tostring(L, 3);
                    
                    GameUtils.CommonUtil.DebugLogByteArrayContent( _data, _length, _name );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IsIphoneX(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushboolean(L, GameUtils.CommonUtil.IsIphoneX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
		
		
    }
}
