using System;
using System.Diagnostics;

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
      static string unsignedApkPath = "";
      static string signedApkPath = "";
      static string alignedApkPath = "";
      static string binPath = "";
      public enum Action { Build, Install}
        static void Main(string[] args)
        {
            Action action = Action.Build;
            if(args.Length != 0){
              foreach(var arg in args){
                if(arg == "--release"){ configuration = "Release"; }
                if(arg == "--debug"){ configuration = "Debug"; }
                if(arg == "--install"){ configuration = "Debug"; action = Action.Install; }
              }
            }

            binPath = $"bin/{configuration}";
            unsignedApkPath = $"\"{binPath}/{packageName}.apk\"";
            signedApkPath = $"{binPath}/{packageName}_signed.apk";
            alignedApkPath = $"{binPath}/{packageName}_signed_aligned.apk";

            switch(action){
              case Action.Build: Build(); break;
              case Action.Install: Install(); break;
            }
        }

        static void Build(){
          string mbuildRestore = $"{androidProject} -t:restore /p:Configuration={configuration}";
          string mbuildClean = $"{androidProject} /t:Clean /p:Configuration={configuration}";
          string mbuildArgs = $"{androidProject} /t:PackageForAndroid /t:Build /p:Configuration={configuration}";
          string jarsignerArgs = $"sign --ks {keystorePath} --ks-pass pass:{keystorePassword} --ks-key-alias {keystoreAlias} --key-pass pass:{keystorePassword} --min-sdk-version 21 --max-sdk-version 27  {signedApkPath} ";
          string zipalignArgs = $" 4 {unsignedApkPath} {signedApkPath}";

          RunProcess(msbuild, mbuildRestore);
          Console.WriteLine("Restore is done");

          RunProcess(msbuild, mbuildClean);
          Console.WriteLine("Clean is done");

          RunProcess(msbuild, mbuildArgs);
          Console.WriteLine("Build is done");

          RunProcess(zipalign, zipalignArgs);
          Console.WriteLine("Zipalign is done");

          RunProcess(jarsigner, jarsignerArgs);
          Console.WriteLine("Jarsigner is done");

          Console.WriteLine("Built and signed");
        }

        static void Install(){
          Console.WriteLine("Installing apk");
          RunProcess("adb", $"uninstall {packageName}");
          RunProcess("adb", $"install {signedApkPath}");
          Console.WriteLine($"{packageName} Installed!");
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
