const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');


const interval = 5 // minutes

function convertMinuteToMs(minutes = 1) {
  return minutes * 60000
}

async function wait(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function run() {
  const stopTime = getStartTime() + (6 * 1000 * 60 * 60);
  let currentTime;
  let isRunning = true;

  while (isRunning) {
    currentTime = Date.now();
    await wait();

    if (currentTime < stopTime) {
      useBatRunner().start()
    }

    else {
      useBatRunner().stop()
      isRunning = false
      await wait(100)
      isRunning = true
    }
  }
}

function useBatRunner() {
  let currentBat;

  function getStartTime() {
    return Date.now()
  }

  function start() {
    currentBat = spawn('cmd.exe', ['/c', 'server.ping.bat']);

    currentBat.stdout.on('data', (data) => {
    console.log(data.toString());
    });
  }

  function stop() {
    currentBat?.kill()
  }

  return {
    getStartTime,
    start,
    stop
  }
}

const { start, stop, getStartTime } = useBatRunner()

run()
