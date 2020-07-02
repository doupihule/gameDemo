/*----------------------------------------------------------------
// Copyright (C) 2016 Jiawen(Kevin)
//
// file name: GameConstants.cs
// description:
// 
// created time： 09/26/2016
//
//----------------------------------------------------------------*/

using System.Collections.Generic;

namespace Constants
{
    public class GameConstants
    {
#if TEST_BUILD
        public const string SERVER_URL_BRANCH = "testBuild";
#elif DAILY_BUILD
        public const string SERVER_URL_BRANCH = "dailyBuild";
#elif STAGE_BUILD
		public const string SERVER_URL_BRANCH = "stageBuild";
#else
        public const string SERVER_URL_BRANCH = "testBuild";
#endif
        public const string ZIP_SECRET_KEY = "OXZpSnBTWGJ4VExlYlN3bw==";
        public const string BUNDLE_EXT_NAME = ".bundle";
        public const string BUNDLE_MANIFEST = "AssetsBoundles";
        public const string LOCAL_ZIP_TIMETAMP_PATH = "timestampZip.dat";
        public const string LOCAL_BYTE_TIMETAMP_PATH = "timestampByte.dat";
        public const string ZIP_FILE_LIST_DAT = "zipFileList.dat";
        public const string BYTE_FILE_LIST_DAT = "byteFileList.dat";
        public const string VERSION_FILE_NAME = "version.bytes";
        public const int DOWN_LOAD_COMPLETE_MARK = -9999999;

#if UNITY_EDITOR
        public static bool LoadAssetByEditor = true;
#endif

    }

    public class AssetBundleAlwaysCache
    {
        public static List<string> CACHE_BUNDLE_NAME_LIST = new List<string>()
        {
            "dependAsset_ab_top.bundle",

        };
    }


}