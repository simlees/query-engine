import config from '../config';
const moment = require('moment');

class DataTransformer {

  transform(data) {
    data = this.parseDates(data);
    const countries = [];
    data.map(attendee => this.addAttendeeAvailability(countries, attendee));
    return countries.map(country => {
      return {
        ...country,
        bestDates: this.findMostAttendableConsecutiveDays(country.dates, config.consecutiveDateWindow)
      }
    });
  }

  /**
   * Parse dates into moment.js dates
   */
  parseDates(data) {
    return data.map(attendee => {
      attendee.dates = attendee.dates.map(date => moment(date));
      return attendee;
    })
  }

  /**
   * Find matching attendee country and add dates, creating a new country if not found
   */
  addAttendeeAvailability(countries, attendee) {
    let matchingCountry = countries.find(c => c.name === attendee.country);
    if (matchingCountry) {
      this.addAttendeeDatesToCountry(attendee.dates, matchingCountry.dates);
    } else {
      countries.push({
        name: attendee.country,
        dates: this.addAttendeeDatesToCountry(attendee.dates)
      });
    }
  }

  /**
   * Add attendee dates to country dates, creating new dates if not found
   */
  addAttendeeDatesToCountry(attendeeDates, countryDates = []) {
    for (let attendeeDate of attendeeDates) {
      let matchingCountryDate = countryDates.find(cd => cd.date.isSame(attendeeDate, 'day'));
      if (matchingCountryDate) {
        matchingCountryDate.count++;
      } else {
        countryDates.push({
          date: attendeeDate,
          count: 1
        });
      }
    }
    return countryDates;
  }

  /**
   * Returns the first date of a highest-attendable date window
   * TODO - Ensure dates are consecutive (only checking order atm)
   */
  findMostAttendableConsecutiveDays(countryDates, windowSize) {
    countryDates.sort((a, b) => a.date.isAfter(b.date));
    let bestStartDate;
    let bestWindowAttendees = 0;
    let dateWindow;
    let windowAttendees;

    for (let i = 0; i < countryDates.length; i++) {
      dateWindow = countryDates.slice(i, i + windowSize);
      windowAttendees = 0;
      dateWindow.forEach(date => windowAttendees += date.count);
      if (windowAttendees > bestWindowAttendees) {
        bestWindowAttendees = windowAttendees;
        bestStartDate = countryDates[i].date;
      }
    }

    return bestStartDate;
  }


}

export default DataTransformer;
