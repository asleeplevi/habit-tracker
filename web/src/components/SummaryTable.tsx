import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { Fragment, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { capitalize } from "../utils/capitalize";
import { createWeekDays } from "../utils/createWeekDays";
import { generateRangeBetweenDates } from "../utils/generateRangeBetweenDates";
import { Habit } from "./Habit";

type SummaryProps = {
  id: number;
  date: Date;
  completed_habits: number;
  amount: number;
};

export const SummaryTable = () => {
  const [summary, setSummary] = useState<SummaryProps[]>([]);
  const [currentDate, setCurrentMonth] = useState(
    dayjs().subtract(1, "month").toDate()
  );

  const getSummary = async () => {
    const { data } = await api.get("/summary");
    setSummary(data);
  };

  const summaryDates = generateRangeBetweenDates(currentDate);

  const days = createWeekDays();
  const weekDays = days.map((day) => day.charAt(0).toUpperCase());
  const currentMonth = dayjs(currentDate).format("MMMM");

  const handleChangeMonth = (offset: number) => {
    const newMonth = dayjs(currentDate).add(offset, "month");
    setCurrentMonth(newMonth.toDate());
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <section className="flex flex-col">
      <div className="grid grid-cols-[20px_100px_20px] ml-auto mb-4">
        <button onClick={() => handleChangeMonth(-1)}>
          <ArrowLeft />
        </button>
        <span className="text-center">{capitalize(currentMonth)}</span>
        <button onClick={() => handleChangeMonth(1)}>
          <ArrowRight />
        </button>
      </div>
      <div className="w-full flex">
        <div className="grid  grid-rows-7 grid-flow-row gap-3">
          {weekDays.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid  grid-rows-7 grid-flow-col gap-3">
          {summary.length > 0 &&
            summaryDates.map((date) => {
              const dayInSummary = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              const isAfterCurrentDate = dayjs().isBefore(date);

              return (
                <Fragment key={date.toString()}>
                  {isAfterCurrentDate ? (
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
                  ) : (
                    <Habit
                      defaultCompleted={dayInSummary?.completed_habits}
                      amount={dayInSummary?.amount}
                      date={date}
                      onAddNewDay={getSummary}
                    />
                  )}
                </Fragment>
              );
            })}
        </div>
      </div>
    </section>
  );
};
