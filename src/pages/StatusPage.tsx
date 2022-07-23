import Paper from "@mui/material/Paper";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import TimeTable from "../components/TimeTable/TimeTable";
import { EmployeeStatus } from "../interfaces/arrangement.interfaces";
import { ComponentStatus } from "../interfaces/common";
import { arrangementService } from "../services/arrangementService";
import { companyService } from "../services/companyService";
import { globalStore } from "../stores/globalStore";
import {
  EmployeeDTO,
  EmpSlotsPreferenceDTO,
  PrfSlotDTO,
} from "../swagger/stubs";

export const StatusPage = observer(() => {
  const arrangementStore = globalStore.arrangementStore;
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus[]>([]);
  const [curEmployee, setCurEmployee] = useState<EmployeeStatus | undefined>();
  const [isLoading, setIsLoading] = useState<ComponentStatus>(
    ComponentStatus.LOADING
  );
  let count = 1;

  useEffect(() => {
    const fetchData = async () => {
      const allEmployees: EmployeeDTO[] = await companyService.getEmployees();
      const allPreferences: EmpSlotsPreferenceDTO[] =
        await arrangementService.getPreferences();
      const employeesStatus: EmployeeStatus[] = allPreferences?.map(
        (empPref) => ({
          empPref,
          roles:
            allEmployees.find((emp) => emp.id === empPref.employeeId)?.roles ??
            [],
        })
      );
      setCurEmployee(employeeStatus[0]);
      setEmployeeStatus(employeesStatus);
      setIsLoading(ComponentStatus.READY);
    };

    fetchData();
  }, []);

  const tst =
    curEmployee?.empPref?.employeeSlots?.map((pref: PrfSlotDTO) => {
      count = count + 1;
      return {
        id: count,
        startDate: new Date(
          moment(pref.startTime ?? "").format("YYYY-MM-DD HH:mm")
        ), // moment(pref.startTime).format('YYYY-MM-DDTHH:mm'),  // "2022-07-19T12:00"
        endDate: new Date(
          moment(pref.endTime ?? "").format("YYYY-MM-DD HH:mm")
        ), // moment(pref.startTime).format('YYYY-MM-DDTHH:mm'),  // "2022-07-19T12:00"
        minPersonnelSize: 0,
        maxPersonnelSize: 0,
        title: "Prefered*", // by design, title is always "Prefered*"
        role: pref.role ?? "",
      };
    }) ?? [];

  console.log(`tst: ${JSON.stringify(tst, undefined, 2)}`);

  if (isLoading) {
    return <LoadingPaper />;
  }

  return (
    <Paper
      sx={{ maxWidth: 936, margin: "auto", overflow: "hidden", height: "100%" }}
    >
      <div style={{ backgroundColor: "#fff", padding: "20px" }}>
        <TimeTable
          views={curEmployee?.roles ?? []}
          slots={tst}
          setSlots={arrangementStore.setReqSlots}
        />
      </div>
    </Paper>
  );
});
