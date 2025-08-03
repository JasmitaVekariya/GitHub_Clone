const yargs  = require("yargs");
const {hideBin} = require("yargs/helpers"); 

const {initRepo} = require("./controllers/init.js"); // Importing the initRepo function from the init.js file in controllers directory
const {addRepo} = require("./controllers/add.js"); 
const {pullRepo} = require("./controllers/pull.js"); 
const {pushRepo} = require("./controllers/push.js"); 
const {commitRepo} = require("./controllers/commit.js"); 
const {revertRepo} = require("./controllers/revert.js"); 

yargs(hideBin(process.argv)).command('init',"Initialise a new repository",{},initRepo)
                            .command('add <file>',"Add a new repository",(yargs)=>{
                                yargs.positional('file',{
                                    describe: 'File to add',
                                    type: 'string'
                                });
                            },
                            (argv)=>{ addRepo(argv.file); }) // This will call the addRepo function with the file argument
                            .command('commit <message>', "commit a repository", (yargs) => {
                                yargs.positional('message', {
                                    describe: 'commit message',
                                    type: 'string'
                                });
                            }, (argv) => commitRepo(argv.message)) // This will call the commitRepo function with the message argument
                            .command('pull',"pull a repository",{},pullRepo)
                            .command('push',"push a repository",{},pushRepo)
                            .command('revert <commit_id>',"revert a command",(yargs)=>{
                                yargs.positional('commit_id',{
                                    describe: 'commit id to revert to',
                                    type: 'string'
                                });
                            }, (argv) => revertRepo(argv.commit_id))
                            .demandCommand(1,"You must provide a command").help().argv; 
//arg Which come from terminal is fetched by process.argv and hidebin is used to hide the first two arguments which are not required
// command is used to define a command with its description when help runs

