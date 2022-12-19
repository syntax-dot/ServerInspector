const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');


const interval = 5 // hours

async function wait(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function useBatRunner() {
  let currentBat;
  const id = (Math.random() * 10).toFixed(0)
  console.log('id', id);

  function getTimestamp() {
    return Date.now()
  }

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
    currentBat.stdin.pause();
    currentBat.stdout.pause();
    currentBat.stderr.pause();
    currentBat.kill();

    console.log('stop', id);
  }

  return {
    getTimestamp,
    start,
    stop
  }
}

const { start, stop, getTimestamp } = useBatRunner()

async function run() {
  let currentTime = getTimestamp();
  // const stopTime = currentTime + (interval * 1000 * 60 * 60);
  const stopTime = currentTime + 2000;
  start()
  console.log('start run');

  while (currentTime < stopTime) {
    currentTime = getTimestamp();
    console.log(currentTime);
    await wait()
  }

  stop()
  console.log('stop run');
  await wait(100)
  // run()
}

run()
