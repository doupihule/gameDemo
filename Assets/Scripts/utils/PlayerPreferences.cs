using System.Collections;
using System.Collections.Generic;
using UnityEngine;


namespace GameUtils
{
    public class PlayerPreferences
    {

        //存储int型数值
        public static void SetInt(string key, int value)
        {
            PlayerPrefs.SetInt(key, value);
        }
        //获取int型数值
        public static int GetInt(string key, int defaultvalue)
        {
            if (PlayerPrefs.HasKey(key))
            {
                return PlayerPrefs.GetInt(key, defaultvalue);
            }
            return defaultvalue;
        }
        //存储string型数值
        public static void SetString(string key, string value)
        {
            PlayerPrefs.SetString(key, value);
        }
        //获取string 型数值
        public static string GetString(string key, string defaultvalue = null)
        {
            if(PlayerPrefs.HasKey(key))
            {
                return PlayerPrefs.GetString(key);
            }

            return defaultvalue;
        }
    }
}
