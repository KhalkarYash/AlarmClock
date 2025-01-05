let currentTime = document.querySelector(".currentTime");
let getDate = document.querySelector("#getDate");
let getTime = document.querySelector("#getTime");
let btn = document.querySelector(".btn");
let upcomingAlarms = document.querySelector(".upcomingAlarms");
var audio = new Audio("./alarm.mp3");

setInterval(function getCurrentTime() {
  let curr = new Date();
  let hrs = curr.getHours();
  let min = String(curr.getMinutes()).padStart(2, "0");
  let sec = String(curr.getSeconds()).padStart(2, "0");
  let period = "AM";

  if (hrs >= 12) {
    period = "PM";
    if (hrs > 12) {
      hrs -= 12;
    }
  }

  hrs = String(hrs).padStart(2, "0");
  currentTime.textContent = `${hrs}:${min}:${sec} ${period}`;
  checkAlarms(curr);
}, 1000);

btn.addEventListener("click", () => {
  let dateValue = getDate.value;
  let timeValue = getTime.value;

  if (!dateValue || !timeValue) {
    Swal.fire({
      icon: "error",
      title: "Missing Input",
      text: "Please select both date and time.",
    });
    return;
  }

  let cDate = new Date();
  let selectedDateTime = new Date(`${dateValue}T${timeValue}`);

  if (selectedDateTime.getTime() > cDate.getTime()) {
    let alarm = {
      id: Date.now(),
      date: selectedDateTime,
      time: timeValue,
    };

    saveAlarmToLocalStorage(alarm);
    displayUpcomingAlarms();
    getDate.value = "";
    getTime.value = "";
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid Date/Time",
      text: "Please select a future date and time.",
    });
  }
});

function saveAlarmToLocalStorage(alarm) {
  let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms.push(alarm);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function deleteAlarm(alarmId) {
  let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  alarms = alarms.filter((alarm) => alarm.id !== alarmId);
  localStorage.setItem("alarms", JSON.stringify(alarms));
  displayUpcomingAlarms();
}

function displayUpcomingAlarms() {
  upcomingAlarms.innerHTML = "";
  let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

  alarms.forEach((alarm) => {
    let alarmItem = `
      <div id="${alarm.id}">
        <div>
          Alarm set for: ${new Date(alarm.date).toLocaleString()}
          <button class="deleteBtn"onclick="deleteAlarm(${
            alarm.id
          })"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;
    upcomingAlarms.innerHTML += alarmItem;
  });
}

function checkAlarms(currentTime) {
  let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

  alarms.forEach((alarm) => {
    let alarmTime = new Date(alarm.date);

    if (currentTime >= alarmTime) {
      audio.play().catch((error) => {
        document.body.addEventListener("click", () => {
          audio.play();
        });
      });

      Swal.fire({
        icon: "info",
        title: "Alarm!",
        text: `It's time for your alarm set for ${alarmTime.toLocaleString()}`,
      });

      deleteAlarm(alarm.id);
    }
  });
}

document.addEventListener("DOMContentLoaded", displayUpcomingAlarms);
