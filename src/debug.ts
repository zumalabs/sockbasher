let debugMode = false;

export function setDebug(mode: boolean = true) {
  debugMode = mode;
}

export default (...m: any[]) => {
  if (debugMode) {
    console.log(...m);
  }
};
