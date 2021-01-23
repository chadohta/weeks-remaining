const moment = require('moment');

// returns an array of GridNodes that represents the weeks
// in a persons life that have already passed
export function getPassedWeeks(grid, birthday) { 
    const passedWeeks = [];
    if (!validateBirthday(birthday)) return passedWeeks;

    const yearsPassed = getYears(birthday);
    for (let i = 0; i < yearsPassed; i++) { 
        for (let j = 0; j < 52; j++) { 
            passedWeeks.push(grid[i][j]);
        }
    }

    const weeksPassed = getWeeks(birthday, yearsPassed);
    for (let i = 0; i < weeksPassed; i++) { 
        passedWeeks.push(grid[yearsPassed][i]);
    }
    return passedWeeks;
}

// validates the input birthday
function validateBirthday(birthday) { 
    let bday = moment(birthday, 'MM/DD/YYYY', true);
    let lowerBound = moment().subtract(80, 'y');
    let upperBound = moment();

    if (bday.isSameOrBefore(lowerBound)) { 
        alert("You have lived longer than the average human life span (80 years)! That's awesome!");
        return false;
    }
    if (bday.isAfter(upperBound)) { 
        alert("You have not been born yet!");
        return false;
    }
    return true;
}

// returns the number of years that have passed in a person's life
function getYears(birthday) { 
    let date = moment(birthday, 'MM/DD/YYYY', true);
    const lastYearToday = moment().subtract(1, 'y');

    let yearsPassed = 0;
    while (date.isSameOrBefore(lastYearToday)) {
        date.add(1, 'y');
        yearsPassed++;
    }
    return yearsPassed;
}

// returns the number of weeks that have passed in a person's life
// since their last birthday
function getWeeks(birthday, yearsPassed) { 
    let date = moment(birthday, 'MM/DD/YYYY', true).add(yearsPassed, 'y');
    let dateFormatted = date.clone().format('MM/DD/YYYY');

    let daysToAdd = getNearestSunday(dateFormatted);
    const lastSunday = moment().add(daysToAdd - 7, 'd'); // nearest sunday, minus one week

    let weeksPassed = 0;
    while (date.isSameOrBefore(lastSunday)) {
        date.add(7, 'd');
        weeksPassed++;
    }
    return weeksPassed;
}

// returns the number of days from the closest sunday
function getNearestSunday(date) { 
    let currDate = moment(date, 'MM/DD/YYYY', true);
    let day = currDate.clone().format('dddd');
    let daysToAdd = 0;
    while (day !== "Sunday") { 
        daysToAdd++;
        currDate.add(1, 'd');
        day = currDate.clone().format('dddd');
    }
    // either add to get to next sunday
    // or subtract to get to previous sunday (whichever is closer)
    return daysToAdd <= 3 ? daysToAdd : (7 - daysToAdd) * -1;
}
