import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { S3Util, urlToKey } from "../utils";
import { NoSuchKey } from "@aws-sdk/client-s3";
import type { NoteData } from "../types";
import { $noteData } from "../notesDataStore";

export const server = {
  notes: {
    lookup: defineAction({
      accept: "form",
      input: z.object({
        liUrl: z.string().url(),
      }),
      handler: async ({ liUrl }, ctx) => {
        const auth = ctx.locals.auth();
        const userId = auth.userId || "";
        if (!userId) {
          // TODO: check the usage of the returnBackUrl param to redirectToSignIn
          //       https://clerk.com/docs/references/nextjs/auth#redirect-to-sign-in
          auth.redirectToSignIn({});
        }

        const s3 = new S3Util();
        const objectKey = `${userId}/${urlToKey(liUrl)}`;
        let noteData: NoteData = {
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
          $noteData.set(noteData);
          result = { success: true, data: noteData };
        } catch (error) {
          // TODO better error handling
          if (error instanceof NoSuchKey) {
            console.warn(`A note having key "${objectKey}" was not found.`);
            result = { success: false, data: noteData };
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
        notes: z.string(),
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
        $noteData.set(data);
        return { success: true };
      },
    }),
  },
};
