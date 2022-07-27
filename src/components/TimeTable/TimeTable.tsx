import react from "react";
import { observer } from "mobx-react-lite";
import DevExpressTimeTable from "./DevExpressTimeTable";

interface TimeTableProps {
    views: string[];
    slots: ReqSlotCell[];
    setSlots?: (reqSlots: ReqSlotCell[]) => void;
}

export interface ReqSlotCell {
    id: number;
    startDate: Date; // "2022-07-19T12:00"
    endDate: Date;
    minPersonnelSize: number;
    maxPersonnelSize: number;
    title: string; // by design, title is always "Required*"
    role: string;
}

function TimeTable(props: TimeTableProps) {    
    console.log(`props.slots: ${JSON.stringify(props.slots, undefined, 2)}`)

  return (
      <DevExpressTimeTable
        views={props.views ?? []}
        slots={props.slots ?? []}
        setSlots={props?.setSlots}
      />
  );
}

export default observer(TimeTable);