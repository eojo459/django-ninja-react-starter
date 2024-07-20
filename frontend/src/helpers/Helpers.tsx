import dayjs, { Dayjs } from "dayjs";
import { DeleteCookies, } from "./Api";
import { getValidTimePeriod } from "./TimeGenerator";

// types
export type Holiday = {
    holiday_id: number;
    date: string;
    name: string;
}

// interfaces

// enums
export enum TimeStatus {
    CLOCKED_OUT = 1,
    CLOCKED_IN = 2,
    BREAK_START = 3,
    BREAK_END = 4,
    UNKNOWN = 5,
    OVERTIME_START = 6,
    OVERTIME_END = 7,
    AUTO_CLOCK_OUT = 8,
}

export enum TimeIndexDepth {
    Depth_1 = 1,
    Depth_2 = 2,
    Depth_3 = 3,
}

export enum TimesheetStatus {
    NOT_SUBMITTED = 1,
    SUBMITTED = 2,
    APPROVED = 3,
    PENDING_CHANGED = 4,
    DENIED = 5,
}

export enum BusinessPlanType {
    FREE = 1,
    TRIAL = 2,
    BASIC = 3,
    PRO = 4,
    ENTERPRISE = 5,
}

// format postal codes to be in the form 'A1B2C3'
export function formatPostalCode(postalCode: string) {
    // Remove non-alphanumeric characters
    const alphanumericValue = postalCode.replace(/[^A-Za-z0-9]/g, '');

    // Apply the postal code format "A1B2C3"
    const formattedValue = alphanumericValue
        .slice(0, 6) // Ensure the length does not exceed 6 characters
        .replace(/(\w{1})?(\w{1})?(\w{1})?(\w{1})?(\w{1})?(\w{1})?/, '$1$2$3 $4$5$6');

    return formattedValue.toUpperCase();
}

// format the date to be like 'YYYY-MM-DD'
export function formatDate(date: Date | null): string {
    if (date != null) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return "";
}


// check if time is null or empty
export function timeIsNullOrEmpty(time: string) {
    if (time == "" || time == null) {
        return true;
    }
    else {
        return false;
    }
}

export function isNullOrEmpty(value: any) {
    if (value == '' || value == null) {
        return true;
    }
    return false;
}

// get the day
export function getDay(date: Date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

export function startOfWeek(date: Date) {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;  // Adjust when day is Sunday
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + diff);
    return newDate;
}

export function endOfWeek(date: Date) {
    const day = date.getDay();
    const diff = (day === 0 ? 0 : 7) - day;  // Adjust when day is Sunday
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + diff);
    return newDate;
}

// check if date is within week range
export function isInWeekRange(date: Date, value: Date | null) {
    return value
        ? dayjs(date).isBefore(endOfWeek(value)) && dayjs(date).isAfter(startOfWeek(value))
        : false;
}

// get hours/minutes/period from the check in/out time
// timeEntry => string like 'HH:MM:SS'
export function splitTime(timeEntry: string | null, type: string) {
    if (timeEntry != null) {
        // Split the time string into an array of substrings
        //let [hourMinute, amPm] = timeEntry.split(" ");
        var timeSplit = timeEntry.split(":");
        switch(type) {
            case 'hours':
                switch(timeSplit[0]) {
                    case undefined:
                    case '':
                        return "";
                }
                return timeSplit[0];
            case 'minutes':
                switch(timeSplit[1]) {
                    case undefined:
                    case '':
                        return "";
                }
                return timeSplit[1];
            case 'period':
                var hours = timeSplit[0];
                if (isNaN(Number(hours)) || hours == '') {
                    return getValidTimePeriod()[0];
                }
                if (Number(hours) < 12) {
                    return "AM";
                }
                else {
                    return "PM";
                }
            default:
                return "";
        }
    }
    else {
        return "";
    }
}

// get hours/minutes/period from the check in/out time
// timeEntry => string like 'HH:MM A'
export function splitTimeAmPm(timeEntry: string | null, type: string) {
    if (timeEntry != null) {
        // Split the time string into an array of substrings
        let [hourMinute, amPm] = timeEntry.split(" ");
        var timeSplit = hourMinute.split(":");
        var hours = timeSplit[0];
        var minutes = timeSplit[1];
        switch(type) {
            case 'hours':
                switch(hours) {
                    case undefined:
                    case '':
                        return "--";
                }
                if (Number(hours) > 12) {
                    return (Number(hours) - 12).toString().padStart(2, '0');
                }
                return hours;
            case 'minutes':
                switch(minutes) {
                    case undefined:
                    case '':
                        return "--";
                }
                return minutes;
            case 'period':
                if (isNaN(Number(hours)) || hours == '') {
                    //return getValidTimePeriod()[0]; // get time period based on current time
                    return "--"
                }
                return amPm;
            default:
                return "";
        }
    }
    else {
        return "";
    }
}

