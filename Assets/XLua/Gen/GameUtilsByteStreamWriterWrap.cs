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
    public class GameUtilsByteStreamWriterWrap 
    {
        public static void __Register(RealStatePtr L)
        {
			ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
			System.Type type = typeof(GameUtils.ByteStreamWriter);
			Utils.BeginObjectRegister(type, L, translator, 0, 16, 0, 0);
			
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteByte", _m_WriteByte);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteBool", _m_WriteBool);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteShort", _m_WriteShort);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteInt", _m_WriteInt);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteUInt", _m_WriteUInt);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteFloat", _m_WriteFloat);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteDouble", _m_WriteDouble);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteLong", _m_WriteLong);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteULong", _m_WriteULong);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteBytes", _m_WriteBytes);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteUTF8", _m_WriteUTF8);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "WriteUTF8WithLength", _m_WriteUTF8WithLength);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetBuffer", _m_GetBuffer);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "GetRawBuffer", _m_GetRawBuffer);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Reset", _m_Reset);
			Utils.RegisterFunc(L, Utils.METHOD_IDX, "Dispose", _m_Dispose);
			
			
			
			
			
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
					
					GameUtils.ByteStreamWriter gen_ret = new GameUtils.ByteStreamWriter();
					translator.Push(L, gen_ret);
                    
					return 1;
				}
				
			}
			catch(System.Exception gen_e) {
				return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
			}
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.ByteStreamWriter constructor!");
            
        }
        
		
        
		
        
        
        
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteByte(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    byte _v = (byte)LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.WriteByte( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteBool(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    bool _v = LuaAPI.lua_toboolean(L, 2);
                    
                    gen_to_be_invoked.WriteBool( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteShort(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    short _v = (short)LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.WriteShort( _v );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 2&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 2)) 
                {
                    int _v = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.WriteShort( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.ByteStreamWriter.WriteShort!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteInt(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    int _v = LuaAPI.xlua_tointeger(L, 2);
                    
                    gen_to_be_invoked.WriteInt( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteUInt(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    uint _v = LuaAPI.xlua_touint(L, 2);
                    
                    gen_to_be_invoked.WriteUInt( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteFloat(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    float _v = (float)LuaAPI.lua_tonumber(L, 2);
                    
                    gen_to_be_invoked.WriteFloat( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteDouble(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    double _v = LuaAPI.lua_tonumber(L, 2);
                    
                    gen_to_be_invoked.WriteDouble( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteLong(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    long _v = LuaAPI.lua_toint64(L, 2);
                    
                    gen_to_be_invoked.WriteLong( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteULong(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    ulong _v = LuaAPI.lua_touint64(L, 2);
                    
                    gen_to_be_invoked.WriteULong( _v );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteBytes(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
			    int gen_param_count = LuaAPI.lua_gettop(L);
            
                if(gen_param_count == 2&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)) 
                {
                    byte[] _v = LuaAPI.lua_tobytes(L, 2);
                    
                    gen_to_be_invoked.WriteBytes( _v );
                    
                    
                    
                    return 0;
                }
                if(gen_param_count == 3&& (LuaAPI.lua_isnil(L, 2) || LuaAPI.lua_type(L, 2) == LuaTypes.LUA_TSTRING)&& LuaTypes.LUA_TNUMBER == LuaAPI.lua_type(L, 3)) 
                {
                    byte[] _s = LuaAPI.lua_tobytes(L, 2);
                    int _len = LuaAPI.xlua_tointeger(L, 3);
                    
                    gen_to_be_invoked.WriteBytes( _s, _len );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
            return LuaAPI.luaL_error(L, "invalid arguments to GameUtils.ByteStreamWriter.WriteBytes!");
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteUTF8(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _s = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.WriteUTF8( _s );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_WriteUTF8WithLength(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    string _s = LuaAPI.lua_tostring(L, 2);
                    
                    gen_to_be_invoked.WriteUTF8WithLength( _s );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetBuffer(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                        byte[] gen_ret = gen_to_be_invoked.GetBuffer(  );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    
                    
                    
                    return 1;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_GetRawBuffer(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    long _length;
                    
                        byte[] gen_ret = gen_to_be_invoked.GetRawBuffer( out _length );
                        LuaAPI.lua_pushstring(L, gen_ret);
                    LuaAPI.lua_pushint64(L, _length);
                        
                    
                    
                    
                    return 2;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        [MonoPInvokeCallbackAttribute(typeof(LuaCSFunction))]
        static int _m_Reset(RealStatePtr L)
        {
		    try {
            
                ObjectTranslator translator = ObjectTranslatorPool.Instance.Find(L);
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Reset(  );
                    
                    
                    
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
            
            
                GameUtils.ByteStreamWriter gen_to_be_invoked = (GameUtils.ByteStreamWriter)translator.FastGetCSObj(L, 1);
            
            
                
                {
                    
                    gen_to_be_invoked.Dispose(  );
                    
                    
                    
                    return 0;
                }
                
            } catch(System.Exception gen_e) {
                return LuaAPI.luaL_error(L, "c# exception:" + gen_e);
            }
            
        }
        
        
        
        
        
        
		
		
		
		
    }
}
