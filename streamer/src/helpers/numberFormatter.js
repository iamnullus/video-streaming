exports.NumberShorterner = (number) => {
  if (isNaN(number)) {
    return "Invalid Number";
  }

  const K_THRESHOLD = 1000;
  const M_THRESHOLD = 1000000;

  if (number >= M_THRESHOLD) {
    return (number / M_THRESHOLD).toFixed(1) + "M";
  } else if (number >= K_THRESHOLD) {
    return (number / K_THRESHOLD).toFixed(1) + "k";
  } else {
    return number.toString();
  }
};