// format time to be in the form HH:MM A
// HH:MM:SS => HH:MM A
export function formatTime(time: string | null) {
    if (time === "") {
        return "-- : --"; // placeholder
    }
    if (time == null) {
        return "";
    }
    
    var hours = Number(splitTime(time, 'hours'));
    var minutes = splitTime(time, 'minutes');
    var period = splitTime(time, 'period');

    // convert hours to 12 hours
    let current12Hour = (hours % 12 || 12).toString();
    return current12Hour + ":" + minutes + " " + period;
}

// create array chunks
export function chunk<T>(array: T[], size: number): T[][] {
    if (!array?.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

// generate a random UUID
export function GenerateUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// generate a random invalid UUID with a '#' infront
// symbolizes default data to be created on server if POSTED 
export function GenerateNullUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    return '#xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function GenerateColour() {
    // Pick a random color component value between 0 and 255
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    // Convert the color components to hexadecimal values
    let color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return color;
}

// calculate remaining seconds till end of shift
export function CalculateRemainingSeconds(shiftStart: string, shiftEnd: string) {
    if (shiftStart == null || shiftEnd == null) {
        return { remainingSeconds: -1, percentage: -1 };
    }

    const now = new Date();
    var shiftStartParts = shiftStart?.split(":");
    var shiftStartHours = parseInt(shiftStartParts[0]);
    var shiftStartMinutes = parseInt(shiftStartParts[1]);

    var shiftEndParts = shiftEnd?.split(":");
    var shiftEndHours = parseInt(shiftEndParts[0]);
    var shiftEndMinutes = parseInt(shiftEndParts[1]);

    var shiftStartDate = new Date();
    shiftStartDate.setHours(shiftStartHours, shiftStartMinutes, 0, 0);
    var shiftEndDate = new Date();
    shiftEndDate.setHours(shiftEndHours, shiftEndMinutes, 0, 0);

    // Check if the shift ends on the next day
    if (shiftStartDate > shiftEndDate) {
        shiftEndDate.setDate(shiftEndDate.getDate() + 1);
    }

    if (now < shiftEndDate) {
        // If the current time is before the end of the shift
        let elapsedTime, totalDuration;
        if (now < shiftStartDate) {
            elapsedTime = 0;
            totalDuration = shiftEndDate.getTime() - shiftStartDate.getTime();
        } else {
            elapsedTime = now.getTime() - shiftStartDate.getTime();
            totalDuration = shiftEndDate.getTime() - shiftStartDate.getTime();
        }
        const percentage = (elapsedTime / totalDuration) * 100;
        const diffInSeconds = Math.max(Math.floor((shiftEndDate.getTime() - now.getTime()) / 1000), 0);
        return { remainingSeconds: diffInSeconds, percentage };
    } 
    else {
        // If the shift has already ended
        return { remainingSeconds: 0, percentage: 0 };
    }
}

// update the time
export function updateTime() {
    const date = new Date();
    let hours = date.getHours();
    var hours_temp = hours;
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be treated as 12
    var formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return {formattedTime: formattedTime, hours: hours_temp}
};

// get the day of week from the given date
export function getDayOfWeek(dateString: string, type: string) {
    if (dateString !== undefined) {
        let daysOfWeek: any[] = [];
        switch(type) {
            case "short":
                daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                break;
            case "long":
                daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                break;
        }
        
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
        const dayIndex = date.getDay(); // sunday = 0, monday = 1

        return daysOfWeek[dayIndex];
    } 
    return "";
}

// get the formatted date "MMM-DD" from a given date
export function getFormattedDate(dateString: string | undefined, type: string) {
    if (dateString !== undefined) {
        let months: any[] = [];
        var dayChecked = false;
        switch(type) {
            case "short":
                months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                break;
            case "long":
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                break;
            case "day":
                dayChecked = true;
                break;
        }

        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const monthAbbreviation = months[date.getMonth()];
        const formattedDay = date.getDate();

        if (dayChecked) {
            return day;
        }

        return `${monthAbbreviation} ${formattedDay}`;
    }
    return "";
}


// format the time inside the time picker popover to be => HH:MM:SS
export function formatPopoverTime(value: string) {
    let [hourMinute, amPm] = value.split(" "); // HH:MM A
    var timeSplit = hourMinute.split(":"); // HH:MM
    let hoursInt = Number(timeSplit[0]);
    let minutes = timeSplit[1];
    let newTime = "";

    // rebuild the string combining all parts and convert into HH:MM:SS
    if (amPm == 'PM' && hoursInt < 12) {
        hoursInt = hoursInt + 12; // convert to 24 hours
    }

    // check if '12:-- AM' => convert to 00:MM:00 (12:-- AM) instead of 12:MM:00 (12:-- PM)
    if (amPm == 'AM' && hoursInt == 12) {
        newTime = "00:" + minutes + ":00"; // 00:MM:00
    }
    else {
        newTime = hoursInt + ":" + minutes + ":00"; // HH:MM:00
    }
    return newTime;
}

export function calculateDuration(start_time: string | null, end_time: string | null) : number {
    if (start_time == null || end_time == null) {
        return 0;
    }
    
    const today = new Date();
    const [startHour, startMinute, startSecond] = start_time.split(":").map(Number);
    const [endHour, endMinute, endSecond] = end_time.split(":").map(Number);

    const start_datetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute, startSecond);
    const end_datetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute, endSecond);

    const durationMilliseconds = end_datetime.getTime() - start_datetime.getTime();
    const durationHours = durationMilliseconds / (1000 * 60 * 60); // convert milliseconds to hours

    return durationHours;
}

