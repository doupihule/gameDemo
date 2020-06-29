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
    public class SpineUnityPlayablesSpineAnimationStateMixerBehaviourWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SpineAnimationStateMixerBehaviour);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ProcessFrame", _m_ProcessFrame);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "PreviewEditModePose", _m_PreviewEditModePose);
			
			
			
			
			
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
					
					Spine.Unity.Playables.SpineAnimationStateMixerBehaviour gen_ret = new Spine.Unity.Playables.SpineAnimationStateMixerBehaviour();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SpineAnimationStateMixerBehaviour constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ProcessFrame(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpineAnimationStateMixerBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateMixerBehaviour)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Playables.Playable _playable;translator.Get(L, 2, out _playable);
                    UnityEngine.Playables.FrameData _info;translator.Get(L, 3, out _info);
                    object _playerData = translator.GetObject(L, 4, typeof(object));
                    
                    gen_to_be_invoked.ProcessFrame( _playable, _info, _playerData );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_PreviewEditModePose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpineAnimationStateMixerBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineAnimationStateMixerBehaviour)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Playables.Playable _playable;translator.Get(L, 2, out _playable);
                    Spine.Unity.SkeletonAnimation _spineComponent = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 3, typeof(Spine.Unity.SkeletonAnimation));
                    
                    gen_to_be_invoked.PreviewEditModePose( _playable, _spineComponent );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
