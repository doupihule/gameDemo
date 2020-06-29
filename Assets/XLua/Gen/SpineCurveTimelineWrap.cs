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
    public class SpineCurveTimelineWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.CurveTimeline);
			Utils.BeginObjectRegister(type, L, translator, 0, 6, 2, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Apply", _m_Apply);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetLinear", _m_SetLinear);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetStepped", _m_SetStepped);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetCurve", _m_SetCurve);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetCurvePercent", _m_GetCurvePercent);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetCurveType", _m_GetCurveType);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "FrameCount", _g_get_FrameCount);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "PropertyId", _g_get_PropertyId);
            
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 1, 0, 0);
			
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Spine.CurveTimeline does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Apply(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    float _lastTime = (float)LuaAPI.lua_tonumber(L, 3);
                    float _time = (float)LuaAPI.lua_tonumber(L, 4);
                    Spine.ExposedList<Spine.Event> _firedEvents = (Spine.ExposedList<Spine.Event>)translator.GetObject(L, 5, typeof(Spine.ExposedList<Spine.Event>));
                    float _alpha = (float)LuaAPI.lua_tonumber(L, 6);
                    Spine.MixPose _pose;translator.Get(L, 7, out _pose);
                    Spine.MixDirection _direction;translator.Get(L, 8, out _direction);
                    
                    gen_to_be_invoked.Apply( _skeleton, _lastTime, _time, _firedEvents, _alpha, _pose, _direction );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetLinear(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.SetLinear( _frameIndex );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetStepped(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.SetStepped( _frameIndex );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetCurve(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    float _cx1 = (float)LuaAPI.lua_tonumber(L, 3);
                    float _cy1 = (float)LuaAPI.lua_tonumber(L, 4);
                    float _cx2 = (float)LuaAPI.lua_tonumber(L, 5);
                    float _cy2 = (float)LuaAPI.lua_tonumber(L, 6);
                    
                    gen_to_be_invoked.SetCurve( _frameIndex, _cx1, _cy1, _cx2, _cy2 );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetCurvePercent(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    float _percent = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        float gen_ret = gen_to_be_invoked.GetCurvePercent( _frameIndex, _percent );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetCurveType(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    
                        float gen_ret = gen_to_be_invoked.GetCurveType( _frameIndex );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_FrameCount(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.FrameCount);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_PropertyId(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.CurveTimeline gen_to_be_invoked = (Spine.CurveTimeline)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.PropertyId);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
		
		
    }
}
