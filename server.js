const { spawn } = require('child_process');

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf16le');
const bat = spawn('cmd.exe', ['/c', 'server.ping.bat']);

const interval = 5 // minutes
const debounceTime = 1 // minutes
const infoMassageBeforeRestart = 1 // minutes

function convertMinuteToMs(minutes = 1) {
  return minutes * 60000
}

function startInspect(rebootInterval = 5) {
  const startTimestamp = Date.now()
  const stopTimestamp = startTimestamp + (convertMinuteToMs(rebootInterval))
  const timestampBeforeRestart = convertMinuteToMs(infoMassageBeforeRestart)

  serverInspect(stopTimestamp, timestampBeforeRestart)
}

function getCurrentTimestamp() {
  return Date.now()
}

function debounce(f, ms = 1) {
  let isCooldown = false;

  return function() {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms * 60000);
  };
}

// function serverInspect(stopTimestamp, informationBeforeRestart) {
//   // const currentTimestamp = debounce(() => getCurrentTimestamp(), 1)
//   const currentTimestamp = getCurrentTimestamp()

//   console.log(currentTimestamp, currentTimestamp);
//   console.log(currentTimestamp, stopTimestamp);

//   if (currentTimestamp && currentTimestamp <= stopTimestamp) {


//     if (currentTimestamp >= stopTimestamp - informationBeforeRestart) {
//       console.log(`До перезапуска сервера осталось ${informationBeforeRestart} минут!`);
//     }
      
//     bat.stdout.on('data', (data) => {
//       console.log(data.toString());
//     });

//     bat.stderr.on('data', (data) => {
//       console.log(`stderr: ${data}`);
//     });

//     bat.on('exit', (code) => {
//       console.log(`Child exited with code ${code}`);
//     });
//   }

//   else {
//     console.log('Сервер перезапускается')
//     bat.kill()
//   }

// }

function executeBat() {
      bat.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });
}

function serverInspect(stopTimestamp, timeBeforeRestart) {
  let isRunning = true;

  while (isRunning) {
    const currentTimestamp = debounce(() => getCurrentTimestamp, 1)
    // const currentTimestamp = setInterval(() => getCurrentTimestamp, 1 * 60000) 
    const timeToReboot = ((currentTimestamp - stopTimestamp) / 60000).toFixed(2)

    executeBat()

    if (currentTimestamp >= stopTimestamp) {
      isRunning = false;
    }

    if (currentTimestamp >= stopTimestamp - timeBeforeRestart) {
      console.log(`До перезапуска сервера осталось ${timeBeforeRestart} минут!`);
    }
    
    // console.log(`До перезапуска сервера осталось ${timeToReboot} минут!`);
  }

  console.log('Сервер перезапускается')
  bat.kill()

  isRunning = true
}


startInspect(interval)
