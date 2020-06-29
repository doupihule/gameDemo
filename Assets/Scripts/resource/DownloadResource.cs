using System;
using System.Text;
using System.Threading;
using System.Collections;
using System.Net.Security;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;

using UnityEngine;
using Unity.IO;

using Constants;
using System.IO;
using GameUtils;
using System.Net;

namespace Resource
{
    public class DownloadResource : MonoBehaviour
    {
		public static string FILE_SERVER_URL = "http://172.16.47.35:8080/";
        private const int DOWNLOAD_THREAD_COUNT = 2; // Start downloading the number of threads.

        private float checkUpdateStepCount = 6; // Check the total number of update steps
        private float checkUpdateStep;

        private Action<float, float> checkCallback;
        private Action<string> versionCallback;
        private Action<long, long, long> downloadCallback;

        private Queue<FileVersionData> waitDownloadQueue;
        private List<DownLoadThread> downLoadList;
        private object lockObjectGetFile;
        private object lockObjectWriteTempFile;
        private long downloadCountSize;
        private int serverBytesVersion;
        private int serverBundleVersion;
        private bool allDownloadIsDone;
        private float delayTimeOne;
        private long downLoadSpeed;

        private string zipFileListPath;
        private string byteFileListPath;
		private BufferedStream zipListFileStream;
		private BufferedStream byteListFileStream;

        private Queue<byte[]> writeZipTempFileListQueue;
        private Queue<byte[]> writeByteTempFileListQueue;
        private bool downloadWriteFileListComplete;
        private bool allResourcesAreReady;

        public void Init( string fileServerIp )
        {
            
            if ( !string.IsNullOrEmpty( fileServerIp ) )
            {
                FILE_SERVER_URL = fileServerIp;
                DebugUtils.Log( DebugUtils.Type.Resource, "The file server ip : " + FILE_SERVER_URL );
            }
            else
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, " Not found file server ip, check it!" );
            }

            lockObjectGetFile = new object();
            lockObjectWriteTempFile = new object();

            allDownloadIsDone = false;
            downloadWriteFileListComplete = false;
            allResourcesAreReady = false;
            serverBytesVersion = serverBundleVersion = -1;

