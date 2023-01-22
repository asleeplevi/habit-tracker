import dayjs from "dayjs";

export const createWeekDays = () => {
  return Array.from({ length: 7 }).map((_, index) =>
    dayjs().set("day", index).format("dddd")
  );
};
