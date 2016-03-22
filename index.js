const fs = require("fs");
const path = require("path");
const promisify = require("./lib/promisify");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const defaultGpioDir = "/sys/class/gpio";

function Pin(options) {
  if(!options || !options.pinId) throw new Error("pinId option is required");
  validateDirection(options.direction);
  this.pinId = options.pinId;
  this.gpioDir = (options.gpioDir || defaultGpioDir);
  this.dir = path.join(this.gpioDir, "/gpio") + options.pinId;
  this.directionFile = path.join(this.dir, "direction");
  this.valueFile = path.join(this.dir, "value");
  this.exportsFile = path.join(this.gpioDir, "exports");
}

Object.assign(Pin.prototype, {
  init() {
    return this.export()
      .then(() => this.setDirection(this.direction));
  },

  export() {
    return writeFile(this.exportsFile, this.pinId);
  },

  read() {
    return readFile(this.valueFile)
      .then((result) => result === "0" ? false : true);
  },

  write() {
    if(this.direction === "in") throw new Error("Cannot write to input pin");
    return writeFile(this.valueFile, onOff ? "1" : "0");
  },

  setDirection(direction) {
    validateDirection(direction);
    this.direction = direction;
    return writeFile(this.directionFile, this.direction);
  }
});

function validateDirection(direction) {
  if(!direction || ["high", "low", "in", "out"].indexOf(direction) === -1) throw new Error("Invalid direction: " + direction);
}
