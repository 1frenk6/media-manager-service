import { s3Client } from "../client";

export default function buildS3Url(bucket: string, key: string) {
  return `${s3Client.config.endpoint}/${bucket}/${key}`;
}
