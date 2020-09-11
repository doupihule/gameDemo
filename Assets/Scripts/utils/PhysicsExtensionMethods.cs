/*----------------------------------------------------------------
// Copyright (C) 2017 Jiawen
//
// file name: ExtensionMethods.cs
// description: 
// 
// created time：11/28/2017
//
//----------------------------------------------------------------*/

using Resource;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace GameUtils
{
    //视图相关的扩展接口
    public static class PhysicsExtensionMethods
    {
       //执行raycast后 在js端直接访问这个对象即可
       public static RaycastHit tempRayCastHit;

       private static Vector3 _tempV1 = new Vector3();
        private static Vector3 _tempV2 = new Vector3();
        public static bool rayCastHit(float x1,float y1, float z1,float x2,float y2,float z2,float maxDistance, int maskLayer)
        {
            _tempV1.x = x1;
            _tempV1.y = y1;
            _tempV1.z = z1;
            _tempV2.x = x2;
            _tempV2.y = y2;
            _tempV2.z = z2;
            bool rt = Physics.Raycast(_tempV1, _tempV2, out tempRayCastHit, maxDistance, maskLayer);
           return rt;
        }

    }
}


