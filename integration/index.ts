import type { AstroIntegration, AstroUserConfig } from 'astro';
import type { CmsConfig } from 'decap-cms-core';
import { spawn } from 'node:child_process';
import type { PreviewStyle } from './types.js';
import AdminDashboard from './vite-plugin-admin-dashboard.js';

const widgetPath = 'astro-decap-plugin/identity-widget';

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

export default function DecapCMS({
  disableIdentityWidgetInjection = false,
  adminPath = '/admin',
  config: cmsConfig,
  previewStyles = [],
}: DecapCMSOptions) {
  if (!adminPath.startsWith('/')) {
    throw new Error(
      '`adminPath` option must be a root-relative pathname, starting with "/", got "' +
        adminPath +
        '"'
    );
  }
  if (adminPath.endsWith('/')) {
    adminPath = adminPath.slice(0, -1);
  }

  let proxy: ReturnType<typeof spawn>;

  const DecapCMSIntegration: AstroIntegration = {
    name: 'dec-cms',
    hooks: {
      'astro:config:setup': ({
        config,
        injectRoute,
        injectScript,
        updateConfig,
      }) => {
        const identityWidgetScript = `import { initIdentity } from '${widgetPath}'; initIdentity('${adminPath}');`;
        
        const newConfig: AstroUserConfig = {
          // Default to the URL provided by Netlify when building there. See:
          // https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
          site: config.site || process.env.URL,
          vite: {
            plugins: [
              ...(config.vite?.plugins || []),
              AdminDashboard({
                config: cmsConfig,
                previewStyles,
                identityWidget: disableIdentityWidgetInjection
                  ? identityWidgetScript
                  : '',
              }),
            ],
          },
        };
        
        updateConfig(newConfig as any);

        injectRoute({
          pattern: adminPath,
          entrypoint: 'astro-decap-plugin/admin-dashboard.astro',
        });

        if (!disableIdentityWidgetInjection) {
          injectScript('page', identityWidgetScript);
        }
      },

      'astro:server:start': () => {
        proxy = spawn('decap-server', {
          stdio: 'inherit',
          // Run in shell on Windows to make sure the npm package can be found.
          shell: process.platform === 'win32',
        }).on('error', (err) => {
          console.error('Failed to start decap-server :', err);
          process.exit(1);
        })
        process.on('exit', () => proxy.kill());
      },

      'astro:server:done': () => {
        proxy.kill();
      },
    },
  };
  return DecapCMSIntegration;
}
