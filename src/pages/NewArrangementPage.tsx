import {
  Button,
  Checkbox,
  FilledInput,
  FormControl,
  FormHelperText,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TimeTable from "react-timetable-events";
import moment from "moment";
import { EventPreviewProps } from "react-timetable-events/dist/types";
import { ArrangementStore } from "../stores/arrangementStore";
import { globalStore } from "../stores/globalStore";
import { observer } from "mobx-react";
import { ArrangementApi, EmployeeDTO } from "../swagger/stubs";
import { mock } from "../mocks/mockData";

// functional component
function NewArrangementPage() {
  const arrangementStore: ArrangementStore = globalStore.arrangementStore;

  const events = {
    monday: [
      {
        id: 1,
        name: "Custom Event 1",
        type: "custom",
        startTime: new Date("2018-02-23T11:30:00"),
        endTime: new Date("2018-02-23T13:30:00"),
      },
    ],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  const employees = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  // const Hour = ({ hour, defaultAttributes, classNames }: HourPreviewProps) => {
  //   return (
  //     <div
  //       {...defaultAttributes}
  //       key={hour}
  //       className={`${defaultAttributes.className} hour`}
  //     >
  //       {hour}
  //     </div>
  //   );
  // };

  const Event = ({
    event,
    defaultAttributes,
    classNames,
  }: EventPreviewProps) => {
    const { id, name, startTime, endTime } = event;
    const start = moment(startTime).format("HH:mm");
    const end = moment(endTime).format("HH:mm");

    const openEventModal = () => {
      alert(`[${id}]: ${name}`);
    };

    return (
      <div
        {...defaultAttributes}
        title={name}
        key={id}
        className={`${defaultAttributes.className} event`}
        onClick={openEventModal}
      >
        <span className={classNames.event_info}>{name}</span>
        <span className={classNames.event_info}>
          {start} - {end}
        </span>
      </div>
    );
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {mock.employees?.map((employee: EmployeeDTO) => {
          const labelId = `active-employee-${employee.id}`;
          // const employee: EmployeeDTO = mock.employees.find(employee => employee.id === activeEmployeeId);
          const isActive =
            arrangementStore?.properties?.activeEmployeesIds?.some(
              (employeeId) => employeeId === employee.id
            );
          return (
            <ListItem key={employee.name} disablePadding>
              <ListItemButton
                onClick={() =>
                  isActive
                    ? arrangementStore.unsetEmployeeAsActive(employee.id)
                    : arrangementStore.setEmployeeAsActive(employee.id)
                }
              >
                <Checkbox checked={isActive} />
                <ListItemText id={labelId} primary={`${employee.name}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {[0, 1, 2, 3].map((value) => {
          const labelId = `active-employee-${value}`;
          return (
            <ListItem key={value} disablePadding>
              <ListItemButton onClick={() => {}}>
                <Checkbox checked={true} />
                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                <FormControl sx={{ m: 1, width: "25ch" }}>
                  <FilledInput
                    id="filled-adornment-weight"
                    value={0}
                    onChange={() => {}}
                    endAdornment={
                      <InputAdornment position="end">%</InputAdornment>
                    }
                  />
                  <FormHelperText id="filled-weight-helper-text">
                    Weight
                  </FormHelperText>
                </FormControl>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Select value={"ok"} onChange={() => {}}>
        {employees.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>

      <TimePicker
        views={["hours", "minutes"]}
        inputFormat="hh:mm"
        mask="__:__"
        label="Start Time"
        value={new Date("08:00:00")}
        onChange={(newValue) => {}}
        renderInput={(params) => <TextField {...params} />}
      />

      <TimePicker
        views={["hours", "minutes"]}
        inputFormat="hh:mm"
        mask="__:__"
        label="End Time"
        value={new Date("08:00:00")}
        onChange={(newValue) => {}}
        renderInput={(params) => <TextField {...params} />}
      />
      <TextField id="standard-basic" label="Standard" variant="standard" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
      <Button variant="text">Submit</Button>

      <div>
        <TimeTable
          events={events}
          renderEvent={Event}
          style={{ height: "500px", width: "100%" }}
        />
      </div>
    </Paper>
  );
}

export default observer(NewArrangementPage);
