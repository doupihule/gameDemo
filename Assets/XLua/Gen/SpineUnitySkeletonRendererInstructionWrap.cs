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
    public class SpineUnitySkeletonRendererInstructionWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SkeletonRendererInstruction);
			Utils.BeginObjectRegister(type, L, translator, 0, 4, 5, 3);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Clear", _m_Clear);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Dispose", _m_Dispose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetWithSubset", _m_SetWithSubset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Set", _m_Set);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "immutableTriangles", _g_get_immutableTriangles);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "submeshInstructions", _g_get_submeshInstructions);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "hasActiveClipping", _g_get_hasActiveClipping);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "rawVertexCount", _g_get_rawVertexCount);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "attachments", _g_get_attachments);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "immutableTriangles", _s_set_immutableTriangles);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "hasActiveClipping", _s_set_hasActiveClipping);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "rawVertexCount", _s_set_rawVertexCount);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 2, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GeometryNotEqual", _m_GeometryNotEqual_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SkeletonRendererInstruction gen_ret = new Spine.Unity.SkeletonRendererInstruction();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonRendererInstruction constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Clear(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Clear(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Dispose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Dispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetWithSubset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.ExposedList<Spine.Unity.SubmeshInstruction> _instructions = (Spine.ExposedList<Spine.Unity.SubmeshInstruction>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.Unity.SubmeshInstruction>));
                    int _startSubmesh = LuaAPI.xlua_tointeger(L, 3);
                    int _endSubmesh = LuaAPI.xlua_tointeger(L, 4);
                    
                    gen_to_be_invoked.SetWithSubset( _instructions, _startSubmesh, _endSubmesh );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Set(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonRendererInstruction _other = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRendererInstruction));
                    
                    gen_to_be_invoked.Set( _other );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GeometryNotEqual_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    Spine.Unity.SkeletonRendererInstruction _a = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRendererInstruction));
                    Spine.Unity.SkeletonRendererInstruction _b = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRendererInstruction));
                    
                        bool gen_ret = Spine.Unity.SkeletonRendererInstruction.GeometryNotEqual( _a, _b );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_immutableTriangles(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.immutableTriangles);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_submeshInstructions(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.submeshInstructions);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_hasActiveClipping(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.hasActiveClipping);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_rawVertexCount(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.rawVertexCount);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_attachments(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.attachments);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_immutableTriangles(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.immutableTriangles = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_hasActiveClipping(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.hasActiveClipping = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_rawVertexCount(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonRendererInstruction gen_to_be_invoked = (Spine.Unity.SkeletonRendererInstruction)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.rawVertexCount = LuaAPI.xlua_tointeger(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
