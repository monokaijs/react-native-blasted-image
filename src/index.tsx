import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NativeModules, Platform, Image, View, StyleSheet, requireNativeComponent, UIManager, findNodeHandle } from 'react-native';
import type { ViewProps } from 'react-native';
import type { BlastedImageProps, SourceProp, ImageSize } from './types';

const LINKING_ERROR =
  `The package 'react-native-blasted-image' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package';

// Check if the new architecture is enabled
const isFabricEnabled = global.nativeFabricUIManager != null;

// Get the native component
const ComponentName = 'BlastedImageView';

const NativeBlastedImage = NativeModules.BlastedImage
  ? NativeModules.BlastedImage
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// For Fabric, we use the Codegenerated component
// For old architecture, we use requireNativeComponent
const BlastedImageView = isFabricEnabled
  ? require('./fabric').default
  : requireNativeComponent(ComponentName);

// Cache for preload requests
const requestsCache: Record<string, Promise<void>> = {};

// Main component
const BlastedImage: React.FC<BlastedImageProps> & {
  clearMemoryCache: () => void;
  clearDiskCache: () => void;
  clearAllCaches: () => void;
  preload: (
    input:
      | { uri: string; skipMemoryCache?: boolean; hybridAssets?: boolean; cloudUrl?: string | null }
      | Array<{ uri: string; skipMemoryCache?: boolean; hybridAssets?: boolean; cloudUrl?: string | null }>,
    retries?: number
  ) => Promise<void>;
} = (props) => {
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

  const [error, setError] = useState<Error | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const viewRef = useRef<any>(null);

  // Handle source prop
  const sourceObj = typeof source === 'number' ? Image.resolveAssetSource(source) : source;

  // Handle errors
  const handleError = useCallback(
    (err: Error) => {
      if (retryCount < retries) {
        setRetryCount(retryCount + 1);
      } else {
        setError(err);
        setShowFallback(true);
        if (onError) {
          onError(err);
        }
      }
    },
    [onError, retryCount, retries]
  );

  // Handle successful load
  const handleLoad = useCallback(
    (size?: ImageSize | null) => {
      if (onLoad) {
        onLoad(returnSize ? size : null);
      }
    },
    [onLoad, returnSize]
  );

  // Render the component
  if (showFallback && fallbackSource) {
    return (
      <Image
        source={fallbackSource}
        style={style}
        resizeMode={resizeMode}
        {...rest}
      />
    );
  }

  if (isBackground) {
    return (
      <View style={[style, styles.container]}>
        <BlastedImageView
          ref={viewRef}
          style={StyleSheet.absoluteFill}
          source={sourceObj}
          resizeMode={resizeMode}
          width={width}
          height={height}
          tintColor={tintColor}
          {...rest}
        />
        {children}
      </View>
    );
  }

  return (
    <BlastedImageView
      ref={viewRef}
      style={style}
      source={sourceObj}
      resizeMode={resizeMode}
      width={width}
      height={height}
      tintColor={tintColor}
      {...rest}
    />
  );
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

BlastedImage.preload = async (
  input:
    | { uri: string; skipMemoryCache?: boolean; hybridAssets?: boolean; cloudUrl?: string | null }
    | Array<{ uri: string; skipMemoryCache?: boolean; hybridAssets?: boolean; cloudUrl?: string | null }>,
  retries = 0
): Promise<void> => {
  const items = Array.isArray(input) ? input : [input];

  const promises = items.map(async (item) => {
    const { uri, skipMemoryCache = false, hybridAssets = false, cloudUrl = null } = item;
    const cacheKey = `${uri}-${skipMemoryCache}-${hybridAssets}-${cloudUrl}`;

    if (requestsCache[cacheKey]) {
      return requestsCache[cacheKey];
    }

    let retryCount = 0;
    const tryLoad = async (): Promise<void> => {
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
export function loadImage(
  imageUrl: string,
  skipMemoryCache = false,
  hybridAssets = false,
  cloudUrl: string | null = null
): Promise<void> {
  return NativeBlastedImage.loadImage(imageUrl, skipMemoryCache, hybridAssets, cloudUrl);
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default BlastedImage;
