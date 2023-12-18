export default function dateFormatter(
  dateString: string,
  format: string = "YYYY-MM-DD HH:mm"
) {
  const time = new Date(dateString);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const formattedDate = format
    .replace("YYYY", year.toString())
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("DD", day.toString().padStart(2, "0"))
    .replace("HH", hour.toString().padStart(2, "0"))
    .replace("mm", minute.toString().padStart(2, "0"))
    .replace("ss", second.toString().padStart(2, "0"));

  return formattedDate;
}
