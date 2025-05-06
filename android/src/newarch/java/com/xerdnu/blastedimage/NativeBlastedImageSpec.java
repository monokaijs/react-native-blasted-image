package com.xerdnu.blastedimage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

/**
 * Abstract base class for the BlastedImage TurboModule.
 */
abstract public class NativeBlastedImageSpec extends ReactContextBaseJavaModule implements TurboModule {
    public NativeBlastedImageSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public abstract void loadImage(String imageUrl, boolean skipMemoryCache, boolean hybridAssets, String cloudUrl, Promise promise);
    public abstract void clearMemoryCache(Promise promise);
    public abstract void clearDiskCache(Promise promise);
    public abstract void clearAllCaches(Promise promise);
}
