const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');


const interval = 0.1 // hours

async function wait(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function useBatRunner() {
  let currentBat;
  const id = (Math.random() * 10).toFixed(0);
  console.log('id', id);

  const killSignal = 'SIGKILL'

  function start() {
    currentBat = spawn('cmd.exe', ['/c', 'server.ping.bat']);
    console.log('start', id);

    currentBat.stdout.on('data', (data) => {
      // console.log('stdout', data.toString());
    });

    currentBat.stderr.on('data', (data) => {
      console.log('stderr', data.toString());
    });

    currentBat.stdin.on('data', (data) => {
      console.log('stdin', data.toString());
    });
  }

  function stop() {
    currentBat.stdout.destroy();
    currentBat.stderr.destroy();

    try {
      currentBat.kill(killSignal);
    } catch (e) {
      console.log('error', e);
    }

    console.log('kill', id);
  }

  return {
    getTimestamp,
    start,
    stop
  }
}

const { start, stop, getTimestamp } = useBatRunner()

async function run() {
  let currentTime = Date.now();
  const startTime = currentTime
  const intervalMs = interval * 1000 * 60 * 60;
  // const stopTime = currentTime + 20000;
  // console.log('stopTime', new Date(stopTime).toISOString().substring(11, 16));

  start()
  console.log('start run');

  while (currentTime - startTime < intervalMs) {
    currentTime = getTimestamp();
    console.log('currentTime', new Date(currentTime).toISOString().substring(11, 16));
    await wait();
  }

  stop()
  console.log('stop run');
  await wait(1000);

  run();
}

run();
