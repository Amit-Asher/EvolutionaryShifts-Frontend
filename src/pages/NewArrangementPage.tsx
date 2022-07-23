import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { ArrangementStore } from "../stores/arrangementStore";
import { globalStore } from "../stores/globalStore";
import { observer } from "mobx-react";
import { EmployeeDTO } from "../swagger/stubs";
import { mock } from "../mocks/mockData";
import { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable/TimeTable";
import Typography from "@mui/material/Typography";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";

// functional component
function NewArrangementPage() {
  const arrangementStore: ArrangementStore = globalStore.arrangementStore;
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
  const [allRules, setAllRules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<ComponentStatus>(
    ComponentStatus.LOADING
  );

  useEffect(() => {
    const fetchRoles = async () => {
      // 'await' send http request to get roles + employees + rules
      companyService.getEmployees();
      setAllRoles(mock.roles);
      setAllEmployees(mock.employees);
      setAllRules(mock.rules);
      setIsLoading(ComponentStatus.READY);
    };
    fetchRoles();
  }, []);

  if (isLoading) {
    return (
      <Paper
        sx={{ margin: "auto", overflow: "hidden" }}
        style={{
          height: "100%",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden" }}>
      <div style={{ backgroundColor: "#fff", padding: "20px" }}>
        <TimeTable
          views={allRoles}
          slots={arrangementStore.reqSlots}
          setSlots={arrangementStore.setReqSlots}
        />
      </div>

      {/* ACTIVE EMPLOYEES */}
      <div
        style={{
          width: "270px",
          marginRight: "100px",
        }}
      >
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            margin: "20px 5px 5px 5px",
          }}
        >
          <Checkbox
            style={{}}
            onChange={(e) => {
              if (e.target.checked) {
                allEmployees?.forEach((emp) =>
                  arrangementStore.setEmployeeAsActive(emp.id)
                );
              } else {
                allEmployees?.forEach((emp) =>
                  arrangementStore.unsetEmployeeAsActive(emp.id)
                );
              }
            }}
          />
          <Typography variant="h6" gutterBottom component="div">
            Active Employees
          </Typography>
        </div>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            borderRight: "inset",
            height: "300px",
            overflow: "auto",
          }}
        >
          {allEmployees?.map((employee: EmployeeDTO) => {
            const labelId = `active-employee-${employee.id}`;
            const isActive = arrangementStore?.activeEmployeesIds?.some(
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
      </div>

      {/* Rules weights */}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {allRules?.map((rule: string) => {
          const labelId = `rule-${rule}`;
          return (
            <ListItem key={rule} disablePadding>
              <Checkbox
                onChange={(enable) =>
                  enable.target.checked
                    ? arrangementStore.enableRule(rule)
                    : arrangementStore.disableRule(rule)
                }
                checked={arrangementStore.selectedRules.some(
                  (selectedRule) =>
                    selectedRule.ruleName === rule && selectedRule.enable
                )}
              />
              <ListItemText id={labelId} primary={`${rule}`} />
              <TextField
                type="number"
                value={
                  arrangementStore.selectedRules.find(
                    (selectedRule) => selectedRule.ruleName === rule
                  )?.weight || undefined
                }
                variant="outlined"
                onChange={(e) =>
                  arrangementStore.setRuleWeight(
                    rule,
                    parseFloat(e.target.value)
                  )
                }
              />
            </ListItem>
          );
        })}
      </List>
      <div style={{ display: "flex", float: "right", padding: "40px" }}>
        <Button
          variant="contained"
          color="secondary"
          style={{ height: "50px", width: "100px" }}
        >
          Create
        </Button>
      </div>
    </Paper>
  );
}

export default observer(NewArrangementPage);