// get the time type based on 0 or 1
export function getTimeType(timeType: number) {
    if (timeType === 0) {
        return "start";
    }
    else {
        return "end";
    }
}

// return the day of week based on day number
export function getDayOfWeekFromInt(day: number) {
    switch (day) {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
    }
}

// return the day of week number based on day name
export function getDayOfWeekInt(day: string) {
    switch (day) {
        case "Monday":
            return 0;
        case "Tuesday":
            return 1;
        case "Wednesday":
            return 2;
        case "Thursday":
            return 3;
        case "Friday":
            return 4;
        case "Saturday":
            return 5;
        case "Sunday":
            return 6;
        default:
            return 0;
    }
}

// format a timestamp from YYYY-MM-DDTHH:MM:SS TO HH:MM A/PM
export function formatTimestamp12Hours(timestamp: string) {
    var timestampDate = new Date(timestamp);
    
    // get time based on timezone and offset
    const localOffset = timestampDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localTime = new Date(timestampDate.getTime() - localOffset).toLocaleTimeString([], {hour12: false});

    return formatTime(localTime);
}

export function formatTimestampMonthDayYear(timestamp: string) {
    var timestampDate = new Date(timestamp);
    
    // get time based on timezone and offset
    const localOffset = timestampDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localTime = new Date(timestampDate.getTime() - localOffset).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

    return localTime;
}

// get current time in 24 hours
export function getCurrentTime() {
    const currentTime: Date = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    var time = `${hours}:${minutes}:${seconds}`;
    return time;
}

// get current time in 12 hours
export function getCurrentTime12Hours() {
    return formatTime(getCurrentTime());
}

// get the year from the date
export function getYearFromDate(date: string) {
    return new Date(date).getFullYear();
}

// return the date like 'May 25, 2024'
export function dateToWords(date: Date | string | undefined, type?: string, dayVisible?: boolean): string {
    if (date === undefined) return '';

    var months;
    if (type === 'short') {
        months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov", "De"
        ];
    }
    else {
        months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
    }

    var month;
    var day;
    var year;

    if (date instanceof Date) {
        month = months[date.getMonth()];
        day = date.getDate();
        year = date.getFullYear();
    }
    else if (typeof date == 'string') {
        var dateParts = date.split('-');
        month = months[Number(dateParts[1])];
        day = dateParts[2];
        year = dateParts[0];
    }
    else {
        return "";
    }

    if (dayVisible === false) {
        return `${month} ${year}`;
    }

    return `${month} ${day}, ${year}`;

    
}

// get the current timestamp
export function getCurrentTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const milliseconds = ('00' + date.getMilliseconds()).slice(-3);
    const timezoneOffset = -date.getTimezoneOffset() / 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = ('0' + Math.abs(timezoneOffset)).slice(-2);
    const offsetMinutes = ('0' + (Math.abs(timezoneOffset) % 1 * 60)).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

// get the timezone offset from the local client
export function getCurrentTimezoneOffset() {
    const date = new Date();
    const timezoneOffset = -date.getTimezoneOffset() / 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = ('0' + Math.abs(timezoneOffset)).slice(-2);
    const offsetMinutes = ('0' + (Math.abs(timezoneOffset) % 1 * 60)).slice(-2);

    return `${offsetSign}${offsetHours}:${offsetMinutes}`;
}

// convert time strings from HH:MM:SS to actual date objects to compare time
export function parseTimeString(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
}

