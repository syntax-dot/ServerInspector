const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');


const interval = 6; // hours
// const intervalMs = interval * 1000 * 60 * 60;
const intervalMs = 10000; // ms

async function wait(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function useBatRunner() {
  let currentBat;
  let startTime;
  const killSignal = 'SIGKILL'
  const id = (Math.random() * 10).toFixed(0);

  function start() {
    currentBat = spawn('cmd.exe', ['/c', 'server.ping.bat']);
    // TODO try catch
    startTime = Date.now()
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

  function getStartTime() {
    return startTime
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
    stop,
    getStartTime
  }
}

const { start, stop, getStartTime } = useBatRunner()

async function run() {
  start()

  while (true) {
    handleTick();
    await wait();
  }

}

async function handleTick() {
  if (Date.now() - getStartTime() < intervalMs) {
    return
  }

  stop()

  await wait(1000)

  start()
}

run();
