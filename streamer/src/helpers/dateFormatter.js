exports.DateFormatter = (date) => {
  date = new Date(date);

  const now = new Date();
  const diffMilliseconds = now - date;

  const seconds = Math.floor(diffMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} ${seconds === 1 ? "sec" : "secs"}`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "min" : "mins"}`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (days < 365) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
};

exports.ShowFullDate = (inputDate) => {
  const parsedDate = new Date(inputDate);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[parsedDate.getMonth()];
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
};
