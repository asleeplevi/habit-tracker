import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { translator, Translator } from "../i18n/Translator";
import { useTranslation } from "react-i18next";
import { createWeekDays } from "../utils/createWeekDays";

export const NewHabitForm = () => {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const { i18n } = useTranslation();
  const handleCreateNewHabit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title || weekDays.length === 0) return;
    const body = {
      title,
      weekDays,
    };

    await api.post("/habits", body);
    setTitle("");
    setWeekDays([]);
  };

  const handleToggleWeekDay = (weekday: number) => {
    if (weekDays.includes(weekday)) {
      setWeekDays((prev) => prev.filter((day) => day !== weekday));
    } else {
      setWeekDays([...weekDays, weekday]);
    }
  };

  return (
    <form onSubmit={handleCreateNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        <Translator path="home.header.form.inputTitle" />
      </label>
      <input
        type="text"
        id="title"
        placeholder={translator("home.header.form.placeholder")}
        autoFocus
        className="p-4 rounded-lg mt-2 bg-zinc-800 text-white placeholder:text-zinc-400 outline-custom"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex flex-col gap-2 mt-3">
        <label htmlFor="" className="font-semibold leading-tight mt-4">
          <Translator path="home.header.form.inputTitle" />
        </label>

        {createWeekDays(i18n.language as any).map((day, index) => (
          <Checkbox.Root
            key={day}
            className="flex items-center gap-3 group focus:outline-none"
            checked={weekDays.includes(index)}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="text-white leading-tight">{day}</span>
          </Checkbox.Root>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 rounded-lg p-4 gap-3 flex justify-center items-center font-semibold bg-green-600 hover:bg-green-500 transition-colors outline-custom"
      >
        <Check size={20} weight="bold" />
        <Translator path="common.confirm" />
      </button>
    </form>
  );
};
