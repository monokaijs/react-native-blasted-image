import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type { HostComponent } from 'react-native';
import type { SourceProp } from '../types';

export interface NativeProps extends ViewProps {
  source: SourceProp;
  resizeMode?: string;
  width?: number;
  height?: number;
  tintColor?: string;
}

export default codegenNativeComponent<NativeProps>(
  'BlastedImageView'
) as HostComponent<NativeProps>;
