const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router.js"); 

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js"); // Importing the initRepo function from the init.js file in controllers directory
const { addRepo } = require("./controllers/add.js");
const { pullRepo } = require("./controllers/pull.js");
const { pushRepo } = require("./controllers/push.js");
const { commitRepo } = require("./controllers/commit.js");
const { revertRepo } = require("./controllers/revert.js");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start a new server", {}, startServer) // This will call the startServer function when the 'start' command is used
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a new repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  ) // This will call the addRepo function with the file argument
  .command(
    "commit <message>",
    "commit a repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => commitRepo(argv.message)
  ) // This will call the commitRepo function with the message argument
  .command("pull", "pull a repository", {}, pullRepo)
  .command("push", "push a repository", {}, pushRepo)
  .command(
    "revert <commit_id>",
    "revert a command",
    (yargs) => {
      yargs.positional("commit_id", {
        describe: "commit id to revert to",
        type: "string",
      });
    },
    (argv) => revertRepo(argv.commit_id)
  )
  .demandCommand(1, "You must provide a command")
  .help().argv;
//arg Which come from terminal is fetched by process.argv and hidebin is used to hide the first two arguments which are not required
// command is used to define a command with its description when help runs

function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;


  app.use("/", mainRouter); 


  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  const mongoURI = process.env.MONGO_URI;

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });

    const user = "test";

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    
    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log(`User ${user} has joined the room`);
            socket.join(userID);
        })
    });

    const db = mongoose.connection;
    db.once("open", async() => {
      console.log("Crud operations are ready to be performed");
    });

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

}
