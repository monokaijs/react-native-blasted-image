function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef, useCallback } from 'react';
import { NativeModules, Platform, Image, View, StyleSheet, requireNativeComponent } from 'react-native';
const LINKING_ERROR = `The package 'react-native-blasted-image' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package';

// Check if the new architecture is enabled
const isFabricEnabled = global.nativeFabricUIManager != null;

// Get the native component
const ComponentName = 'BlastedImageView';
const NativeBlastedImage = NativeModules.BlastedImage ? NativeModules.BlastedImage : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

// For Fabric, we use the Codegenerated component
// For old architecture, we use requireNativeComponent
const BlastedImageView = isFabricEnabled ? require('./fabric').default : requireNativeComponent(ComponentName);

// Cache for preload requests
const requestsCache = {};

// Main component
const BlastedImage = props => {
  const {
    source,
    style,
    resizeMode = 'cover',
    onLoad,
    onError,
    isBackground = false,
    children,
    width,
    height,
    tintColor,
    returnSize = false,
    fallbackSource,
    retries = 0,
    ...rest
  } = props;
  const [error, setError] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const viewRef = useRef(null);

  // Handle source prop
  const sourceObj = typeof source === 'number' ? Image.resolveAssetSource(source) : source;

  // Handle errors
  const handleError = useCallback(err => {
    if (retryCount < retries) {
      setRetryCount(retryCount + 1);
    } else {
      setError(err);
      setShowFallback(true);
      if (onError) {
        onError(err);
      }
    }
  }, [onError, retryCount, retries]);

  // Handle successful load
  const handleLoad = useCallback(size => {
    if (onLoad) {
      onLoad(returnSize ? size : null);
    }
  }, [onLoad, returnSize]);

  // Render the component
  if (showFallback && fallbackSource) {
    return /*#__PURE__*/React.createElement(Image, _extends({
      source: fallbackSource,
      style: style,
      resizeMode: resizeMode
    }, rest));
  }
  if (isBackground) {
    return /*#__PURE__*/React.createElement(View, {
      style: [style, styles.container]
    }, /*#__PURE__*/React.createElement(BlastedImageView, _extends({
      ref: viewRef,
      style: StyleSheet.absoluteFill,
      source: sourceObj,
      resizeMode: resizeMode,
      width: width,
      height: height,
      tintColor: tintColor
    }, rest)), children);
  }
  return /*#__PURE__*/React.createElement(BlastedImageView, _extends({
    ref: viewRef,
    style: style,
    source: sourceObj,
    resizeMode: resizeMode,
    width: width,
    height: height,
    tintColor: tintColor
  }, rest));
};

// Static methods
BlastedImage.clearMemoryCache = () => {
  NativeBlastedImage.clearMemoryCache();
};
BlastedImage.clearDiskCache = () => {
  NativeBlastedImage.clearDiskCache();
};
BlastedImage.clearAllCaches = () => {
  NativeBlastedImage.clearAllCaches();
};
BlastedImage.preload = async (input, retries = 0) => {
  const items = Array.isArray(input) ? input : [input];
  const promises = items.map(async item => {
    const {
      uri,
      skipMemoryCache = false,
      hybridAssets = false,
      cloudUrl = null
    } = item;
    const cacheKey = `${uri}-${skipMemoryCache}-${hybridAssets}-${cloudUrl}`;
    if (requestsCache[cacheKey]) {
      return requestsCache[cacheKey];
    }
    let retryCount = 0;
    const tryLoad = async () => {
      try {
        await NativeBlastedImage.loadImage(uri, skipMemoryCache, hybridAssets, cloudUrl);
      } catch (error) {
        if (retryCount < retries) {
          retryCount++;
          return tryLoad();
        }
        throw error;
      }
    };
    const promise = tryLoad();
    requestsCache[cacheKey] = promise;
    try {
      await promise;
    } finally {
      delete requestsCache[cacheKey];
    }
  });
  await Promise.all(promises);
};

// Export the loadImage function
export function loadImage(imageUrl, skipMemoryCache = false, hybridAssets = false, cloudUrl = null) {
  return NativeBlastedImage.loadImage(imageUrl, skipMemoryCache, hybridAssets, cloudUrl);
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});
export default BlastedImage;
//# sourceMappingURL=index.js.map