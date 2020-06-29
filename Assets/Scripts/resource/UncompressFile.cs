using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections;

using UnityEngine;

using Constants;
using GameUtils;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;
//using Pathfinding.Ionic.Zip;

namespace Resource
{
    public class UncompressFile : MonoBehaviour
    {
        private UncompressProgressVo uncompressVo;
        private string saveBundlePath;
        private string saveBytesPath;
        private string tempAssetPath;
        private string streamingAssetsPath;

        private Queue<FileVersionData> zipPathQueue;
        private Queue<FileVersionData> luaPathQueue;
        private Action<int, int> uncompressCallBack;
        private WaitForSeconds loadWaitForSeconds;
        private bool loadBytesComplete;
        private FileVersionData curUncompressFile;

        private string zipFileListPath;
        private string byteFileListPath;
        private string zipVersionFilePath;
        private string byteVersionFilePath;

		private BufferedStream zipFileListFS;
		private BufferedStream zipVersionFS;
		private BufferedStream luaFileListFS;
		private BufferedStream luaVersionFS;

        private List<FileVersionData> zipVersionList;
        private List<FileVersionData> byteVersionList;

        public void Uncompress( Action<int, int> uncompressCallBack )
        {
            this.uncompressCallBack = uncompressCallBack;

            saveBytesPath = ResourceManager.assetPath + ResourceManager.BYTES_PATH;
            saveBundlePath = ResourceManager.assetPath + ResourceManager.BUNDLE_PATH;
            tempAssetPath = ResourceManager.assetPath + ResourceManager.TEMP_PATH;
            zipFileListPath = tempAssetPath + GameConstants.ZIP_FILE_LIST_DAT;
            byteFileListPath = tempAssetPath + GameConstants.BYTE_FILE_LIST_DAT;
            zipVersionFilePath = ResourceManager.assetPath + "filelist_F.bytes";
            byteVersionFilePath = ResourceManager.assetPath + "filelist_C.bytes";

            streamingAssetsPath = Application.streamingAssetsPath;

            PrepareResourceData();
        }

        private void PrepareResourceData()
        {
            uncompressVo = new UncompressProgressVo();

            zipPathQueue = new Queue<FileVersionData>();
            luaPathQueue = new Queue<FileVersionData>();

            curUncompressFile = null;
            long zipTotalSize = 0;
            long luaTotalSize = 0;

            if( File.Exists( zipFileListPath ) )
            {
				zipFileListFS = new BufferedStream( File.Open( zipFileListPath, FileMode.Open, FileAccess.ReadWrite ) );
                List<FileVersionData> fileListArr = FileVersionData.ParseFileVersionData( GetFileListArr( zipFileListFS, '|' ), AssetType.F, "uncompress file1" );

                for( int i = 0; i < fileListArr.Count; i++ )
                {
                    zipPathQueue.Enqueue( fileListArr[i] );
                    zipTotalSize += fileListArr[i].fileSize;
                }

                if( zipPathQueue.Count > 0 )
                {
					zipVersionFS = new BufferedStream( File.Open( zipVersionFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite ) );
                    zipVersionList = FileVersionData.ParseFileVersionData( GetFileListArr( zipVersionFS, '\n' ), AssetType.F, "uncompress file2" );
                }

                DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Find {0} zip file that needs to be decompressed, size:{1}", zipPathQueue.Count, zipTotalSize ) );
            }

            if( File.Exists( byteFileListPath ) )
            {
				luaFileListFS = new BufferedStream( File.Open( byteFileListPath, FileMode.Open, FileAccess.ReadWrite ) );
                List<FileVersionData> arr = FileVersionData.ParseFileVersionData( GetFileListArr( luaFileListFS, '|' ), AssetType.C, "uncompress file3" );

                for( int i = 0; i < arr.Count; i++ )
                {
                    luaPathQueue.Enqueue( arr[i] );
                    luaTotalSize += arr[i].fileSize;
                }

                if( luaPathQueue.Count > 0 )
                {
					luaVersionFS = new BufferedStream( File.Open( byteVersionFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite ) );
                    byteVersionList = FileVersionData.ParseFileVersionData( GetFileListArr( luaVersionFS, '\n' ), AssetType.C, "uncompress file4" );
                }

                DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Find {0} lua file that needs to be decompressed, size:{1}", luaPathQueue.Count, luaTotalSize ) );
            }

            uncompressVo.alreadyFileNum = 0;
            uncompressVo.fileNumber = luaPathQueue.Count + zipPathQueue.Count;            

			if( uncompressVo.fileNumber > 0 )
			{
				if( luaPathQueue.Count > 0 )
				{
                    uncompressVo.fileNumber += 1;
                    StartCoroutine ( StartMoveLua() );
				}

				if( zipPathQueue.Count > 0 )
				{
                    uncompressVo.fileNumber += 1;
                    StartUnzip ();
				}
			}
			else
			{
				uncompressCallBack (0, 0);
			}
        }

