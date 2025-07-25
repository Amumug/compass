import dayjs from "dayjs";
import { Schema_Event_Core } from "@core/types/event.types";
import { RRULE } from "../../../../../core/src/constants/core.constants";
import { areDatesUnique, haveSharedValues } from "./recur.test.util";
import { assembleInstances } from "./util/recur.util";

describe("Weekly Recurrence: Basics", () => {
  it("starts recurrences on the first day and last day of the week", () => {
    const rEvents = assembleInstances({
      startDate: "2023-07-21",
      endDate: "2023-07-22",
      recurrence: {
        rule: [RRULE.WEEK],
      },
    } as Schema_Event_Core);

    const start = dayjs(rEvents[1]?.startDate);
    const end = dayjs(rEvents[rEvents.length - 1]?.endDate);

    const isStartSunday = start.day() === 0;
    const isEndSaturday = end.day() === 6;

    expect(isStartSunday).toBe(true);
    expect(isEndSaturday).toBe(true);
  });
});

describe("Weekly Recurrence: Cases", () => {
  it("uses correct dates: case 1", () => {
    const events = assembleInstances({
      startDate: "2023-01-08",
      endDate: "2023-01-14",
      recurrence: { rule: [RRULE.WEEK] },
    } as Schema_Event_Core);

    expect(events[1]?.startDate).toBe("2023-01-15");
    expect(events[1]?.endDate).toBe("2023-01-21");

    expect(events[2]?.startDate).toBe("2023-01-22");
    expect(events[2]?.endDate).toBe("2023-01-28");
  });
  it("uses correct dates: case 3: DST (11.5)", () => {
    const events = assembleInstances({
      startDate: "2023-07-23",
      endDate: "2023-07-29",
      recurrence: { rule: [RRULE.WEEK] },
    } as Schema_Event_Core).map((e) => ({ ...e, _id: e._id?.toString() }));

    expect(areDatesUnique(events)).toBe(true);
    expect(haveSharedValues(events)).toBe(false);
  });
});
