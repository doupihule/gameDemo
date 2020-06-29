﻿#if USE_UNI_LUA
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
    public class SpineUnityPlayablesSpineAnimationStateClipWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SpineAnimationStateClip);
			Utils.BeginObjectRegister(type, L, translator, 0, 1, 2, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "CreatePlayable", _m_CreatePlayable);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "clipCaps", _g_get_clipCaps);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "template", _g_get_template);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "template", _s_set_template);
            
			
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
					
					Spine.Unity.Playables.SpineAnimationStateClip gen_ret = new Spine.Unity.Playables.SpineAnimationStateClip();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SpineAnimationStateClip constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CreatePlayable(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpineAnimationStateClip gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateClip)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Playables.PlayableGraph _graph;translator.Get(L, 2, out _graph);
                    UnityEngine.GameObject _owner = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    
                        UnityEngine.Playables.Playable gen_ret = gen_to_be_invoked.CreatePlayable( _graph, _owner );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_clipCaps(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateClip gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateClip)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.clipCaps);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_template(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateClip gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateClip)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.template);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_template(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpineAnimationStateClip gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateClip)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.template = (Spine.Unity.Playables.SpineAnimationStateBehaviour)translator.GetObject(L, 2, typeof(Spine.Unity.Playables.SpineAnimationStateBehaviour));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
