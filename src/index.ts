import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";
import { hasSubscribers, subscribe } from "diagnostics_channel";
import { stat } from "fs";


const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();
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
  publisher.hSet("status", id, "uploaded");

  // const value = await publisher.hGet("status", id);

  res.json({
    id: id,
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);

  res.json({
    status: response,
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
