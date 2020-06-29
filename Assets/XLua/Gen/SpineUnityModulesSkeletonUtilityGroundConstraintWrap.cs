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
    public class SpineUnityModulesSkeletonUtilityGroundConstraintWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.Modules.SkeletonUtilityGroundConstraint);
			Utils.BeginObjectRegister(type, L, translator, 0, 1, 8, 8);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "DoUpdate", _m_DoUpdate);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "groundMask", _g_get_groundMask);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "use2D", _g_get_use2D);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "useRadius", _g_get_useRadius);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "castRadius", _g_get_castRadius);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "castDistance", _g_get_castDistance);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "castOffset", _g_get_castOffset);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "groundOffset", _g_get_groundOffset);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "adjustSpeed", _g_get_adjustSpeed);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "groundMask", _s_set_groundMask);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "use2D", _s_set_use2D);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "useRadius", _s_set_useRadius);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "castRadius", _s_set_castRadius);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "castDistance", _s_set_castDistance);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "castOffset", _s_set_castOffset);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "groundOffset", _s_set_groundOffset);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "adjustSpeed", _s_set_adjustSpeed);
            
			
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
					
					Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_ret = new Spine.Unity.Modules.SkeletonUtilityGroundConstraint();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.Modules.SkeletonUtilityGroundConstraint constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_DoUpdate(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.DoUpdate(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_groundMask(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.groundMask);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_use2D(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.use2D);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_useRadius(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.useRadius);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_castRadius(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.castRadius);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_castDistance(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.castDistance);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_castOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.castOffset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_groundOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.groundOffset);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_adjustSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.adjustSpeed);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_groundMask(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                UnityEngine.LayerMask gen_value;translator.Get(L, 2, out gen_value);
				gen_to_be_invoked.groundMask = gen_value;
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_use2D(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.use2D = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_useRadius(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.useRadius = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_castRadius(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.castRadius = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_castDistance(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.castDistance = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_castOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.castOffset = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_groundOffset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.groundOffset = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_adjustSpeed(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.Modules.SkeletonUtilityGroundConstraint gen_to_be_invoked = (Spine.Unity.Modules.SkeletonUtilityGroundConstraint)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.adjustSpeed = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
