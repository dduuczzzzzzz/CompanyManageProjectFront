export const formatDateTime = (inputDate: Date): { dateStr: string; timeStr: string } => {
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');
  const seconds = String(inputDate.getSeconds()).padStart(2, '0');

  // Create the date and time strings
  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hours}:${minutes}:${seconds}`;

  return { dateStr, timeStr };
}

export const formatEndDate = (inputDateStr: string): string => {
  const inputDate = new Date(inputDateStr);

  // Decrease the day by 1
  inputDate.setDate(inputDate.getDate() - 1);

  // Convert the updated date back to a string in "yyyy-mm-dd" format
  const updatedDateStr = inputDate.toISOString().split('T')[0];

  return updatedDateStr;
}