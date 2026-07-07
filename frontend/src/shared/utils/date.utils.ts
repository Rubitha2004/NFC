import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const formatDate = (date: string | Date, format = "DD MMM YYYY"): string => {
  return dayjs(date).format(format);
};

export const formatTime = (date: string | Date, format = "hh:mm A"): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format("DD MMM YYYY, hh:mm A");
};

export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const getCurrentTime = (): string => {
  return dayjs().format("hh:mm:ss A");
};

export const getCurrentDate = (): string => {
  return dayjs().format("ddd, DD MMM YYYY");
};
