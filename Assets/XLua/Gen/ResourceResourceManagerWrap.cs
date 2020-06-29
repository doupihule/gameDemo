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
    public class ResourceResourceManagerWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Resource.ResourceManager);
			Utils.BeginObjectRegister(type, L, translator, 0, 14, 2, 4);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Init", _m_Init);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Dispose", _m_Dispose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "CheckReourceUpdate", _m_CheckReourceUpdate);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "DownloadResources", _m_DownloadResources);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "DownloadDispose", _m_DownloadDispose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UncompressResources", _m_UncompressResources);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RemoveDonwloadObject", _m_RemoveDonwloadObject);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "InitLoadManager", _m_InitLoadManager);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindInBundle", _m_FindInBundle);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetCustomSpriteRendererMaterial", _m_GetCustomSpriteRendererMaterial);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ReleaseAsset", _m_ReleaseAsset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnloadBundleByName", _m_UnloadBundleByName);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetBundleInfo", _m_GetBundleInfo);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetString", _m_GetString);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "currentSceneName", _g_get_currentSceneName);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "spriteRendererMaterialDic", _g_get_spriteRendererMaterialDic);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "luaLoadResource", _s_set_luaLoadResource);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "multiLanguageHelper", _s_set_multiLanguageHelper);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "currentSceneName", _s_set_currentSceneName);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "spriteRendererMaterialDic", _s_set_spriteRendererMaterialDic);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 4, 6, 5);
			
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BUNDLE_PATH", Resource.ResourceManager.BUNDLE_PATH);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "BYTES_PATH", Resource.ResourceManager.BYTES_PATH);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "TEMP_PATH", Resource.ResourceManager.TEMP_PATH);
            
			Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "Instance", _g_get_Instance);
            Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "assetPath", _g_get_assetPath);
            Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "bytesLuaTxtPath", _g_get_bytesLuaTxtPath);
            Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "gameVersion", _g_get_gameVersion);
            Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "bytesVersion", _g_get_bytesVersion);
            Utils.RegisterFunc(L, Utils.CLS_GETTER_IDX, "bundleVersion", _g_get_bundleVersion);
            
			Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "assetPath", _s_set_assetPath);
            Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "bytesLuaTxtPath", _s_set_bytesLuaTxtPath);
            Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "gameVersion", _s_set_gameVersion);
            Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "bytesVersion", _s_set_bytesVersion);
            Utils.RegisterFunc(L, Utils.CLS_SETTER_IDX, "bundleVersion", _s_set_bundleVersion);
            
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Resource.ResourceManager does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Init(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.GameObject _go = (UnityEngine.GameObject)translator.GetObject(L, 2, typeof(UnityEngine.GameObject));
                    
                    gen_to_be_invoked.Init( _go );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Dispose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Dispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CheckReourceUpdate(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    System.Action<float, float> _checkCallback = translator.GetDelegate<System.Action<float, float>>(L, 2);
                    System.Action<string> _versionCallback = translator.GetDelegate<System.Action<string>>(L, 3);
                    
                    gen_to_be_invoked.CheckReourceUpdate( _checkCallback, _versionCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DownloadResources(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    System.Action<long, long, long> _updateCallback = translator.GetDelegate<System.Action<long, long, long>>(L, 2);
                    
                    gen_to_be_invoked.DownloadResources( _updateCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DownloadDispose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.DownloadDispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UncompressResources(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    System.Action<int, int> _uncompressCallback = translator.GetDelegate<System.Action<int, int>>(L, 2);
                    
                    gen_to_be_invoked.UncompressResources( _uncompressCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RemoveDonwloadObject(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.RemoveDonwloadObject(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_InitLoadManager(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.InitLoadManager(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindInBundle(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    string _shaderName = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    
                        UnityEngine.Shader gen_ret = gen_to_be_invoked.FindInBundle( _shaderName, _bundleName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _shaderName = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Shader gen_ret = gen_to_be_invoked.FindInBundle( _shaderName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.ResourceManager.FindInBundle!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetCustomSpriteRendererMaterial(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Texture2D _alphaTexture2d = (UnityEngine.Texture2D)translator.GetObject(L, 2, typeof(UnityEngine.Texture2D));
                    
                        UnityEngine.Material gen_ret = gen_to_be_invoked.GetCustomSpriteRendererMaterial( _alphaTexture2d );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ReleaseAsset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    string _assetName = LuaAPI.lua_tostring(L, 3);
                    
                    gen_to_be_invoked.ReleaseAsset( _bundleName, _assetName );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnloadBundleByName(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    bool _unloadAllLoadedObjects = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.UnloadBundleByName( _bundleName, _unloadAllLoadedObjects );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.UnloadBundleByName( _bundleName );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.ResourceManager.UnloadBundleByName!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetBundleInfo(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        string[] gen_ret = gen_to_be_invoked.GetBundleInfo( _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _id = LuaAPI.lua_tostring(L, 2);
                    
                        string gen_ret = gen_to_be_invoked.GetString( _id );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Instance(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			    translator.Push(L, Resource.ResourceManager.Instance);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_assetPath(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushstring(L, Resource.ResourceManager.assetPath);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_bytesLuaTxtPath(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushstring(L, Resource.ResourceManager.bytesLuaTxtPath);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_currentSceneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.currentSceneName);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_gameVersion(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.lua_pushstring(L, Resource.ResourceManager.gameVersion);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_bytesVersion(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.xlua_pushinteger(L, Resource.ResourceManager.bytesVersion);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_bundleVersion(RealStatePtr L)
        {
		    try {
            
			    LuaAPI.xlua_pushinteger(L, Resource.ResourceManager.bundleVersion);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_spriteRendererMaterialDic(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.spriteRendererMaterialDic);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_luaLoadResource(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.luaLoadResource = (XLua.LuaTable)translator.GetObject(L, 2, typeof(XLua.LuaTable));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_multiLanguageHelper(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.multiLanguageHelper = (XLua.LuaTable)translator.GetObject(L, 2, typeof(XLua.LuaTable));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_assetPath(RealStatePtr L)
        {
		    try {
                
			    Resource.ResourceManager.assetPath = LuaAPI.lua_tostring(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_bytesLuaTxtPath(RealStatePtr L)
        {
		    try {
                
			    Resource.ResourceManager.bytesLuaTxtPath = LuaAPI.lua_tostring(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_currentSceneName(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.currentSceneName = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_gameVersion(RealStatePtr L)
        {
		    try {
                
			    Resource.ResourceManager.gameVersion = LuaAPI.lua_tostring(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_bytesVersion(RealStatePtr L)
        {
		    try {
                
			    Resource.ResourceManager.bytesVersion = LuaAPI.xlua_tointeger(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_bundleVersion(RealStatePtr L)
        {
		    try {
                
			    Resource.ResourceManager.bundleVersion = LuaAPI.xlua_tointeger(L, 1);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_spriteRendererMaterialDic(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Resource.ResourceManager gen_to_be_invoked = (Resource.ResourceManager)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.spriteRendererMaterialDic = (System.Collections.Generic.Dictionary<string, UnityEngine.Material>)translator.GetObject(L, 2, typeof(System.Collections.Generic.Dictionary<string, UnityEngine.Material>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
