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
    public class SpineTransformConstraintTimelineWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.TransformConstraintTimeline);
			Utils.BeginObjectRegister(type, L, translator, 0, 2, 3, 2);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetFrame", _m_SetFrame);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Apply", _m_Apply);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "TransformConstraintIndex", _g_get_TransformConstraintIndex);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Frames", _g_get_Frames);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "PropertyId", _g_get_PropertyId);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "TransformConstraintIndex", _s_set_TransformConstraintIndex);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Frames", _s_set_Frames);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 2, 0, 0);
			
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "ENTRIES", Spine.TransformConstraintTimeline.ENTRIES);
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 2 && LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2))
				{
					int _frameCount = LuaAPI.xlua_tointeger(L, 2);
					
					Spine.TransformConstraintTimeline gen_ret = new Spine.TransformConstraintTimeline(_frameCount);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.TransformConstraintTimeline constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetFrame(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _frameIndex = LuaAPI.xlua_tointeger(L, 2);
                    float _time = (float)LuaAPI.lua_tonumber(L, 3);
                    float _rotateMix = (float)LuaAPI.lua_tonumber(L, 4);
                    float _translateMix = (float)LuaAPI.lua_tonumber(L, 5);
                    float _scaleMix = (float)LuaAPI.lua_tonumber(L, 6);
                    float _shearMix = (float)LuaAPI.lua_tonumber(L, 7);
                    
                    gen_to_be_invoked.SetFrame( _frameIndex, _time, _rotateMix, _translateMix, _scaleMix, _shearMix );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Apply(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
            
            
                
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
        static int _g_get_TransformConstraintIndex(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.TransformConstraintIndex);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Frames(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Frames);
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
			
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.PropertyId);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_TransformConstraintIndex(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.TransformConstraintIndex = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Frames(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.TransformConstraintTimeline gen_to_be_invoked = (Spine.TransformConstraintTimeline)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Frames = (float[])translator.GetObject(L, 2, typeof(float[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
