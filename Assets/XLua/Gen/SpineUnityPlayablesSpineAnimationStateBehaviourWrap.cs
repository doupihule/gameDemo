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
    public class SpineUnityPlayablesSpineAnimationStateBehaviourWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SpineAnimationStateBehaviour);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 7, 7);
			
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "animationReference", _g_get_animationReference);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "loop", _g_get_loop);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "customDuration", _g_get_customDuration);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "mixDuration", _g_get_mixDuration);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "attachmentThreshold", _g_get_attachmentThreshold);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "eventThreshold", _g_get_eventThreshold);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "drawOrderThreshold", _g_get_drawOrderThreshold);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "animationReference", _s_set_animationReference);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "loop", _s_set_loop);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "customDuration", _s_set_customDuration);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "mixDuration", _s_set_mixDuration);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "attachmentThreshold", _s_set_attachmentThreshold);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "eventThreshold", _s_set_eventThreshold);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "drawOrderThreshold", _s_set_drawOrderThreshold);
            
			
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
					
					Spine.Unity.Playables.SpineAnimationStateBehaviour gen_ret = new Spine.Unity.Playables.SpineAnimationStateBehaviour();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SpineAnimationStateBehaviour constructor!");
            
        }
        
		
        
		
        
        
        
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_animationReference(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.animationReference);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_loop(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.loop);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_customDuration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.customDuration);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_mixDuration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.mixDuration);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_attachmentThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.attachmentThreshold);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_eventThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.eventThreshold);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_drawOrderThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.drawOrderThreshold);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_animationReference(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.animationReference = (Spine.Unity.AnimationReferenceAsset)translator.GetObject(L, 2, typeof(Spine.Unity.AnimationReferenceAsset));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_loop(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.loop = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_customDuration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.customDuration = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_mixDuration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.mixDuration = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_attachmentThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.attachmentThreshold = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_eventThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.eventThreshold = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_drawOrderThreshold(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.drawOrderThreshold = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
