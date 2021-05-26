export default function dateFilter(value) {
  const d = new Date(value);
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return `${dd}.${mm}.${yyyy}, ${hours}:${minutes}`;
}
