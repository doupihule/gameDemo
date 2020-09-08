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
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

public static class ExportUICompList
{

    private static Dictionary<string,string> uiTypeMap;
    private static string exportString="";

    [MenuItem("Tools/导出ui组件列表")]
    private static void exportUIComp()
    {
        
        var prefabStage = UnityEditor.Experimental.SceneManagement.PrefabStageUtility.GetCurrentPrefabStage();
        if (prefabStage == null)
        {
            Debug.Log("当前没有编辑预设,return");
            return;
        }
        exportString = "";


        GameObject basePrebabModal = AssetDatabase.LoadAssetAtPath(prefabStage.prefabAssetPath, typeof(GameObject)) as GameObject;

        exportOneUi(basePrebabModal.transform, "");
        Debug.Log(exportString);
    }



    private static void exportOneUi(Transform tran,string path = "")
    {
        var len = tran.childCount;
        for(var i=0; i < len; i++)
        {
            var childTrans = tran.GetChild(i);
            var name = childTrans.name;
            var uiTypeArr = name.Split('_');
            string uiType = uiTypeArr[0];
            bool forChild = true;
            string cname = "";
            if (uiType.Equals("btn"))
            {
                cname = "ButtonExpand";
                forChild = false;
            } else if (uiType.Equals("img"))
            {
                cname = "ImageExpand";
            }
            else if (uiType.Equals("spine"))
            {
                cname = "SpineGraphicExpand";
            }
            else if (uiType.Equals("list"))
            {
                cname = "ListExpand";
                forChild = false;
            }
            else if (uiType.Equals("ctn"))
            {
                cname = "BaseContainer";
                forChild = false;
            }
            else if (uiType.Equals("label"))
            {
                cname = "LabelExpand";
            }
            else if (uiType.Equals("panel"))
            {
                cname = "BaseContainer";
            }
            else if (uiType.Equals("scroll"))
            {
                cname = "ScrollExpand";
                forChild = false; ;
            }
            else if (uiType.Equals("ui"))
            {
                cname = "UIBaseView";
                forChild = false;
            }
            if(cname.Length ==0)
            {
                Debug.Log("__wrongName:" + name);
                
            }
            else
            {
                string targetStr = "   public " + name + " : " + cname + ";\n";
                if(exportString.IndexOf(targetStr) ==-1)
                {
                    exportString += targetStr;
                }
                else
                {
                    Debug.Log("重复的属性名:" + name +"path:"+path);
                }
               
            }
            if (forChild)
            {
                exportOneUi(childTrans, path + "." + name);
            }

        }
    }
    
}
