const validator = require("validator");
const config = require("./config");
const commands = config.commands;
const MAX = config.MAX_RANGE;

//#region Service Methods
const helpers = {
  validateArguments: function(lstOfArgs) {
    var hasPlaceCommand = false;
    var sMessage = "";

    if (!lstOfArgs || !lstOfArgs.length) {
      sMessage = "Please provide a list of commands.";
    } else if (lstOfArgs && lstOfArgs.length > 1) {
      for (var i = 0; i < lstOfArgs.length; i++) {
        var prevArg = i - 1 >= 0 ? lstOfArgs[i - 1].toString() : "";
        var arg = lstOfArgs[i].toString();
        var coords = arg && arg.length ? arg.split(",") : [];
        var bPrevPlaceCommand = false;

        // Check If Place Command
        if (arg.toUpperCase().indexOf("PLACE") > -1) {
          hasPlaceCommand = true;
        }

        // Check If Previous Command was PLACE
        if (
          prevArg &&
          prevArg.length &&
          prevArg.toUpperCase().indexOf("PLACE") > -1
        ) {
          bPrevPlaceCommand = true;
        }

        // Check If Valid Coordinate Command
        if (bPrevPlaceCommand && coords && coords.length < 3) {
          sMessage = "You Have Invalid Coordinates For A Place Command.";
        }

        // Check If Valid Command
        else if (
          validator.isEmpty(arg) ||
          (!bPrevPlaceCommand && commands.indexOf(arg.toUpperCase()) === -1)
        ) {
          sMessage = "You Have Invalid Commands";
        }

        // Display Error Message If Any
        if (!validator.isEmpty(sMessage)) {
          console.log("Invalid Command: ", arg);
          return sMessage;
        }
      }

      if (!hasPlaceCommand) {
        sMessage = "There needs to be a single PLACE command.";
      }
    } else {
      sMessage = "List Of Commands Needs To Be Greater Than One.";
    }

    return sMessage;
  },
  report: function(pacman) {
    if (pacman != null) {
      console.log("PACMAN IS FACING: ", pacman.face);
      console.log("COORDINATES: ", pacman.x, pacman.y);
    }
  },
  rotate: function(pacman, dir) {
    if (pacman != null) {
      const face = pacman.face;

      switch (face) {
        case "NORTH":
          return (pacman.face = dir === "RIGHT" ? "EAST" : "WEST");
        case "EAST":
          return (pacman.face = dir === "RIGHT" ? "SOUTH" : "NORTH");
        case "SOUTH":
          return (pacman.face = dir === "RIGHT" ? "WEST" : "EAST");
        case "WEST":
          return (pacman.face = dir === "RIGHT" ? "NORTH" : "SOUTH");
      }
    }
    return pacman;
  },
  move: function(pacman) {
    if (pacman != null) {
      if (boundaryCheck(pacman)) {
        switch (pacman.face) {
          case "NORTH":
            pacman.y += 1;
            break;
          case "EAST":
            pacman.x += 1;
            break;
          case "SOUTH":
            pacman.y -= 1;
            break;
          case "WEST":
            pacman.x -= 1;
            break;
        }
      }
    }
    return pacman;
  }
};
//#endregion

//#region Helpers
function boundaryCheck(pacman) {
  const x = pacman.x,
    y = pacman.y,
    face = pacman.face;

  switch (face) {
    case "NORTH":
      return y + 1 <= MAX;
    case "EAST":
      return x + 1 <= MAX;
    case "SOUTH":
      return y - 1 >= 0;
    case "WEST":
      return x - 1 >= 0;
  }
  return false;
}
//#endregion

module.exports = helpers;
