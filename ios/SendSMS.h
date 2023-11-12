//
//  SendSMS.h
//  Kizuner
//
//  Created by Luan on 23/11/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <MessageUI/MessageUI.h>

@interface SendSMS : NSObject <MFMessageComposeViewControllerDelegate, RCTBridgeModule> {
    RCTResponseSenderBlock _callback;
}

@end