            //zipFileListPath = string.Concat(ResourceManager.assetPath, ResourceManager.TEMP_PATH, GameConstants.ZIP_FILE_LIST_DAT);
            //byteFileListPath = string.Concat(ResourceManager.assetPath, ResourceManager.TEMP_PATH, GameConstants.BYTE_FILE_LIST_DAT);

        }

        // Check if there are update files, local and server
        public void CheckUpdate( Action<float, float> checkCallback, Action<string> versionCallback )
        {
            // Set data
            this.checkCallback = checkCallback;
            this.versionCallback = versionCallback;
            checkUpdateStep = 0f;

            // 1 time add step
            AddUpdateStep();
            // Start check streamingAssetsPath resources
            StartCoroutine( CheckLocalResource() );
        }

        private IEnumerator CheckLocalResource()
        {
            zipListFileStream = new BufferedStream( File.Open( zipFileListPath, FileMode.OpenOrCreate ) );
            byteListFileStream = new BufferedStream( File.Open( byteFileListPath, FileMode.OpenOrCreate ) );

            string streamingResourcePath;
            if( Application.platform == RuntimePlatform.WindowsEditor || Application.platform == RuntimePlatform.Android )
            {
                streamingResourcePath = string.Concat( Application.streamingAssetsPath, "/GameResources/" );
            }
            else
            {
                streamingResourcePath = string.Concat( "file:///", Application.streamingAssetsPath, "/GameResources/" );
            }

            WWW timeTampZipW = new WWW( streamingResourcePath + GameConstants.LOCAL_ZIP_TIMETAMP_PATH );
            yield return timeTampZipW;

            // 2 time add step
            AddUpdateStep();

            string versionPath = ResourceManager.assetPath + GameConstants.VERSION_FILE_NAME;
            string[] versionArr = null;
            if( File.Exists( versionPath ) )
            {
                versionArr = File.ReadAllText( versionPath ).Trim().Split( '.' );
            }
            else
            {
                versionArr = new string[] { "0", "0", "0", "0" };
            }
            if( string.IsNullOrEmpty( timeTampZipW.error ) && !string.IsNullOrEmpty( timeTampZipW.text ) )
            {
                string prefsTimestamp = versionArr[2];
                // If the timestamp in the file is different from the PlayerPrefs record, so, needs to be updated.
                if( !prefsTimestamp.Equals( timeTampZipW.text ) )
                {
                    prefsTimestamp = timeTampZipW.text;
                    WWW zipFileListW = new WWW( streamingResourcePath + GameConstants.ZIP_FILE_LIST_DAT );
                    yield return zipFileListW;

                    if( string.IsNullOrEmpty( zipFileListW.error ) )
                    {
                        LocalWriteFileListData( zipFileListW, streamingResourcePath, AssetType.F );
                    }

                    zipFileListW.Dispose();
                    zipFileListW = null;

                    versionArr[2] = prefsTimestamp;
                    DebugUtils.Log( DebugUtils.Type.Resource, "The streamingAssets file has been copy to the target path" );
                }
            }
            timeTampZipW.Dispose();
            timeTampZipW = null;

            WWW timeTampLuaW = new WWW( streamingResourcePath + GameConstants.LOCAL_BYTE_TIMETAMP_PATH );
            yield return timeTampLuaW;

            // 3 time add step
            AddUpdateStep();

            if( string.IsNullOrEmpty( timeTampLuaW.error ) && !string.IsNullOrEmpty( timeTampLuaW.text ) )
            {
                string prefsTimestamp = versionArr[3];
                // If the timestamp in the file is different from the PlayerPrefs record, so, needs to be updated.
                if( !prefsTimestamp.Equals( timeTampLuaW.text ) )
                {
                    prefsTimestamp = timeTampLuaW.text;
                    WWW byteFileListW = new WWW( streamingResourcePath + GameConstants.BYTE_FILE_LIST_DAT );
                    yield return byteFileListW;

                    if( string.IsNullOrEmpty( byteFileListW.error ) )
                    {
                        LocalWriteFileListData( byteFileListW, streamingResourcePath, AssetType.C );
                    }

                    byteFileListW.Dispose();
                    byteFileListW = null;

                    versionArr[3] = prefsTimestamp;
                    DebugUtils.Log( DebugUtils.Type.Resource, "The streamingAssets file has been copy to the target path" );
                }
            }
            timeTampLuaW.Dispose();
            timeTampLuaW = null;

            string versionStr = string.Join( ".", versionArr );
            File.WriteAllText( versionPath, versionStr );
            DebugUtils.Log( DebugUtils.Type.Resource, "Parsing streamingAssets files complete, Write the version number to the file, number = " + versionStr );

            // 4 time add step
            AddUpdateStep();
            // Check cdn resources
            StartCoroutine( CheckCDNResources() );
        }

        private IEnumerator CheckCDNResources()
        {
            //if( Application.internetReachability == NetworkReachability.NotReachable )
            //{
            //    DebugUtils.LogError( DebugUtils.Type.Resource, "The current network is not available please check!" );
            //    yield break;
            //}

            string versionUrl = FILE_SERVER_URL + "version.txt";
            DebugUtils.Log( DebugUtils.Type.Resource, "The request server resource version url:" + versionUrl );

            WWW versionW = new WWW( versionUrl );
            yield return versionW;

            // 5 time add step
            AddUpdateStep();

            if( !string.IsNullOrEmpty( versionW.error ) )
            {
#if !LOCAL_TEST_PACKAGE
                DebugUtils.LogError( DebugUtils.Type.Resource, "Request the resource version number error. msg:" + versionW.error );
#endif
            }
            else
            {
				DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "The server resource version number:{0} local version number:{1}.{2}", versionW.text, ResourceManager.bytesVersion, ResourceManager.bundleVersion ) );
                
                if ( this.versionCallback != null )
                {
                    this.versionCallback( versionW.text );
                }

                string[] versions = versionW.text.Split('.');
                if( versions.Length != 2 )
                {
                    DebugUtils.LogError( DebugUtils.Type.Resource, "The server resource version length is err, length:" + versions.Length );
                }
                else
                {
                    serverBytesVersion = int.Parse( versions[0] );
                    serverBundleVersion = int.Parse( versions[1] );

                    downloadCountSize = 0;
                    waitDownloadQueue = new Queue<FileVersionData>();

                    if ( zipListFileStream == null)
                    {
                        zipListFileStream = new BufferedStream( File.Open( zipFileListPath, FileMode.OpenOrCreate ) );
                    }
                    if ( byteListFileStream == null)
                    {
                        byteListFileStream = new BufferedStream( File.Open( byteFileListPath, FileMode.OpenOrCreate ) );
                    }

                    if( ResourceManager.bytesVersion != serverBytesVersion )
                    {
                        // Verify lua code needs update
                        yield return StartCoroutine( LoadCompareFileList( AssetType.C ) );
                    }
                    
                    if( ResourceManager.bundleVersion != serverBundleVersion )
                    {
                        // Verify the bundle needs update
                        yield return StartCoroutine( LoadCompareFileList( AssetType.F ) );
                    }
                }
            }

			// 6 time add step
			AddUpdateStep();

            versionW.Dispose();
            versionW = null;
        }

        private IEnumerator LoadCompareFileList( AssetType fileType )
        {
            string tempfileType = fileType.ToString();
            string serverFileListUrl = string.Format( "{0}filelist_{1}.bytes", FILE_SERVER_URL, tempfileType );
            DebugUtils.Log( DebugUtils.Type.Resource, "The server fileList url:" + serverFileListUrl );

            WWW www = new WWW( serverFileListUrl );
            yield return www;

            if( !string.IsNullOrEmpty( www.error ) )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, "Request the fileList error. msg:" + www.error );
            }
            else
            {
                string[] serverFileList = www.text.Split( '\n' );
                string localFileListPath = string.Format( "{0}filelist_{1}.bytes", ResourceManager.assetPath, tempfileType );
                string[] localFileList = File.Exists( localFileListPath ) ? File.ReadAllLines( localFileListPath ) : null;

                // Save temp path
				string savePath = string.Concat( ResourceManager.assetPath, ResourceManager.TEMP_PATH, tempfileType, "/" );

                // Gets a list of resources by version comparison
                List<FileVersionData> downloadList = CompareVersions( serverFileList, localFileList );

                List<FileVersionData> tempFileList = null;
                if( fileType == AssetType.C )
                {
					tempFileList = ParseFileListData( byteListFileStream, AssetType.C );
                }
                else if( fileType == AssetType.F )
                {
					tempFileList = ParseFileListData( zipListFileStream, AssetType.F );
                }

                for( int i = 0; i < downloadList.Count; i++ )
                {
                    // Find all files that has been downloaded but version is wrong, delete it
                    bool isRemove = false;
                    for( int j = 0; j < tempFileList.Count; j++ )
                    {
                        if( downloadList[i].fileName.Equals( tempFileList[j].fileName ) )
                        {
                            FileInfo fileInfo = new FileInfo( savePath + downloadList[i].fileName );
                            if( downloadList[i].version > tempFileList[j].version )
                            {
								if ( fileInfo.Exists )
								{
									File.Delete( savePath + downloadList[i].fileName );
								}
								tempFileList.RemoveAt ( j );
                            }
                            else if( downloadList[i].version == tempFileList[j].version )
                            {
								if (fileInfo.Exists)
								{
									if (fileInfo.Length == downloadList [i].fileSize)
									{
										downloadList.RemoveAt (i);
										--i;
										isRemove = true;
									}
									else
									{
										tempFileList.RemoveAt (j);
									}
								}
								else
								{
									tempFileList.RemoveAt ( j );
								}
                            }
                            else if( downloadList[i].version < tempFileList[j].version )
                            {
  
                                downloadList.RemoveAt( i );
                                --i;
                                isRemove = true;
                            }

                            break;
                        }
                    }

                    if( !isRemove )
                    {
                        // Prepare to download the required data.
                        downloadList[i].filePath = savePath;
                        downloadList[i].fileType = fileType;
                        // Calculate the total size of all download files
                        downloadCountSize += downloadList[i].fileSize;
                        // Join the wait download queue
                        waitDownloadQueue.Enqueue( downloadList[i] );
                    }
                 
                }
				
				StringBuilder sb = new StringBuilder( tempFileList.Count );
				for( int i = 0; i < tempFileList.Count; i++ )
				{
					sb.Append( tempFileList[i].GetTempListString() );
				}

				BufferedStream fs = null;
				byte[] bytes = null;
				if( fileType == AssetType.C )
				{
					fs = byteListFileStream;
				}
				else if( fileType == AssetType.F )
				{
					fs = zipListFileStream;
				}
				bytes = Encoding.Default.GetBytes( sb.ToString() );
				fs.SetLength( 0 );
				fs.Seek( 0, SeekOrigin.Begin );
				fs.Write( bytes, 0, bytes.Length );
				fs.Flush();

				sb = null;
            }

            www.Dispose();
            www = null;
        }

		private List<FileVersionData> ParseFileListData( BufferedStream fs, AssetType type )
		{
            byte[] bytes = new byte[fs.Length];
			fs.Read( bytes, 0, bytes.Length );
            string allLine = Encoding.Default.GetString( bytes );
            if ( !string.IsNullOrEmpty( allLine.Trim() ) )
            {
                string[] lines = allLine.Split( '|' );

                return FileVersionData.ParseFileVersionData( lines, type, "download resource" );
            }
            else
            {
                return FileVersionData.ParseFileVersionData( null, type, "download resource" );
            }
		}
        
        private IEnumerator DownloadFileWithTimeout( string url, Action<WWW> completeCall )
        {
            float timer = 0;
            float timeOut = 10;
            bool failed = false;

            WWW www = new WWW( url );
            while( !www.isDone )
            {
                if( timer > timeOut ) { failed = true; break; }
                timer += Time.deltaTime;
                yield return null;
            }

            if( failed || !string.IsNullOrEmpty( www.error ) )
            {
                Debug.Log( string.Format( "Requested the URL failed! url:{0} err:{1}", failed, www.error ) );
                completeCall( null );
                www.Dispose();
                www = null;
            }
            else
            {
                completeCall( www );
            }
        }

        public void DownloadResources( Action<long, long, long> downloadCallback )
        {
            if( ( waitDownloadQueue == null || waitDownloadQueue.Count == 0 ) && downloadCallback != null )
            {
                downloadCallback( GameConstants.DOWN_LOAD_COMPLETE_MARK, GameConstants.DOWN_LOAD_COMPLETE_MARK, 0 );

                downloadCallback = null;
                return;
            }

            this.downloadCallback = downloadCallback;

            DebugUtils.Log( DebugUtils.Type.Resource, "Prepare to download files, the number = " + waitDownloadQueue.Count );

            writeZipTempFileListQueue = new Queue<byte[]>();
            writeByteTempFileListQueue = new Queue<byte[]>();
            Thread writeThread = new Thread( OnWriteThreadRun );
#if !UNITY_EDITOR
            writeThread.IsBackground = true;
#endif
            writeThread.Start();

            ServicePointManager.ServerCertificateValidationCallback = OnRemoteCertificateValidationCallback;

            downLoadList = new List<DownLoadThread>();
            for( int i = 0; i < DOWNLOAD_THREAD_COUNT; i++ )
            {
                DownLoadThread downLoadThread = new DownLoadThread();
                // Initialize and start downloading
                downLoadThread.InitAndDownLoad( i, FILE_SERVER_URL, GetFileVersionData, OnDownloadComplete );
                downLoadList.Add( downLoadThread );
            }
        }

        public bool OnRemoteCertificateValidationCallback( object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors )
        {
            bool isOk = true;
            // If there are errors in the certificate chain,
            // look at each error to determine the cause.
            if( sslPolicyErrors != SslPolicyErrors.None )
            {
                for( int i = 0; i < chain.ChainStatus.Length; i++ )
                {
                    if( chain.ChainStatus[i].Status == X509ChainStatusFlags.RevocationStatusUnknown )
                    {
                        continue;
                    }
                    chain.ChainPolicy.RevocationFlag = X509RevocationFlag.EntireChain;
                    chain.ChainPolicy.RevocationMode = X509RevocationMode.Online;
                    chain.ChainPolicy.UrlRetrievalTimeout = new TimeSpan( 0, 1, 0 );
                    chain.ChainPolicy.VerificationFlags = X509VerificationFlags.AllFlags;
                    bool chainIsValid = chain.Build( ( X509Certificate2 )certificate );
                    if( !chainIsValid )
                    {
                        isOk = false;
                        break;
                    }
                }
            }
            return isOk;
        }

        private FileVersionData GetFileVersionData( int id )
        {
            FileVersionData data = null;
            lock( lockObjectGetFile )
            {
                if( waitDownloadQueue.Count > 0 )
                {
                    data = waitDownloadQueue.Dequeue();
                }
            }

            if( data == null )
            {
                downLoadList[id].isDone = true;

                for( int i = 0; i < downLoadList.Count; i++ )
                {
                    if( !downLoadList[i].isDone )
                    {
                        allDownloadIsDone = false;
                        break;
                    }
                    else
                    {
                        allDownloadIsDone = true;
                    }
                }
            }

            return data;
        }

        private void OnDownloadComplete( FileVersionData data, bool isSucceed )
        {
			if (data == null || !isSucceed ) return;
               
            string content = string.Empty;
            if( Application.platform != RuntimePlatform.WindowsEditor )
            {
                content = data.GetTempListString( "file:///" );
            }
            else
            {
                content = data.GetTempListString();
            }

            DebugUtils.Log( DebugUtils.Type.Resource, "Prepare to write to temp filelist, content:" + content );
        
            lock( lockObjectWriteTempFile )
            {
                if( data.fileType == AssetType.F )
                {
                    writeZipTempFileListQueue.Enqueue( Encoding.Default.GetBytes( content ) );
                    DebugUtils.Log( DebugUtils.Type.Resource, "the writeZipTempFileList queue length = " + writeZipTempFileListQueue.Count );
                }
                else if( data.fileType == AssetType.C )
                {
                    writeByteTempFileListQueue.Enqueue( Encoding.Default.GetBytes( content ) );
                    DebugUtils.Log( DebugUtils.Type.Resource, "the writeByteTempFileList queue length = " + writeByteTempFileListQueue.Count );
                }
            }
        }

        private void OnWriteThreadRun()
        {
            while( !downloadWriteFileListComplete )
            {
                if( allDownloadIsDone )
                {
                    downloadWriteFileListComplete = true;
                }

                OnWriteTempFileList();

                // sleep 20
                Thread.Sleep( 20 );
            }

            OnWriteTempFileList();

            if ( byteListFileStream != null )
            {
                byteListFileStream.Flush();
                byteListFileStream.Close();
                byteListFileStream = null;
            }
   
            if ( zipListFileStream != null )
            {
                zipListFileStream.Flush();
                zipListFileStream.Close();
                zipListFileStream = null;
            }

            allResourcesAreReady = true;
        }

        private void OnWriteTempFileList()
        {
            byte[] allBytes = null;
            int tempLength = 0;

            // write byte file
            if( writeByteTempFileListQueue.Count > 0 )
            {
                byte[][] tempBytes = new byte[writeByteTempFileListQueue.Count][];
                DebugUtils.Log( DebugUtils.Type.Resource, "the tempBytes array length = " + tempBytes.Length );
                for( int i = 0; i < tempBytes.Length; i++ )
                {
                    tempBytes[i] = writeByteTempFileListQueue.Dequeue();
                }
                try
                {
                    tempLength = 0;
                    for( int i = 0; i < tempBytes.Length; i++ )
                    {
                        if( tempBytes[i] != null )
                        {
                            tempLength += tempBytes[i].Length;
                        }
                    }

                    allBytes = new byte[tempLength];
                    tempLength = 0;
                    for( int i = 0; i < tempBytes.Length; i++ )
                    {
                        byte[] bytes = tempBytes[i];
                        if( bytes != null )
                        {
                            Array.Copy( bytes, 0, allBytes, tempLength, bytes.Length );
                            tempLength += bytes.Length;
                        }
                    }

                    if( DebugUtils.DebugMode )
                    {
                        DebugUtils.Log( DebugUtils.Type.Resource, " The byte string will be written to tempFileList is : " + Encoding.Default.GetString( allBytes ) );
                    }
                    byteListFileStream.Write( allBytes, 0, allBytes.Length );
                }
                catch( Exception e )
                {
                    DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "byte write temp file err, msg:{0} allBytes.Length:{1}  tempLength:{2}", e.Message, allBytes == null ? 0 : allBytes.Length, tempLength ) );
                }
            }

            // write zip file
            if( writeZipTempFileListQueue.Count > 0 )
            {
                byte[][] tempZips = new byte[writeZipTempFileListQueue.Count][];
                DebugUtils.Log( DebugUtils.Type.Resource, "the tempZips array length = " + tempZips.Length );
                for( int i = 0; i < tempZips.Length; i++ )
                {
                    tempZips[i] = writeZipTempFileListQueue.Dequeue();
                }
                try
                {
                    tempLength = 0;
                    for( int i = 0; i < tempZips.Length; i++ )
                    {
                        if( tempZips[i] != null )
                        {
                            tempLength += tempZips[i].Length;
                        }
                    }

                    allBytes = new byte[tempLength];
                    tempLength = 0;
                    for( int i = 0; i < tempZips.Length; i++ )
                    {
                        byte[] bytes = tempZips[i];
                        if( bytes != null )
                        {
                            Array.Copy( bytes, 0, allBytes, tempLength, bytes.Length );
                            tempLength += bytes.Length;
                        }
                    }

                    if( DebugUtils.DebugMode )
                    {
                        DebugUtils.Log( DebugUtils.Type.Resource, " The zip string will be written to tempFileList is : " + Encoding.Default.GetString( allBytes ) );
                    }
                    zipListFileStream.Write( allBytes, 0, allBytes.Length );
                }
                catch( Exception e )
                {
                    DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "zip write temp file err, msg:{0} allBytes.Length:{1}, tempLength:{2}", e.Message, allBytes == null ? 0 : allBytes.Length, tempLength ) );
                }
            }
        }

        private List<FileVersionData> CompareVersions( string[] netList, string[] localList )
        {
            List<FileVersionData> list1 = FileVersionData.ParseFileVersionData( netList, AssetType.Unknown, "download resource compare net list" );
            List<FileVersionData> list2 = FileVersionData.ParseFileVersionData( localList, AssetType.Unknown, "download resource compare local list" );

            return CompareVersions( list1, list2 );
        }

        private List<FileVersionData> CompareVersions( List<FileVersionData> netList, List<FileVersionData> localList )
        {
            List<FileVersionData> resultList = new List<FileVersionData>();

            int localCount = localList.Count;
            int netCount = netList.Count;
            for( int i = 0; i < netCount; i++ )
            {
                bool enableUpdata = true;
                string name = netList[i].fileName;
                long netVersion = netList[i].version;
                for( int j = 0; j < localCount; j++ )
                {
                    if( localList[j].fileName.Equals( name ) )
                    {
                        enableUpdata = localList[j].version < netVersion;
                        break;
                    }
                }

                if( enableUpdata )
                {
                    resultList.Add( netList[i] );
                }
            }

            return resultList;
        }

        private void LocalWriteFileListData( WWW w, string streamingPath, AssetType resType )
        {
            string[] zipLines = null;
            if( !string.IsNullOrEmpty( w.text ) )
            {
                zipLines = w.text.Split( '\n' );
            }

            List<FileVersionData> versionList = FileVersionData.ParseFileVersionData( zipLines, resType, "download resource local write file list" );

			BufferedStream fs = null;
            string targetPath = string.Empty;

            if( resType == AssetType.F )
            {
                targetPath = streamingPath + "zips/";
                fs = zipListFileStream;
            }
            else if( resType == AssetType.C )
            {
                targetPath = streamingPath + "bytes/";
                fs = byteListFileStream;
            }

            for( int i = 0; i < versionList.Count; i++ )
            {
                versionList[i].filePath = targetPath;
            }

            try
            {
                fs.SetLength( 0 );
                fs.Seek( 0, SeekOrigin.Begin );
                // Get bytes
                StringBuilder sb = new StringBuilder();
                for( int i = 0; i < versionList.Count; i++ )
                {
                    sb.Append( versionList[i].GetString() );
                }
                byte[] bytes = Encoding.Default.GetBytes( sb.ToString() );
                fs.Write( bytes, 0, bytes.Length );
                fs.Flush();
                fs.Close();
                fs.Dispose();
                fs = null;
                if( resType == AssetType.F )
                {
                    zipListFileStream = null;
                }
                else if( resType == AssetType.C )
                {
                    byteListFileStream = null;
                }
            }
            catch( Exception e )
            {
                DebugUtils.LogError( DebugUtils.Type.Resource, "Write temp file list err! msg:" + e.Message );
            }

            if( versionList.Count > 0 )
            {
                string savePath = string.Empty;
                if( resType == AssetType.F )
                {
                    savePath = ResourceManager.assetPath + ResourceManager.BUNDLE_PATH;
                }
                else if( resType == AssetType.C )
                {
                    savePath = ResourceManager.assetPath + ResourceManager.BYTES_PATH;
                }
                // If this is done here, this is the new package, so clean up the previous version of the file to reduce disk usage.
                if( Directory.Exists( savePath ) )
                {
                    Directory.Delete( savePath, true );
                }
                Directory.CreateDirectory( savePath );
            }
        }

        private void AddUpdateStep( int num = 1 )
        {
            checkUpdateStep += num;

            if( checkCallback != null )
            {
                checkCallback( checkUpdateStep, checkUpdateStepCount );
            }
        }

        void Update()
        {
            if( allResourcesAreReady )
            {
                allResourcesAreReady = false;

                string versionPath = ResourceManager.assetPath + GameConstants.VERSION_FILE_NAME;
                string[] versionArr = null;
                if ( File.Exists( versionPath ) )
                {
                    versionArr = File.ReadAllText( versionPath ).Trim().Split( '.' );
                }
                else
                {
                    versionArr = new string[] { "0", "0", "0", "0" };
                }

                if( serverBytesVersion != -1 )
                {
                    ResourceManager.bytesVersion = serverBytesVersion;
                    DebugUtils.Log( DebugUtils.Type.Resource, "Downloaded files complete, set the local bytes version number to " + ResourceManager.bytesVersion );
                    versionArr[0] = ResourceManager.bytesVersion.ToString();

                    serverBytesVersion = -1;
                }

                if( serverBundleVersion != -1 )
                {
                    ResourceManager.bundleVersion = serverBundleVersion;
                    DebugUtils.Log( DebugUtils.Type.Resource, "Downloaded files complete, set the local bundle version number to " + ResourceManager.bundleVersion );
                    versionArr[1] = ResourceManager.bundleVersion.ToString();

                    serverBundleVersion = -1;
                }

                string versionStr = string.Join( ".", versionArr );
                File.WriteAllText( versionPath, versionStr );
                DebugUtils.Log( DebugUtils.Type.Resource, "Downloaded files complete, Write the version number to the file, number = " + versionStr );
                downloadCallback( GameConstants.DOWN_LOAD_COMPLETE_MARK, GameConstants.DOWN_LOAD_COMPLETE_MARK, 0 );
            }

            if( downloadCallback != null && downLoadList != null )
            {
                long size = 0;

                for( int i = 0; i < downLoadList.Count; i++ )
                {
                    size += downLoadList[i].progress;
                }

                delayTimeOne += Time.deltaTime;
                if( delayTimeOne > 1 )
                {
                    downloadCallback( size, downloadCountSize, size - downLoadSpeed );
                    downLoadSpeed = size;
                    delayTimeOne = 0;
                }
                else
                {
                    downloadCallback( size, downloadCountSize, 0 );
                }
            }
        }

        public void Dispose()
        {
            if( zipListFileStream != null )
            {
                zipListFileStream.Close();
                zipListFileStream = null;
            }
            if( byteListFileStream != null )
            {
                byteListFileStream.Close();
                byteListFileStream = null;
            }

            if( downLoadList != null )
            {
                downLoadList.Clear();
                downLoadList = null;
            }

            if( waitDownloadQueue != null )
            {
                waitDownloadQueue.Clear();
                waitDownloadQueue = null;
            }

            lockObjectGetFile = null;
        }

        void OnDestroy()
        {
            Dispose();

            GC.Collect();
        }

    }   
}