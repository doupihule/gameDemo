/*----------------------------------------------------------------
// Copyright (C) 2017 Jiawen(Kevin)
//
// file name: LuaBehaviour.cs
// description: 
// 
// created time：11/28/2017
//
//----------------------------------------------------------------*/

using System;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;


namespace XLua
{
    [LuaCallCSharp]
    public class LuaBehaviour : MonoBehaviour
    {
        protected Action<LuaTable> luaAwake = null;
        protected Action luaStart = null;
        protected Action luaUpdate = null;
        protected Action luaOnDestroy = null;
        protected LuaTable luaTable = null;

        protected XLuaBridge lua = XLuaBridge.GetInstance();

        protected virtual void Awake()
        {
            if ( name.Contains( "(Clone)" ) )
            {
                gameObject.name = name.Replace( "(Clone)" , "" );
            }

            luaTable = lua.XLuaDoFile( "", name, name );

            GetFunction();

            if (luaAwake != null)
            {
                luaAwake( luaTable );
            }
        }

        protected virtual void GetFunction()
        {
            luaAwake = luaTable.Get<Action<LuaTable>>( "Awake" );
            luaStart = luaTable.Get<Action>( "Start" );
            luaUpdate = luaTable.Get<Action>( "Update" );
            luaOnDestroy = luaTable.Get<Action>( "OnDestroy" );
        }

        // Use this for initialization
        protected virtual void Start ()
        {
            if (luaStart != null)
            {
                luaStart();
            }
    	}

        protected virtual void Update()
        {
            if ( luaUpdate != null )
            {
                luaUpdate();
            }
        }

        protected virtual void OnDestroy()
        {
            if ( luaOnDestroy != null)
            {
                luaOnDestroy();
            }

            luaAwake = null;
            luaStart = null;
            luaUpdate = null;
            luaOnDestroy = null;
        }

        public LuaTable GetLuaTable()
        {
            return luaTable;
        }
    }
}
