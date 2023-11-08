import { format } from "date-fns";

const DEFAULT_FORMAT_DATE = "dd-MM-yyyy HH:mm";

export const formatDate = (
  date: string | Date,
  formatString = DEFAULT_FORMAT_DATE
) => {
  return format(new Date(date), formatString);
};
