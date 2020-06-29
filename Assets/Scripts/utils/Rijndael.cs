using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace GameUtils
{    
    public class Rijndael 
    {   
        RijndaelManaged aes;

        ICryptoTransform encryptor;
        ICryptoTransform decryptor;

        public Rijndael( byte[] key, byte[] iv )
        {
            aes = new RijndaelManaged();                     
            aes.Key = key;
            aes.IV = iv ;

            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.None;
            aes.BlockSize = 128;

            encryptor = aes.CreateEncryptor( key, iv );
            decryptor = aes.CreateDecryptor( key, iv );
        }

        /// <summary>
        /// AES加密算法
        /// </summary>
        /// <returns>返回加密后的密文字节数组</returns>
        public byte[] Encrypt( byte[] inputByteArray )
        {
            byte[] cipherBytes;
            using( MemoryStream ms = new MemoryStream() )
            {
                using( CryptoStream cs = new CryptoStream( ms, encryptor, CryptoStreamMode.Write ) )
                {
                    cs.Write( inputByteArray, 0, inputByteArray.Length );
                    cs.FlushFinalBlock();
                    cipherBytes = ms.ToArray();//得到加密后的字节数组
                }
            }
            return cipherBytes;
        }

        /// <summary>
        /// AES解密
        /// </summary>
        /// <param name="cipherByteArray">密文字节数组</param>
        /// <returns>返回解密后的字符串</returns>
        public byte[] Decrypt( byte[] cipherByteArray, int originalLength = 0 )
        {        
            int length = originalLength;
            if( length == 0 )
            {
                length = cipherByteArray.Length;
            }
            byte[] decryptBytes = new byte[length];
            using( MemoryStream ms = new MemoryStream( cipherByteArray ) )
            {
                using( CryptoStream cs = new CryptoStream( ms, decryptor, CryptoStreamMode.Read ) )
                {
                    //cs.Read( decryptBytes, 0, decryptBytes.Length );
                    //*
                    using (MemoryStream originalMemory = new MemoryStream())    
                    {    
                        Byte[] Buffer = new Byte[1024];    
                        Int32 readBytes = 0;    
                        while ((readBytes = cs.Read(Buffer, 0, Buffer.Length)) > 0)
                        {    
                            originalMemory.Write(Buffer, 0, readBytes);
                        }    

                        decryptBytes = originalMemory.ToArray();    
                    }
                    //*/
                }
            }       
            return decryptBytes;
        }
    }
}