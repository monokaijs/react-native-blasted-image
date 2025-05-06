#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "BlastedImageModuleImpl.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface BlastedImageModule : BlastedImageModuleImpl
#else
@interface BlastedImageModule : RCTEventEmitter <RCTBridgeModule>
#endif

- (void)sendEventWithName:(NSString *)name message:(NSString *)message;

- (NSURL *)prepareUrl:(NSString *)imageUrl
        hybridAssets:(BOOL)hybridAssets
            cloudUrl:(NSString *)cloudUrl
             showLog:(BOOL)showLog;

@end
