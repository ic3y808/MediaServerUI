using System.Reflection;
using System.Runtime.InteropServices;
using Android.App;
using Alloy.Common;

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("Alloy")]
[assembly: AssemblyDescription("")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("")]
[assembly: AssemblyProduct("Alloy")]
[assembly: AssemblyCopyright("Copyright ©  2018")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]
[assembly: ComVisible(false)]
[assembly: UsesPermission(Name = "android.permission.WAKE_LOCK")]
[assembly: UsesPermission(Name = "android.permission.READ_EXTERNAL_STORAGE")]
[assembly: UsesPermission(Name = "android.permission.WRITE_EXTERNAL_STORAGE")]
[assembly: UsesPermission(Name = "android.permission.INTERNET")]
[assembly: UsesPermission(Name = "android.permission.ACCESS_NETWORK_STATE")]
[assembly: UsesPermission(Name = "android.permission.ACCESS_WIFI_STATE")]
[assembly: UsesPermission(Name = "android.permission.CHANGE_WIFI_STATE")]
[assembly: UsesPermission(Name = "android.permission.BLUETOOTH")]
[assembly: UsesPermission(Name = "android.permission.SUBSTITUTE_NOTIFICATION_APP_NAME")]
[assembly: UsesPermission(Name = "android.permission.DEVICE_POWER")]
[assembly: UsesPermission(Name = "android.permission.INJECT_EVENTS")]
[assembly: UsesPermission(Name = "android.permission.CHANGE_NETWORK_STATE")]
[assembly: UsesPermission(Name = "android.permission.CHANGE_WIFI_STATE")]
[assembly: UsesPermission(Name = "android.permission.CONFIGURE_WIFI_DISPLAY")]
[assembly: UsesPermission(Name = "android.permission.BROADCAST_STICKY")]
[assembly: UsesPermission(Name = "android.permission.MODIFY_AUDIO_SETTINGS")]
[assembly: UsesPermission(Name = "android.permission.WRITE_SETTINGS")]
[assembly: UsesPermission(Name = "android.permission.WRITE_MEDIA_STORAGE")]
[assembly: UsesPermission(Name = "android.permission.MEDIA_CONTENT_CONTROL")]
[assembly: UsesPermission(Name = "android.permission.READ_USER_DICTIONARY")]
[assembly: UsesPermission(Name = "com.android.launcher.permission.INSTALL_SHORTCUT")]
[assembly: UsesPermission(Name = "com.android.launcher.permission.UNINSTALL_SHORTCUT")]
[assembly: MetaData("com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME", Value = "alloy.providers.CastOptionsProvider")]
[assembly: UsesFeature("android.hardware.wifi")]
[assembly: SupportedFormat("Mpeg", Extensions = new[] { ".mp3", ".mp4" })]
[assembly: SupportedFormat("Wave", Extensions = new []{ ".wav" })]
[assembly: SupportedFormat("flac", Extensions = new []{ ".flac" })]
[assembly: SupportedFormat("ogg vorbis", Extensions = new []{ ".ogg" })]
// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers 
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]