import { useEffect, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { api } from "../lib/axios";
import { Check } from "phosphor-react";

type PossibleHabitsProps = {
  id: number;
  title: string;
  created_at: Date;
};

type DayProps = {
  possibleHabits: PossibleHabitsProps[];
  completedHabits: number[];
};

type HabitListProps = {
  date: Date;
  onCompletedChange: (amount: number) => void;
};

export const HabitList = ({ date, onCompletedChange }: HabitListProps) => {
  const [day, setDay] = useState<DayProps>();

  const toggleHabit = async (habitId: number) => {
    await api.patch(`/habits/${habitId}/toggle?date=${date}`);

    let completedHabits: number[] = day?.completedHabits || [];
    if (day?.completedHabits?.includes(habitId)) {
      completedHabits = completedHabits.filter((id) => id !== habitId);
    } else {
      completedHabits = [...completedHabits, habitId];
    }
    setDay({
      possibleHabits: day!.possibleHabits,
      completedHabits,
    });

    onCompletedChange(completedHabits.length);
  };

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/day", {
        params: {
          date: date.toISOString(),
        },
      });
      setDay(data);
    })();
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {day?.possibleHabits.map((habit) => {
        const isCompleted = day?.completedHabits?.includes(habit.id);
        return (
          <Checkbox.Root
            key={habit.id}
            checked={isCompleted}
            onCheckedChange={() => toggleHabit(habit.id)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
};
