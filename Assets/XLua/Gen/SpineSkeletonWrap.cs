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
using Spine;using Spine.Unity;using Spine.Unity.Modules.AttachmentTools;

namespace XLua.CSObjectWrap
{
    using Utils = XLua.Utils;
    public class SpineSkeletonWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Skeleton);
			Utils.BeginObjectRegister(type, L, translator, 0, 24, 19, 10);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UpdateCache", _m_UpdateCache);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UpdateWorldTransform", _m_UpdateWorldTransform);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetToSetupPose", _m_SetToSetupPose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetBonesToSetupPose", _m_SetBonesToSetupPose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetSlotsToSetupPose", _m_SetSlotsToSetupPose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindBone", _m_FindBone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindBoneIndex", _m_FindBoneIndex);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindSlot", _m_FindSlot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindSlotIndex", _m_FindSlotIndex);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetSkin", _m_SetSkin);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetAttachment", _m_GetAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetAttachment", _m_SetAttachment);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindIkConstraint", _m_FindIkConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindTransformConstraint", _m_FindTransformConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FindPathConstraint", _m_FindPathConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Update", _m_Update);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetBounds", _m_GetBounds);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetDrawOrderToSetupPose", _m_SetDrawOrderToSetupPose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetSlotAttachmentToSetupPose", _m_SetSlotAttachmentToSetupPose);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "PoseWithAnimation", _m_PoseWithAnimation);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetColor", _m_GetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SetColor", _m_SetColor);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnshareSkin", _m_UnshareSkin);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetClonedSkin", _m_GetClonedSkin);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "Data", _g_get_Data);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Bones", _g_get_Bones);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "UpdateCacheList", _g_get_UpdateCacheList);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Slots", _g_get_Slots);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "DrawOrder", _g_get_DrawOrder);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "IkConstraints", _g_get_IkConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "PathConstraints", _g_get_PathConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "TransformConstraints", _g_get_TransformConstraints);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Skin", _g_get_Skin);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "R", _g_get_R);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "G", _g_get_G);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "B", _g_get_B);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "A", _g_get_A);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Time", _g_get_Time);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "X", _g_get_X);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Y", _g_get_Y);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "FlipX", _g_get_FlipX);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "FlipY", _g_get_FlipY);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "RootBone", _g_get_RootBone);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "Skin", _s_set_Skin);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "R", _s_set_R);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "G", _s_set_G);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "B", _s_set_B);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "A", _s_set_A);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Time", _s_set_Time);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "X", _s_set_X);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "Y", _s_set_Y);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "FlipX", _s_set_FlipX);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "FlipY", _s_set_FlipY);
            
			
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
				if(LuaAPI.lua_gettop(L) == 2 && translator.Assignable<Spine.SkeletonData>(L, 2))
				{
					Spine.SkeletonData _data = (Spine.SkeletonData)translator.GetObject(L, 2, typeof(Spine.SkeletonData));
					
					Spine.Skeleton gen_ret = new Spine.Skeleton(_data);
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UpdateCache(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.UpdateCache(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UpdateWorldTransform(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.UpdateWorldTransform(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.SetToSetupPose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetBonesToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.SetBonesToSetupPose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetSlotsToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.SetSlotsToSetupPose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FindBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _boneName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.Bone gen_ret = gen_to_be_invoked.FindBone( _boneName );
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.Slot gen_ret = gen_to_be_invoked.FindSlot( _slotName );
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
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
        static int _m_SetSkin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _skinName = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.SetSkin( _skinName );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.Skin>(L, 2)) 
                {
                    Spine.Skin _newSkin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
                    
                    gen_to_be_invoked.SetSkin( _newSkin );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.SetSkin!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    string _attachmentName = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetAttachment( _slotIndex, _attachmentName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)) 
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    string _attachmentName = LuaAPI.lua_tostring(L, 3);
                    
                        Spine.Attachment gen_ret = gen_to_be_invoked.GetAttachment( _slotName, _attachmentName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.GetAttachment!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetAttachment(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _slotName = LuaAPI.lua_tostring(L, 2);
                    string _attachmentName = LuaAPI.lua_tostring(L, 3);
                    
                    gen_to_be_invoked.SetAttachment( _slotName, _attachmentName );
                    
                    
                    
                    return 0;
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.IkConstraint gen_ret = gen_to_be_invoked.FindIkConstraint( _constraintName );
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.TransformConstraint gen_ret = gen_to_be_invoked.FindTransformConstraint( _constraintName );
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
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _constraintName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.PathConstraint gen_ret = gen_to_be_invoked.FindPathConstraint( _constraintName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Update(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _delta = (float)LuaAPI.lua_tonumber(L, 2);
                    
                    gen_to_be_invoked.Update( _delta );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetBounds(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _x;
                    float _y;
                    float _width;
                    float _height;
                    float[] _vertexBuffer = (float[])translator.GetObject(L, 2, typeof(float[]));
                    
                    gen_to_be_invoked.GetBounds( out _x, out _y, out _width, out _height, ref _vertexBuffer );
                    LuaAPI.lua_pushnumber(L, _x);
                        
                    LuaAPI.lua_pushnumber(L, _y);
                        
                    LuaAPI.lua_pushnumber(L, _width);
                        
                    LuaAPI.lua_pushnumber(L, _height);
                        
                    translator.Push(L, _vertexBuffer);
                        
                    
                    
                    
                    return 5;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetDrawOrderToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.SetDrawOrderToSetupPose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetSlotAttachmentToSetupPose(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _slotIndex = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.SetSlotAttachmentToSetupPose( _slotIndex );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_PoseWithAnimation(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    string _animationName = LuaAPI.lua_tostring(L, 2);
                    float _time = (float)LuaAPI.lua_tonumber(L, 3);
                    bool _loop = LuaAPI.lua_toboolean(L, 4);
                    
                    gen_to_be_invoked.PoseWithAnimation( _animationName, _time, _loop );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    string _animationName = LuaAPI.lua_tostring(L, 2);
                    float _time = (float)LuaAPI.lua_tonumber(L, 3);
                    
                    gen_to_be_invoked.PoseWithAnimation( _animationName, _time );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.PoseWithAnimation!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetColor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        UnityEngine.Color gen_ret = gen_to_be_invoked.GetColor(  );
                        translator.PushUnityEngineColor(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetColor(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Color>(L, 2)) 
                {
                    UnityEngine.Color _color;translator.Get(L, 2, out _color);
                    
                    gen_to_be_invoked.SetColor( _color );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Color32>(L, 2)) 
                {
                    UnityEngine.Color32 _color;translator.Get(L, 2, out _color);
                    
                    gen_to_be_invoked.SetColor( _color );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.SetColor!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnshareSkin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 4&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& translator.Assignable<Spine.AnimationState>(L, 4)) 
                {
                    bool _includeDefaultSkin = LuaAPI.lua_toboolean(L, 2);
                    bool _unshareAttachments = LuaAPI.lua_toboolean(L, 3);
                    Spine.AnimationState _state = (Spine.AnimationState)translator.GetObject(L, 4, typeof(Spine.AnimationState));
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.UnshareSkin( _includeDefaultSkin, _unshareAttachments, _state );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    bool _includeDefaultSkin = LuaAPI.lua_toboolean(L, 2);
                    bool _unshareAttachments = LuaAPI.lua_toboolean(L, 3);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.UnshareSkin( _includeDefaultSkin, _unshareAttachments );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.UnshareSkin!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetClonedSkin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    string _newSkinName = LuaAPI.lua_tostring(L, 2);
                    bool _includeDefaultSkin = LuaAPI.lua_toboolean(L, 3);
                    bool _cloneAttachments = LuaAPI.lua_toboolean(L, 4);
                    bool _cloneMeshesAsLinked = LuaAPI.lua_toboolean(L, 5);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetClonedSkin( _newSkinName, _includeDefaultSkin, _cloneAttachments, _cloneMeshesAsLinked );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    string _newSkinName = LuaAPI.lua_tostring(L, 2);
                    bool _includeDefaultSkin = LuaAPI.lua_toboolean(L, 3);
                    bool _cloneAttachments = LuaAPI.lua_toboolean(L, 4);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetClonedSkin( _newSkinName, _includeDefaultSkin, _cloneAttachments );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    string _newSkinName = LuaAPI.lua_tostring(L, 2);
                    bool _includeDefaultSkin = LuaAPI.lua_toboolean(L, 3);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetClonedSkin( _newSkinName, _includeDefaultSkin );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    string _newSkinName = LuaAPI.lua_tostring(L, 2);
                    
                        Spine.Skin gen_ret = gen_to_be_invoked.GetClonedSkin( _newSkinName );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Skeleton.GetClonedSkin!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Data(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Data);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Bones);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_UpdateCacheList(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.UpdateCacheList);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Slots);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_DrawOrder(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.DrawOrder);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.IkConstraints);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.PathConstraints);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.TransformConstraints);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Skin(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Skin);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_R(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.R);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_G(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.G);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_B(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.B);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_A(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.A);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Time(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Time);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushnumber(L, gen_to_be_invoked.Y);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_FlipX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.FlipX);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_FlipY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                LuaAPI.lua_pushboolean(L, gen_to_be_invoked.FlipY);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_RootBone(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.RootBone);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Skin(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Skin = (Spine.Skin)translator.GetObject(L, 2, typeof(Spine.Skin));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_R(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.R = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_G(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.G = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_B(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.B = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_A(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.A = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_Time(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Time = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_X(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
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
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.Y = (float)LuaAPI.lua_tonumber(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_FlipX(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.FlipX = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_FlipY(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Skeleton gen_to_be_invoked = (Spine.Skeleton)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.FlipY = LuaAPI.lua_toboolean(L, 2);
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
