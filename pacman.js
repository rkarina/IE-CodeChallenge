//#region Headers
const yargs = require("yargs");
const chalk = require("chalk");
const utils = require("./utils");
const validator = require("validator");
const config = require("./config");
//#endregion

//#region Global Variables, Constants And Enums
const colourEnum = config.colour;
var pacman = null;
//#endregion

/**
 * Start the pacman simulator.
 * 1. Ensure we have inputs from the command line.
 * 2. Validate every input.
 * 3. Proceed to process each input.
 * 4. Prompt end of simulator.
 * **/
StartSimulator();

//region Main Methods
function StartSimulator() {
  // Initialise
  DisplayMessage("Welcome to the Pacman Simulator!", colourEnum.Green);

  const lstOfArgs = yargs.argv._;

  // Validate Input
  const sMessage = utils.validateArguments(lstOfArgs);

  if (!validator.isEmpty(sMessage)) {
    DisplayMessage(sMessage, colourEnum.Red);
    return;
  }

  // Process Each Command
  ProcessCommands(lstOfArgs);
}

function ProcessCommands(lstOfArgs) {
  var bPlacePacman = false;

  lstOfArgs.forEach(arg => {
    var coords = arg.split(",");
    var arg = arg.toUpperCase();

    if (bPlacePacman) {
      pacman = {
        x: parseInt(coords[0]),
        y: parseInt(coords[1]),
        face: coords[2]
      };
      bPlacePacman = false;
    } else {
      switch (arg) {
        case "PLACE":
          bPlacePacman = true;
          break;
        case "MOVE":
          pacman = utils.move(pacman);
          console.log("MOVE | PACMAN DETAILS: ", pacman);
          break;
        case "LEFT":
        case "RIGHT":
          utils.rotate(pacman, arg);
          break;
        case "REPORT":
          utils.report(pacman);
          break;
      }
    }
  });
}
//#endregion

//#region Helpers
function DisplayMessage(sMessage, colour) {
  var msg = sMessage;

  // Assign Chalk Colour If Applied
  if (colour && colour > 0) {
    switch (colour) {
      case colourEnum.Green:
        msg = chalk.green(sMessage);
        break;
      case colourEnum.Yelllow:
        msg = chalk.yellow(sMessage);
        break;
      case colourEnum.Red:
        msg = chalk.red(sMessage);
        break;
    }
  }
  console.log(msg);
}
//#endregion
