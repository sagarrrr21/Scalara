// id - 7ehsoahdkf34nksn2228y3skdhdflpo6a
// secret - slfhdsnfsmi123sfkd98dg732ndspp1pksafdb98nksdf9u2nnfskd
// endpoint - https://skdhfkanams083nsdnfksmamsf.s3.aws.com

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();
uploadFile(
  "dist/ouput/wesfd/package.json",
  "/Users/saagrrr21/vercel/dist/output/wesfd/package.json"
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl; // github.com/sagarrr21/react-code
  const id = generate(); // lkj634
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const files = getAllFiles(path.join(__dirname, `output/${id}`));

  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  // put this to S3
  publisher.lPush("build-queue", id);
  res.json({
    id: id,
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
