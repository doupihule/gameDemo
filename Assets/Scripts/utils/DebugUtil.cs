/*----------------------------------------------------------------
// Copyright (C) 2016 Jiawen(Kevin)
//
// file name: DebugUtils.cs
// description: the assistant debug class
// 
// created time：09/26/2016
//
//----------------------------------------------------------------*/

//#define DEBUG
using System;
using System.Collections.Generic;
using UnityEngine;

using Constants;
using UnityEngine.Profiling;

namespace GameUtils
{
    public class DebugUtils
    {
        public static bool DebugMode = true;
        private static LogWriter logWriter;

        public enum Type
        {
            Lua,

            Data,

            AssetBundle,
            Resource,

            AsyncSocket,
            Network,
            Protocol,
            NetAlert,
            Cipher,
            Compress,

            UI,

            Battle,
            Render,
            Match,
         
            LoadingScene,

            Special,
            Important,
        }

        private static Dictionary<Type, string> type2string = new Dictionary<Type, string>()
        {
            { Type.Lua, "Lua : " },
            { Type.Data, "Data : " },
            //{ Type.Render, "Render : " },
#if !UNITY_EDITOR
            { Type.AssetBundle, "AssetBundle : " },
            { Type.Resource, "Resource : " },
#else
            { Type.AssetBundle, "AssetBundle : " },
            { Type.Resource, "Resource : " },
#endif
           
            { Type.AsyncSocket, "AsyncSocket : " },
            { Type.Network, "Network : " },
            { Type.Protocol, "Protocol : " },
            { Type.NetAlert, "NetAlert : " },
            { Type.Cipher, "Cipher : " },
            { Type.Compress, "Compress : " },

            { Type.UI, "UI : " },

            { Type.Special, "Special : " },
            { Type.Important, "Important : " },

        };
        
        //[System.Diagnostics.Conditional("ENABLE_LOGS")]
        public static void Assert( bool cond, string message = "" )
        {
            if ( DebugMode && !cond )
            {
                //Logger.instance.log(message);
                // Debug.LogError( message );
                throw new Exception( message );
            }
        }

        public static void Log( Type type, string message )
        {
            //if ( DebugMode && type2string.ContainsKey( type ) )
            {
                Debug.Log( string.Concat( type2string[type], message ) );

               // WriteToFile( message, LogType.Log );
            }
        }

        public static void TestLog( bool cond, Type type, string message )
        {
            if ( DebugMode && cond )
            {
                Log( type, message );
            }
        }

        public static void JsonLog( Type type, object jsonableObject )
        {
            if ( DebugMode && type2string.ContainsKey( type ) )
            {
                Debug.Log( string.Concat( type2string[type], UnityEngine.JsonUtility.ToJson( jsonableObject, true ) ) );
            }
        }

        public static void LogWarning( Type type, string message )
        {
            if ( DebugMode && type2string.ContainsKey( type ) )
            {
                Debug.LogWarning( string.Concat( type2string[type], message ) );

                WriteToFile( message, LogType.Warning );
            }
        }

        public static void TestLogWarning( bool cond, Type type, string message )
        {
            if ( DebugMode && cond )
            {
                LogWarning( type, message );
            }
        }

        public static void LogError( Type type, string message )
        {
            /*
            if( DebugMode && type2string.ContainsKey( type ) )
            {
                Debug.LogError( string.Concat(type2string[type] , message ));
            }
            */
            if ( DebugMode )
            {
                Debug.LogError( message );
            }
            //LogOnScreen( message );
        }

        public static void TestLogError( bool cond, Type type, string message )
        {
            if ( DebugMode && cond )
            {
                LogError( type, message );
            }
        }

        /// <summary>
        /// Push the log to screen and send it to server
        /// </summary>
        /// <param name="message"></param>
        public static void LogOnScreen( string message )
        {
            if ( string.IsNullOrEmpty( message ) )
            {
                return;
            }

            DebugToScreen.PostException( message );
        }
        
        public static void Init( GameObject go )
        {
#if DEBUG
            Debug.Log( "Unity DEBUG mode is on!" );
            DebugMode = true;
#else
		    Debug.Log( "Unity DEBUG mode is off!" );
            DebugMode = false;
#endif
            Debug.unityLogger.logEnabled = DebugMode;

#if UNITY_EDITOR
            GameConstants.LoadAssetByEditor = DebugMode && CommonUtil.LoadAssetsWay;
            Debug.Log( "Current resource loading method : " + ( GameConstants.LoadAssetByEditor ? "Editor" : "Assetbundle" ) );
#endif

            if( DebugMode )
            {
                DebugToScreen.Init( go );
                DebugToScreen.RegisterHandler();

                go.AddComponent<FPSLabel>();

                logWriter = new LogWriter();
                Application.logMessageReceivedThreaded += ProcessExceptionReport;
                Application.lowMemory += LowMemoryCallback;
                

                logWriter.WriteLog( "The current app version number is : " + Application.version );
                logWriter.WriteLog( "The model of the device : " + SystemInfo.deviceName );
                logWriter.WriteLog( "The user defined name of the device : " + SystemInfo.deviceModel );
                logWriter.WriteLog( "Amount of video memory present : " + SystemInfo.graphicsMemorySize );
                logWriter.WriteLog( "Graphics device shader capability level : " + SystemInfo.graphicsShaderLevel );
                logWriter.WriteLog( "Amount of system memory present : " + SystemInfo.systemMemorySize );
                logWriter.WriteLog( "The device network state : " + Application.internetReachability.ToString() );
            }
        }

        private static void LowMemoryCallback()
        {
            //string s = "";
            //s += " MonoHeap:" + Profiler.GetMonoHeapSizeLong() / 1000 + "k";
            //s += " MonoUsed:" + Profiler.GetMonoUsedSizeLong() / 1000 + "k";
            //s += " Allocated:" + Profiler.GetTotalAllocatedMemoryLong() / 1000 + "k";
            //s += " Reserved:" + Profiler.GetTotalReservedMemoryLong() / 1000 + "k";
            //s += " UnusedReserved:" + Profiler.GetTotalUnusedReservedMemoryLong() / 1000 + "k";
            //s += " UsedHeap:" + Profiler.usedHeapSizeLong / 1000 + "k";
            //Debug.LogError( "Current application in low memory state" );
            //logWriter.WriteLog( " ============ Current application in low memory state START ============== " );
            //logWriter.WriteLog( "The device network state : " + UnityEngine.Profiling.Profiler.GetMonoUsedSizeLong() );
            //logWriter.WriteLog( " ============ Current application in low memory state END ============== " );
        }

        private static void ProcessExceptionReport( string message, string stackTrace, LogType type )
        {
            if( type == LogType.Error || type == LogType.Exception )
            {
                WriteToFile( message, type, stackTrace );
            }
        }

        public static void WriteToFile( string message, LogType logType, string stackTrace = null )
        {
            if( logWriter != null && !DebugMode ) return;

            if( string.IsNullOrEmpty( stackTrace ) )
            {
                stackTrace = Environment.StackTrace;
            }

            message = string.Format( "[{3}]:{0}:{1}'\n'{2}", DateTime.Now.ToString( "yyyy-MM-dd HH:mm:ss,fff" ), message, stackTrace, logType );

            if( logWriter != null )
            {
                logWriter.WriteLog( message );
            }

            if( logType == LogType.Error || logType == LogType.Exception )
            {
                LogOnScreen( message );
            }
        }


        public static void Release()
        {
            if( logWriter != null )
            {
                logWriter.Release();
                logWriter = null;
            }
        }

    }
}