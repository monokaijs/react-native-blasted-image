#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBlastedImageViewComponentView.h"
#import "BlastedImageModule.h"

#import <react/renderer/components/RNBlastedImageSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNBlastedImageSpec/EventEmitters.h>
#import <react/renderer/components/RNBlastedImageSpec/Props.h>
#import <react/renderer/components/RNBlastedImageSpec/RCTComponentViewHelpers.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <SDWebImage/SDWebImage.h>
#import <objc/runtime.h>

using namespace facebook::react;

@interface RNBlastedImageViewComponentView () <RCTBlastedImageViewViewProtocol>
@end

@implementation RNBlastedImageViewComponentView {
    UIImageView *_imageView;
    BlastedImageModule *_blastedImageModule;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const BlastedImageViewProps>();
        _props = defaultProps;
        
        _imageView = [[UIImageView alloc] initWithFrame:self.bounds];
        _imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _imageView.clipsToBounds = YES;
        
        self.contentView = _imageView;
        
        _blastedImageModule = [BlastedImageModule new];
    }
    
    return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<BlastedImageViewComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<BlastedImageViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<BlastedImageViewProps const>(props);
    
    // Handle source prop
    if (oldViewProps.source.uri != newViewProps.source.uri ||
        oldViewProps.source.hybridAssets != newViewProps.source.hybridAssets ||
        oldViewProps.source.cloudUrl != newViewProps.source.cloudUrl) {
        
        NSString *uri = RCTNSStringFromString(newViewProps.source.uri);
        BOOL hybridAssets = newViewProps.source.hybridAssets;
        NSString *cloudUrl = RCTNSStringFromString(newViewProps.source.cloudUrl);
        
        if (uri.length > 0) {
            NSURL *url = [_blastedImageModule prepareUrl:uri hybridAssets:hybridAssets cloudUrl:cloudUrl showLog:NO];
            
            if (url != nil && ![url.absoluteString isEqualToString:@""]) {
                UIColor *storedTintColor = objc_getAssociatedObject(_imageView, @selector(tintColor));
                
                if (!storedTintColor) {
                    [_imageView sd_setImageWithURL:url];
                } else {
                    [_imageView sd_setImageWithURL:url completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
                        if (error) return;
                        
                        dispatch_async(dispatch_get_main_queue(), ^{
                            _imageView.tintColor = storedTintColor;
                            _imageView.image = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
                            [_imageView setNeedsDisplay];
                        });
                    }];
                }
                
                [_imageView setHidden:NO];
            } else {
                [_imageView setHidden:YES];
            }
        } else {
            [_imageView setHidden:YES];
        }
    }
    
    // Handle resizeMode prop
    if (oldViewProps.resizeMode != newViewProps.resizeMode) {
        NSString *resizeMode = RCTNSStringFromString(newViewProps.resizeMode);
        
        // Check if resizeMode is nil, empty, or "undefined" then set default
        if (!resizeMode || [resizeMode isEqualToString:@""] || [resizeMode isEqualToString:@"undefined"]) {
            resizeMode = @"cover";
        }
        
        if ([resizeMode isEqualToString:@"contain"]) {
            [_imageView setContentMode:UIViewContentModeScaleAspectFit];
        } else if ([resizeMode isEqualToString:@"stretch"]) {
            [_imageView setContentMode:UIViewContentModeScaleToFill];
        } else if ([resizeMode isEqualToString:@"cover"]) {
            [_imageView setContentMode:UIViewContentModeScaleAspectFill];
        } else if ([resizeMode isEqualToString:@"center"]) {
            [_imageView setContentMode:UIViewContentModeCenter];
        } else {
            [_imageView setContentMode:UIViewContentModeScaleAspectFill]; // Default to cover
        }
    }
    
    // Handle width prop
    if (oldViewProps.width != newViewProps.width) {
        CGFloat width = newViewProps.width;
        CGRect frame = _imageView.frame;
        frame.size.width = width;
        _imageView.frame = frame;
    }
    
    // Handle height prop
    if (oldViewProps.height != newViewProps.height) {
        CGFloat height = newViewProps.height;
        CGRect frame = _imageView.frame;
        frame.size.height = height;
        _imageView.frame = frame;
    }
    
    // Handle tintColor prop
    if (oldViewProps.tintColor != newViewProps.tintColor) {
        NSString *tintColorHex = RCTNSStringFromString(newViewProps.tintColor);
        
        if (tintColorHex.length > 0) {
            UIColor *uiColor = [self colorFromHexString:tintColorHex];
            objc_setAssociatedObject(_imageView, @selector(tintColor), uiColor, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
            
            if (_imageView.image) {
                _imageView.image = [_imageView.image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
                _imageView.tintColor = uiColor;
            }
            
            [_imageView setNeedsDisplay];
        }
    }
    
    [super updateProps:props oldProps:oldProps];
}

- (BOOL)isEmptyString:(NSString *)str {
    return (!str || ![str isKindOfClass:[NSString class]] || [str isEqualToString:@""]);
}

- (UIColor *)colorFromHexString:(NSString *)hexString {
    if ([hexString hasPrefix:@"#"]) {
        hexString = [hexString substringFromIndex:1];
    }
    
    if (hexString.length == 6) {
        unsigned rgbValue = 0;
        NSScanner *scanner = [NSScanner scannerWithString:hexString];
        [scanner scanHexInt:&rgbValue];
        
        return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16) / 255.0
                               green:((rgbValue & 0x00FF00) >> 8) / 255.0
                                blue:(rgbValue & 0x0000FF) / 255.0
                               alpha:1.0];
    }
    
    SEL colorSelector = NSSelectorFromString([hexString stringByAppendingString:@"Color"]);
    if ([UIColor respondsToSelector:colorSelector]) {
        return [UIColor performSelector:colorSelector];
    }
    
    // Return black if no match is found
    return [UIColor blackColor];
}

@end

Class<RCTComponentViewProtocol> BlastedImageViewCls(void)
{
    return RNBlastedImageViewComponentView.class;
}
#endif
