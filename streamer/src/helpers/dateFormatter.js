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
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (days < 365) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
};
