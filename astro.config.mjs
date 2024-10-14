// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  experimental: {
    env: {
      schema: {
        AWS_ACCESS_KEY_ID: envField.string({ context: "server", access: "secret" }),
        AWS_ENDPOINT_URL_S3: envField.string({ context: "server", access: "secret" }),
        AWS_REGION: envField.string({ context: "server", access: "secret" }),
        AWS_SECRET_ACCESS_KEY: envField.string({ context: "server", access: "secret" }),
        BUCKET_NAME: envField.string({ context: "server", access: "secret" }),
      }
    }
  },
  integrations: [react()],
  output: "hybrid",
});
