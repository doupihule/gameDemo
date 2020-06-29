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
    public class XLuaXLuaHelperWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(XLua.XLuaHelper);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 39, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadCloneGameObject", _m_LoadCloneGameObject_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadCloneGameObjectAsync", _m_LoadCloneGameObjectAsync_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadUObject", _m_LoadUObject_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadShader", _m_LoadShader_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetPoints", _m_GetPoints_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetSizes", _m_GetSizes_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetPaths", _m_GetPaths_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetPathSizes", _m_GetPathSizes_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "UnLoadUObject", _m_UnLoadUObject_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadUObjectAsync", _m_LoadUObjectAsync_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ReleaseAsset", _m_ReleaseAsset_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "UnloadBundle", _m_UnloadBundle_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "IsNull", _m_IsNull_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "InputClick", _m_InputClick_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "CreateEmptyGameObject", _m_CreateEmptyGameObject_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "CreateRenderTexture", _m_CreateRenderTexture_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LoadUILuaTable", _m_LoadUILuaTable_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "FillCompoents", _m_FillCompoents_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SetLocalScale", _m_SetLocalScale_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SetPosition", _m_SetPosition_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SetLocalPosition", _m_SetLocalPosition_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ParseDistance", _m_ParseDistance_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ParseVector3", _m_ParseVector3_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SearchInChildSprite", _m_SearchInChildSprite_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "OnlyEncrypt", _m_OnlyEncrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "OnlyDecrypt", _m_OnlyDecrypt_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetComponent", _m_GetComponent_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "Find", _m_Find_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ParentTransform", _m_ParentTransform_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetLuaTable", _m_GetLuaTable_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetGameObjectComponent", _m_GetGameObjectComponent_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "CheckReourceUpdate", _m_CheckReourceUpdate_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "DownloadResources", _m_DownloadResources_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "DownloadDispose", _m_DownloadDispose_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "UncompressResources", _m_UncompressResources_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ResetResourceManager", _m_ResetResourceManager_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "LocalGameVersion", _m_LocalGameVersion_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "ServerVersion", _m_ServerVersion_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					XLua.XLuaHelper gen_ret = new XLua.XLuaHelper();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadCloneGameObject_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Transform>(L, 4)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 4, typeof(UnityEngine.Transform));
                    
                        UnityEngine.GameObject gen_ret = XLua.XLuaHelper.LoadCloneGameObject( _assetName, _path, _bundleName, _parent );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    
                        UnityEngine.GameObject gen_ret = XLua.XLuaHelper.LoadCloneGameObject( _assetName, _path, _bundleName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.LoadCloneGameObject!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadCloneGameObjectAsync_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<System.Action<UnityEngine.GameObject>>(L, 4)&& translator.Assignable<UnityEngine.Transform>(L, 5)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    System.Action<UnityEngine.GameObject> _callback = translator.GetDelegate<System.Action<UnityEngine.GameObject>>(L, 4);
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 5, typeof(UnityEngine.Transform));
                    
                    XLua.XLuaHelper.LoadCloneGameObjectAsync( _assetName, _path, _bundleName, _callback, _parent );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<System.Action<UnityEngine.GameObject>>(L, 4)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    System.Action<UnityEngine.GameObject> _callback = translator.GetDelegate<System.Action<UnityEngine.GameObject>>(L, 4);
                    
                    XLua.XLuaHelper.LoadCloneGameObjectAsync( _assetName, _path, _bundleName, _callback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.LoadCloneGameObjectAsync!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadUObject_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    
                        UnityEngine.Object gen_ret = XLua.XLuaHelper.LoadUObject( _assetName, _path, _bundleName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadShader_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _shaderName = LuaAPI.lua_tostring(L, 1);
                    string _bundleName = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Shader gen_ret = XLua.XLuaHelper.LoadShader( _shaderName, _bundleName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetPoints_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.Vector3 _a;translator.Get(L, 1, out _a);
                    UnityEngine.Vector3 _b;translator.Get(L, 2, out _b);
                    float _pointCount = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        System.Collections.Generic.List<UnityEngine.Vector3> gen_ret = XLua.XLuaHelper.GetPoints( _a, _b, _pointCount );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetSizes_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    float _a = (float)LuaAPI.lua_tonumber(L, 1);
                    float _b = (float)LuaAPI.lua_tonumber(L, 2);
                    float _pointCount = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        System.Collections.Generic.List<float> gen_ret = XLua.XLuaHelper.GetSizes( _a, _b, _pointCount );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetPaths_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.Collections.Generic.List<UnityEngine.Vector3> _points = (System.Collections.Generic.List<UnityEngine.Vector3>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<UnityEngine.Vector3>));
                    float _pointCount = (float)LuaAPI.lua_tonumber(L, 2);
                    UnityEngine.GameObject _parentObj = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    
                        UnityEngine.Vector3[] gen_ret = XLua.XLuaHelper.GetPaths( _points, _pointCount, _parentObj );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetPathSizes_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.Collections.Generic.List<float> _sizes = (System.Collections.Generic.List<float>)translator.GetObject(L, 1, typeof(System.Collections.Generic.List<float>));
                    float _pointCount = (float)LuaAPI.lua_tonumber(L, 2);
                    
                        float[] gen_ret = XLua.XLuaHelper.GetPathSizes( _sizes, _pointCount );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnLoadUObject_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    object _obj = translator.GetObject(L, 1, typeof(object));
                    
                    XLua.XLuaHelper.UnLoadUObject( _obj );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadUObjectAsync_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    System.Action<UnityEngine.Object> _callback = translator.GetDelegate<System.Action<UnityEngine.Object>>(L, 4);
                    
                    XLua.XLuaHelper.LoadUObjectAsync( _assetName, _path, _bundleName, _callback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ReleaseAsset_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 1);
                    string _assetName = LuaAPI.lua_tostring(L, 2);
                    
                    XLua.XLuaHelper.ReleaseAsset( _bundleName, _assetName );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnloadBundle_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _bundleName = LuaAPI.lua_tostring(L, 1);
                    bool _unloadAllLoadedObjects = LuaAPI.lua_toboolean(L, 2);
                    
                    XLua.XLuaHelper.UnloadBundle( _bundleName, _unloadAllLoadedObjects );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_IsNull_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    
                        bool gen_ret = XLua.XLuaHelper.IsNull( _obj );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_InputClick_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        bool gen_ret = XLua.XLuaHelper.InputClick(  );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CreateEmptyGameObject_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.GameObject>(L, 2)) 
                {
                    string _name = LuaAPI.lua_tostring(L, 1);
                    UnityEngine.GameObject _parentObj = (UnityEngine.GameObject)translator.GetObject(L, 2, typeof(UnityEngine.GameObject));
                    
                        UnityEngine.GameObject gen_ret = XLua.XLuaHelper.CreateEmptyGameObject( _name, _parentObj );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)) 
                {
                    string _name = LuaAPI.lua_tostring(L, 1);
                    
                        UnityEngine.GameObject gen_ret = XLua.XLuaHelper.CreateEmptyGameObject( _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.CreateEmptyGameObject!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CreateRenderTexture_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    float _width = (float)LuaAPI.lua_tonumber(L, 1);
                    float _height = (float)LuaAPI.lua_tonumber(L, 2);
                    
                        UnityEngine.RenderTexture gen_ret = XLua.XLuaHelper.CreateRenderTexture( _width, _height );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LoadUILuaTable_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Transform>(L, 4)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 4, typeof(UnityEngine.Transform));
                    
                        XLua.LuaTable gen_ret = XLua.XLuaHelper.LoadUILuaTable( _assetName, _path, _bundleName, _parent );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    string _assetName = LuaAPI.lua_tostring(L, 1);
                    string _path = LuaAPI.lua_tostring(L, 2);
                    string _bundleName = LuaAPI.lua_tostring(L, 3);
                    
                        XLua.LuaTable gen_ret = XLua.XLuaHelper.LoadUILuaTable( _assetName, _path, _bundleName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.LoadUILuaTable!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillCompoents_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    XLua.LuaTable _t = (XLua.LuaTable)translator.GetObject(L, 1, typeof(XLua.LuaTable));
                    UnityEngine.GameObject _g = (UnityEngine.GameObject)translator.GetObject(L, 2, typeof(UnityEngine.GameObject));
                    string _path = LuaAPI.lua_tostring(L, 3);
                    
                    XLua.XLuaHelper.FillCompoents( _t, _g, _path );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetLocalScale_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.Transform _t = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    XLua.XLuaHelper.SetLocalScale( _t, _x, _y );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetPosition_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.Transform _t = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    XLua.XLuaHelper.SetPosition( _t, _x, _y );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetLocalPosition_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.Transform _t = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    XLua.XLuaHelper.SetLocalPosition( _t, _x, _y );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ParseDistance_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _positionstr = LuaAPI.lua_tostring(L, 1);
                    UnityEngine.Vector3 _position;translator.Get(L, 2, out _position);
                    
                        float gen_ret = XLua.XLuaHelper.ParseDistance( _positionstr, _position );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ParseVector3_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _positionstr = LuaAPI.lua_tostring(L, 1);
                    
                        UnityEngine.Vector3 gen_ret = XLua.XLuaHelper.ParseVector3( _positionstr );
                        translator.PushUnityEngineVector3(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SearchInChildSprite_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.GameObject>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    string _contains = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Sprite[] gen_ret = XLua.XLuaHelper.SearchInChildSprite( _obj, _contains );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1&& translator.Assignable<UnityEngine.GameObject>(L, 1)) 
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    
                        UnityEngine.Sprite[] gen_ret = XLua.XLuaHelper.SearchInChildSprite( _obj );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.SearchInChildSprite!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_OnlyEncrypt_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    string _text = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = XLua.XLuaHelper.OnlyEncrypt( _text );
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
                    string _text = LuaAPI.lua_tostring(L, 1);
                    
                        string gen_ret = XLua.XLuaHelper.OnlyDecrypt( _text );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetComponent_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.GameObject>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Component gen_ret = XLua.XLuaHelper.GetComponent( _obj, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Transform>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.Transform _trans = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Component gen_ret = XLua.XLuaHelper.GetComponent( _trans, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.GetComponent!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Find_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.GameObject>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.GameObject gen_ret = XLua.XLuaHelper.Find( _obj, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Transform>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.Transform _trans = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Transform gen_ret = XLua.XLuaHelper.Find( _trans, _name );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.Transform>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.Transform _trans = (UnityEngine.Transform)translator.GetObject(L, 1, typeof(UnityEngine.Transform));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    string _type = LuaAPI.lua_tostring(L, 3);
                    
                        UnityEngine.Component gen_ret = XLua.XLuaHelper.Find( _trans, _name, _type );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.GameObject>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    string _name = LuaAPI.lua_tostring(L, 2);
                    string _type = LuaAPI.lua_tostring(L, 3);
                    
                        UnityEngine.Component gen_ret = XLua.XLuaHelper.Find( _obj, _name, _type );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to XLua.XLuaHelper.Find!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ParentTransform_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.GameObject _childObj = (UnityEngine.GameObject)translator.GetObject(L, 1, typeof(UnityEngine.GameObject));
                    UnityEngine.GameObject _obj = (UnityEngine.GameObject)translator.GetObject(L, 2, typeof(UnityEngine.GameObject));
                    
                    XLua.XLuaHelper.ParentTransform( _childObj, _obj );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetLuaTable_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _gameObjectName = LuaAPI.lua_tostring(L, 1);
                    
                        XLua.LuaTable gen_ret = XLua.XLuaHelper.GetLuaTable( _gameObjectName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetGameObjectComponent_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    string _gameObjectName = LuaAPI.lua_tostring(L, 1);
                    string _componentName = LuaAPI.lua_tostring(L, 2);
                    
                        UnityEngine.Component gen_ret = XLua.XLuaHelper.GetGameObjectComponent( _gameObjectName, _componentName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CheckReourceUpdate_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.Action<float, float> _checkCallback = translator.GetDelegate<System.Action<float, float>>(L, 1);
                    System.Action<string> _versionCallback = translator.GetDelegate<System.Action<string>>(L, 2);
                    
                    XLua.XLuaHelper.CheckReourceUpdate( _checkCallback, _versionCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DownloadResources_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.Action<long, long, long> _downloadCallback = translator.GetDelegate<System.Action<long, long, long>>(L, 1);
                    
                    XLua.XLuaHelper.DownloadResources( _downloadCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DownloadDispose_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                    XLua.XLuaHelper.DownloadDispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UncompressResources_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    System.Action<int, int> _uncompressCallback = translator.GetDelegate<System.Action<int, int>>(L, 1);
                    
                    XLua.XLuaHelper.UncompressResources( _uncompressCallback );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ResetResourceManager_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                    XLua.XLuaHelper.ResetResourceManager(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_LocalGameVersion_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        string gen_ret = XLua.XLuaHelper.LocalGameVersion(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ServerVersion_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    
                        string gen_ret = XLua.XLuaHelper.ServerVersion(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
