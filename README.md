## Installation

```bash
npm i astro-decap-plugin
```

## What is this?

This is an integration for the [Astro](https://astro.build/) site builder,
which adds support for [Decap CMS](https://decapcms.org/), an
open-source, Git-based content management system.

Adding the integration will:

- Add the Decap CMS dashboard at `/admin` (or another route if configured)
- Inject Netlify’s [Identity Widget](https://github.com/netlify/netlify-identity-widget) across your site to support logging in to the admin app
- Run a [local proxy server](https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository) in `dev` mode to allow local content updates via the CMS

Usually each of these requires individual set up and configuration. Using this integration, you configure your CMS once in `astro.config.mjs`, sit back, and enjoy!

### Adding the integration

To add Decap CMS to your project, import and use the integration in your
Astro config file, adding it to the `integrations` array.

```js
// astro.config.mjs

import { defineConfig } from "astro/config";
import DecapCMS from "astro-decap-plugin";

export default defineConfig({
  integrations: [
    DecapCMS({
      config: {
        backend: {
          name: "git-gateway",
          branch: "main",
        },
        collections: [
          // Content collections go here
        ],
      },
    }),
  ],
});
```

### Configuration options

You can pass an options object to the integration to configure how it behaves.

#### `adminPath`

**Type:** `string`  
**Default:** `'/admin'`

Determines the route where the Decap CMS admin dashboard will be available on your site.

Feeling nostalgic for WordPress? You could set this to `'/wp-admin'`!

#### `config`

**Type:** `CmsConfig`

This option is **required**. It allows you to configure Decap CMS with the
same options you would use when using Decap CMS’ `config.yml` file format.

You can see [a full list of configuration options in the Decap CMS docs](https://www.netlifycms.org/docs/configuration-options/).

At a minimum, you _must_ set the `backend` and `collections` options:

```js
config: {
  // Use Netlify’s “Git Gateway” authentication and target our default branch
  backend: {
    name: 'git-gateway',
    branch: 'main',
  },
  collections: [
    // Define a blog post collection
    {
      name: 'posts',
      label: 'Blog Posts',
      folder: 'src/pages/posts',
      create: true,
      delete: true,
      fields: [
        { name: 'title', widget: 'string', label: 'Post Title' },
        { name: 'body', widget: 'markdown', label: 'Post Body' },
      ],
    },
  ],
};
```

#### `previewStyles`

**Type:** `Array<string | [string, { raw: true }]>`

Sets custom CSS styles to apply in the Netlify CMS preview pane.

You can provide URLs to external CSS stylesheets (Google Fonts for example), paths to local CSS files in your project, or even raw CSS strings:

```js
previewStyles: [
  // Path to a local CSS file, relative to your project’s root directory
  "/src/styles/main.css",
  // An npm module identifier
  "@fontsource/roboto",
  // A URL to an externally hosted CSS file
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap",
  // Raw CSS!
  ["p { color: red; }", { raw: true }],
];
```

#### `disableIdentityWidgetInjection`

**Type:** `boolean`  
**Default:** `false`

By default, `astro-decap-plugin` injects Netlify’s [Identity Widget](https://github.com/netlify/netlify-identity-widget) across your site to enable authentication. If you only want to inject the widget on the admin route, you can set `disableIdentityWidgetInjection: true`.

#### Shoutout to:

Forked from [astro-netlify-cms](https://github.com/delucis/astro-netlify-cms)
