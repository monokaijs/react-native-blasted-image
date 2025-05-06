#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTTurboModule.h>
#import <React/RCTEventEmitter.h>

@interface BlastedImageModuleImpl : RCTEventEmitter <RCTTurboModule>

- (void)sendEventWithName:(NSString *)name message:(NSString *)message;

- (NSURL *)prepareUrl:(NSString *)imageUrl
        hybridAssets:(BOOL)hybridAssets
            cloudUrl:(NSString *)cloudUrl
             showLog:(BOOL)showLog;

@end
#endif
