import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { S3Util, urlToKey } from "../utils";
import { NoSuchKey } from "@aws-sdk/client-s3";

export const server = {
  notes: {
    lookup: defineAction({
      accept: "form",
      input: z.object({
        liUrl: z.string().url(),
      }),
      handler: async ({ liUrl }, ctx) => {
        const auth = ctx.locals.auth();
        const userId = auth.userId;
        if (!userId) {
          // TODO: check the usage of the returnBackUrl param to redirectToSignIn
          //       https://clerk.com/docs/references/nextjs/auth#redirect-to-sign-in
          auth.redirectToSignIn({});
        }

        const s3 = new S3Util();
        const objectKey = `${userId}/${urlToKey(liUrl)}`;
        let noteData = {
          userId: userId,
          url: "",
          name: "",
          notes: "",
        };
        let result;

        try {
          const response = await s3.getBucketObject({ objectKey });
          const data = await response.Body.transformToString();
          noteData = JSON.parse(data) as NoteData;
          result = { success: true, data: noteData };
        } catch (error) {
          // TODO better error handling
          if (error instanceof NoSuchKey) {
            console.warn(`A note having key "${objectKey}" was not found.`);
            result = { success: false };
          } else {
            console.error(error);
            throw new ActionError({
              message: `Lookup error ${error}`,
              code: "INTERNAL_SERVER_ERROR",
            });
          }
        }

        console.log(result);
        return result;
      },
    }),

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
