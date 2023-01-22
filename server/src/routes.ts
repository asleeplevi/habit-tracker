import { FastifyInstance } from "fastify";
import { database } from "./lib/prisma";
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(5)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    await database.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((day) => ({ week_day: day })),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    const possibleHabits = await database.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await database.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        habits: true,
      },
    });

    const completedHabits = day?.habits.map((habit) => habit.habit_id);

    return {
      possibleHabits,
      completedHabits,
    };
  });
  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabitParams = z.object({
      id: z.coerce.number(),
    });

    const toggleHabitQuery = z.object({
      date: z.coerce.date(),
    });

    const { id } = toggleHabitParams.parse(request.params);
    const { date } = toggleHabitQuery.parse(request.query);

    const today = dayjs(date).startOf("day").toDate();
    let day = await database.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day)
      day = await database.day.create({
        data: {
          date: today,
        },
      });

    const dayHabit = await database.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          habit_id: id,
          day_id: day.id,
        },
      },
    });

    if (dayHabit) {
      await database.dayHabit.delete({
        where: {
          day_id_habit_id: {
            habit_id: id,
            day_id: day.id,
          },
        },
      });
    } else {
      await database.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });

  app.get("/summary", async () => {
    const summary = await database.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(COUNT(*) as float)
          FROM
            day_habits DH
          WHERE
            DH.day_id = D.id
        ) as completed_habits,
        (
          SELECT 
            cast(COUNT(*) as float)
          FROM
            habit_week_days HWD 
          JOIN
            habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) 
          AND
            H.created_at <= D.date
        ) as amount
      FROM 
        days D
    `;

    return summary;
  });
}
