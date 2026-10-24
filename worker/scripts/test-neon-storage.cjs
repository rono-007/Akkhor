const { S3Client, ListBucketsCommand, CreateBucketCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const endpoint = "https://br-small-cloud-b4ofouo5.storage.c-6.us-east-2.aws.neon.tech";
const accessKeyId = "nak_live_3fe1575ecef44d0884d266f8aae28ff4";
const secretAccessKey = "nsk_live_8bf4236b3fc37eb8d2170f2908656d860ab141e1586b5c4fad930ea948ece0c0";
const region = "us-east-2";

const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

async function main() {
  try {
    console.log("Connecting to Neon S3 Storage...");
    const bucketsRes = await s3.send(new ListBucketsCommand({}));
    console.log("Existing buckets:", bucketsRes.Buckets?.map(b => b.Name) || []);

    const targetBucket = "akshar-fonts";
    const bucketExists = bucketsRes.Buckets?.some(b => b.Name === targetBucket);

    if (!bucketExists) {
      console.log(`Creating bucket '${targetBucket}'...`);
      try {
        await s3.send(new CreateBucketCommand({ Bucket: targetBucket }));
        console.log(`Successfully created bucket '${targetBucket}'`);
      } catch (err) {
        console.warn(`Could not create '${targetBucket}', using default or checking error:`, err.message);
      }
    } else {
      console.log(`Bucket '${targetBucket}' already exists!`);
    }

    // Test test put/get
    console.log("Testing upload of a test file...");
    await s3.send(new PutObjectCommand({
      Bucket: targetBucket,
      Key: "test-akshar.txt",
      Body: "AKSHAR Bengali Typography Test",
      ContentType: "text/plain",
    }));
    console.log("Test file uploaded successfully!");
  } catch (err) {
    console.error("Neon S3 connection error:", err);
  }
}

main();
