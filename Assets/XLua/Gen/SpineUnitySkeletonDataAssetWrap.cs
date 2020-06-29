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
    public class SpineUnitySkeletonDataAssetWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SkeletonDataAsset);
			Utils.BeginObjectRegister(type, L, translator, 0, 4, 9, 8);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Clear", _m_Clear);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetSkeletonData", _m_GetSkeletonData);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FillStateData", _m_FillStateData);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetAnimationStateData", _m_GetAnimationStateData);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "IsLoaded", _g_get_IsLoaded);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "atlasAssets", _g_get_atlasAssets);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "scale", _g_get_scale);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonJSON", _g_get_skeletonJSON);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "fromAnimation", _g_get_fromAnimation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "toAnimation", _g_get_toAnimation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "duration", _g_get_duration);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "defaultMix", _g_get_defaultMix);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "controller", _g_get_controller);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "atlasAssets", _s_set_atlasAssets);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "scale", _s_set_scale);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonJSON", _s_set_skeletonJSON);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "fromAnimation", _s_set_fromAnimation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "toAnimation", _s_set_toAnimation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "duration", _s_set_duration);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "defaultMix", _s_set_defaultMix);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "controller", _s_set_controller);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 2, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "CreateRuntimeInstance", _m_CreateRuntimeInstance_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SkeletonDataAsset gen_ret = new Spine.Unity.SkeletonDataAsset();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonDataAsset constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CreateRuntimeInstance_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& translator.Assignable<UnityEngine.TextAsset>(L, 1)&& translator.Assignable<Spine.Unity.AtlasAsset>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    UnityEngine.TextAsset _skeletonDataFile = (UnityEngine.TextAsset)translator.GetObject(L, 1, typeof(UnityEngine.TextAsset));
                    Spine.Unity.AtlasAsset _atlasAsset = (Spine.Unity.AtlasAsset)translator.GetObject(L, 2, typeof(Spine.Unity.AtlasAsset));
                    bool _initialize = LuaAPI.lua_toboolean(L, 3);
                    float _scale = (float)LuaAPI.lua_tonumber(L, 4);
                    
                        Spine.Unity.SkeletonDataAsset gen_ret = Spine.Unity.SkeletonDataAsset.CreateRuntimeInstance( _skeletonDataFile, _atlasAsset, _initialize, _scale );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.TextAsset>(L, 1)&& translator.Assignable<Spine.Unity.AtlasAsset>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    UnityEngine.TextAsset _skeletonDataFile = (UnityEngine.TextAsset)translator.GetObject(L, 1, typeof(UnityEngine.TextAsset));
                    Spine.Unity.AtlasAsset _atlasAsset = (Spine.Unity.AtlasAsset)translator.GetObject(L, 2, typeof(Spine.Unity.AtlasAsset));
                    bool _initialize = LuaAPI.lua_toboolean(L, 3);
                    
                        Spine.Unity.SkeletonDataAsset gen_ret = Spine.Unity.SkeletonDataAsset.CreateRuntimeInstance( _skeletonDataFile, _atlasAsset, _initialize );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<UnityEngine.TextAsset>(L, 1)&& translator.Assignable<Spine.Unity.AtlasAsset[]>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    UnityEngine.TextAsset _skeletonDataFile = (UnityEngine.TextAsset)translator.GetObject(L, 1, typeof(UnityEngine.TextAsset));
                    Spine.Unity.AtlasAsset[] _atlasAssets = (Spine.Unity.AtlasAsset[])translator.GetObject(L, 2, typeof(Spine.Unity.AtlasAsset[]));
                    bool _initialize = LuaAPI.lua_toboolean(L, 3);
                    float _scale = (float)LuaAPI.lua_tonumber(L, 4);
                    
                        Spine.Unity.SkeletonDataAsset gen_ret = Spine.Unity.SkeletonDataAsset.CreateRuntimeInstance( _skeletonDataFile, _atlasAssets, _initialize, _scale );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.TextAsset>(L, 1)&& translator.Assignable<Spine.Unity.AtlasAsset[]>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    UnityEngine.TextAsset _skeletonDataFile = (UnityEngine.TextAsset)translator.GetObject(L, 1, typeof(UnityEngine.TextAsset));
                    Spine.Unity.AtlasAsset[] _atlasAssets = (Spine.Unity.AtlasAsset[])translator.GetObject(L, 2, typeof(Spine.Unity.AtlasAsset[]));
                    bool _initialize = LuaAPI.lua_toboolean(L, 3);
                    
                        Spine.Unity.SkeletonDataAsset gen_ret = Spine.Unity.SkeletonDataAsset.CreateRuntimeInstance( _skeletonDataFile, _atlasAssets, _initialize );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonDataAsset.CreateRuntimeInstance!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Clear(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Clear(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetSkeletonData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    bool _quiet = LuaAPI.lua_toboolean(L, 2);
                    
                        Spine.SkeletonData gen_ret = gen_to_be_invoked.GetSkeletonData( _quiet );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillStateData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.FillStateData(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetAnimationStateData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.AnimationStateData gen_ret = gen_to_be_invoked.GetAnimationStateData(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IsLoaded(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.IsLoaded);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_atlasAssets(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.atlasAssets);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.scale);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonJSON(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonJSON);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_fromAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.fromAnimation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_toAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.toAnimation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_duration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.duration);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_defaultMix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.defaultMix);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_controller(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.controller);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_atlasAssets(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.atlasAssets = (Spine.Unity.AtlasAsset[])translator.GetObject(L, 2, typeof(Spine.Unity.AtlasAsset[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_scale(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.scale = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonJSON(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonJSON = (UnityEngine.TextAsset)translator.GetObject(L, 2, typeof(UnityEngine.TextAsset));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_fromAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.fromAnimation = (string[])translator.GetObject(L, 2, typeof(string[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_toAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.toAnimation = (string[])translator.GetObject(L, 2, typeof(string[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_duration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.duration = (float[])translator.GetObject(L, 2, typeof(float[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_defaultMix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.defaultMix = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_controller(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonDataAsset gen_to_be_invoked = (Spine.Unity.SkeletonDataAsset)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.controller = (UnityEngine.RuntimeAnimatorController)translator.GetObject(L, 2, typeof(UnityEngine.RuntimeAnimatorController));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
