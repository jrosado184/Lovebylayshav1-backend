import server from "./server.js";
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("localhost+2-key.pem"),
  cert: fs.readFileSync("localhost+2.pem"),
};

const port: any = process.env.PORT || 9000;
https.createServer(options, server).listen(port, () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
});
