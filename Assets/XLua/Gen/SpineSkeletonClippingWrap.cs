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
    public class SpineSkeletonClippingWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.SkeletonClipping);
			Utils.BeginObjectRegister(type, L, translator, 0, 3, 4, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ClipStart", _m_ClipStart);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ClipEnd", _m_ClipEnd);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ClipTriangles", _m_ClipTriangles);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "ClippedVertices", _g_get_ClippedVertices);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ClippedTriangles", _g_get_ClippedTriangles);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ClippedUVs", _g_get_ClippedUVs);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "IsClipping", _g_get_IsClipping);
            
			
			
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
					
					Spine.SkeletonClipping gen_ret = new Spine.SkeletonClipping();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonClipping constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ClipStart(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    Spine.ClippingAttachment _clip = (Spine.ClippingAttachment)translator.GetObject(L, 3, typeof(Spine.ClippingAttachment));
                    
                        int gen_ret = gen_to_be_invoked.ClipStart( _slot, _clip );
                        LuaAPI.xlua_pushinteger(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ClipEnd(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 1) 
                {
                    
                    gen_to_be_invoked.ClipEnd(  );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.Slot>(L, 2)) 
                {
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    
                    gen_to_be_invoked.ClipEnd( _slot );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonClipping.ClipEnd!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ClipTriangles(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float[] _vertices = (float[])translator.GetObject(L, 2, typeof(float[]));
                    int _verticesLength = LuaAPI.xlua_tointeger(L, 3);
                    int[] _triangles = (int[])translator.GetObject(L, 4, typeof(int[]));
                    int _trianglesLength = LuaAPI.xlua_tointeger(L, 5);
                    float[] _uvs = (float[])translator.GetObject(L, 6, typeof(float[]));
                    
                    gen_to_be_invoked.ClipTriangles( _vertices, _verticesLength, _triangles, _trianglesLength, _uvs );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ClippedVertices(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.ClippedVertices);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ClippedTriangles(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.ClippedTriangles);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ClippedUVs(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.ClippedUVs);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IsClipping(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonClipping gen_to_be_invoked = (Spine.SkeletonClipping)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.IsClipping);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
		
		
		
		
    }
}
