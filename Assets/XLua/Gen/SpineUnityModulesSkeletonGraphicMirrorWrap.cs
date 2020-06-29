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
    public class SpineUnityModulesSkeletonGraphicMirrorWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonGraphicMirror);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 3, 3);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "StartMirroring", _m_StartMirroring);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UpdateTexture", _m_UpdateTexture);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RestoreIndependentSkeleton", _m_RestoreIndependentSkeleton);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "source", _g_get_source);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "mirrorOnStart", _g_get_mirrorOnStart);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "restoreOnDisable", _g_get_restoreOnDisable);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "source", _s_set_source);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "mirrorOnStart", _s_set_mirrorOnStart);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "restoreOnDisable", _s_set_restoreOnDisable);
            
			
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
					
					Spine.Unity.Modules.SkeletonGraphicMirror gen_ret = new Spine.Unity.Modules.SkeletonGraphicMirror();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonGraphicMirror constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_StartMirroring(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.StartMirroring(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UpdateTexture(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Texture2D _newOverrideTexture = (UnityEngine.Texture2D)translator.GetObject(L, 2, typeof(UnityEngine.Texture2D));
                    
                    gen_to_be_invoked.UpdateTexture( _newOverrideTexture );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RestoreIndependentSkeleton(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.RestoreIndependentSkeleton(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_source(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.source);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_mirrorOnStart(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.mirrorOnStart);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_restoreOnDisable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.restoreOnDisable);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_source(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.source = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_mirrorOnStart(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.mirrorOnStart = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_restoreOnDisable(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonGraphicMirror gen_to_be_invoked = (Spine.Unity.Modules.SkeletonGraphicMirror)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.restoreOnDisable = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
