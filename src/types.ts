import type { ImageSourcePropType, ViewStyle, StyleProp } from 'react-native';
import type { ReactNode } from 'react';

export interface ImageSize {
  width: number;
  height: number;
}

export interface SourceProp {
  uri: string;
  hybridAssets?: boolean;
  cloudUrl?: string | null;
  tintColor?: string;
}

export interface BlastedImageProps {
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  isBackground?: boolean;
  returnSize?: boolean;
  fallbackSource?: ImageSourcePropType;
  source: SourceProp | number;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  onLoad?: (size?: ImageSize | null) => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
  retries?: number;
  tintColor?: string;
}
