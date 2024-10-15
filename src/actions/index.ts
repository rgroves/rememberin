import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { S3Util, urlToKey } from "../utils";

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

        const { liUrl, liName, notes } = input;

        const s3 = new S3Util();
        // await s3.listBuckets();
        // const data = await s3.getBucketObject({ objectKey: "test" });
        // console.log(">>> AWS Bucket Object: test\n");
        // console.log(await data.Body.transformToString());
        // console.log("<<< AWS Bucket Object: test\n");

        const objectKey = urlToKey(liUrl);
        const data = { url: liUrl, name: liName, notes: notes };
        console.log({ liUrl, objectKey, data });
        const result = await s3.putBucketObject({ objectKey, data });
        console.log({ result });
        return "ok";
      },
    }),
  },
};
