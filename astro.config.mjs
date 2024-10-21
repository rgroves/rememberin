// @ts-check
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from "@clerk/astro";
import { defineConfig, envField } from 'astro/config';

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
        CLERK_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
        PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({ context: "server", access: "secret" })
      }
    }
  },
  integrations: [clerk(), react()],
  output: "hybrid",
});
