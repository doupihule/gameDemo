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
    public class SpineUnityPlayablesSpineSkeletonFlipMixerBehaviourWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ProcessFrame", _m_ProcessFrame);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "OnGraphStop", _m_OnGraphStop);
			
			
			
			
			
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
					
					Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour gen_ret = new Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ProcessFrame(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour)translator.FastGetCSObj(L, 1);
            
            
                
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
        static int _m_OnGraphStop(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour gen_to_be_invoked = (Spine.Unity.Playables.SpineSkeletonFlipMixerBehaviour)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Playables.Playable _playable;translator.Get(L, 2, out _playable);
                    
                    gen_to_be_invoked.OnGraphStop( _playable );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
