import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { S3Util, urlToKey } from "../utils";

export const server = {
  notes: {
    save: defineAction({
      accept: "form",
      input: z.object({
        userId: z.string(),
        liUrl: z.string().url(),
        liName: z.string().trim().min(1),
        notes: z.optional(z.string()),
      }),
      handler: async ({ userId, liUrl, liName, notes }, ctx) => {
        const s3 = new S3Util();
        const objectKey = `${userId}/${urlToKey(liUrl)}`;
        const data = {
          userId,
          url: liUrl,
          name: liName,
          notes: notes,
        };
        const result = await s3.putBucketObject({ objectKey, data });
        return { success: true };
      },
    }),
  },
};
