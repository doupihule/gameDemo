using System;
using System.IO;
using System.Reflection;
using System.Text;
using LitJson;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
public class MyEditor : Editor
{
    //将所有游戏场景导出为JSON格式
    [MenuItem("GameObject/ExportJSON")]

    static void ExportJSON()
    {

        Transform rootObjTrans;
        string filepath = Application.dataPath + @"/../../../assets_dev/bin/levelCfg/levelCfg.json";
        FileInfo t = new FileInfo(filepath);
        if (!File.Exists(filepath))
        {
            File.Delete(filepath);
        }
        StreamWriter sw = t.CreateText();

        StringBuilder sb = new StringBuilder();
        JsonWriter writer = new JsonWriter(sb);

        foreach (UnityEditor.EditorBuildSettingsScene S in UnityEditor.EditorBuildSettings.scenes)
        {
            if (S.enabled)
            {
                string name = S.path;
                EditorSceneManager.OpenScene(name);
                writer.WriteObjectStart();
                writer.WritePropertyName("scenes");
                writer.WriteArrayStart();
                writer.WriteObjectStart();
                writer.WritePropertyName("name");
                writer.Write(name);
                writer.WritePropertyName("level");
                writer.WriteObjectStart();
                foreach (GameObject rootObj in UnityEngine.Object.FindObjectsOfType(typeof(GameObject)))
                {
                    if (rootObj.name.IndexOf("level_") != -1)
                    {

                        Debug.Log("=>" + rootObj.name + "开始写入");
                        var elementNum = 0;
                        var playerNum = 0;
                        var targetNum = 0;

                        writer.WritePropertyName(rootObj.name);
                        // writer.WriteObjectStart();
                        writer.WriteArrayStart();
                        rootObjTrans = rootObj.transform;
                        foreach (GameObject obj in UnityEngine.Object.FindObjectsOfType(typeof(GameObject)))
                        {
                            if (obj.transform.parent == rootObjTrans)
                            {

                                if (obj.GetComponent<Param>() == null)
                                {
                                    Debug.LogWarning("\t" + rootObj.name + "中" + obj.name + "未添加Param脚本");
                                    continue;
                                }

                                writer.WriteObjectStart();
                                writer.WritePropertyName("name");
                                if (obj.name.IndexOf(' ') != -1)
                                {
                                    string[] sArray = obj.name.Split(' ');
                                    writer.Write(sArray[0]);
                                    // Debug.Log("\t" + sArray[0]);
                                }
                                else
                                {
                                    writer.Write(obj.name);
                                    // Debug.Log("\t" + obj.name);
                                }
                                Debug.Log("\t" + obj.name);


                                writer.WritePropertyName("type");
                                Param.ElementGroup type = obj.GetComponent<Param>().m_ElementGroup;
                                switch (type)
                                {
                                    case Param.ElementGroup.Player:
                                        playerNum++;
                                        break;
                                    case Param.ElementGroup.Target:
                                        targetNum++;
                                        break;
                                }
                                writer.Write(type + "");

                                writer.WritePropertyName("transform");

                                writer.WriteArrayStart();
                                writer.Write(Math.Round(-obj.transform.position.x, 2));
                                writer.Write(Math.Round(obj.transform.position.y, 2));
                                writer.Write(Math.Round(obj.transform.position.z, 2));
                                writer.Write(Math.Round(obj.transform.rotation.eulerAngles.x, 2));
                                writer.Write(Math.Round(-obj.transform.rotation.eulerAngles.y, 2));
                                writer.Write(Math.Round(obj.transform.rotation.eulerAngles.z, 2));
                                writer.Write(Math.Round(obj.transform.localScale.x, 2));
                                writer.Write(Math.Round(obj.transform.localScale.y, 2));
                                writer.Write(Math.Round(obj.transform.localScale.z, 2));
                                writer.WriteArrayEnd();

                                writer.WritePropertyName("param");
                                SerializableTest param = obj.GetComponent<Param>().param;
                                writer.WriteObjectStart();
                                foreach (FieldInfo p in param.GetType().GetFields())
                                {
                                    writer.WritePropertyName(p.Name.Split('_')[1]);

                                    switch (p.GetValue(param).GetType().Name)
                                    {
                                        case "Boolean":
                                            writer.Write(p.GetValue(param).ToString().Substring(0, 1));
                                            break;
                                        case "Int32":
                                            writer.Write(int.Parse(p.GetValue(param).ToString()));
                                            break;
                                        case "Vector3":
                                            writer.WriteArrayStart();
                                            Vector3 tmp = (Vector3)p.GetValue(param);
                                            writer.Write(Math.Round(tmp.x, 2));
                                            writer.Write(Math.Round(tmp.y, 2));
                                            writer.Write(Math.Round(tmp.z, 2));
                                            writer.WriteArrayEnd();
                                            break;
                                        default:
                                            writer.Write(p.GetValue(param).ToString());
                                            break;
                                    }
                                }
                                writer.WriteObjectEnd();

                                writer.WriteObjectEnd();

                                elementNum++;
                            }
                        }

                        writer.WriteArrayEnd();

                        if (playerNum == 0)
                            Debug.LogError("\t" + rootObj.name + "未设置主角");
                        if (targetNum == 0)
                            Debug.LogError("\t" + rootObj.name + "未设置目标");
                        Debug.Log("=>" + rootObj.name + "共写入" + elementNum + "个元素");
                        // writer.WriteObjectEnd();
                    }
                }
                writer.WriteObjectEnd();
                writer.WriteObjectEnd();
                writer.WriteArrayEnd();
                writer.WriteObjectEnd();

                Debug.Log("写入完成");
            }
        }

        sw.WriteLine(sb.ToString());
        sw.Close();
        sw.Dispose();
        AssetDatabase.Refresh();
    }
}