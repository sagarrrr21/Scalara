import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "7ehsoahdkf34nksn2228y3skdhdflpo6a",
  secretAccessKey: "slfhdsnfsmi123sfkd98dg732ndspp1pksafdb98nksdf9u2nnfskd",
  endpoint: "https://skdhfkanams083nsdnfksmamsf.s3.aws.com",
});

// filename => output/12321/src/App.jsx
// filePath => /Users/sagar/vercel/dist/output/12321/src/App.jsx
export const uploadFile = async (filename: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel001",
      Key: filename,
    })
    .promise();
};