// check if time1 < time2
export function isTimeLessThan(time1: any, time2: any): boolean {
    const date1 = parseTimeString(time1.toString());
    const date2 = parseTimeString(time2.toString());
    return date1 < date2;
}

// add days to a date
export function addDaysToDate(date: Date, days: number): Date {
    var newDate = new Date(date.getTime());
    newDate.setDate(date.getDate() + days);;
    return newDate;
}

// add hours to a date
export function addHoursToDate(date: Date, hours: number): Date {
    var newDate = new Date(date.getTime());
    newDate.setHours(date.getHours() + hours);
    return newDate;
}

// add minutes to a date
export function addMinutesToDate(date: Date, minutes: number): Date {
    var newDate = new Date(date.getTime());
    newDate.setMinutes(date.getMinutes() + minutes);
    return newDate;
}

// add seconds to a date
export function addSecondsToDate(date: Date, seconds: number): Date {
    var newDate = new Date(date.getTime());
    newDate.setSeconds(date.getSeconds() + seconds);
    return newDate;
}

// convert a date to a string
export function dateToTimeString(date: Date) {
    var hours =  String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}:00`;
}

// set the expiry date of a cookie
export function cookieExpiryDate(date: Date, numTillExpiry: number, type: string): string {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // set cookie expiry date
    var expiryDate = new Date(date.getTime());
    switch (type) {
        case "days":
            //expiryDate.setDate(expiryDate.getDate() + numTillExpiry);
            expiryDate = addDaysToDate(expiryDate, numTillExpiry);
            break;
        case "mins":
            //expiryDate.setDate(expiryDate.getMinutes() + numTillExpiry);
            expiryDate = addMinutesToDate(expiryDate, numTillExpiry);
            break;
        case "hours":
            //expiryDate.setDate(expiryDate.getHours() + numTillExpiry);
            expiryDate = addHoursToDate(expiryDate, numTillExpiry);
            break;
        case "seconds":
            //expiryDate.setDate(expiryDate.getSeconds() + numTillExpiry);
            expiryDate = addSecondsToDate(expiryDate, numTillExpiry);
            break;
    }
    
    const dayOfWeek = daysOfWeek[expiryDate.getUTCDay()];
    const day = String(expiryDate.getUTCDate()).padStart(2, '0');
    const month = months[expiryDate.getUTCMonth()];
    const year = expiryDate.getUTCFullYear();
    const hours = String(expiryDate.getUTCHours()).padStart(2, '0');
    const minutes = String(expiryDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(expiryDate.getUTCSeconds()).padStart(2, '0');

    return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

// get cookie by name if it exists
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export function getCookieV2(name: string) {
    var cookieValue;
    if (document.cookie.includes(";")) {
        cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
    }
    else {
        cookieValue = document.cookie
            .split(name + "=")[1]?.split(";")[0];
    }
    return cookieValue; 
}

// delete a cookie by setting its expiry to a past date
export async function deleteCookie(data: any, deleteOnServer: boolean) {
    document.cookie = `${data['cookie_name']}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    if (!deleteOnServer) return;
    
    // send request to delete cookie on server
    await DeleteCookies(data['user_uid'], data, data['access_token']);
};
  
// get current time as unix timestamp 8:30 PM => 1899484873
export function getCurrentUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
};

// format countdown time as HH:MM:SS or MM:SS or SS
export function formatCountdownTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (hours === 0 && minutes === 0 && seconds === 0) {
        return 0;
    }
    else if (hours === 0 && minutes === 0) {
        // SS s
        return `${seconds}s`;
    }
    else if (hours === 0) {
        // MM:SS
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // HH:MM:SS
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function createCountdownCookie(name: string, expiryNum: number, type: string) {
    var countdownStartTime = getCurrentUnixTimestamp();
    var countdownCookieExpiry = cookieExpiryDate(new Date(), expiryNum, type);
    document.cookie = `${name}=${countdownStartTime}; expires=${countdownCookieExpiry}; path=/`;
    return [countdownStartTime, countdownCookieExpiry];
}

export function convertMinutesToHoursAndMinutes(totalMinutes: number): { hours: number, minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

export function isObjectEmpty(obj: Record<string, any>) {
    //return Object.keys(obj).length === 0;
    return obj === undefined || obj === null || Object.keys(obj).length <= 0;
}

export function convertToLocalTime(utcTimestamp: string): string {
    //var timezone = getCurrentTimezoneOffset();

    // Parse the UTC timestamp to a Date object
    const date = new Date(utcTimestamp);
    
    // Get the local time components
    const localDateString = date.toLocaleDateString();

    const options = { hour12: false };
    const localTimeString = date.toLocaleTimeString('en-GB', options);

    // Combine the date and time into one string
    return `${localDateString} ${localTimeString}`;
}