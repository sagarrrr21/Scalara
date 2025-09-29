import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: "7ehsoahdkf34nksn2228y3skdhdflpo6a",
  secretAccessKey: "slfhdsnfsmi123sfkd98dg732ndspp1pksafdb98nksdf9u2nnfskd",
  endpoint: "https://skdhfkanams083nsdnfksmamsf.s3.aws.com",
});

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;

  const id = host.split(".")[0];
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercel",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  res.send(contents.Body);
});

app.listen(3001);
