const currentDate = new Date();
const Day = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day2 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month2 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year2 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day3 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month3 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year3 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day4 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month4 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year4 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day5 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month5 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year5 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day6 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month6 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year6 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));
const Day7 = currentDate.getDate(currentDate.setDate(currentDate.getDate() - 1));
const Month7 = (currentDate.getMonth(currentDate.setDate(currentDate.getDate())) + 1).toString().padStart(2, '0');
const Year7 = currentDate.getFullYear(currentDate.setDate(currentDate.getDate()));

module.exports = {
    Day,
    Month,
    Year,
    Day2,
    Month2,
    Year2,
    Day3,
    Month3,
    Year3,
    Day4,
    Month4,
    Year4,
    Day5,
    Month5,
    Year5,
    Day6,
    Month6,
    Year6,
    Day7,
    Month7,
    Year7
  };