namespace XLua.LuaDLL
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Runtime.InteropServices;
    using UnityEngine;

    public partial class Lua
    {
        [DllImport( LUADLL, CallingConvention = CallingConvention.Cdecl )]
        public static extern int luaopen_rapidjson( System.IntPtr L );

        [MonoPInvokeCallback( typeof( LuaDLL.lua_CSFunction ) )]
        public static int LoadRapidJson( System.IntPtr L )
        {
            return luaopen_rapidjson( L );
        }

        [DllImport( LUADLL, CallingConvention = CallingConvention.Cdecl )]
        public static extern int luaopen_luaFixedMath( System.IntPtr L );

        [MonoPInvokeCallback( typeof( LuaDLL.lua_CSFunction ) )]
        public static int LoadLuaFixedMath( System.IntPtr L )
        {
            return luaopen_luaFixedMath( L );
        }
    }
}
