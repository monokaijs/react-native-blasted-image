"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.loadImage = loadImage;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LINKING_ERROR = `The package 'react-native-blasted-image' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package';

// Check if the new architecture is enabled
const isFabricEnabled = global.nativeFabricUIManager != null;

// Get the native component
const ComponentName = 'BlastedImageView';
const NativeBlastedImage = _reactNative.NativeModules.BlastedImage ? _reactNative.NativeModules.BlastedImage : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

// For Fabric, we use the Codegenerated component
// For old architecture, we use requireNativeComponent
const BlastedImageView = isFabricEnabled ? require('./fabric').default : (0, _reactNative.requireNativeComponent)(ComponentName);

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
  const [error, setError] = (0, _react.useState)(null);
  const [imageSize, setImageSize] = (0, _react.useState)(null);
  const [retryCount, setRetryCount] = (0, _react.useState)(0);
  const [showFallback, setShowFallback] = (0, _react.useState)(false);
  const viewRef = (0, _react.useRef)(null);

  // Handle source prop
  const sourceObj = typeof source === 'number' ? _reactNative.Image.resolveAssetSource(source) : source;

  // Handle errors
  const handleError = (0, _react.useCallback)(err => {
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
  const handleLoad = (0, _react.useCallback)(size => {
    if (onLoad) {
      onLoad(returnSize ? size : null);
    }
  }, [onLoad, returnSize]);

  // Render the component
  if (showFallback && fallbackSource) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Image, _extends({
      source: fallbackSource,
      style: style,
      resizeMode: resizeMode
    }, rest));
  }
  if (isBackground) {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [style, styles.container]
    }, /*#__PURE__*/_react.default.createElement(BlastedImageView, _extends({
      ref: viewRef,
      style: _reactNative.StyleSheet.absoluteFill,
      source: sourceObj,
      resizeMode: resizeMode,
      width: width,
      height: height,
      tintColor: tintColor
    }, rest)), children);
  }
  return /*#__PURE__*/_react.default.createElement(BlastedImageView, _extends({
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
function loadImage(imageUrl, skipMemoryCache = false, hybridAssets = false, cloudUrl = null) {
  return NativeBlastedImage.loadImage(imageUrl, skipMemoryCache, hybridAssets, cloudUrl);
}
const styles = _reactNative.StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});
var _default = exports.default = BlastedImage;
//# sourceMappingURL=index.js.map