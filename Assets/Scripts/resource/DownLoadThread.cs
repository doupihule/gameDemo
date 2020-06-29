using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Reflection;
using System.Diagnostics;

using GameUtils;

namespace Resource
{
    public class DownLoadThread
    {
        public long progress { get; private set; }
        public bool isDone;

        private Thread thread;
        private string url;
        private Func<int, FileVersionData> getFileDataFunc;
        private Action<FileVersionData, bool > downloadCompleteAction;
        private int threadId;

        public void InitAndDownLoad( int threadId,string url, Func<int, FileVersionData> getFileDataFunc, Action<FileVersionData, bool> downloadCompleteAction )
        {
            this.threadId = threadId;
            this.url = url;
            this.getFileDataFunc = getFileDataFunc;
            this.downloadCompleteAction = downloadCompleteAction;
            isDone = false;
            progress = 0;

            StartDownLoad();
        }

        private void StartDownLoad()
        {
            if( getFileDataFunc == null ) return;

            byte[] buff = new byte[1024];

            thread = new Thread( delegate ()
            {
				FileVersionData data = getFileDataFunc( threadId );
				
				while( data != null )
                {
                    // url/version/F or C/fileName
                    string downLoadUrl = string.Format( "{0}{1}/{2}/{3}", url, data.fileType.ToString(), data.version, data.fileName );
                    //sw.WriteLine( url );
                    string savePath = data.filePath + data.fileName;
                    DebugUtils.Log( DebugUtils.Type.Resource, string.Format( "Download file start, url:{0} save:{1}", downLoadUrl, savePath ) );

                    FileInfo fileInfo = new FileInfo( savePath );
                    if( !fileInfo.Directory.Exists ) fileInfo.Directory.Create();

                    FileStream fileStream = fileInfo.Open( FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite );

                    long fileLength = fileStream.Length;
                    long totalLength = data.fileSize; /*GetContentLength( downLoadUrl );*/

                    DebugUtils.Log( DebugUtils.Type.Resource, "The file local size is:" + fileLength + " total size is:" + totalLength );

                    string errMsg = string.Empty;
                    progress += fileLength;
                    if( fileLength < totalLength )
                    {
                        try
                        {
                            // Set the local file stream position for breakpoint resume
                            fileStream.Seek( fileLength, SeekOrigin.Begin );
                            // Request server file
                            HttpWebRequest request = HttpWebRequest.Create( downLoadUrl ) as HttpWebRequest;
                            // Set the server start stream position for breakpoint resume
                            request.AddRange( ( int )fileLength );
                            // Get response
                            HttpWebResponse response = ( HttpWebResponse )request.GetResponse();
                            // Get stream
                            Stream stream = response.GetResponseStream();
							
							int length = 0;
							do
							{
								length = stream.Read( buff, 0, buff.Length );
								if( length > 0 ) 
								{
									fileStream.Write( buff, 0, length );
									progress += length;
								}
							}while( length > 0 );

                            stream.Close();
                            stream.Dispose();

                            DebugUtils.Log( DebugUtils.Type.Resource, "Donwload file complete, url:" + downLoadUrl );
                        }
                        catch( Exception e )
                        {
                            errMsg = string.Format( "Donwload file err! Will try again, msg:{0}\nurl:{1}", e.Message, downLoadUrl );
                        }
                    }
                    else
                    {
                        DebugUtils.Log( DebugUtils.Type.Resource, "Donwload file already complete, url:" + downLoadUrl );
                    }

                    fileStream.Close();
                    fileStream.Dispose();
                    fileStream = null;
					
                    if ( string.IsNullOrEmpty( errMsg ) )
                    {
                        // Write temp file list!
                        if( downloadCompleteAction != null )
                        {
                            downloadCompleteAction( data, true );
                        }

                        data = getFileDataFunc( threadId );
                        if ( data != null )
                        {
                            DebugUtils.Log( DebugUtils.Type.Resource, "Get next download data is:" + data.fileName );
                        }
                        else
                        {
                            DebugUtils.Log( DebugUtils.Type.Resource, "No next download data!, threadId = " + threadId );
                        }
                    }
					else
                    {
                        DebugUtils.LogWarning( DebugUtils.Type.Resource, errMsg );
                        if( File.Exists( savePath ) )
                        {
                            File.Delete( savePath );
                        }
                    }
					
                }
            } );

#if !UNITY_EDITOR
            thread.IsBackground = true;
#endif
            thread.Start();
        }

        private long GetContentLength( string url )
        {
            HttpWebRequest requet = HttpWebRequest.Create( url ) as HttpWebRequest;
            requet.Method = "HEAD";
            HttpWebResponse response = requet.GetResponse() as HttpWebResponse;
            return response.ContentLength;
        }

        private string GetStackInfo()
        {
            StackTrace trace = new StackTrace();
            if( trace.GetFrame( 2 ) == null )
            {
                return string.Empty;
            }
            MethodBase method = trace.GetFrame( 2 ).GetMethod();
            return string.Format( "{0}(): ", method.Name );
        }

        private string GetStacksInfo()
        {
            System.Text.StringBuilder builder = new System.Text.StringBuilder();
            StackFrame[] frames = new StackTrace().GetFrames();
            int j = 1;
            j += 0;
            for( int i = 3; i < frames.Length; i++ )
            {
                builder.AppendLine( frames[i].ToString() );
            }
            return builder.ToString();
        }

    }
}
