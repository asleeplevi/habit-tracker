import * as Popover from "@radix-ui/react-popover";
import { ProgressBar } from "./ProgressBar";
import clsx from "clsx";
import dayjs from "dayjs";
import { HabitList } from "./HabitList";
import { useState } from "react";

type HabitProps = {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
  onAddNewDay: () => Promise<void>;
};

export function Habit({
  amount = 0,
  defaultCompleted = 0,
  date,
  onAddNewDay,
}: HabitProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;
  const minMaxPercent = (min: number, max: number) =>
    completedPercentage >= min && completedPercentage < max;

  const weekDay = dayjs(date).format("dddd");

  const handleCompletedChanged = (amountOfCompletedHabits: number) => {
    setCompleted(amountOfCompletedHabits);
    if (amount === 0) onAddNewDay();
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          "w-10 h-10  border-2 rounded-lg transition-colors outline-custom",
          {
            "bg-zinc-900 border-zinc-800": completedPercentage === 0,
            "bg-violet-900 border-violet-700": minMaxPercent(1, 20),
            "bg-violet-800 border-violet-600": minMaxPercent(20, 40),
            "bg-violet-700 border-violet-500": minMaxPercent(40, 60),
            "bg-violet-600 border-violet-500": minMaxPercent(60, 80),
            "bg-violet-500 border-violet-400": minMaxPercent(80, 101),
          }
        )}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col outline-custom">
          <span className="font-semibold text-zinc-400">{weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayjs(date).format("DD/MM")}
          </span>
          <ProgressBar progress={completedPercentage} />
          <HabitList date={date} onCompletedChange={handleCompletedChanged} />
          <Popover.Arrow height={8} width={16} className="fill-zinc-900 " />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
