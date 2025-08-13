export const decimalToTime = (decimalHour: number) => {
  // Get the hour (wrap at 24 just in case)
  let hours = Math.floor(decimalHour) % 24;
  let minutes = Math.round((decimalHour - Math.floor(decimalHour)) * 60);

  // Adjust minutes rollover
  if (minutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert 0 → 12 AM, 13 → 1 PM, etc.
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  // Pad minutes
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHour}:${displayMinutes}${period}`;
};

export const minutesToHoursString = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const leftover = minutes - hours * 60;

  return `${hours}hrs${leftover ? `${leftover}min` : ''}`;
};