		private string[] GetFileListArr( BufferedStream fs, char c )
        {
            byte[] bytes = new byte[fs.Length];
            fs.Read( bytes, 0, bytes.Length );
            string allLine = Encoding.Default.GetString( bytes );

            return allLine.Split( c );
        }

        private IEnumerator StartMoveLua()
        {
            while( luaPathQueue.Count > 0 )
            {
                FileVersionData data = luaPathQueue.Dequeue();

                string sourcePath = data.filePath + data.fileName;
                string targetPath = saveBytesPath + data.fileName;

                FileInfo fileInfo = new FileInfo( targetPath );
                if( !fileInfo.Directory.Exists )
                {
                    fileInfo.Directory.Create();
                }

                WWW www = new WWW( sourcePath );
                yield return www;

                if( string.IsNullOrEmpty( www.error ) )
                {
                    FileStream fs = fileInfo.Open( FileMode.OpenOrCreate, FileAccess.ReadWrite );
                    fs.SetLength( 0 );
                    fs.Seek( 0, SeekOrigin.Begin );
                    fs.Write( www.bytes, 0, www.bytes.Length );
                    fs.Flush();
                    fs.Close();

					// update version list
					UpdateVersionList( byteVersionList, data );

                    if( !sourcePath.Contains( streamingAssetsPath ) )
                    {
                        File.Delete( sourcePath.Replace( "file:///", "" ) );
                    }
                }
                else
                {
					DebugUtils.LogWarning( DebugUtils.Type.Resource, string.Format( "Not find lua file, path:{0} msg:{1}", sourcePath, www.error ) );
                }

                uncompressVo.alreadyFileNum++;

                www.Dispose();
                www = null;
            }
            // Rewrite file list, prevent interruption of decompression.
            RewriteVersionList( byteVersionList, luaVersionFS );
            // delete temp file
            if( File.Exists( tempAssetPath + "C/" ) )
            {
                Directory.Delete( tempAssetPath + "C/", true );
            }
            // close temp file list
            if( luaFileListFS != null )
            {
                luaFileListFS.Close();
                luaFileListFS = null;
            }
			File.Delete( byteFileListPath );
            // add file number
            uncompressVo.alreadyFileNum++;

            DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Move lua file complete, alreadyFileNum:{0} fileNumber:{1}", uncompressVo.alreadyFileNum, uncompressVo.fileNumber ) );
        }

        private void StartUnzip()
        {
            if( zipPathQueue.Count == 0 ) return;

            DebugUtils.Log( DebugUtils.Type.Resource, "Start uncompress files" );

            Thread thread = new Thread( UncompressThread );
            thread.IsBackground = true;
            thread.Start();

            loadWaitForSeconds = new WaitForSeconds( Time.fixedDeltaTime );
            loadBytesComplete = false;
            StartCoroutine( LoadZipFile() );
        }

