// const S3 = new S3Client();
// console.log("\nlist buckets\n");
// console.log(await S3.send(new ListBucketsCommand()));
// const upload = new Upload({
//   params: {
//     Bucket: BUCKET_NAME,
//     Key: "test",
//     Body: JSON.stringify({
//       url: input.liUrl,
//       name: input.liName,
//       notes: input.notes,
//     }),
//     ContentType: "application/json",
//   },
//   client: S3,
// });
// await upload.done();

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSecret } from "astro:env/server";

const AWS_ACCESS_KEY_ID = getSecret("AWS_ACCESS_KEY_ID");
const AWS_ENDPOINT_URL_S3 = getSecret("AWS_ENDPOINT_URL_S3");
const AWS_REGION = getSecret("AWS_REGION");
const AWS_SECRET_ACCESS_KEY = getSecret("AWS_SECRET_ACCESS_KEY");
const BUCKET_NAME = getSecret("BUCKET_NAME");

function sanitizeBucketName(bucketName?: string | undefined) {
  let sourceBucket;

  if (typeof bucketName === "undefined") {
    sourceBucket = BUCKET_NAME;
  } else if (typeof bucketName !== "string") {
    sourceBucket = BUCKET_NAME;
    console.warn("Invalid bucket name supplied; Using default bucket name.");
  } else {
    sourceBucket = bucketName === "" ? BUCKET_NAME : bucketName;
  }

  return sourceBucket;
}

interface ObjectInfo {
  bucketName?: string | undefined;
  objectKey: string;
}

interface PutObjectInfo extends ObjectInfo {
  data: object;
}

export class S3Util {
  private _S3: S3Client = new S3Client();

  async listBuckets() {
    const buckets = await this._S3.send(new ListBucketsCommand());
    console.log(">>> AWS Buckets\n");
    console.log(buckets);
    console.log("<<< AWS Buckets\n");
  }

  deleteBucketObject({ bucketName, objectKey }: ObjectInfo) {
    const sourceBucket = sanitizeBucketName(bucketName);
    return this._S3.send(
      new DeleteObjectCommand({ Bucket: sourceBucket, Key: objectKey })
    );
  }

  getBucketObject({ bucketName, objectKey }: ObjectInfo) {
    let sourceBucket = sanitizeBucketName(bucketName);

    return this._S3.send(
      new GetObjectCommand({ Bucket: sourceBucket, Key: objectKey })
    );
  }

  putBucketObject({ bucketName, objectKey, data }: PutObjectInfo) {
    const destBucket = sanitizeBucketName(bucketName);
    const jsonData = JSON.stringify(data);

    return this._S3.send(
      new PutObjectCommand({
        Bucket: destBucket,
        Body: jsonData,
        Key: objectKey,
        ContentLength: jsonData.length,
        ContentType: "text/plain",
        ContentEncoding: "utf-8",
      })
    );
  }
}

export function urlToKey(url: string) {
  return url.replace(/https?:\/\/www\.linkedin\.com\/in\/([^/]*)\/?/, "$1");
}
