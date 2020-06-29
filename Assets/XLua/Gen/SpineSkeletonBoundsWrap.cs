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
    public class SpineSkeletonBoundsWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.SkeletonBounds);
			Utils.BeginObjectRegister(type, L, translator, 0, 7, 8, 4);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Update", _m_Update);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AabbContainsPoint", _m_AabbContainsPoint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AabbIntersectsSegment", _m_AabbIntersectsSegment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AabbIntersectsSkeleton", _m_AabbIntersectsSkeleton);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ContainsPoint", _m_ContainsPoint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "IntersectsSegment", _m_IntersectsSegment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetPolygon", _m_GetPolygon);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "BoundingBoxes", _g_get_BoundingBoxes);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Polygons", _g_get_Polygons);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "MinX", _g_get_MinX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "MinY", _g_get_MinY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "MaxX", _g_get_MaxX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "MaxY", _g_get_MaxY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Width", _g_get_Width);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Height", _g_get_Height);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "MinX", _s_set_MinX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "MinY", _s_set_MinY);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "MaxX", _s_set_MaxX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "MaxY", _s_set_MaxY);
            
			
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
					
					Spine.SkeletonBounds gen_ret = new Spine.SkeletonBounds();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonBounds constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Update(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    bool _updateAabb = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.Update( _skeleton, _updateAabb );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AabbContainsPoint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        bool gen_ret = gen_to_be_invoked.AabbContainsPoint( _x, _y );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AabbIntersectsSegment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _x1 = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y1 = (float)LuaAPI.lua_tonumber(L, 3);
                    float _x2 = (float)LuaAPI.lua_tonumber(L, 4);
                    float _y2 = (float)LuaAPI.lua_tonumber(L, 5);
                    
                        bool gen_ret = gen_to_be_invoked.AabbIntersectsSegment( _x1, _y1, _x2, _y2 );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AabbIntersectsSkeleton(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.SkeletonBounds _bounds = (Spine.SkeletonBounds)translator.GetObject(L, 2, typeof(Spine.SkeletonBounds));
                    
                        bool gen_ret = gen_to_be_invoked.AabbIntersectsSkeleton( _bounds );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ContainsPoint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    float _x = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y = (float)LuaAPI.lua_tonumber(L, 3);
                    
                        Spine.BoundingBoxAttachment gen_ret = gen_to_be_invoked.ContainsPoint( _x, _y );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.Polygon>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.Polygon _polygon = (Spine.Polygon)translator.GetObject(L, 2, typeof(Spine.Polygon));
                    float _x = (float)LuaAPI.lua_tonumber(L, 3);
                    float _y = (float)LuaAPI.lua_tonumber(L, 4);
                    
                        bool gen_ret = gen_to_be_invoked.ContainsPoint( _polygon, _x, _y );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonBounds.ContainsPoint!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_IntersectsSegment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)) 
                {
                    float _x1 = (float)LuaAPI.lua_tonumber(L, 2);
                    float _y1 = (float)LuaAPI.lua_tonumber(L, 3);
                    float _x2 = (float)LuaAPI.lua_tonumber(L, 4);
                    float _y2 = (float)LuaAPI.lua_tonumber(L, 5);
                    
                        Spine.BoundingBoxAttachment gen_ret = gen_to_be_invoked.IntersectsSegment( _x1, _y1, _x2, _y2 );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 6&& translator.Assignable<Spine.Polygon>(L, 2)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 5)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.Polygon _polygon = (Spine.Polygon)translator.GetObject(L, 2, typeof(Spine.Polygon));
                    float _x1 = (float)LuaAPI.lua_tonumber(L, 3);
                    float _y1 = (float)LuaAPI.lua_tonumber(L, 4);
                    float _x2 = (float)LuaAPI.lua_tonumber(L, 5);
                    float _y2 = (float)LuaAPI.lua_tonumber(L, 6);
                    
                        bool gen_ret = gen_to_be_invoked.IntersectsSegment( _polygon, _x1, _y1, _x2, _y2 );
                        LuaAPI.lua_pushboolean(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonBounds.IntersectsSegment!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetPolygon(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.BoundingBoxAttachment _attachment = (Spine.BoundingBoxAttachment)translator.GetObject(L, 2, typeof(Spine.BoundingBoxAttachment));
                    
                        Spine.Polygon gen_ret = gen_to_be_invoked.GetPolygon( _attachment );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_BoundingBoxes(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.BoundingBoxes);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Polygons(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Polygons);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_MinX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.MinX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_MinY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.MinY);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_MaxX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.MaxX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_MaxY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.MaxY);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Width(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Width);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Height(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Height);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_MinX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.MinX = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_MinY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.MinY = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_MaxX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.MaxX = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_MaxY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonBounds gen_to_be_invoked = (Spine.SkeletonBounds)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.MaxY = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
