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
using Spine;using Spine.Unity;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineVertexAttachmentWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.VertexAttachment);
			Utils.BeginObjectRegister(type, L, translator, 0, 5, 4, 3);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ComputeWorldVertices", _m_ComputeWorldVertices);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ApplyDeform", _m_ApplyDeform);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "IsWeighted", _m_IsWeighted);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetLocalVertices", _m_GetLocalVertices);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetWorldVertices", _m_GetWorldVertices);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Id", _g_get_Id);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Bones", _g_get_Bones);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Vertices", _g_get_Vertices);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "WorldVerticesLength", _g_get_WorldVerticesLength);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "Bones", _s_set_Bones);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Vertices", _s_set_Vertices);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "WorldVerticesLength", _s_set_WorldVerticesLength);
            
			
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
					
					Spine.VertexAttachment gen_ret = new Spine.VertexAttachment(_name);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.VertexAttachment constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ComputeWorldVertices(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<float[]>(L, 3)) 
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    float[] _worldVertices = (float[])translator.GetObject(L, 3, typeof(float[]));
                    
                    gen_to_be_invoked.ComputeWorldVertices( _slot, _worldVertices );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 7&& translator.Assignable<Spine.Slot>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& translator.Assignable<float[]>(L, 5)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 6)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 7)) 
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    int _start = LuaAPI.xlua_tointeger(L, 3);
                    int _count = LuaAPI.xlua_tointeger(L, 4);
                    float[] _worldVertices = (float[])translator.GetObject(L, 5, typeof(float[]));
                    int _offset = LuaAPI.xlua_tointeger(L, 6);
                    int _stride = LuaAPI.xlua_tointeger(L, 7);
                    
                    gen_to_be_invoked.ComputeWorldVertices( _slot, _start, _count, _worldVertices, _offset, _stride );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 6&& translator.Assignable<Spine.Slot>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& translator.Assignable<float[]>(L, 5)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    int _start = LuaAPI.xlua_tointeger(L, 3);
                    int _count = LuaAPI.xlua_tointeger(L, 4);
                    float[] _worldVertices = (float[])translator.GetObject(L, 5, typeof(float[]));
                    int _offset = LuaAPI.xlua_tointeger(L, 6);
                    
                    gen_to_be_invoked.ComputeWorldVertices( _slot, _start, _count, _worldVertices, _offset );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.VertexAttachment.ComputeWorldVertices!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ApplyDeform(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.VertexAttachment _sourceAttachment = (Spine.VertexAttachment)translator.GetObject(L, 2, typeof(Spine.VertexAttachment));
                    
                        bool gen_ret = gen_to_be_invoked.ApplyDeform( _sourceAttachment );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_IsWeighted(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        bool gen_ret = gen_to_be_invoked.IsWeighted(  );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetLocalVertices(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.Vector2[] _buffer = (UnityEngine.Vector2[])translator.GetObject(L, 3, typeof(UnityEngine.Vector2[]));
                    
                        UnityEngine.Vector2[] gen_ret = gen_to_be_invoked.GetLocalVertices( _slot, _buffer );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetWorldVertices(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.Vector2[] _buffer = (UnityEngine.Vector2[])translator.GetObject(L, 3, typeof(UnityEngine.Vector2[]));
                    
                        UnityEngine.Vector2[] gen_ret = gen_to_be_invoked.GetWorldVertices( _slot, _buffer );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Id(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.Id);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Bones(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Bones);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Vertices(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Vertices);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_WorldVerticesLength(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.WorldVerticesLength);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Bones(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Bones = (int[])translator.GetObject(L, 2, typeof(int[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Vertices(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Vertices = (float[])translator.GetObject(L, 2, typeof(float[]));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_WorldVerticesLength(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.VertexAttachment gen_to_be_invoked = (Spine.VertexAttachment)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.WorldVerticesLength = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
