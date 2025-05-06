#import <UIKit/UIKit.h>

#ifndef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewManager.h>
#else
#import <React/RCTViewComponentView.h>
#endif

#ifndef RCT_NEW_ARCH_ENABLED
@interface BlastedViewManager : RCTViewManager
#else
@interface BlastedViewManager : NSObject
#endif

@end
