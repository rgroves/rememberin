import { defineAction } from "astro:actions";
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";

const AWS_ACCESS_KEY_ID = getSecret("AWS_ACCESS_KEY_ID");
const AWS_ENDPOINT_URL_S3 = getSecret("AWS_ENDPOINT_URL_S3");
const AWS_REGION = getSecret("AWS_REGION");
const AWS_SECRET_ACCESS_KEY = getSecret("AWS_SECRET_ACCESS_KEY");
const BUCKET_NAME = getSecret("BUCKET_NAME");

export const server = {
  notes: {
    save: defineAction({
      accept: "form",
      input: z.object({
        liUrl: z.string().url(),
        liName: z.string().trim().min(1),
        notes: z.optional(z.string()),
      }),
      handler: async (input) => {
        console.log("in action");
        console.log(input);
        return "ok";
      },
    }),
  },
};
