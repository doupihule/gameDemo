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
    public class ResourceFileVersionDataWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Resource.FileVersionData);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 6, 6);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetString", _m_GetString);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetVersionString", _m_GetVersionString);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetTempListString", _m_GetTempListString);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "fileType", _g_get_fileType);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "filePath", _g_get_filePath);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "fileName", _g_get_fileName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "fileSize", _g_get_fileSize);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "version", _g_get_version);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "memoryStream", _g_get_memoryStream);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "fileType", _s_set_fileType);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "filePath", _s_set_filePath);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "fileName", _s_set_fileName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "fileSize", _s_set_fileSize);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "version", _s_set_version);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "memoryStream", _s_set_memoryStream);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 2, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "ParseFileVersionData", _m_ParseFileVersionData_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Resource.FileVersionData gen_ret = new Resource.FileVersionData();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.FileVersionData constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2) || LuaAPI.lua_isint64(L, 2))) 
                {
                    long _v = LuaAPI.lua_toint64(L, 2);
                    
                        string gen_ret = gen_to_be_invoked.GetString( _v );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1) 
                {
                    
                        string gen_ret = gen_to_be_invoked.GetString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.FileVersionData.GetString!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetVersionString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        string gen_ret = gen_to_be_invoked.GetVersionString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetTempListString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _prefix = LuaAPI.lua_tostring(L, 2);
                    
                        string gen_ret = gen_to_be_invoked.GetTempListString( _prefix );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1) 
                {
                    
                        string gen_ret = gen_to_be_invoked.GetTempListString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.FileVersionData.GetTempListString!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ParseFileVersionData_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<string[]>(L, 1)&& translator.Assignable<Resource.AssetType>(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    string[] _strs = (string[])translator.GetObject(L, 1, typeof(string[]));
                    Resource.AssetType _fileType;translator.Get(L, 2, out _fileType);
                    string _logStr = LuaAPI.lua_tostring(L, 3);
                    
                        System.Collections.Generic.List<Resource.FileVersionData> gen_ret = Resource.FileVersionData.ParseFileVersionData( _strs, _fileType, _logStr );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<string[]>(L, 1)&& translator.Assignable<Resource.AssetType>(L, 2)) 
                {
                    string[] _strs = (string[])translator.GetObject(L, 1, typeof(string[]));
                    Resource.AssetType _fileType;translator.Get(L, 2, out _fileType);
                    
                        System.Collections.Generic.List<Resource.FileVersionData> gen_ret = Resource.FileVersionData.ParseFileVersionData( _strs, _fileType );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1&& translator.Assignable<string[]>(L, 1)) 
                {
                    string[] _strs = (string[])translator.GetObject(L, 1, typeof(string[]));
                    
                        System.Collections.Generic.List<Resource.FileVersionData> gen_ret = Resource.FileVersionData.ParseFileVersionData( _strs );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.FileVersionData.ParseFileVersionData!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fileType(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.fileType);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_filePath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.filePath);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fileName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.fileName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fileSize(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushint64(L, gen_to_be_invoked.fileSize);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_version(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushint64(L, gen_to_be_invoked.version);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_memoryStream(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.memoryStream);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fileType(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                Resource.AssetType gen_value;translator.Get(L, 2, out gen_value);
				gen_to_be_invoked.fileType = gen_value;
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_filePath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.filePath = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fileName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.fileName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fileSize(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.fileSize = LuaAPI.lua_toint64(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_version(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.version = LuaAPI.lua_toint64(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_memoryStream(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.FileVersionData gen_to_be_invoked = (Resource.FileVersionData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.memoryStream = (System.IO.MemoryStream)translator.GetObject(L, 2, typeof(System.IO.MemoryStream));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
