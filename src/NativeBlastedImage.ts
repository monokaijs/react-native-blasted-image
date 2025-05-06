import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  loadImage(
    imageUrl: string,
    skipMemoryCache: boolean,
    hybridAssets: boolean,
    cloudUrl: string | null
  ): Promise<void>;
  clearMemoryCache(): Promise<void>;
  clearDiskCache(): Promise<void>;
  clearAllCaches(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BlastedImage');
