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
    public class SpineUnitySkeletonUtilityWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.SkeletonUtility);
			Utils.BeginObjectRegister(type, L, translator, 0, 11, 5, 5);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RegisterBone", _m_RegisterBone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnregisterBone", _m_UnregisterBone);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "RegisterConstraint", _m_RegisterConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "UnregisterConstraint", _m_UnregisterConstraint);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "CollectBones", _m_CollectBones);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetBoneRoot", _m_GetBoneRoot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SpawnRoot", _m_SpawnRoot);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SpawnHierarchy", _m_SpawnHierarchy);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SpawnBoneRecursively", _m_SpawnBoneRecursively);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "SpawnBone", _m_SpawnBone);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "OnReset", _e_OnReset);
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "boneRoot", _g_get_boneRoot);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonRenderer", _g_get_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "skeletonAnimation", _g_get_skeletonAnimation);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "utilityBones", _g_get_utilityBones);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "utilityConstraints", _g_get_utilityConstraints);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "boneRoot", _s_set_boneRoot);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonRenderer", _s_set_skeletonRenderer);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "skeletonAnimation", _s_set_skeletonAnimation);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "utilityBones", _s_set_utilityBones);
            Utils.RegisterFunc(L, Utils.SETTER_IDX, "utilityConstraints", _s_set_utilityConstraints);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 5, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "AddBoundingBoxGameObject", _m_AddBoundingBoxGameObject_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "AddBoundingBoxAsComponent", _m_AddBoundingBoxAsComponent_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "SetColliderPointsLocal", _m_SetColliderPointsLocal_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GetBoundingBoxBounds", _m_GetBoundingBoxBounds_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.SkeletonUtility gen_ret = new Spine.Unity.SkeletonUtility();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtility constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddBoundingBoxGameObject_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 2)&& translator.Assignable<Spine.Slot>(L, 3)&& translator.Assignable<UnityEngine.Transform>(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    string _name = LuaAPI.lua_tostring(L, 1);
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 2, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 3, typeof(Spine.Slot));
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 4, typeof(UnityEngine.Transform));
                    bool _isTrigger = LuaAPI.lua_toboolean(L, 5);
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxGameObject( _name, _box, _slot, _parent, _isTrigger );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& (LuaAPI.lua_isnil(L, 1) || LuaAPI.lua_type(L, 1) == LuaTypes.LUA_TSTRING)&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 2)&& translator.Assignable<Spine.Slot>(L, 3)&& translator.Assignable<UnityEngine.Transform>(L, 4)) 
                {
                    string _name = LuaAPI.lua_tostring(L, 1);
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 2, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 3, typeof(Spine.Slot));
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 4, typeof(UnityEngine.Transform));
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxGameObject( _name, _box, _slot, _parent );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 6&& translator.Assignable<Spine.Skeleton>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 4) || LuaAPI.lua_type(L, 4) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Transform>(L, 5)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 1, typeof(Spine.Skeleton));
                    string _skinName = LuaAPI.lua_tostring(L, 2);
                    string _slotName = LuaAPI.lua_tostring(L, 3);
                    string _attachmentName = LuaAPI.lua_tostring(L, 4);
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 5, typeof(UnityEngine.Transform));
                    bool _isTrigger = LuaAPI.lua_toboolean(L, 6);
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxGameObject( _skeleton, _skinName, _slotName, _attachmentName, _parent, _isTrigger );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& translator.Assignable<Spine.Skeleton>(L, 1)&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 3) || LuaAPI.lua_type(L, 3) == LuaTypes.LUA_TSTRING)&& (LuaAPI.lua_isnil(L, 4) || LuaAPI.lua_type(L, 4) == LuaTypes.LUA_TSTRING)&& translator.Assignable<UnityEngine.Transform>(L, 5)) 
                {
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 1, typeof(Spine.Skeleton));
                    string _skinName = LuaAPI.lua_tostring(L, 2);
                    string _slotName = LuaAPI.lua_tostring(L, 3);
                    string _attachmentName = LuaAPI.lua_tostring(L, 4);
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 5, typeof(UnityEngine.Transform));
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxGameObject( _skeleton, _skinName, _slotName, _attachmentName, _parent );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtility.AddBoundingBoxGameObject!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddBoundingBoxAsComponent_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 6&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<UnityEngine.GameObject>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.GameObject _gameObject = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    bool _isTrigger = LuaAPI.lua_toboolean(L, 4);
                    bool _isKinematic = LuaAPI.lua_toboolean(L, 5);
                    float _gravityScale = (float)LuaAPI.lua_tonumber(L, 6);
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxAsComponent( _box, _slot, _gameObject, _isTrigger, _isKinematic, _gravityScale );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 5&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<UnityEngine.GameObject>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.GameObject _gameObject = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    bool _isTrigger = LuaAPI.lua_toboolean(L, 4);
                    bool _isKinematic = LuaAPI.lua_toboolean(L, 5);
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxAsComponent( _box, _slot, _gameObject, _isTrigger, _isKinematic );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 4&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<UnityEngine.GameObject>(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.GameObject _gameObject = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    bool _isTrigger = LuaAPI.lua_toboolean(L, 4);
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxAsComponent( _box, _slot, _gameObject, _isTrigger );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 3&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)&& translator.Assignable<Spine.Slot>(L, 2)&& translator.Assignable<UnityEngine.GameObject>(L, 3)) 
                {
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    UnityEngine.GameObject _gameObject = (UnityEngine.GameObject)translator.GetObject(L, 3, typeof(UnityEngine.GameObject));
                    
                        UnityEngine.PolygonCollider2D gen_ret = Spine.Unity.SkeletonUtility.AddBoundingBoxAsComponent( _box, _slot, _gameObject );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtility.AddBoundingBoxAsComponent!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SetColliderPointsLocal_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    UnityEngine.PolygonCollider2D _collider = (UnityEngine.PolygonCollider2D)translator.GetObject(L, 1, typeof(UnityEngine.PolygonCollider2D));
                    Spine.Slot _slot = (Spine.Slot)translator.GetObject(L, 2, typeof(Spine.Slot));
                    Spine.BoundingBoxAttachment _box = (Spine.BoundingBoxAttachment)translator.GetObject(L, 3, typeof(Spine.BoundingBoxAttachment));
                    
                    Spine.Unity.SkeletonUtility.SetColliderPointsLocal( _collider, _slot, _box );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetBoundingBoxBounds_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    Spine.BoundingBoxAttachment _boundingBox = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    float _depth = (float)LuaAPI.lua_tonumber(L, 2);
                    
                        UnityEngine.Bounds gen_ret = Spine.Unity.SkeletonUtility.GetBoundingBoxBounds( _boundingBox, _depth );
                        translator.PushUnityEngineBounds(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                if(gen_param_count == 1&& translator.Assignable<Spine.BoundingBoxAttachment>(L, 1)) 
                {
                    Spine.BoundingBoxAttachment _boundingBox = (Spine.BoundingBoxAttachment)translator.GetObject(L, 1, typeof(Spine.BoundingBoxAttachment));
                    
                        UnityEngine.Bounds gen_ret = Spine.Unity.SkeletonUtility.GetBoundingBoxBounds( _boundingBox );
                        translator.PushUnityEngineBounds(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtility.GetBoundingBoxBounds!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RegisterBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityBone _bone = (Spine.Unity.SkeletonUtilityBone)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonUtilityBone));
                    
                    gen_to_be_invoked.RegisterBone( _bone );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnregisterBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityBone _bone = (Spine.Unity.SkeletonUtilityBone)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonUtilityBone));
                    
                    gen_to_be_invoked.UnregisterBone( _bone );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_RegisterConstraint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityConstraint _constraint = (Spine.Unity.SkeletonUtilityConstraint)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonUtilityConstraint));
                    
                    gen_to_be_invoked.RegisterConstraint( _constraint );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_UnregisterConstraint(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityConstraint _constraint = (Spine.Unity.SkeletonUtilityConstraint)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonUtilityConstraint));
                    
                    gen_to_be_invoked.UnregisterConstraint( _constraint );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_CollectBones(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.CollectBones(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetBoneRoot(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        UnityEngine.Transform gen_ret = gen_to_be_invoked.GetBoneRoot(  );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SpawnRoot(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityBone.Mode _mode;translator.Get(L, 2, out _mode);
                    bool _pos = LuaAPI.lua_toboolean(L, 3);
                    bool _rot = LuaAPI.lua_toboolean(L, 4);
                    bool _sca = LuaAPI.lua_toboolean(L, 5);
                    
                        UnityEngine.GameObject gen_ret = gen_to_be_invoked.SpawnRoot( _mode, _pos, _rot, _sca );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SpawnHierarchy(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonUtilityBone.Mode _mode;translator.Get(L, 2, out _mode);
                    bool _pos = LuaAPI.lua_toboolean(L, 3);
                    bool _rot = LuaAPI.lua_toboolean(L, 4);
                    bool _sca = LuaAPI.lua_toboolean(L, 5);
                    
                        UnityEngine.GameObject gen_ret = gen_to_be_invoked.SpawnHierarchy( _mode, _pos, _rot, _sca );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SpawnBoneRecursively(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 3, typeof(UnityEngine.Transform));
                    Spine.Unity.SkeletonUtilityBone.Mode _mode;translator.Get(L, 4, out _mode);
                    bool _pos = LuaAPI.lua_toboolean(L, 5);
                    bool _rot = LuaAPI.lua_toboolean(L, 6);
                    bool _sca = LuaAPI.lua_toboolean(L, 7);
                    
                        UnityEngine.GameObject gen_ret = gen_to_be_invoked.SpawnBoneRecursively( _bone, _parent, _mode, _pos, _rot, _sca );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_SpawnBone(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Bone _bone = (Spine.Bone)translator.GetObject(L, 2, typeof(Spine.Bone));
                    UnityEngine.Transform _parent = (UnityEngine.Transform)translator.GetObject(L, 3, typeof(UnityEngine.Transform));
                    Spine.Unity.SkeletonUtilityBone.Mode _mode;translator.Get(L, 4, out _mode);
                    bool _pos = LuaAPI.lua_toboolean(L, 5);
                    bool _rot = LuaAPI.lua_toboolean(L, 6);
                    bool _sca = LuaAPI.lua_toboolean(L, 7);
                    
                        UnityEngine.GameObject gen_ret = gen_to_be_invoked.SpawnBone( _bone, _parent, _mode, _pos, _rot, _sca );
                        translator.Push(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_boneRoot(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.boneRoot);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.skeletonRenderer);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_skeletonAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                translator.PushAny(L, gen_to_be_invoked.skeletonAnimation);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_utilityBones(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.utilityBones);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_utilityConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.utilityConstraints);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_boneRoot(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.boneRoot = (UnityEngine.Transform)translator.GetObject(L, 2, typeof(UnityEngine.Transform));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonRenderer(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonRenderer = (Spine.Unity.SkeletonRenderer)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRenderer));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_skeletonAnimation(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.skeletonAnimation = (Spine.Unity.ISkeletonAnimation)translator.GetObject(L, 2, typeof(Spine.Unity.ISkeletonAnimation));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_utilityBones(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.utilityBones = (System.Collections.Generic.List<Spine.Unity.SkeletonUtilityBone>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Unity.SkeletonUtilityBone>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_utilityConstraints(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                gen_to_be_invoked.utilityConstraints = (System.Collections.Generic.List<Spine.Unity.SkeletonUtilityConstraint>)translator.GetObject(L, 2, typeof(System.Collections.Generic.List<Spine.Unity.SkeletonUtilityConstraint>));
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _e_OnReset(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			    int gen_param_count = LuaAPI.lua_gettop(L);
			Spine.Unity.SkeletonUtility gen_to_be_invoked = (Spine.Unity.SkeletonUtility)translator.FastGetCSObj(L, 1);
                Spine.Unity.SkeletonUtility.SkeletonUtilityDelegate gen_delegate = translator.GetDelegate<Spine.Unity.SkeletonUtility.SkeletonUtilityDelegate>(L, 3);
                if (gen_delegate == null) {
                    return LuaAPI.luaL_error(L, "#3 need Spine.Unity.SkeletonUtility.SkeletonUtilityDelegate!");
                }
				
				if (gen_param_count == 3)
				{
					
					if (LuaAPI.xlua_is_eq_str(L, 2, "+")) {
						gen_to_be_invoked.OnReset += gen_delegate;
						return 0;
					} 
					
					
					if (LuaAPI.xlua_is_eq_str(L, 2, "-")) {
						gen_to_be_invoked.OnReset -= gen_delegate;
						return 0;
					} 
					
				}
			} catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
			LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.SkeletonUtility.OnReset!");
            return 0;
        }
        
		
		
    }
}
