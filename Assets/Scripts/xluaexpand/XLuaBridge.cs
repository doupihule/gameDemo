/*----------------------------------------------------------------
// Copyright (C) 2017 Jiawen(Kevin)
//
// file name: XLuaBridge.cs
// description: 
// 
// created time：11/28/2017
//
//----------------------------------------------------------------*/

using System;
using System.IO;
using System.Collections.Generic;

using UnityEngine;

using GameUtils;
using Resource;

namespace XLua
{
    public class XLuaBridge
    {
        internal static LuaEnv luaEnv; 
        internal float time = 0;
        internal float lastGCTime = 0;
        internal const float GCInterval = 1;//1 second

        public static XLuaBridge xLuaBridge;

        private LuaTable scriptEnv;


        private List<LuaTable> luaTables = new List<LuaTable>();
        private List<Action<float>> luaFuncs = new List<Action<float>>();

        public static XLuaBridge Init()
        {
            if( xLuaBridge == null )
            {
                luaEnv = new LuaEnv();  //all lua behaviour shared one luaenv only!
                xLuaBridge = new XLuaBridge();
                luaEnv.DoString("package.path = 'Assets/Scripts/luasrc/?.lua.txt;'..package.path");
                luaEnv.DoString("require 'Main'");
            }
            else
            {
                DebugUtils.LogError( DebugUtils.Type.Lua, "Initialize XLuaBridge again!" );
            }
            return xLuaBridge;
        }

        public static XLuaBridge GetInstance()
        {
            return xLuaBridge;
        }

        private XLuaBridge() {}

        public void Awake()
        {
            scriptEnv = luaEnv.Global;
            luaEnv.AddLoader(LoadByteAsset);
        }

        // Update is called once per frame
        public void Update( float deltaTime )
        {
            //if (MemorySnapShot.ins != null)
            //    MemorySnapShot.ins.GetEnvMemoryInfo(luaEnv.Memroy);
            for ( int j = 0; j < luaFuncs.Count; j++ )
            {
                luaFuncs[j]( deltaTime );
            }

            time += deltaTime;
            if ( time - lastGCTime > GCInterval )
            {
                luaEnv.Tick();
                lastGCTime = time;
            }
        }

        public void OnApplicationPause()
        {
            for( int j = 0; j < luaTables.Count; j++ )
            {
                LuaTable table = luaTables[j];
                table.Get<Action>( "OnApplicationPause" )();
            }
        }

        public LuaEnv GetEvn()
        {
            return luaEnv;
        }

        public void OnDestroy()
        {
            luaFuncs.Clear();

            for( int j = 0; j < luaTables.Count; j++ )
            {
                LuaTable table = luaTables[j];
                table.Get<Action>( "OnDestroy" )();
            }

            luaTables.Clear();

            //scriptEnv.Dispose();
        }

        public void XLuaRegisterCSharpModule( string name, LuaBehaviour module )
        {
            scriptEnv.Set( name, module );
        }

        public LuaTable XLuaDoUILuaTable( string name )
        {
            return (LuaTable)(luaEnv.DoString( string.Format( "require 'sys/views/uisource/{0}' return {1}", name , name ) , name )[0]);
        }

        public LuaTable XLuaDoBattleLuaTable( string name )
        {
            return (LuaTable)( luaEnv.DoString( string.Format( "require 'Battle/{0}' return {1}", name, name ), name )[0] );
        }

        public LuaTable XLuaDoFile( string path, string chunk, string name )
        {
            return (LuaTable)(luaEnv.DoString( string.Format( "require '{0}{1}' return {2}", path, chunk, chunk ), name )[0]);
        }

        public LuaTable XLuaLoacalDoFile( string path, string chunk, string name )
        {
            return (LuaTable)( luaEnv.DoString( string.Format( "local info = require '{0}{1}' return info", path, chunk ), name )[0] );
        }

        public object[] XLuaDoString( string chunk, string name )
        {
            return luaEnv.DoString( chunk, name );
        }


        /// <summary>
        /// Registers the lua table.
        /// 1. the table should have Start, Update, OnApplicationPause, OnDestroy functions.
        /// 2. when the table is registered, its Start function will be called.
        /// </summary>
        /// <param name="table">Table.</param>
        public void RegisterLuaTable( LuaTable table )
        {
            if( luaTables.Contains( table ) )
            {
                DebugUtils.LogError( DebugUtils.Type.Lua, "register an existing table twice!" );
            }
            else
            {
                luaTables.Add( table );

                Action startFunc = table.Get<Action>( "Start" );
                startFunc();

                Action<float> func = table.Get<Action<float>>( "Update" );
                if( func == null )
                {
                    DebugUtils.LogError( DebugUtils.Type.Lua, "register a table which doesn't have an Update function!" );
                }
                else
                {
                    luaFuncs.Add( func );
                }
            }
        }
            
        public bool UnRegisterLuaTable( LuaTable table )
        {
            int j = luaTables.IndexOf( table );
            if( j != -1 )
            {
                luaTables.RemoveAt( j );
                luaFuncs.RemoveAt( j );
                return true;
            }

            return false;
        }

        public static byte[] LoadByteAsset(ref string path)
        {
            byte[] datas = null;
#if UNITY_EDITOR
            if ( Constants.GameConstants.LoadAssetByEditor )
            {
                string luaPath = string.Concat( "Assets/Shared/Scripts/Lua/", path, ".lua.txt" );
                TextAsset ta = UnityEditor.AssetDatabase.LoadAssetAtPath<TextAsset>( luaPath );
                DebugUtils.Assert( ta != null, "The lua file cannot be found! path is " + luaPath );
                datas = ta.bytes;
            }
            else
#endif
            {
                string decryptStr = File.ReadAllText( string.Format( ResourceManager.bytesLuaTxtPath, path ), System.Text.Encoding.UTF8 );
                string byteStr = AESUtil.AESDecrypt( decryptStr ); //解密
                datas = System.Text.Encoding.UTF8.GetBytes( byteStr );
            }
            DebugUtils.Assert( datas != null, "The lua file cannot be found! path is " + path );

            return datas;
        }

    }
}

