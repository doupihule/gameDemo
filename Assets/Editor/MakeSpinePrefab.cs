/*
 * Tencent is pleased to support the open source community by making xLua available.
 * Copyright (C) 2016 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

using System.Collections.Generic;
using System;
using System.Reflection;
using System.Linq;
using UnityEditor;
using UnityEngine;
using System.IO;
using Spine.Unity;

public static class MakeSpinePrefab
{
    /***************如果你全lua编程，可以参考这份自动化配置***************/
    //--------------begin 纯lua编程配置参考----------------------------
    [MenuItem("Tools/生成spine预制")]
    private static void makeSpineFrefab()
    {
        string sourcepath = "Assets/Animation/SpineRes";
        string prefabpath = "Assets/Animation/Prefabs/";
        string baseprefab = "Assets/Animation/Prefabs/baseSpine.prefab";

        string[] pathArr = Directory.GetDirectories(sourcepath);

        GameObject basePrebabModal = AssetDatabase.LoadAssetAtPath(baseprefab,typeof(GameObject)) as GameObject;                              //加载模板
        for (int i = 0; i < pathArr.Length; i++) {
            string path = pathArr[i];
            if (path.Contains(".meta")) {
                continue;
            }
            path = path.Replace("\\", "/");
            string [] tempArr = path.Split('/');
            string spineName = tempArr[tempArr.Length - 1];

            string targetPrefabPath = prefabpath + spineName + ".prefab";
            //如果已经存在 对应的预设了 不执行
            if (File.Exists(targetPrefabPath))
            {
                continue;
            }

            string tempMaterialPath = sourcepath + "/" + spineName + "/" + spineName + "_Material.mat";
            string dataAeestName = sourcepath + "/" + spineName + "/" + spineName + "_SkeletonData.asset";
            if (!File.Exists(dataAeestName))
            {
                Debug.Log("not exisit spineData:" + dataAeestName);
                continue;
            }
            GameObject targetSpine = GameObject.Instantiate<GameObject>(basePrebabModal);                        //实例化模板
            
            SkeletonGraphic grap = targetSpine.GetComponent<SkeletonGraphic>();
            Spine.Unity.SkeletonDataAsset prefabAsset = AssetDatabase.LoadAssetAtPath<SkeletonDataAsset>(dataAeestName);
            
            grap.skeletonDataAsset = prefabAsset;
             Material mater = AssetDatabase.LoadAssetAtPath<Material>(tempMaterialPath);
            grap.material = mater;
            PrefabUtility.SaveAsPrefabAsset( targetSpine, targetPrefabPath);
            GameObject.DestroyImmediate(targetSpine);
            Debug.Log("createSpinePrefab:" + targetPrefabPath);
        }

    }
    
}
