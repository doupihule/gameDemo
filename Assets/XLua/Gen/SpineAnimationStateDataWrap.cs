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
    public class SpineAnimationStateDataWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.AnimationStateData);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 2, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetMix", _m_SetMix);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetMix", _m_GetMix);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "SkeletonData", _g_get_SkeletonData);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "DefaultMix", _g_get_DefaultMix);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "DefaultMix", _s_set_DefaultMix);
            
			
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
				if(LuaAPI.lua_gettop(L) == 2 && translator.Assignable<Spine.SkeletonData>(L, 2))
				{
					Spine.SkeletonData _skeletonData = (Spine.SkeletonData)translator.GetObject(L, 2, typeof(Spine.SkeletonData));
					
					Spine.AnimationStateData gen_ret = new Spine.AnimationStateData(_skeletonData);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.AnimationStateData constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetMix(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AnimationStateData gen_to_be_invoked = (Spine.AnimationStateData)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    string _fromName = LuaAPI.lua_tostring(L, 2);
                    string _toName = LuaAPI.lua_tostring(L, 3);
                    float _duration = (float)LuaAPI.lua_tonumber(L, 4);
                    
                    gen_to_be_invoked.SetMix( _fromName, _toName, _duration );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.Animation>(L, 2)&& translator.Assignable<Spine.Animation>(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Animation _from = (Spine.Animation)translator.GetObject(L, 2, typeof(Spine.Animation));
                    Spine.Animation _to = (Spine.Animation)translator.GetObject(L, 3, typeof(Spine.Animation));
                    float _duration = (float)LuaAPI.lua_tonumber(L, 4);
                    
                    gen_to_be_invoked.SetMix( _from, _to, _duration );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.AnimationStateData.SetMix!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetMix(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.AnimationStateData gen_to_be_invoked = (Spine.AnimationStateData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Animation _from = (Spine.Animation)translator.GetObject(L, 2, typeof(Spine.Animation));
                    Spine.Animation _to = (Spine.Animation)translator.GetObject(L, 3, typeof(Spine.Animation));
                    
                        float gen_ret = gen_to_be_invoked.GetMix( _from, _to );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
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
			
                Spine.AnimationStateData gen_to_be_invoked = (Spine.AnimationStateData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.SkeletonData);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_DefaultMix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.AnimationStateData gen_to_be_invoked = (Spine.AnimationStateData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.DefaultMix);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_DefaultMix(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.AnimationStateData gen_to_be_invoked = (Spine.AnimationStateData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.DefaultMix = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
