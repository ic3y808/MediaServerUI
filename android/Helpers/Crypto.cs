using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Android.App;

namespace Alloy.Helpers
{
	internal static class Crypto
	{
		private static readonly byte[] salt = Encoding.ASCII.GetBytes(Application.Context.GetString(Resource.String.master_salt));

		internal static string Encrypt(string textToEncrypt, string encryptionPassword)
		{
			var algorithm = GetAlgorithm(encryptionPassword);

			if (textToEncrypt == null || textToEncrypt == "") return "";

			byte[] encryptedBytes;
			using (ICryptoTransform encryptor = algorithm.CreateEncryptor(algorithm.Key, algorithm.IV))
			{
				byte[] bytesToEncrypt = Encoding.UTF8.GetBytes(textToEncrypt);
				encryptedBytes = InMemoryCrypt(bytesToEncrypt, encryptor);
			}
			return Convert.ToBase64String(encryptedBytes);
		}

		internal static string Decrypt(string encryptedText, string encryptionPassword)
		{
			var algorithm = GetAlgorithm(encryptionPassword);

			//Anything to process?
			if (encryptedText == null || encryptedText == "") return "";

			byte[] descryptedBytes;
			using (ICryptoTransform decryptor = algorithm.CreateDecryptor(algorithm.Key, algorithm.IV))
			{
				byte[] encryptedBytes = Convert.FromBase64String(encryptedText);
				descryptedBytes = InMemoryCrypt(encryptedBytes, decryptor);
			}
			return Encoding.UTF8.GetString(descryptedBytes);
		}

		private static byte[] InMemoryCrypt(byte[] data, ICryptoTransform transform)
		{
			MemoryStream memory = new MemoryStream();
			using (Stream stream = new CryptoStream(memory, transform, CryptoStreamMode.Write))
			{
				stream.Write(data, 0, data.Length);
			}
			return memory.ToArray();
		}

		private static RijndaelManaged GetAlgorithm(string encryptionPassword)
		{
			// Create an encryption key from the encryptionPassword and salt.
			var key = new Rfc2898DeriveBytes(encryptionPassword, salt);

			// Declare that we are going to use the Rijndael algorithm with the key that we've just got.
			var algorithm = new RijndaelManaged();
			int bytesForKey = algorithm.KeySize / 8;
			int bytesForIV = algorithm.BlockSize / 8;
			algorithm.Key = key.GetBytes(bytesForKey);
			algorithm.IV = key.GetBytes(bytesForIV);
			return algorithm;
		}

	}
}