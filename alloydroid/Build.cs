using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml.Linq;

//https://docs.microsoft.com/en-us/xamarin/android/deploy-test/building-apps/build-process
namespace APKBuilder
{
    class Program
    {
      static string packageName = "com.d3bug.alloy";
      static string msbuild = @"msbuild";
      static string zipalign = @"zipalign";
      static string jarsigner = @"apksigner";
      static string androidProject = $"Alloy.csproj";
      static string keystorePath = $"alloy.keystore";
      static string keystorePassword = "37a2447966364633bbed42866b87ad13";
      static string keystoreAlias = "android";
      static string configuration = "Release";
        static void Main(string[] args)
        {
            
            if(args.Length != 0){}
            else Build();
            
        }

        static void Build(){
          string binPath = $"bin/{configuration}";
          string objPath = $"obj";

          string unsignedApkPath = $"\"{binPath}/{packageName}.apk\"";
          string signedApkPath = $"{binPath}/{packageName}_signed.apk";
          string alignedApkPath = $"{binPath}/{packageName}_signed_aligned.apk";

          string mbuildArgs = $"{androidProject} /restore /t:PackageForAndroid /p:Configuration={configuration}";
          string jarsignerArgs = $"sign --ks {keystorePath} --ks-pass pass:{keystorePassword} --ks-key-alias {keystoreAlias} --key-pass pass:{keystorePassword} --min-sdk-version 21 --max-sdk-version 27  {signedApkPath} ";
          string zipalignArgs = $" 4 {unsignedApkPath} {signedApkPath}";

          RunProcess(msbuild, mbuildArgs);
          Console.WriteLine("Build is done");

          Console.WriteLine(zipalign + " " + zipalignArgs);
          RunProcess(zipalign, zipalignArgs);
          Console.WriteLine("Zipalign is done");

          Console.WriteLine(jarsigner + " " + jarsignerArgs);
          RunProcess(jarsigner, jarsignerArgs);
          Console.WriteLine("Jarsigner is done");

          //This is should be the last step otherwise Google Play Store will not accept the APK


        

          Console.WriteLine("Built and signed");
        }

        static void RunProcess(string filename, string arguments)
        {
            var process = new Process();
            process.StartInfo.FileName = filename;
            process.StartInfo.Arguments = arguments;
            process.Start();
            process.WaitForExit();
        }
    }
}
