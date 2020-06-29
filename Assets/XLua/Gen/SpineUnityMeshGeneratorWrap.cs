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
    public class SpineUnityMeshGeneratorWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(Spine.Unity.MeshGenerator);
			Utils.BeginObjectRegister(type, L, translator, 0, 11, 3, 1);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Begin", _m_Begin);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "AddSubmesh", _m_AddSubmesh);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "BuildMesh", _m_BuildMesh);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "BuildMeshWithArrays", _m_BuildMeshWithArrays);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "ScaleVertexData", _m_ScaleVertexData);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FillVertexData", _m_FillVertexData);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FillLateVertexData", _m_FillLateVertexData);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FillTriangles", _m_FillTriangles);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "FillTrianglesSingle", _m_FillTrianglesSingle);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "EnsureVertexCapacity", _m_EnsureVertexCapacity);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "TrimExcess", _m_TrimExcess);
			
			
			Utils.RegisterFunc(L, Utils.GETTER_IDX, "VertexCount", _g_get_VertexCount);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "Buffers", _g_get_Buffers);
            Utils.RegisterFunc(L, Utils.GETTER_IDX, "settings", _g_get_settings);
            
			Utils.RegisterFunc(L, Utils.SETTER_IDX, "settings", _s_set_settings);
            
			
			Utils.EndObjectRegister(type, L, translator, null, null,
			    null, null, null);

		    Utils.BeginClassRegister(type, L, __CreateInstance, 5, 0, 0);
			Utils.RegisterFunc(L, Utils.CLS_IDX, "GenerateSingleSubmeshInstruction", _m_GenerateSingleSubmeshInstruction_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "GenerateSkeletonRendererInstruction", _m_GenerateSkeletonRendererInstruction_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "TryReplaceMaterials", _m_TryReplaceMaterials_xlua_st_);
            Utils.RegisterFunc(L, Utils.CLS_IDX, "FillMeshLocal", _m_FillMeshLocal_xlua_st_);
            
			
            
			
			
			
			Utils.EndClassRegister(type, L, translator);
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int __CreateInstance(RealStatePtr L)
        {
            
			try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
				if(LuaAPI.lua_gettop(L) == 1)
				{
					
					Spine.Unity.MeshGenerator gen_ret = new Spine.Unity.MeshGenerator();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.MeshGenerator constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GenerateSingleSubmeshInstruction_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    Spine.Unity.SkeletonRendererInstruction _instructionOutput = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRendererInstruction));
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    UnityEngine.Material _material = (UnityEngine.Material)translator.GetObject(L, 3, typeof(UnityEngine.Material));
                    
                    Spine.Unity.MeshGenerator.GenerateSingleSubmeshInstruction( _instructionOutput, _skeleton, _material );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GenerateSkeletonRendererInstruction_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 6&& translator.Assignable<Spine.Unity.SkeletonRendererInstruction>(L, 1)&& translator.Assignable<Spine.Skeleton>(L, 2)&& translator.Assignable<System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>>(L, 3)&& translator.Assignable<System.Collections.Generic.List<Spine.Slot>>(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 6)) 
                {
                    Spine.Unity.SkeletonRendererInstruction _instructionOutput = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRendererInstruction));
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material> _customSlotMaterials = (System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>)translator.GetObject(L, 3, typeof(System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>));
                    System.Collections.Generic.List<Spine.Slot> _separatorSlots = (System.Collections.Generic.List<Spine.Slot>)translator.GetObject(L, 4, typeof(System.Collections.Generic.List<Spine.Slot>));
                    bool _generateMeshOverride = LuaAPI.lua_toboolean(L, 5);
                    bool _immutableTriangles = LuaAPI.lua_toboolean(L, 6);
                    
                    Spine.Unity.MeshGenerator.GenerateSkeletonRendererInstruction( _instructionOutput, _skeleton, _customSlotMaterials, _separatorSlots, _generateMeshOverride, _immutableTriangles );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 5&& translator.Assignable<Spine.Unity.SkeletonRendererInstruction>(L, 1)&& translator.Assignable<Spine.Skeleton>(L, 2)&& translator.Assignable<System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>>(L, 3)&& translator.Assignable<System.Collections.Generic.List<Spine.Slot>>(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    Spine.Unity.SkeletonRendererInstruction _instructionOutput = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 1, typeof(Spine.Unity.SkeletonRendererInstruction));
                    Spine.Skeleton _skeleton = (Spine.Skeleton)translator.GetObject(L, 2, typeof(Spine.Skeleton));
                    System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material> _customSlotMaterials = (System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>)translator.GetObject(L, 3, typeof(System.Collections.Generic.Dictionary<Spine.Slot, UnityEngine.Material>));
                    System.Collections.Generic.List<Spine.Slot> _separatorSlots = (System.Collections.Generic.List<Spine.Slot>)translator.GetObject(L, 4, typeof(System.Collections.Generic.List<Spine.Slot>));
                    bool _generateMeshOverride = LuaAPI.lua_toboolean(L, 5);
                    
                    Spine.Unity.MeshGenerator.GenerateSkeletonRendererInstruction( _instructionOutput, _skeleton, _customSlotMaterials, _separatorSlots, _generateMeshOverride );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.MeshGenerator.GenerateSkeletonRendererInstruction!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_TryReplaceMaterials_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
                
                {
                    Spine.ExposedList<Spine.Unity.SubmeshInstruction> _workingSubmeshInstructions = (Spine.ExposedList<Spine.Unity.SubmeshInstruction>)translator.GetObject(L, 1, typeof(Spine.ExposedList<Spine.Unity.SubmeshInstruction>));
                    System.Collections.Generic.Dictionary<UnityEngine.Material, UnityEngine.Material> _customMaterialOverride = (System.Collections.Generic.Dictionary<UnityEngine.Material, UnityEngine.Material>)translator.GetObject(L, 2, typeof(System.Collections.Generic.Dictionary<UnityEngine.Material, UnityEngine.Material>));
                    
                    Spine.Unity.MeshGenerator.TryReplaceMaterials( _workingSubmeshInstructions, _customMaterialOverride );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Begin(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Begin(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_AddSubmesh(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 3&& translator.Assignable<Spine.Unity.SubmeshInstruction>(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    Spine.Unity.SubmeshInstruction _instruction;translator.Get(L, 2, out _instruction);
                    bool _updateTriangles = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.AddSubmesh( _instruction, _updateTriangles );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& translator.Assignable<Spine.Unity.SubmeshInstruction>(L, 2)) 
                {
                    Spine.Unity.SubmeshInstruction _instruction;translator.Get(L, 2, out _instruction);
                    
                    gen_to_be_invoked.AddSubmesh( _instruction );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.MeshGenerator.AddSubmesh!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_BuildMesh(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonRendererInstruction _instruction = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRendererInstruction));
                    bool _updateTriangles = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.BuildMesh( _instruction, _updateTriangles );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_BuildMeshWithArrays(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    Spine.Unity.SkeletonRendererInstruction _instruction = (Spine.Unity.SkeletonRendererInstruction)translator.GetObject(L, 2, typeof(Spine.Unity.SkeletonRendererInstruction));
                    bool _updateTriangles = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.BuildMeshWithArrays( _instruction, _updateTriangles );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_ScaleVertexData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _scale = (float)LuaAPI.lua_tonumber(L, 2);
                    
                    gen_to_be_invoked.ScaleVertexData( _scale );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillVertexData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 2, typeof(UnityEngine.Mesh));
                    
                    gen_to_be_invoked.FillVertexData( _mesh );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillLateVertexData(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 2, typeof(UnityEngine.Mesh));
                    
                    gen_to_be_invoked.FillLateVertexData( _mesh );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillTriangles(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 2, typeof(UnityEngine.Mesh));
                    
                    gen_to_be_invoked.FillTriangles( _mesh );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillTrianglesSingle(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 2, typeof(UnityEngine.Mesh));
                    
                    gen_to_be_invoked.FillTrianglesSingle( _mesh );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_EnsureVertexCapacity(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 5&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 5)) 
                {
                    int _minimumVertexCount = LuaAPI.xlua_tointeger(L, 2);
                    bool _inlcudeTintBlack = LuaAPI.lua_toboolean(L, 3);
                    bool _includeTangents = LuaAPI.lua_toboolean(L, 4);
                    bool _includeNormals = LuaAPI.lua_toboolean(L, 5);
                    
                    gen_to_be_invoked.EnsureVertexCapacity( _minimumVertexCount, _inlcudeTintBlack, _includeTangents, _includeNormals );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 4&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 4)) 
                {
                    int _minimumVertexCount = LuaAPI.xlua_tointeger(L, 2);
                    bool _inlcudeTintBlack = LuaAPI.lua_toboolean(L, 3);
                    bool _includeTangents = LuaAPI.lua_toboolean(L, 4);
                    
                    gen_to_be_invoked.EnsureVertexCapacity( _minimumVertexCount, _inlcudeTintBlack, _includeTangents );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 3&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)&& LuaTypes.LUA_TBOOLEAN == LuaAPI.lua_type(L, 3)) 
                {
                    int _minimumVertexCount = LuaAPI.xlua_tointeger(L, 2);
                    bool _inlcudeTintBlack = LuaAPI.lua_toboolean(L, 3);
                    
                    gen_to_be_invoked.EnsureVertexCapacity( _minimumVertexCount, _inlcudeTintBlack );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    int _minimumVertexCount = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.EnsureVertexCapacity( _minimumVertexCount );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.MeshGenerator.EnsureVertexCapacity!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_TrimExcess(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.TrimExcess(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_FillMeshLocal_xlua_st_(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& translator.Assignable<UnityEngine.Mesh>(L, 1)&& translator.Assignable<Spine.RegionAttachment>(L, 2)) 
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 1, typeof(UnityEngine.Mesh));
                    Spine.RegionAttachment _regionAttachment = (Spine.RegionAttachment)translator.GetObject(L, 2, typeof(Spine.RegionAttachment));
                    
                    Spine.Unity.MeshGenerator.FillMeshLocal( _mesh, _regionAttachment );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 3&& translator.Assignable<UnityEngine.Mesh>(L, 1)&& translator.Assignable<Spine.MeshAttachment>(L, 2)&& translator.Assignable<Spine.SkeletonData>(L, 3)) 
                {
                    UnityEngine.Mesh _mesh = (UnityEngine.Mesh)translator.GetObject(L, 1, typeof(UnityEngine.Mesh));
                    Spine.MeshAttachment _meshAttachment = (Spine.MeshAttachment)translator.GetObject(L, 2, typeof(Spine.MeshAttachment));
                    Spine.SkeletonData _skeletonData = (Spine.SkeletonData)translator.GetObject(L, 3, typeof(Spine.SkeletonData));
                    
                    Spine.Unity.MeshGenerator.FillMeshLocal( _mesh, _meshAttachment, _skeletonData );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to Spine.Unity.MeshGenerator.FillMeshLocal!");
            
        }
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_VertexCount(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
                LuaAPI.xlua_pushinteger(L, gen_to_be_invoked.VertexCount);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_Buffers(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.Buffers);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _g_get_settings(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
                translator.Push(L, gen_to_be_invoked.settings);
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 1;
        }
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _s_set_settings(RealStatePtr L)
        {
		    try {
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			
                Spine.Unity.MeshGenerator gen_to_be_invoked = (Spine.Unity.MeshGenerator)translator.FastGetCSObj(L, 1);
                Spine.Unity.MeshGenerator.Settings gen_value;translator.Get(L, 2, out gen_value);
				gen_to_be_invoked.settings = gen_value;
            
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            return 0;
        }
        
		
		
		
		
    }
}
