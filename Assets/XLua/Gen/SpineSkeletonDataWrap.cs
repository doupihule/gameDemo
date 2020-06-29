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
    public class SpineSkeletonDataWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.SkeletonData);
			Utils.BeginObjectRegister(type, L, translator, 0, 12, 16, 14);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindBone", _m_FindBone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindBoneIndex", _m_FindBoneIndex);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindSlot", _m_FindSlot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindSlotIndex", _m_FindSlotIndex);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindSkin", _m_FindSkin);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindEvent", _m_FindEvent);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindAnimation", _m_FindAnimation);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindIkConstraint", _m_FindIkConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindTransformConstraint", _m_FindTransformConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindPathConstraint", _m_FindPathConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindPathConstraintIndex", _m_FindPathConstraintIndex);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ToString", _m_ToString);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Name", _g_get_Name);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Bones", _g_get_Bones);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Slots", _g_get_Slots);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Skins", _g_get_Skins);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "DefaultSkin", _g_get_DefaultSkin);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Events", _g_get_Events);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Animations", _g_get_Animations);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "IkConstraints", _g_get_IkConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "TransformConstraints", _g_get_TransformConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "PathConstraints", _g_get_PathConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Width", _g_get_Width);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Height", _g_get_Height);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Version", _g_get_Version);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Hash", _g_get_Hash);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "ImagesPath", _g_get_ImagesPath);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Fps", _g_get_Fps);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "Name", _s_set_Name);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Skins", _s_set_Skins);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "DefaultSkin", _s_set_DefaultSkin);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Events", _s_set_Events);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Animations", _s_set_Animations);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "IkConstraints", _s_set_IkConstraints);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "TransformConstraints", _s_set_TransformConstraints);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "PathConstraints", _s_set_PathConstraints);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Width", _s_set_Width);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Height", _s_set_Height);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Version", _s_set_Version);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Hash", _s_set_Hash);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "ImagesPath", _s_set_ImagesPath);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Fps", _s_set_Fps);
            
			
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
					
					Spine.SkeletonData gen_ret = new Spine.SkeletonData();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.SkeletonData constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _boneName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.BoneData gen_ret = gen_to_be_invoked.FindBone( _boneName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindBoneIndex(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _boneName = LuaAPI.lua_tostring(L, 2);
                    
                        int gen_ret = gen_to_be_invoked.FindBoneIndex( _boneName );
                        LuaAPI.xlua_pushinteger(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindSlot(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.SlotData gen_ret = gen_to_be_invoked.FindSlot( _slotName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindSlotIndex(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    
                        int gen_ret = gen_to_be_invoked.FindSlotIndex( _slotName );
                        LuaAPI.xlua_pushinteger(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindSkin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _skinName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.FindSkin( _skinName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindEvent(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _eventDataName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.EventData gen_ret = gen_to_be_invoked.FindEvent( _eventDataName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindAnimation(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _animationName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.Animation gen_ret = gen_to_be_invoked.FindAnimation( _animationName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindIkConstraint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.IkConstraintData gen_ret = gen_to_be_invoked.FindIkConstraint( _constraintName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindTransformConstraint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.TransformConstraintData gen_ret = gen_to_be_invoked.FindTransformConstraint( _constraintName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindPathConstraint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.PathConstraintData gen_ret = gen_to_be_invoked.FindPathConstraint( _constraintName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindPathConstraintIndex(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _pathConstraintName = LuaAPI.lua_tostring(L, 2);
                    
                        int gen_ret = gen_to_be_invoked.FindPathConstraintIndex( _pathConstraintName );
                        LuaAPI.xlua_pushinteger(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ToString(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        string gen_ret = gen_to_be_invoked.ToString(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
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
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Name);
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
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Bones);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Slots(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Slots);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Skins(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Skins);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_DefaultSkin(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.DefaultSkin);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Events(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Events);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Animations(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Animations);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_IkConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.IkConstraints);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_TransformConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.TransformConstraints);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_PathConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.PathConstraints);
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
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
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
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Height);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Version(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Version);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Hash(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.Hash);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_ImagesPath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushstring(L, gen_to_be_invoked.ImagesPath);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Fps(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Fps);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Name(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Name = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Skins(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Skins = (Spine.ExposedList<Spine.Skin>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.Skin>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_DefaultSkin(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.DefaultSkin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Events(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Events = (Spine.ExposedList<Spine.EventData>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.EventData>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Animations(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Animations = (Spine.ExposedList<Spine.Animation>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.Animation>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_IkConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.IkConstraints = (Spine.ExposedList<Spine.IkConstraintData>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.IkConstraintData>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_TransformConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.TransformConstraints = (Spine.ExposedList<Spine.TransformConstraintData>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.TransformConstraintData>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_PathConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.PathConstraints = (Spine.ExposedList<Spine.PathConstraintData>)translator.GetObject(L, 2, typeof(Spine.ExposedList<Spine.PathConstraintData>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Width(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Width = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Height(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Height = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Version(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Version = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Hash(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Hash = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_ImagesPath(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.ImagesPath = LuaAPI.lua_tostring(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Fps(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.SkeletonData gen_to_be_invoked = (Spine.SkeletonData)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Fps = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
