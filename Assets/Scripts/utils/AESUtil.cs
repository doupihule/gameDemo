using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace GameUtils
{
    /// <summary>
    /// AES加密解密
    /// </summary>
    public class AESUtil
    {
        public const string ENCRYPT_KEY = "12345678"; //加密密钥
        public const string ENCRYPT_IV = "87654321"; //加密向量
        public const string KEY = "ae125efkk4454eeff444ferfkny6oxi8";


        #region 加密字符串
        /// <summary>
        /// AES 加密
        /// </summary>
        /// <param name="EncryptString">待加密密文</param>
        public static string DESEncrypt( string EncryptString )
        {
            using ( DESCryptoServiceProvider sa = new DESCryptoServiceProvider { Key = Encoding.UTF8.GetBytes( ENCRYPT_KEY ), IV = Encoding.UTF8.GetBytes( ENCRYPT_IV ) } )
            {
                using ( ICryptoTransform ct = sa.CreateEncryptor() )
                {
                    byte[] by = Encoding.UTF8.GetBytes( EncryptString );
                    using ( var ms = new MemoryStream() )
                    {
                        using ( var cs = new CryptoStream( ms, ct,
                                                         CryptoStreamMode.Write ) )
                        {
                            cs.Write( by, 0, by.Length );
                            cs.FlushFinalBlock();
                        }
                        return Convert.ToBase64String( ms.ToArray() );
                    }
                }
            }
        }
        #endregion

        #region 解密字符串
        /// <summary>
        /// AES 解密
        /// </summary>
        /// <param name="DecryptString">待解密密文</param>
        public static string DESDecrypt( string DecryptString )
        {
            using ( DESCryptoServiceProvider sa = new DESCryptoServiceProvider { Key = Encoding.UTF8.GetBytes( ENCRYPT_KEY ), IV = Encoding.UTF8.GetBytes( ENCRYPT_IV ) } )
            {
                using ( ICryptoTransform ct = sa.CreateDecryptor() )
                {
                    byte[] byt = Convert.FromBase64String( DecryptString );

                    using ( var ms = new MemoryStream() )
                    {
                        using ( var cs = new CryptoStream( ms, ct, CryptoStreamMode.Write ) )
                        {
                            cs.Write( byt, 0, byt.Length );
                            cs.FlushFinalBlock();
                        }
                        return Encoding.UTF8.GetString( ms.ToArray() );
                    }
                }
            }
        }
        #endregion


        /// <summary>
        ///  AES 加密
        /// </summary>
        /// <param name="str">明文（待加密）</param>
        /// <param name="key">密文</param>
        /// <returns></returns>
        public static string AESEncrypt( string str )
        {
            if ( string.IsNullOrEmpty( str ) ) return null;
            Byte[] toEncryptArray = Encoding.UTF8.GetBytes( str );

            System.Security.Cryptography.RijndaelManaged rm = new System.Security.Cryptography.RijndaelManaged
            {
                Key = Encoding.UTF8.GetBytes( KEY ),
                Mode = System.Security.Cryptography.CipherMode.ECB,
                Padding = System.Security.Cryptography.PaddingMode.PKCS7
            };

            System.Security.Cryptography.ICryptoTransform cTransform = rm.CreateEncryptor();
            Byte[] resultArray = cTransform.TransformFinalBlock( toEncryptArray, 0, toEncryptArray.Length );

            return Convert.ToBase64String( resultArray, 0, resultArray.Length );
        }

        /// <summary>
        ///  AES 解密
        /// </summary>
        /// <param name="str">明文（待解密）</param>
        /// <param name="key">密文</param>
        /// <returns></returns>
        public static string AESDecrypt( string str )
        {
            if ( string.IsNullOrEmpty( str ) ) return null;
            Byte[] toEncryptArray = Convert.FromBase64String( str );

            System.Security.Cryptography.RijndaelManaged rm = new System.Security.Cryptography.RijndaelManaged
            {
                Key = Encoding.UTF8.GetBytes( KEY ),
                Mode = System.Security.Cryptography.CipherMode.ECB,
                Padding = System.Security.Cryptography.PaddingMode.PKCS7
            };

            System.Security.Cryptography.ICryptoTransform cTransform = rm.CreateDecryptor();
            Byte[] resultArray = cTransform.TransformFinalBlock( toEncryptArray, 0, toEncryptArray.Length );

            return Encoding.UTF8.GetString( resultArray );
        }




        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="pToEncrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public static string MD5Encrypt( string pToEncrypt, string sKey )
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray = Encoding.Default.GetBytes( pToEncrypt );
            des.Key = ASCIIEncoding.ASCII.GetBytes( sKey );
            des.IV = ASCIIEncoding.ASCII.GetBytes( sKey );
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream( ms, des.CreateEncryptor(), CryptoStreamMode.Write );
            cs.Write( inputByteArray, 0, inputByteArray.Length );
            cs.FlushFinalBlock();
            StringBuilder ret = new StringBuilder();
            foreach ( byte b in ms.ToArray() )
            {
                ret.AppendFormat( "{0:X2}", b );
            }
            ret.ToString();
            return ret.ToString();
        }

        /// <summary>
        /// MD5解密
        /// </summary>
        /// <param name="pToDecrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public static string MD5Decrypt( string pToDecrypt, string sKey )
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();

            byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
            for ( int x = 0; x < pToDecrypt.Length / 2; x++ )
            {
                int i = ( Convert.ToInt32( pToDecrypt.Substring( x * 2, 2 ), 16 ) );
                inputByteArray[x] = (byte)i;
            }

            des.Key = ASCIIEncoding.ASCII.GetBytes( sKey );
            des.IV = ASCIIEncoding.ASCII.GetBytes( sKey );
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream( ms, des.CreateDecryptor(), CryptoStreamMode.Write );
            cs.Write( inputByteArray, 0, inputByteArray.Length );
            cs.FlushFinalBlock();

            StringBuilder ret = new StringBuilder();

            return System.Text.Encoding.Default.GetString( ms.ToArray() );
        }

        /// <summary>
        /// 创建Key
        /// </summary>
        /// <returns></returns>
        public static string GenerateKey()
        {
            DESCryptoServiceProvider desCrypto = (DESCryptoServiceProvider)DESCryptoServiceProvider.Create();
            return ASCIIEncoding.ASCII.GetString( desCrypto.Key );
        }


        /// <summary>
        /// 唯一加密方式
        /// </summary>
        /// <param name="texts"></param>
        /// <returns></returns>
        public static string OnlyEncrypt( string texts )
        {
            string Keys = GenerateKey();
            return MD5Encrypt( texts, Keys ) + "=" + Keys;   
        }


        /// <summary>
        /// 唯一解密方式
        /// </summary>
        /// <param name="texts"></param>
        /// <returns></returns>
        public static string OnlyDecrypt( string texts )
        {
            string[] pwa = texts.Split( new char[] { '=' } );   //分割一下    然后调解密
            return MD5Decrypt( pwa[0], pwa[1] );

        }
    }

}