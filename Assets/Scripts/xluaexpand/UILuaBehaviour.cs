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
using UnityEngine.UI;

namespace XLua
{
    [LuaCallCSharp]
    public class UILuaBehaviour : LuaBehaviour
    {
        protected override void Awake()
        {
            if (name.Contains("(Clone)"))
                gameObject.name = name.Replace("(Clone)", "");

            luaTable = XLuaBridge.GetInstance().XLuaDoUILuaTable(name);
            //绑定的ui类一定有会__cobject.指向这个对象的Object 这是通用规则. lua和c#绑定的对象 
            luaTable.Set("__cobject", this.gameObject);
            //luaTable.Set("__index", XLuaBridge.luaEnv.Global);
            // Need be invoked before luaAwake()
            XLuaHelper.FillCompoents(luaTable, gameObject, "{0}");
            GameObject child = GameObject.Find("testButton");
            RectTransform a= child.GetComponent<RectTransform>();
            GetFunction();
            //a.localRotation = new Vector3(0, 0, 0);
            
            Vector3 vv = new Vector3(0, 0, 70);
            a.eulerAngles = vv;
            vv.z = 0;
            if ( luaAwake != null )
            {
                luaAwake( luaTable );
            }

        }

        protected override void GetFunction()
        {
            luaAwake = luaTable.Get<Action<LuaTable>>( "OnAwake" );
            luaOnDestroy = luaTable.Get<Action>( "OnDestroy" );
        }
    }
}
