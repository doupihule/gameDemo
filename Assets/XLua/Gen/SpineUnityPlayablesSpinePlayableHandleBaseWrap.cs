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
    public class SpineUnityPlayablesSpinePlayableHandleBaseWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Playables.SpinePlayableHandleBase);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 2, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "HandleEvents", _m_HandleEvents);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AnimationEvents", _e_AnimationEvents);
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "SkeletonData", _g_get_SkeletonData);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Skeleton", _g_get_Skeleton);
            
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 0, 0);
			
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Spine.Unity.Playables.SpinePlayableHandleBase does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_HandleEvents(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Playables.SpinePlayableHandleBase gen_to_be_invoked = (Spine.Unity.Playables.SpinePlayableHandleBase)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.ExposedList<Spine.Event> _eventBuffer = (Spine.ExposedList<Spine.Event>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.Event>));
                    
                    gen_to_be_invoked.HandleEvents( _eventBuffer );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_SkeletonData(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpinePlayableHandleBase gen_to_be_invoked = (Spine.Unity.Playables.SpinePlayableHandleBase)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.SkeletonData);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Skeleton(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Playables.SpinePlayableHandleBase gen_to_be_invoked = (Spine.Unity.Playables.SpinePlayableHandleBase)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Skeleton);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _e_AnimationEvents(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			    int gen_param_count = LuaAPI.lua_gettop(L);
			Spine.Unity.Playables.SpinePlayableHandleBase gen_to_be_invoked = (Spine.Unity.Playables.SpinePlayableHandleBase)translator.FastGetCSObj(L, 1);
                Spine.Unity.Playables.SpineEventDelegate gen_delegate = translator.GetDelegate<Spine.Unity.Playables.SpineEventDelegate>(L, 3);
                if (gen_delegate == null) {
                    return LuaAPI.luaL_error(L, "#3 need Spine.Unity.Playables.SpineEventDelegate!");
                }
				
				if (gen_param_count == 3)
				{
					
					if (LuaAPI.xlua_is_eq_str(L, 2, "+")) {
						gen_to_be_invoked.AnimationEvents += gen_delegate;
						return 0;
					} 
					
					
					if (LuaAPI.xlua_is_eq_str(L, 2, "-")) {
						gen_to_be_invoked.AnimationEvents -= gen_delegate;
						return 0;
					} 
					
				}
			} catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
			LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Playables.SpinePlayableHandleBase.AnimationEvents!");
            return 0;
        }
        
		
		
    }
}
