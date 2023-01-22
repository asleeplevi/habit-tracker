import dayjs from "dayjs";

const minimumSummaryDatesSize = 18 * 7;

export function generateRangeBetweenDates(date: Date) {
  const firstDay = dayjs(date).startOf("month");

  const dates = [];

  for (let i = 0; i < minimumSummaryDatesSize; i++) {
    dates.push(firstDay.add(i, "day").toDate());
  }

  return dates;
}
