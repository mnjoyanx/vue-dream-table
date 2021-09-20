import moment from "moment";

export const removeUnderscores = (string) => {
  return string.replace(/_/g, " ");
};

export const dateFilter = (string) => {
  return moment.utc(string).format("M/D/YYYY, h:mm:ss");
};

export const capitalize = (val) => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const maxStringSize = (val, size) => {
  if (val.length > size) {
    return val.substring(0, size) + "...";
  } else {
    return val;
  }
};
