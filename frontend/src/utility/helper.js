export const formatDate = (date) => {
  // format date to YYYY-MM-DD
  const d = new Date(date);
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${d.getFullYear()}-${month}-${day}`;
};