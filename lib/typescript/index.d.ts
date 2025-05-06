import React from 'react';
import type { BlastedImageProps } from './types';
declare const BlastedImage: React.FC<BlastedImageProps> & {
    clearMemoryCache: () => void;
    clearDiskCache: () => void;
    clearAllCaches: () => void;
    preload: (input: {
        uri: string;
        skipMemoryCache?: boolean;
        hybridAssets?: boolean;
        cloudUrl?: string | null;
    } | Array<{
        uri: string;
        skipMemoryCache?: boolean;
        hybridAssets?: boolean;
        cloudUrl?: string | null;
    }>, retries?: number) => Promise<void>;
};
export declare function loadImage(imageUrl: string, skipMemoryCache?: boolean, hybridAssets?: boolean, cloudUrl?: string | null): Promise<void>;
export default BlastedImage;
//# sourceMappingURL=index.d.ts.map