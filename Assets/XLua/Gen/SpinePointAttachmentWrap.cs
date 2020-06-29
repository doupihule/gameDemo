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
using Spine.Unity;using Spine.Unity.Modules.AttachmentTools;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpinePointAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.PointAttachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 4, 3, 3);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ComputeWorldPosition", _m_ComputeWorldPosition);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ComputeWorldRotation", _m_ComputeWorldRotation);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetWorldPosition", _m_GetWorldPosition);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClone", _m_GetClone);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "X", _g_get_X);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Y", _g_get_Y);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Rotation", _g_get_Rotation);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "X", _s_set_X);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Y", _s_set_Y);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Rotation", _s_set_Rotation);
            
			
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
				if(LuaAPI.lua_gettop(L) == 2 && (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING))
				{
					string _name = LuaAPI.lua_tostring(L, 2);
					
					Spine.PointAttachment gen_ret = new Spine.PointAttachment(_name);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.PointAttachment constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ComputeWorldPosition(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    float _ox;
                    float _oy;
                    
                    gen_to_be_invoked.ComputeWorldPosition( _bone, out _ox, out _oy );
                    LuaAPI.lua_pushnumber(L, _ox);
                        
                    LuaAPI.lua_pushnumber(L, _oy);
                        
                    
                    
                    
                    return 2;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ComputeWorldRotation(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    
                        float gen_ret = gen_to_be_invoked.ComputeWorldRotation( _bone );
                        LuaAPI.lua_pushnumber(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetWorldPosition(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<UnityEngine.Transform>(L, 3)) 
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.Transform _spineGameObjectTransform = (UnityEngine.Transform)translator.GetObject(L, 3, typeof(UnityEngine.Transform));
                    
                        UnityEngine.Vector3 gen_ret = gen_to_be_invoked.GetWorldPosition( _slot, _spineGameObjectTransform );
                        translator.PushUnityEngineVector3(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.Bone>(L, 2)&& translator.Assignable<UnityEngine.Transform>(L, 3)) 
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    UnityEngine.Transform _spineGameObjectTransform = (UnityEngine.Transform)translator.GetObject(L, 3, typeof(UnityEngine.Transform));
                    
                        UnityEngine.Vector3 gen_ret = gen_to_be_invoked.GetWorldPosition( _bone, _spineGameObjectTransform );
                        translator.PushUnityEngineVector3(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.PointAttachment.GetWorldPosition!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        Spine.PointAttachment gen_ret = gen_to_be_invoked.GetClone(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.X);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Y(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Y);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Rotation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.X = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Y(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Y = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Rotation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.PointAttachment gen_to_be_invoked = (Spine.PointAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Rotation = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