        private IEnumerator LoadZipFile()
        {
            while( true )
            {
                if( !loadBytesComplete && curUncompressFile != null )
                {
                    WWW www = new WWW( curUncompressFile.filePath + curUncompressFile.fileName );
                    yield return www;

                    if( string.IsNullOrEmpty( www.error ) )
                    {
                        curUncompressFile.memoryStream = new MemoryStream( www.bytes );
                    }
                    else
                    {
                        curUncompressFile.memoryStream = null;
                        DebugUtils.LogWarning( DebugUtils.Type.Resource,
                            string.Format( "Load the zip file err! msg:{0} url:{1}", www.error, curUncompressFile.filePath + curUncompressFile.fileName ) );
                    }

                    loadBytesComplete = true;

                    www.Dispose();
                    www = null;
                }

                yield return loadWaitForSeconds;
            }
        }

        private void UncompressThread()
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();

            byte[] buffer = new byte[4096];

            while( zipPathQueue.Count > 0 )
            {
                curUncompressFile = zipPathQueue.Dequeue();

                DebugUtils.Log( DebugUtils.Type.Resource, "Start uncompress the file, path:" + curUncompressFile.fileName );

                loadBytesComplete = false;
                while( !loadBytesComplete )
                {
                    Thread.Sleep( 2 );
                }

                DebugUtils.Log( DebugUtils.Type.Resource, "Load the file complete, path:" + curUncompressFile.fileName + "  data exist = " + (curUncompressFile.memoryStream != null).ToString() );

                if( curUncompressFile.memoryStream == null )
                {
                    uncompressVo.alreadyFileNum++;
                    DebugUtils.LogWarning( DebugUtils.Type.Resource, string.Format( "Uncompress the zip file is null! url:{0}", curUncompressFile.filePath + curUncompressFile.fileName ) );
                    continue;
                }

      //          ZipInputStream zipInputStream = new ZipInputStream( curUncompressFile.memoryStream );
      //          zipInputStream.Position = 0;
      //          zipInputStream.Password = GameConstants.ZIP_SECRET_KEY;
      //          try
      //          {
      //              ZipEntry zipEntry = null;
      //              while( ( zipEntry = zipInputStream.GetNextEntry() ) != null )
      //              {
      //                  if( zipEntry.IsDirectory ) continue;

      //                  zipEntry.Password = GameConstants.ZIP_SECRET_KEY;
      //                  FileInfo fileInfo = new FileInfo( saveBundlePath + zipEntry.FileName );
      //                  if( !fileInfo.Directory.Exists ) fileInfo.Directory.Create();

						//using( BufferedStream fs = new BufferedStream( fileInfo.Create() ) )
      //                  {
      //                      fs.Seek( 0, SeekOrigin.Begin );
      //                      int length = 0;
						//	do
						//	{
						//		length = zipInputStream.Read( buffer, 0, buffer.Length );

						//		if( length > 0 )
						//		{
						//			fs.Write( buffer, 0, length );
						//		}
						//	}while( length > 0 );

      //                      fs.Flush();
      //                      fs.Close();
      //                      fs.Dispose();

      //                      DebugUtils.Log( DebugUtils.Type.Resource, "The file uncompress complete! fileName:" + zipEntry.FileName );
      //                  }
      //              }
      //          }
      //          catch( Exception ex )
      //          {
      //              DebugUtils.LogError( DebugUtils.Type.Resource, string.Format( "Uncompress zip err! msg:{0} source:{1}", ex.Message, curUncompressFile.fileName ) );
      //          }
      //          finally
      //          {
      //              zipInputStream.Close();
      //              zipInputStream.Dispose();
      //              zipInputStream = null;
      //          }

                uncompressVo.alreadyFileNum++;

                // update version list
				UpdateVersionList( zipVersionList, curUncompressFile );

                if( !curUncompressFile.filePath.Contains( streamingAssetsPath ) )
                {
                    File.Delete( curUncompressFile.filePath.Replace( "file:///", "" ) + curUncompressFile.fileName );
                }
            }
            // Rewrite file list, prevent interruption of decompression.
            RewriteVersionList( zipVersionList, zipVersionFS );

