import server from "./server"

const port = process.env.PORT || 9000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


