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
    public class SpineUnityWaitForSpineEventWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.WaitForSpineEvent);
			Utils.BeginObjectRegister(type, L, translator, 0, 1, 1, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "NowWaitFor", _m_NowWaitFor);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "WillUnsubscribeAfterFiring", _g_get_WillUnsubscribeAfterFiring);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "WillUnsubscribeAfterFiring", _s_set_WillUnsubscribeAfterFiring);
            
			
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
				if(LuaAPI.lua_gettop(L) == 4 && translator.Assignable<Spine.AnimationState>(L, 2) && translator.Assignable<Spine.EventData>(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
					Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
					bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_state, _eventDataReference, _unsubscribeAfterFiring);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && translator.Assignable<Spine.AnimationState>(L, 2) && translator.Assignable<Spine.EventData>(L, 3))
				{
					Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
					Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_state, _eventDataReference);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 4 && translator.Assignable<Spine.Unity.SkeletonAnimation>(L, 2) && translator.Assignable<Spine.EventData>(L, 3) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					Spine.Unity.SkeletonAnimation _skeletonAnimation = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimation));
					Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
					bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_skeletonAnimation, _eventDataReference, _unsubscribeAfterFiring);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && translator.Assignable<Spine.Unity.SkeletonAnimation>(L, 2) && translator.Assignable<Spine.EventData>(L, 3))
				{
					Spine.Unity.SkeletonAnimation _skeletonAnimation = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimation));
					Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_skeletonAnimation, _eventDataReference);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 4 && translator.Assignable<Spine.AnimationState>(L, 2) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
					string _eventName = LuaAPI.lua_tostring(L, 3);
					bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_state, _eventName, _unsubscribeAfterFiring);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && translator.Assignable<Spine.AnimationState>(L, 2) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING))
				{
					Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
					string _eventName = LuaAPI.lua_tostring(L, 3);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_state, _eventName);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 4 && translator.Assignable<Spine.Unity.SkeletonAnimation>(L, 2) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING) && LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4))
				{
					Spine.Unity.SkeletonAnimation _skeletonAnimation = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimation));
					string _eventName = LuaAPI.lua_tostring(L, 3);
					bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_skeletonAnimation, _eventName, _unsubscribeAfterFiring);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				if(LuaAPI.lua_gettop(L) == 3 && translator.Assignable<Spine.Unity.SkeletonAnimation>(L, 2) && (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING))
				{
					Spine.Unity.SkeletonAnimation _skeletonAnimation = (Spine.Unity.SkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonAnimation));
					string _eventName = LuaAPI.lua_tostring(L, 3);
					
					Spine.Unity.WaitForSpineEvent gen_ret = new Spine.Unity.WaitForSpineEvent(_skeletonAnimation, _eventName);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.WaitForSpineEvent constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_NowWaitFor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.WaitForSpineEvent gen_to_be_invoked = (Spine.Unity.WaitForSpineEvent)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& translator.Assignable<Spine.AnimationState>(L, 2)&& translator.Assignable<Spine.EventData>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
                    Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
                    bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.Unity.WaitForSpineEvent gen_ret = gen_to_be_invoked.NowWaitFor( _state, _eventDataReference, _unsubscribeAfterFiring );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.AnimationState>(L, 2)&& translator.Assignable<Spine.EventData>(L, 3)) 
                {
                    Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
                    Spine.EventData _eventDataReference = (Spine.EventData)translator.GetObject(L, 3, typeof(Spine.EventData));
                    
                        Spine.Unity.WaitForSpineEvent gen_ret = gen_to_be_invoked.NowWaitFor( _state, _eventDataReference );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.AnimationState>(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
                    string _eventName = LuaAPI.lua_tostring(L, 3);
                    bool _unsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.Unity.WaitForSpineEvent gen_ret = gen_to_be_invoked.NowWaitFor( _state, _eventName, _unsubscribeAfterFiring );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.AnimationState>(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 2, typeof(Spine.AnimationState));
                    string _eventName = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.Unity.WaitForSpineEvent gen_ret = gen_to_be_invoked.NowWaitFor( _state, _eventName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.WaitForSpineEvent.NowWaitFor!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_WillUnsubscribeAfterFiring(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.WaitForSpineEvent gen_to_be_invoked = (Spine.Unity.WaitForSpineEvent)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.WillUnsubscribeAfterFiring);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_WillUnsubscribeAfterFiring(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.WaitForSpineEvent gen_to_be_invoked = (Spine.Unity.WaitForSpineEvent)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.WillUnsubscribeAfterFiring = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
