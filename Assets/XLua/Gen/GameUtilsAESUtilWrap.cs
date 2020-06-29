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
    public class GameUtilsAESUtilWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(GameUtils.AESUtil);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 13, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "DESEncrypt", _m_DESEncrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "DESDecrypt", _m_DESDecrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "AESEncrypt", _m_AESEncrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "AESDecrypt", _m_AESDecrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "MD5Encrypt", _m_MD5Encrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "MD5Decrypt", _m_MD5Decrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GenerateKey", _m_GenerateKey_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "OnlyEncrypt", _m_OnlyEncrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "OnlyDecrypt", _m_OnlyDecrypt_xlua_st_);
            
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ENCRYPT_KEY", GameUtils.AESUtil.ENCRYPT_KEY);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ENCRYPT_IV", GameUtils.AESUtil.ENCRYPT_IV);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "KEY", GameUtils.AESUtil.KEY);
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					GameUtils.AESUtil gen_ret = new GameUtils.AESUtil();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.AESUtil constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DESEncrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _EncryptString = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.DESEncrypt( _EncryptString );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DESDecrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _DecryptString = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.DESDecrypt( _DecryptString );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AESEncrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _str = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.AESEncrypt( _str );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AESDecrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _str = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.AESDecrypt( _str );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_MD5Encrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _pToEncrypt = LuaAPI.lua_tostring(L, 1);
                    string _sKey = LuaAPI.lua_tostring(L, 2);
                    
                        string gen_ret = GameUtils.AESUtil.MD5Encrypt( _pToEncrypt, _sKey );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_MD5Decrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _pToDecrypt = LuaAPI.lua_tostring(L, 1);
                    string _sKey = LuaAPI.lua_tostring(L, 2);
                    
                        string gen_ret = GameUtils.AESUtil.MD5Decrypt( _pToDecrypt, _sKey );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GenerateKey_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        string gen_ret = GameUtils.AESUtil.GenerateKey(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_OnlyEncrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _texts = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.OnlyEncrypt( _texts );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_OnlyDecrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _texts = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = GameUtils.AESUtil.OnlyDecrypt( _texts );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
