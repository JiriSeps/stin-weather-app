const currentDate = new Date();

const getFormattedDate = (date, offset) => {
  const targetDate = new Date(date); // Create a new date object to avoid modifying the original date
  targetDate.setDate(targetDate.getDate() - offset); // Update the date by the specified offset
  const day = targetDate.getDate().toString().padStart(2, '0');
  const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
  const year = targetDate.getFullYear();
  return { day, month, year };
};

const dates = Array.from({ length: 7 }, (_, i) => getFormattedDate(currentDate, i));

module.exports = dates;