            // uncompress take time
            stopwatch.Stop();
            DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Uncompress all zipFile complete! Take {0} milliseconds", stopwatch.ElapsedMilliseconds ) );

            // del temp file
            if( File.Exists( tempAssetPath + "F/" ) )
            {
                Directory.Delete( tempAssetPath + "F/", true );
            }
            // close temp file list
            if( zipFileListFS != null )
            {
                zipFileListFS.Close();
                zipFileListFS = null;
            }
			File.Delete( zipFileListPath );
            // add file number        
            uncompressVo.alreadyFileNum++;

            DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Uncompress zip file complete, alreadyFileNum:{0} fileNumber:{1}", uncompressVo.alreadyFileNum, uncompressVo.fileNumber ) );
        }


        private void UpdateVersionList( List<FileVersionData> versionList, FileVersionData newData )
        {
            bool has = false;
            for( int i = 0; i < versionList.Count; i++ )
            {
                if( versionList[i].fileName.Equals( newData.fileName ) )
                {
                    versionList[i].fileSize = newData.fileSize;
                    versionList[i].version = newData.version;
                    has = true;
                    break;
                }
            }
            if( !has )
            {
                versionList.Add( newData );
            }
        }

		private void RewriteVersionList( List<FileVersionData> versionList, BufferedStream fs )
		{
			fs.SetLength( 0 );
			fs.Seek( 0, SeekOrigin.Begin );
			// Get bytes
			StringBuilder sb = new StringBuilder();
			for( int i = 0; i < versionList.Count; i++ )
			{
				sb.Append( versionList[i].GetVersionString() );
				sb.Append( '\n' );
			}
			byte[] bytes = Encoding.Default.GetBytes( sb.ToString() );
			fs.Write( bytes, 0, bytes.Length );
			fs.Flush();

            DebugUtils.Log( DebugUtils.Type.Resource, "Uncompress file done, rewrite the filelist" );
        }

		private void RewriteFileList( Queue<FileVersionData> queue, BufferedStream fs )
        {
			if (queue.Count > 0) 
			{
				fs.SetLength (0);
				fs.Seek (0, SeekOrigin.Begin);
				// Get bytes
				StringBuilder sb = new StringBuilder ();
				var item = queue.GetEnumerator ();
				while (item.MoveNext ()) {
					sb.Append (item.Current.GetString ());
				}
				byte[] bytes = Encoding.Default.GetBytes (sb.ToString ());
				fs.Write (bytes, 0, bytes.Length);
				fs.Flush ();
			}
			else
			{
				fs.Close ();
			}
        }

        void Update()
        {
            if( uncompressCallBack != null && uncompressVo != null )
            {
                if( uncompressVo.alreadyFileNum > 0 )
                {
                    uncompressCallBack( uncompressVo.alreadyFileNum, uncompressVo.fileNumber );
                }
            }
        }

        void OnDestroy()
        {
            loadWaitForSeconds = null;
            uncompressVo = null;
            uncompressCallBack = null;

            if( byteVersionList != null )
            {
                byteVersionList.Clear();
                byteVersionList = null;
            }

            if( zipVersionList != null )
            {
                zipVersionList.Clear();
                zipVersionList = null;
            }

            if( zipFileListFS != null )
            {
                zipFileListFS.Close();
                zipFileListFS.Dispose();
                zipFileListFS = null;
            }
            if( zipVersionFS != null )
            {
                zipVersionFS.Close();
                zipVersionFS.Dispose();
                zipVersionFS = null;
            }

            if( luaFileListFS != null )
            {
                luaFileListFS.Close();
                luaFileListFS.Dispose();
                luaFileListFS = null;
            }
            if( luaVersionFS != null )
            {
                luaVersionFS.Close();
                luaVersionFS.Dispose();
                luaVersionFS = null;
            }
        }

        private class UncompressProgressVo
        {
            public int fileNumber;
            public int alreadyFileNum;
        }
    }
}