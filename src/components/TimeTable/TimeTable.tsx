import react from "react";
import { observer } from "mobx-react-lite";
import DevExpressTimeTable from "./DevExpressTimeTable";

interface TimeTableProps {
    views: string[];
    slots: ReqSlotCell[];
    // editSlots: {
    //     addSlot: (ReqSlotCell: ReqSlotCell) => void;
    //     changeSlot: (ReqSlotCell: ReqSlotCell) => void;
    //     deleteSlot: (ReqSlotCell: ReqSlotCell) => void;
    // };
    setSlots: (reqSlots: ReqSlotCell[]) => void;
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
  return (
      <DevExpressTimeTable
        views={props.views ?? []}
        slots={props.slots ?? []}
        setSlots={props.setSlots}
         // data (e.g reqslots from store)
         // setter for commitchanges
         // views (e.g roles)
         // currentDate
      />
  );
}

export default observer(TimeTable);