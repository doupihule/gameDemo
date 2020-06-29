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
    public class SpineMathUtilsWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.MathUtils);
			Utils.BeginObjectRegister(type, L, translator, 0, 0, 0, 0);
			
			
			
			
			
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 11, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "Sin", _m_Sin_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "Cos", _m_Cos_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SinDeg", _m_SinDeg_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "CosDeg", _m_CosDeg_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "Atan2", _m_Atan2_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "Clamp", _m_Clamp_xlua_st_);
            
			
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "PI", Spine.MathUtils.PI);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "PI2", Spine.MathUtils.PI2);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "RadDeg", Spine.MathUtils.RadDeg);
            Utils.RegisterObject(L, translator, Utils.CLS_IDX, "DegRad", Spine.MathUtils.DegRad);
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            return LuaAPI.luaL_error(L, "Spine.MathUtils does not have a constructor!");
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Sin_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _radians = (float)LuaAPI.lua_tonumber(L, 1);
                    
                        float gen_ret = Spine.MathUtils.Sin( _radians );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Cos_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _radians = (float)LuaAPI.lua_tonumber(L, 1);
                    
                        float gen_ret = Spine.MathUtils.Cos( _radians );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SinDeg_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _degrees = (float)LuaAPI.lua_tonumber(L, 1);
                    
                        float gen_ret = Spine.MathUtils.SinDeg( _degrees );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CosDeg_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _degrees = (float)LuaAPI.lua_tonumber(L, 1);
                    
                        float gen_ret = Spine.MathUtils.CosDeg( _degrees );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Atan2_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _y = (float)LuaAPI.lua_tonumber(L, 1);
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    
                        float gen_ret = Spine.MathUtils.Atan2( _y, _x );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Clamp_xlua_st_(RealStatePtr L)
        {
		    try {
            
            
            
                
                {
                    float _value = (float)LuaAPI.lua_tonumber(L, 1);
                    float _min = (float)LuaAPI.lua_tonumber(L, 2);
                    float _max = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        float gen_ret = Spine.MathUtils.Clamp( _value, _min, _max );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
