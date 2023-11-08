const notifier = require('node-notifier'); // package untuk show notifikasi windows
const moment = require('moment'); // package untuk handle manipulasi durasi waktu
const argTime = process.argv.slice(2); // untuk mendapatkan argumen dari console (skip 2 argumen pertama dengan slice())

const POMODORO_DURATION = argTime[0]; // waktu bekerja, diambil dari argumen ke 1
const BREAK_DURATION = argTime[1]; // waktu istirahat, diambil dari argumen ke 2

let isWorking = false; // indikator bekerja atau tidak
let remainingTime = 0; // waktu yang tersisa untuk setiap state (working/break)

// fungsi untuk generate waktu dalam format : HH:MM:SS 
function formatingTime(totalSecond) {
    const duration = moment.duration(totalSecond, 'seconds');
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function startTimer(duration) {
    isWorking = !isWorking;
    remainingTime = duration * 60;

    const timer = setInterval(() => {
        remainingTime--;

        const formatedTime = formatingTime(remainingTime);

        console.log(`${isWorking ? 'Working' : 'Break'} ${formatedTime}`);

        if (remainingTime == 0) {
            clearInterval(timer);

            notifier.notify({
                title : isWorking ? 'Break Time!' : 'Working Time!',
                message :  isWorking ? 'Good Work!' : 'Good Break!',
                sound : true,
                wait : true
            });

            startTimer(isWorking ? BREAK_DURATION : POMODORO_DURATION);

        }
    }, 1000);
}

startTimer(POMODORO_DURATION);