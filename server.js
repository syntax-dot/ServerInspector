const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');


const interval = 6 // hours

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
      console.log('stdout', data.toString());
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
    start,
    stop
  }
}

const { start, stop } = useBatRunner()

async function run() {
  let currentTime = Date.now();
  const startTime = currentTime
  // const intervalMs = interval * 1000 * 60 * 60;
  const intervalMs = 10000;

  start()
  console.log('start run');

  while (currentTime - startTime < intervalMs) {
    currentTime = Date.now();
    console.log('currentTime', new Date(currentTime).toISOString().substring(11, 16));
    await wait();
  }

  stop()
  console.log('stop run');
  await wait(1000);

  run();
}

run();
