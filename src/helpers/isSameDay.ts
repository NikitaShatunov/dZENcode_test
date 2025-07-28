/**
 * Checks if two dates are the same day.
 *
 * @param {Date} first_date - The first date to compare.
 * @param {Date} second_date - The second date to compare.
 * @returns {boolean} - True if the dates are the same day, false otherwise.
 */
export const isSameDay = (first_date: Date, second_date: Date): boolean => {
  // Get the date part of the dates (ignoring time)
  const first_date_date = new Date(first_date).getDate();
  const second_date_date = new Date(second_date).getDate();

  // Compare the date parts
  return first_date_date === second_date_date;
};
