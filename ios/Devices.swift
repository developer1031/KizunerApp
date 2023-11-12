//
//  Devices.swift
//  Kizuner
//
//  Created by Luan on 23/03/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation

public enum DevicesType: String {
  case unknown            = "Unknown"
  case iPodTouch1         = "iPod Touch 1"
  case iPodTouch2         = "iPod Touch 2"
  case iPodTouch3         = "iPod Touch 3"
  case iPodTouch4         = "iPod Touch 4"
  case iPodTouch5         = "iPod Touch 5"
  case iPodTouch6         = "iPod Touch 6"
  case iPodTouch7         = "iPod Touch 7"
  case iPhone4            = "iPhone 4"
  case iPhone4s           = "iPhone 4s"
  case iPhone5            = "iPhone 5"
  case iPhone5c           = "iPhone 5c"
  case iPhone5s           = "iPhone 5s"
  case iPhone6            = "iPhone 6"
  case iPhone6Plus        = "iPhone 6 Plus"
  case iPhone6s           = "iPhone 6s"
  case iPhone6sPlus       = "iPhone 6s Plus"
  case iPhoneSE           = "iPhone SE"
  case iPhone7            = "iPhone 7"
  case iPhone7Plus        = "iPhone 7 Plus"
  case iPhone8            = "iPhone 8"
  case iPhone8Plus        = "iPhone 8 Plus"
  case iPhoneX            = "iPhone X"
  case iPhoneXs           = "iPhone XS"
  case iPhoneXsMax        = "iPhone XS Max"
  case iPhoneXr           = "iPhone XR"
  case iPhone11           = "iPhone 11"
  case iPhone11Pro        = "iPhone 11 Pro"
  case iPhone11ProMax     = "iPhone 11 Pro Max"
  case iPhoneSE2          = "iPhone SE (2nd generation)"
  case iPhone12Mini       = "iPhone 12 Mini"
  case iPhone12           = "iPhone 12"
  case iPhone12Pro        = "iPhone 12 Pro"
  case iPhone12ProMax     = "iPhone 12 Pro Max"
  case iPad2              = "iPad 2"
  case iPad3              = "iPad 3"
  case iPad4              = "iPad 4"
  case iPadAir            = "iPad Air"
  case iPadAir2           = "iPad Air 2"
  case iPadAir3           = "iPad Air 3"
  case iPadAir4           = "iPad Air 4"
  case iPad5              = "iPad 5"
  case iPad6              = "iPad 6"
  case iPad7              = "iPad 7"
  case iPad8              = "iPad 8"
  case iPadMini           = "iPad mini"
  case iPadMini2          = "iPad mini 2"
  case iPadMini3          = "iPad mini 3"
  case iPadMini4          = "iPad mini 4"
  case iPadMini5          = "iPad mini 5"
  case iPadPro            = "iPad Pro"
  case iPadPro2           = "iPad Pro (2nd generation)"
  case iPadPro3           = "iPad Pro (3rd generation)"
  case iPadPro4           = "iPad Pro (4th generation)"
  case simulator          = "Simulator"
}

public enum DevicesSize: String {
  case screenUnknown          = "Unknown"
  case screen4Inches          = "4 inches"
  case screen4Dot7Inches      = "4,7 inches"
  case screen5Dot4Inches      = "5,4 inches"
  case screen5Dot5Inches      = "5,5 inches"
  case screen5Dot8Inches      = "5,8 inches"
  case screen6Dot1Inches      = "6,1 inches"
  case screen6Dot5Inches      = "6,5 inches"
  case screen6Dot7Inches      = "6,7 inches"
  case screen7Dot9Inches      = "7,9 inches"
  case screen9Dot7Inches      = "9,7 inches"
  case screen10Dot2Inches     = "10,2 inches"
  case screen10Dot5Inches     = "10,5 inches"
  case screen10Dot9Inches     = "10,9 inches"
  case screen11Inches         = "11 inches"
  case screen12Dot9Inches     = "12,9 inches"
  
  var value: Double {
    switch self {
    case .screenUnknown:
        return -1
    case .screen4Inches:
        return 4
    case .screen4Dot7Inches:
        return 4.7
    case .screen5Dot4Inches:
        return 5.4
    case .screen5Dot5Inches:
        return 5.5
    case .screen5Dot8Inches:
        return 5.8
    case .screen6Dot1Inches:
        return 6.1
    case .screen6Dot5Inches:
        return 6.5
    case .screen6Dot7Inches:
        return 6.7
    case .screen7Dot9Inches:
        return 7.9
    case .screen9Dot7Inches:
        return 9.7
    case .screen10Dot2Inches:
        return 10.2
    case .screen10Dot5Inches:
        return 10.5
    case .screen10Dot9Inches:
        return 10.9
    case .screen11Inches:
        return 11
    case .screen12Dot9Inches:
        return 12.9
    }
  }
  
}


public enum DevicesConnectivity: String {
  case unknown        = "Unknown"
  case wiFi           = "WiFi"
  case wiFi3G         = "WiFi + 3G"
  case wiFi4G         = "WiFi + 4G"
  case wiFi5G         = "WiFi + 5G"
}


public struct Devices {
  public private (set) var identifier: String
  public private (set) var type: DevicesType
  public private (set) var model: String
  public private (set) var size: DevicesSize
  public private (set) var connectivity: DevicesConnectivity
  public private (set) var completeName: String
  public private (set) var year: Int
  
    
}
