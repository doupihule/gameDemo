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
    public class ResourceLoadAssetBundleWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Resource.LoadAssetBundle);
			Utils.BeginObjectRegister(type, L, translator, 0, 7, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Init", _m_Init);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ReleaseAsset", _m_ReleaseAsset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnloadBundle", _m_UnloadBundle);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnloadAllBundles", _m_UnloadAllBundles);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "PreloadBundle", _m_PreloadBundle);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetAssetAsync", _m_GetAssetAsync);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "PrintBundles", _m_PrintBundles);
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 0, 0);
			
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Resource.LoadAssetBundle gen_ret = new Resource.LoadAssetBundle();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Resource.LoadAssetBundle constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Init(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Init(  );
                    
                    
                    
                    return 0;
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
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
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
        static int _m_UnloadBundle(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    bool _unloadAllLoadedObjects = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.UnloadBundle( _bundleName, _unloadAllLoadedObjects );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnloadAllBundles(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.UnloadAllBundles(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_PreloadBundle(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.PreloadBundle( _bundleName );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetAssetAsync(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _assetName = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    System.Action<UnityEngine.Object> _callback = translator.GetDelegate<System.Action<UnityEngine.Object>>(L, 4);
                    
                    gen_to_be_invoked.GetAssetAsync( _assetName, _bundleName, _callback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_PrintBundles(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Resource.LoadAssetBundle gen_to_be_invoked = (Resource.LoadAssetBundle)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.PrintBundles(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
