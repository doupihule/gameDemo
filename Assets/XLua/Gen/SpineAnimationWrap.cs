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
using Spine;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineAnimationWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Animation);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 3, 2);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Apply", _m_Apply);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "PoseSkeleton", _m_PoseSkeleton);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetKeyedItemsToSetupPose", _m_SetKeyedItemsToSetupPose);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Name", _g_get_Name);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Timelines", _g_get_Timelines);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Duration", _g_get_Duration);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "Timelines", _s_set_Timelines);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Duration", _s_set_Duration);
            
			
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
				if(LuaAPI.lua_gettop(L) == 4 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING) && translator.Assignable<Spine.ExposedList<Spine.Timeline>>(L, 3) && LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4))
				{
					string _name = LuaAPI.lua_tostring(L, 2);
					Spine.ExposedList<Spine.Timeline> _timelines = (Spine.ExposedList<Spine.Timeline>)translator.GetObject(L, 3, typeof(Spine.ExposedList<Spine.Timeline>));
					float _duration = (float)LuaAPI.lua_tonumber(L, 4);
					
					Spine.Animation gen_ret = new Spine.Animation(_name, _timelines, _duration);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Animation constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Apply(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    float _lastTime = (float)LuaAPI.lua_tonumber(L, 3);
                    float _time = (float)LuaAPI.lua_tonumber(L, 4);
                    bool _loop = LuaAPI.lua_toboolean(L, 5);
                    Spine.ExposedList<Spine.Event> _events = (Spine.ExposedList<Spine.Event>)translator.GetObject(L, 6, typeof(Spine.ExposedList<Spine.Event>));
                    float _alpha = (float)LuaAPI.lua_tonumber(L, 7);
                    Spine.MixPose _pose;translator.Get(L, 8, out _pose);
                    Spine.MixDirection _direction;translator.Get(L, 9, out _direction);
                    
                    gen_to_be_invoked.Apply( _skeleton, _lastTime, _time, _loop, _events, _alpha, _pose, _direction );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_PoseSkeleton(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& translator.Assignable<Spine.Skeleton>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    float _time = (float)LuaAPI.lua_tonumber(L, 3);
                    bool _loop = LuaAPI.lua_toboolean(L, 4);
                    
                    gen_to_be_invoked.PoseSkeleton( _skeleton, _time, _loop );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.Skeleton>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    float _time = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    gen_to_be_invoked.PoseSkeleton( _skeleton, _time );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Animation.PoseSkeleton!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetKeyedItemsToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    
                    gen_to_be_invoked.SetKeyedItemsToSetupPose( _skeleton );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Name(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Name);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Timelines(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Timelines);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Duration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Duration);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Timelines(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Timelines = (Spine.ExposedList<Spine.Timeline>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.Timeline>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Duration(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Animation gen_to_be_invoked = (Spine.Animation)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Duration = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
