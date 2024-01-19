import type { AstroIntegration } from 'astro';
import type { CmsConfig } from 'decap-cms-core';
import type { PreviewStyle } from './types.js';
interface DecapCMSOptions {
    /**
     * Path at which the Netlify CMS admin dashboard should be served.
     * @default '/admin'
     */
    adminPath?: string;
    config: Omit<CmsConfig, 'load_config_file' | 'local_backend'>;
    disableIdentityWidgetInjection?: boolean;
    previewStyles?: PreviewStyle[];
}
export default function DecapCMS({ disableIdentityWidgetInjection, adminPath, config: cmsConfig, previewStyles, }: DecapCMSOptions): AstroIntegration;
export {};
