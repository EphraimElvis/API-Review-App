const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.log(bind + " require elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.listen(port, () => {
  console.log(`App Listening on port ${port}`);
});
