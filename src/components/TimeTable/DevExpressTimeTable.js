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
    if (props?.type === "multilineTextEditor") {
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
    const [currentViewName, setCurrentViewName] = useState(props?.views?.[0] ?? {});
    const [currentDate, setCurrentDate] = useState(moment('2022-05-22').format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentViewName(props?.views?.[0] ?? {});
    }, [props?.views])

    // only relevent for the flow of new arrangement (set reqslots)
    const commitChanges = ({ added, changed, deleted }) => {
        if (added) {
            if (props?.slots?.length === undefined) {
                return;
            }
            const startingAddedId = props?.slots?.length > 0 ? (props?.slots?.[props.slots.length - 1]?.id ?? 0) + 1 : 0;
            const newData = [
                ...props?.slots,
                {
                    ...added,
                    id: startingAddedId,
                    title: "Required*",
                    role: currentViewName,
                },
            ];
            props?.setSlots?.(newData);
            return;
        }
        if (changed) {
            const newData = props?.slots.map((appointment) =>
                changed[appointment.id]
                    ? { ...appointment, ...changed[appointment.id] }
                    : appointment
            );
            props?.setSlots?.(newData);
            return;
        }
        if (deleted !== undefined) {
            const newData = props?.slots?.filter((appointment) => appointment.id !== deleted);
            props?.setSlots?.(newData);
            return;
        }
    };

    const CustomAppointment = (CustomAppointmentProps) => {
        return (
            <Appointments.Appointment
                onClick={props?.onSelectAppointment ? (event) => {
                    props?.onSelectAppointment(CustomAppointmentProps?.data, CustomAppointmentProps?.data?.isSelected)
                } : undefined}
                style={{
                    backgroundColor: CustomAppointmentProps?.data?.isSelected ? '#2e7d32' : ''
                }}
            >
                {CustomAppointmentProps?.children}
            </Appointments.Appointment>
        );
    }

    return (
        <Scheduler
            data={props?.slots?.filter((slot) => slot.role === currentViewName) ?? []}
            // height={600}
            style={{ marginTop: '30px' }}
        >
            <ViewState
                currentDate={currentDate}
                currentViewName={currentViewName}
                onCurrentViewNameChange={setCurrentViewName}
                onCurrentDateChange={setCurrentDate}
            />
            {props?.setSlots && <EditingState onCommitChanges={commitChanges} />}
            {props?.setSlots && <EditRecurrenceMenu />}
            {props?.views?.map((viewName) => (
                <WeekView
                    key={viewName}
                    name={viewName}
                    displayName={viewName}
                    startDayHour={0}
                    endDayHour={24}
                    cellDuration={180}
                />
            ))}

            {props?.onSelectAppointment && <Appointments appointmentComponent={CustomAppointment} />}
            {!props?.onSelectAppointment && <Appointments />}

            <Toolbar {...(loading ? { rootComponent: ToolbarWithLoading } : null)} />
            <DateNavigator />
            {!props?.onSelectAppointment && <AppointmentTooltip
                showCloseButton
                showOpenButton={props?.setSlots ? true : false}
                showDeleteButton={props?.setSlots ? true : false}
            />}

            <ViewSwitcher />
            {props?.setSlots && <AppointmentForm
                basicLayoutComponent={BasicLayout}
                textEditorComponent={TextEditor}
            />}
            {props?.setSlots && <DragDropProvider />}
        </Scheduler>
    );
};
