using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using GameUtils;

namespace XLua
{
    [LuaCallCSharp]
    public class CSRegisterObject
    {
        public static List<System.Object> csObjectList = new List<System.Object>();
        public static LuaTable LuaRegisterObject;

        public static void UnRegisterObject( System.Object obj )
        {
            if ( csObjectList.Contains( obj ) )
            {
                csObjectList.Remove( obj );
            }
            else
            {
                DebugUtils.LogError( DebugUtils.Type.Lua, "Rigister is not fond " + obj.ToString() );
            }
        }

        public static void RegisterObject( System.Object obj )
        {
            if ( csObjectList.Contains( obj ) )
            {
                DebugUtils.LogError( DebugUtils.Type.Lua, "this object already exist" );
            }
            else
            {
                csObjectList.Add( obj );
            }

        }
    }
}
