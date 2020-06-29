using System.IO;
using System.Collections.Generic;

using GameUtils;

namespace Resource
{
    public enum AssetType
    {
        Unknown = -1,
        C = 0, // lua code
        F = 1, // assetbundle
    }

    public class FileVersionData
    {
        public AssetType fileType;
        public string filePath;
        public string fileName;
        public long fileSize;
        public long version;
        public MemoryStream memoryStream;

        public string GetString( long v = -2 )
        {
            version = v == -2 ? version : v;
            return string.Concat( fileName, "#", fileSize, "#", version, "#", filePath, "|" );
        }

        public string GetVersionString()
        {
            return string.Concat( fileName, "#", fileSize, "#", version );
        }

		public string GetTempListString( string prefix = "" )
		{
			return string.Format( "{0}#{1}#{2}#{3}{4}|", fileName, fileSize, version, prefix, filePath );
		}

        public static List<FileVersionData> ParseFileVersionData( string[] strs, AssetType fileType = AssetType.Unknown, string logStr = "" )
        {
            List<FileVersionData> list = new List<FileVersionData>();

            if( strs == null || strs.Length == 0 ) return list;
            int length = strs.Length;

            for( int i = 0; i < strs.Length; i++ )
            {
                string str = strs[i].Trim();
                if( string.IsNullOrEmpty( str ) ) continue;

                string[] datas = str.Split( '#' );
                if( datas.Length != 3 && datas.Length != 4 )
                {
                    string errMsg = string.Format( "File version data incorrect length!, fileType = {0} str = {1} logStr = {2}", fileType, str, logStr );
                    if ( logStr == "download resource" )
                    {
                        DebugUtils.Log( DebugUtils.Type.Resource, errMsg );
                    }
                    else
                    {
                        DebugUtils.LogError( DebugUtils.Type.Resource, errMsg );
                    }
                    continue;
                }
                // fileName#fileSize#versions
                FileVersionData fileVersionData = new FileVersionData();
                fileVersionData.fileType = fileType;
                fileVersionData.fileName = datas[0];
                fileVersionData.fileSize = long.Parse( datas[1] );
                fileVersionData.version = long.Parse( datas[2] );
                fileVersionData.filePath = datas.Length == 4 ? datas[3] : "";

                list.Add( fileVersionData );
            }

            return list;
        }
    }
}