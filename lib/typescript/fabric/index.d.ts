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
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map