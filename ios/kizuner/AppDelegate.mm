#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import "Orientation.h"
#import <AVFoundation/AVFoundation.h>

#import <Firebase.h>
//#import <RNFBDynamicLinks/RNFBDynamicLinksModule.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <GoogleMaps/GoogleMaps.h>

#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  BOOL handled = [RCTLinkingManager application:application openURL:url options:options];
  
//  if (!handled) {
//    handled = [[FIRDynamicLink instance] application:application openURL:url options:options];
//    return handled;
//  }
  
  return handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options] || [RNGoogleSignin application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  
  [FIRApp configure];
  
  self.moduleName = @"kizuner";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  [GMSServices provideAPIKey:@"AIzaSyBRQTWz3Vtr8P0Qx5O49sUecTr0WZHZflg"];
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error: nil];
  
  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
