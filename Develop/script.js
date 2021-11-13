let currentDayEl = document.getElementById('currentDay');
let timeblocksContainerEl = document.getElementById('timeblocks-container');

// when you open the planner/refresh the page

// current day is added to header, formatted: Thursday, September 5th
document.querySelector('#currentDay').textContent = moment().format('dddd, MMMM Do');

// based on current time, loop through adding timeblocks with appropriate classes
// will need some conditional check time logic, compare to current time
const buildTimeBlockEl = function() {
    const timeblockEl = document.createElement('div');
    timeblockEl.classList.add('row', 'time-block');

    timeblockEl.appendChild(document.createElement('div')).classList.add('hour', 'col-md-1');
    timeblockEl.appendChild(document.createElement('textarea')).classList.add('description', 'col-md-10');
    timeblockEl.appendChild(document.createElement('button')).classList.add('saveBtn', 'col-md-1');
    
    timeblockEl.querySelector('.saveBtn').innerHTML = '<i class="fas fa-save"></i>';

    return timeblockEl;
}

// generate empty timeblocks
const dayStart = 9;
const dayLength = 8;

for (let i = 0; i < dayLength + 1; i++) {
    let currentTimeBlockEl = buildTimeBlockEl();
    timeblocksContainerEl.append(currentTimeBlockEl);

}

// collect timeblocks in array
const timeBlocksArr = Array.from(document.getElementsByClassName('time-block'));
console.log(timeBlocksArr);

// add hour to timeblocks
for (let i = 0; i < timeBlocksArr.length; i++) {
    let beforeNoon = true;
    let currentHour = dayStart + i;
    const currentTimeBlockEl = timeBlocksArr[i];
    const currentHourEl = timeBlocksArr[i].querySelector('.hour');

    if (currentHour >= 12) {
        // nifty formula for converting to 12 hour clock
        currentHour = ((currentHour + 11) % 12 + 1);
        beforeNoon = false;
    }

    if (beforeNoon) {
        currentTimeBlockEl.setAttribute('id', 'hour-' + currentHour +'-am');
    } else {
        currentTimeBlockEl.setAttribute('id', 'hour-' + currentHour +'-pm');
    }

    currentHourEl.textContent = currentHour + ':00';
}

// get current time
const now = moment();

// add color to timeblocks
for (let i = 0; i < timeBlocksArr.length; i++) {
    // get textarea for color change
    const currentTextarea = timeBlocksArr[i].querySelector('textarea');
    
    // get id
    const currentId = timeBlocksArr[i].getAttribute('id');
    let currentHour = parseInt(currentId.split('-')[1]);

    // convert to military time for comparison
    if ((currentId.split('-')[2] === 'pm') && (currentHour != 12)) {
        currentHour += 12;
    }

    // parse hour of time now in 24H format
    const nowHour = parseInt(now.format('H'));

    // debugger;
    // set temporal state
    if (currentHour < nowHour) {
        currentTextarea.classList.add('past');
    } else if (currentHour > nowHour) {
        currentTextarea.classList.add('future');
    } else {
        currentTextarea.classList.add('present');
    }
}

// load descriptions to timeblocks if saved in local storage
for (let i = 0; i < timeBlocksArr.length; i++) {
    const currentTimeBlockEl = timeBlocksArr[i];
    const currentId = timeBlocksArr[i].getAttribute('id');

    // get textarea for description
    const currentDescription = timeBlocksArr[i].querySelector('.description');


    // check key in localStorage
    if (localStorage.getItem(currentId)) {
        currentDescription.textContent = localStorage.getItem(currentId);
    }
}

// interactive functionality
// on saveBtn click/submit, update localStorage
timeblocksContainerEl.addEventListener('click', function(event) {
    if (event.target.matches('.fa-save')) {
        // console.log(event.target.parentElement.parentElement);
        console.log(event.target.closest('.time-block'));

        // get parent timeblock
        const clickedTimeBlockEl = event.target.closest('.time-block');

        // get timeblock id
        const clickedTimeBlockId = clickedTimeBlockEl.getAttribute('id');

        // get timeblock description element
        const clickedTimeBlockDescriptionEl = clickedTimeBlockEl.querySelector('.description');

        // set new saved description to local storage
        localStorage.setItem(clickedTimeBlockId, clickedTimeBlockDescriptionEl.value);
    }
});