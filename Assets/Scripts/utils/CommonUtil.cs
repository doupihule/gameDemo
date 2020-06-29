using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace GameUtils
{
    public class CommonUtil
    {
        public static string GetPlatformString()
        {
            switch( Application.platform )
            {
                case RuntimePlatform.Android:
                return "Android";
                case RuntimePlatform.IPhonePlayer:
                return "IOS";
                //case RuntimePlatform.OSXPlayer:
                //return "osx";
                case RuntimePlatform.WindowsPlayer:
                return "Desktop";
                default: return "Desktop";
            }
        }

        public static bool IsIphoneX
        {
            get
            {
                return SystemInfo.deviceModel.Contains( "iPhone10,3" ) || SystemInfo.deviceModel.Contains( "iPhone10,6" );
            }
        }
        
        public static string EncodingToMd5( string data )
        {
            byte[] bytes = Encoding.Default.GetBytes( data );
            MD5 md5 = new MD5CryptoServiceProvider();
            bytes = md5.ComputeHash( bytes );
            return BitConverter.ToString( bytes ).Replace( "-", "" ); ;
        }

        public static byte[] ReverseBytes( byte[] inArray )
        {
            byte temp;
            int highCtr = inArray.Length - 1;

            for (int ctr = 0; ctr < inArray.Length / 2; ctr++)
            {
                temp = inArray[ctr];
                inArray[ctr] = inArray[highCtr];
                inArray[highCtr] = temp;
                highCtr -= 1;
            }
            return inArray;
        }

        public static string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime( 1970, 1, 1, 0, 0, 0, 0 );
            return Convert.ToInt64( ts.TotalSeconds ).ToString();
        }

#if UNITY_EDITOR
        public static bool LoadAssetsWay
        {
            set
            {
                UnityEditor.EditorPrefs.SetBool( "LOAD_ASSETS_WAY_KEY", value );
            }
            get
            {
                bool way = true;
                if( UnityEditor.EditorPrefs.HasKey( "LOAD_ASSETS_WAY_KEY" ) )
                {
                    way = UnityEditor.EditorPrefs.GetBool( "LOAD_ASSETS_WAY_KEY", true );
                }
                else if( System.IO.Directory.GetCurrentDirectory().Contains( "/UnityProject" ) )
                {
                    way = true;
                    UnityEditor.EditorPrefs.SetBool( "LOAD_ASSETS_WAY_KEY", way );
                }
                return way;
            }
        }
#endif

        

        public static void DebugLogByteArrayContent( byte[] data, int length, string name )
        {
            StringBuilder s = new StringBuilder();
            for( int j = 0; j < length; j++ )
            {
                s.Append( String.Format( ", [{0}]:{1}", j, data[j] ) );
            }
            DebugUtils.Log( DebugUtils.Type.Special, String.Format( "{0} Length = {1}, {2} = {3}", name, length, name, s ) );
        }

    }
}