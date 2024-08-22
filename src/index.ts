import server from "./server.js";
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("/Users/javierrosado/Desktop/my-server-key.pem"),
  cert: fs.readFileSync("/Users/javierrosado/Desktop/my-server-cert.pem"),
  ca: fs.readFileSync("/Users/javierrosado/Desktop/my-ca-cert.pem"),
};

const port: any = process.env.PORT || 9000;
https.createServer(options, server).listen(port, () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
});
