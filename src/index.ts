import server from "./server.js";

const port: any = process.env.PORT || 9000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on port ${port}`);
});
