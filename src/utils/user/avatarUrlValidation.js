exports.isValidURL = (url) => {
  const urlPattern =
    /^(https?:\/\/)?([\w.]+)+(\d{1,5}\/)?(\/[\w#!:.?+=&%@!\-\/]+)?$/;
  return urlPattern.test(url);
};
