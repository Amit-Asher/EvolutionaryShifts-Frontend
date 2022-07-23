import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { EditingState, ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  DragDropProvider,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  EditRecurrenceMenu,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useState, useEffect } from "react";
import "../../themes/newArrangementPage.css";
import { ArrangementStore } from "../../stores/arrangementStore";
import { stepConnectorClasses } from "@mui/material";
import moment from "moment";

const PREFIX = "timeTable";

const classes = {
  toolbarRoot: `${PREFIX}-toolbarRoot`,
  progress: `${PREFIX}-progress`,
};

const StyledDiv = styled("div")({
  [`&.${classes.toolbarRoot}`]: {
    position: "relative",
  },
});

const ToolbarWithLoading = ({ children, ...restProps }) => (
  <StyledDiv className={classes.toolbarRoot}>
    <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
    <StyledLinearProgress className={classes.progress} />
  </StyledDiv>
);

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${classes.progress}`]: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
}));

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onMinPersonnelSizeChange = (nextValue) => {
    onFieldChange({ minPersonnelSize: nextValue });
  };

  const onMaxPersonnelSizeChange = (nextValue) => {
    onFieldChange({ maxPersonnelSize: nextValue });
  };

  const onStartDateChange = (nextValue) => {
    onFieldChange({ startDate: nextValue });
  };

  const onEndDateChange = (nextValue) => {
    onFieldChange({ endDate: nextValue });
  };

  return (
    <div style={{ width: "100%", padding: "0px 20px", marginTop: "30px" }}>
      <AppointmentForm.Label text="Details" type="title" />

      <div style={{ display: "flex" }}>
        <AppointmentForm.DateEditor
          value={appointmentData?.startDate}
          onValueChange={onStartDateChange}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0px 10px",
          }}
        >
          -
        </div>
        <AppointmentForm.DateEditor
          value={appointmentData?.endDate}
          onValueChange={onEndDateChange}
        />
      </div>

      <AppointmentForm.Label text="Personnel Size" type="title" />
      <div style={{ display: "flex", marginRight: "65px" }}>
        <AppointmentForm.Label type="ordinaryLabel" />
        <AppointmentForm.TextEditor
          value={appointmentData.minPersonnelSize}
          onValueChange={onMinPersonnelSizeChange}
          placeholder="Min"
          type="numberEditor"
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0px 10px",
          }}
        >
          -
        </div>
        <AppointmentForm.Label type="ordinaryLabel" />
        <AppointmentForm.TextEditor
          value={appointmentData.maxPersonnelSize}
          onValueChange={onMaxPersonnelSizeChange}
          placeholder="Max"
          type="numberEditor"
        />
      </div>
    </div>
  );
};

export default (props) => {
  const [data, setData] = useState([]);
  //   const [currentViewName, setCurrentViewName] = useState([]);
  const [currentViewName, setCurrentViewName] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get req slots + roles from server
    setCurrentViewName(props?.views[0] ?? '');
    props.setSlots([]); // set outside
    setData([]);
    setLoading(false);
  }, []);

  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      const startingAddedId =
        data.length > 0 ? data[data.length - 1].id + 1 : 0;
      const newData = [
        ...data,
        {
          ...added,
          id: startingAddedId,
          title: "Required*",
          role: currentViewName,
        },
      ];
      setData(newData);
      props.setSlots(newData);
      return;
    }
    if (changed) {
      const newData = data.map((appointment) =>
        changed[appointment.id]
          ? { ...appointment, ...changed[appointment.id] }
          : appointment
      );
      setData(newData);
      props.setSlots(newData);
      return;
    }
    if (deleted !== undefined) {
      const newData = data.filter((appointment) => appointment.id !== deleted);
      setData(newData);
      props.setSlots(newData);
      return;
    }
  };

  return (
    <Scheduler
      data={data.filter((slot) => slot.role === currentViewName)}
      height={660}
    >
      <ViewState
        currentDate={currentDate}
        currentViewName={currentViewName}
        onCurrentViewNameChange={setCurrentViewName}
        onCurrentDateChange={setCurrentDate}
      />
      <EditingState onCommitChanges={commitChanges} />
      <EditRecurrenceMenu />
      {props.views?.map((viewName) => (
        <WeekView
          key={viewName}
          name={viewName}
          displayName={viewName}
          startDayHour={0}
          endDayHour={24}
        />
      ))}
      <Appointments />
      <Toolbar {...(loading ? { rootComponent: ToolbarWithLoading } : null)} />
      <DateNavigator />
      <AppointmentTooltip showOpenButton showCloseButton showDeleteButton />
      <ViewSwitcher />
      <AppointmentForm
        basicLayoutComponent={BasicLayout}
        textEditorComponent={TextEditor}
      />
      <DragDropProvider />
    </Scheduler>
  );
};
