import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios, { AxiosRequestConfig } from 'axios';
import {
    useAutocomplete,
    AutocompleteGetTagProps,
} from '@mui/base/AutocompleteUnstyled';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js';
import { ListItemButton, Paper } from '@mui/material';
import { observer } from 'mobx-react';
import { EmployeeApi, EmployeeDTO, EmployeesDTO, GenericResponseDTO, NewEmployeeDTO, RoleApi, RolesDTO, SettingsApi } from '../swagger/stubs';
import AsyncSelect from 'react-select/async';
import cssVars from '@mui/system/cssVars';
import { FormControlUnstyledContext } from '@mui/base';
import { isGenerator } from 'mobx/dist/internal';
import { companyService } from '../services/companyService';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { globalStore } from '../stores/globalStore';
import '../themes/employeePage.css';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';


enum EmpsSubTab {
    Employees,
    Roles
}


const onlyLetters = (str: string): boolean => {
    return /^[a-zA-Z -]+$/.test(str);
}

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const getEmployees = async (): Promise<EmployeeDTO[]> => {
    try {
        // GET REQUEST
        const res: EmployeesDTO = await (new EmployeeApi()).getAllEmployees({ credentials: 'include' });
        const employees: EmployeeDTO[] = res.employees ?? [];
        //console.log(`employees: ${JSON.stringify(employees, undefined, 2)}`)
        console.log('Success to get employees');
        return employees;
    } catch (err) {
        console.log('failed to get employees');
        return [];
    }
}

const getRoles = async (): Promise<string[]> => {
    try {
        // GET REQUEST
        const res: RolesDTO = await (new RoleApi()).getAllRoles({ credentials: 'include' });
        return res?.names ?? [];
    } catch (err) {
        console.log('failed to get roles');
        return [];
    }
}



const deleteRoleForEmp = async (employee: EmployeeDTO, role: string, employees: EmployeeDTO[], setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>,
    tableRows: EmployeeDTO[], setTableRows: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>): Promise<void> => {
    try {
        //DELETE REQURST
        const res = await (new RoleApi()).removeRoleFromEmp(employee.id || "*error*", role, { credentials: 'include' });
        var emplyeesAfterChange: EmployeeDTO[] = employees;
        emplyeesAfterChange.map(emp => {
            if (emp.id === employee.id) {
                emp.roles = emp.roles?.filter(role_i => role_i !== role);
            }
        });
        setEmployees([...emplyeesAfterChange]);



        var rowsTableAfterChange: EmployeeDTO[] = tableRows;
        rowsTableAfterChange.map(emp => {
            if (emp.id === employee.id) {
                emp.roles = emp.roles?.filter(role_i => role_i !== role);
            }
        });
        setTableRows([...rowsTableAfterChange]);

        console.log(res.message);
        globalStore.notificationStore.show({ message: res.message || "**error**", severity: "success" });
        //console.log(`employees: ${JSON.stringify(employees, undefined, 2)}`)
    } catch (err) {
        console.log(`Failed to remove role: '${role}' from employee: '${employee.fullName}'`);
        globalStore.notificationStore.show({ message: `Failed to remove role: '${role}' from employee: '${employee.fullName}'`, severity: "error" });
    }
}

interface RolesListForEmpProps {
    employee: EmployeeDTO;
    employees: EmployeeDTO[];
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
    tableRows: EmployeeDTO[];
    setTableRows: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
}

function RolesListForEmp(props: RolesListForEmpProps) {
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const { employee, employees, setEmployees, tableRows, setTableRows } = props;

    var lines = [];

    for (let i = 0; i < (employee.roles || []).length; i++) {
        lines.push(
            <ListItem style={{ padding: '0px' }}
                key={i}
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(event) => {
                        const rolesSize: number = employee.roles?.length || 0;
                        if (rolesSize >= 2)
                            deleteRoleForEmp(employee, (employee.roles || [])[i], employees, setEmployees, tableRows, setTableRows);
                        else
                            console.log(`Can not remoove role: ${(employee.roles || [])[i]} from employee: ${employee} when the size of the roles is less than 1`);
                        globalStore.notificationStore.show({ message: `Can not remoove role: ${(employee.roles || [])[i]} from employee: ${employee} when the size of the roles is less than 1`, severity: "error" });
                    }}>
                        <DeleteIcon />
                    </IconButton>
                }
            >

                <ListItemText
                    primary={(props?.employee?.roles || [])[i]}
                    secondary={secondary ? 'Secondary text' : null}
                />
            </ListItem>
        );
    }
    return (
        <List dense={dense}>
            {lines}
        </List>
    );
}



function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: string },
    b: { [key in Key]: string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof EmployeeDTO;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'firstName',
        numeric: false,
        disablePadding: true,
        label: ' First Name',
    },
    {
        id: 'lastName',
        numeric: false,
        disablePadding: true,
        label: ' Last Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: true,
        label: ' Email',
    },
    {
        id: 'phoneNumber',
        numeric: false,
        disablePadding: true,
        label: 'Phone number',
    },
    {
        id: 'roles',
        numeric: false,
        disablePadding: true,
        label: 'Roles',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EmployeeDTO) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof EmployeeDTO) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    let repairHeadCell: JSX.Element[] = [];

    headCells.map((headCell) => {
        if (headCell.id !== "roles") {
            repairHeadCell.push(
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            );
        }
        else {
            repairHeadCell.push(
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                    {headCell.label}
                </TableCell>
            );
        }
    });

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all employees',
                        }}
                    />
                </TableCell>
                {repairHeadCell}
            </TableRow>
        </TableHead>
    );
}


const deleteSelectedEmp = async (selectedEmpToRemove: readonly string[], employees: EmployeeDTO[], setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>
    , tableRows: EmployeeDTO[], setTableRows: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>): Promise<void> => {
    var tempEmps = employees;
    var tempRows = tableRows;

    for (let i = 0; i < selectedEmpToRemove.length; i++) {
        try {
            //DELETE REQURST
            const res = await (new EmployeeApi()).removeEmployee(selectedEmpToRemove[i], { credentials: 'include' });
            tempEmps = tempEmps.filter(emp => emp.id !== selectedEmpToRemove[i]);
            tempRows = tempRows.filter(emp => emp.id !== selectedEmpToRemove[i]);
            console.log("Sucsses to remove employee: " + selectedEmpToRemove[i]);
            globalStore.notificationStore.show({ message: `Sucsses to remove employee: ${selectedEmpToRemove[i]}`, severity: "success" });
        } catch (err) {
            console.log("failed to remove employee: " + selectedEmpToRemove[i]);
            globalStore.notificationStore.show({ message: `failed to remove employee: ${selectedEmpToRemove[i]}`, severity: "error" });

        }
    }
    setEmployees(tempEmps);
    setTableRows(tempRows);
}

interface EnhancedTableToolbarProps {
    selectedEmpToRemove: readonly string[];
    employees: EmployeeDTO[];
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
    numSelected: number;
    tableRows: EmployeeDTO[];
    setTableRows: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
    setSelectedEmpToRemove: React.Dispatch<React.SetStateAction<readonly string[]>>;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { selectedEmpToRemove, employees, setEmployees, numSelected, tableRows, setTableRows, setSelectedEmpToRemove } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h5"
                    id="tableTitle"
                    component="div"
                >
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={(event) => {
                        deleteSelectedEmp(selectedEmpToRemove, employees, setEmployees, tableRows, setTableRows);
                        setSelectedEmpToRemove([]);
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <div />
            )}
        </Toolbar>
    );
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const EmployeesPage = observer(() => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof EmployeeDTO>('id');
    const [selectedEmpToRemove, setSelectedEmpToRemove] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [employees, setEmployees] = React.useState<EmployeeDTO[]>([]);
    const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
    const [phoneNumber, setValuePhoneEmp] = React.useState("");
    const [valueFirstNameEmp, setValueFirstNameEmp] = React.useState("");
    const [valueLastNameEmp, setValueLastNameEmp] = React.useState("");
    const [valueEmailEmp, setValueEmailEmp] = React.useState("");
    const [valueAddRoleToEmp, setValueAddRoleToEmp] = React.useState("");
    const [valueNewRole, setValueNewRole] = React.useState("");
    const [roleSelectKey, setRoleSelectKey] = React.useState(0);
    const [valueRoles, setValueRoles] = React.useState<string[]>([]);
    const [valuesearchedEmp, setValuesearchedEmp] = React.useState<string>("");
    const [tableRows, setTableRows] = React.useState<EmployeeDTO[]>([]);
    const [roleRows, setRoleRows] = React.useState<string[]>([]);
    const [valuesearcheRole, setValuesearcheRole] = React.useState<string>("");
    const [currentTab, setCurrentTab] = React.useState<EmpsSubTab>(EmpsSubTab.Roles);
    const [freeSearchEmp, setFreeSearchEmp] = React.useState<string>('');
    const [freeSearchRole, setFreeSearchRole] = React.useState<string>('');
    const [showAddEmpDialog, setShowAddEmpDialog] = React.useState<boolean>(false);

    const getRolesTab = () => {
        return (
            <div
                style={{
                    width: "100%",
                    height: '100%',
                    marginRight: "100px",
                    backgroundColor: '#fff',
                    justifyContent: "center",
                    padding: '20px'
                }}
            >
                {/* TITLE */}
                <div
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        display: "flex"
                    }}
                >
                    <Typography variant="h6" gutterBottom component="div">
                        Roles Dashboard
                    </Typography>
                </div>
                <div style={{ padding: '30px 20px' }}>
                    <div style={{ display: 'flex', marginBottom: "10px" }}>
                        <TextField
                            id="addNewRoleTextField"
                            label="New Role"
                            variant="outlined"
                            value={valueNewRole}
                            onChange={handleChangeNewRole}
                            style={{ marginRight: "20px", width: "235px" }}
                            size="small"
                        />
                        <Button id="addNewRoleButton" disableElevation={true} variant="contained" size="medium" onClick={(event) => {
                            if (valueNewRole.length === 0) {
                                console.log("new role is empty");
                                globalStore.notificationStore.show({ message: "new role is empty", severity: "error" });
                            }
                            else
                                addNewRole(valueNewRole);
                            setValueNewRole("");
                        }}
                        >Add New Role
                        </Button>
                    </div>
                    <TextField
                        placeholder='Search Role'
                        value={freeSearchRole}
                        size='small'
                        style={{ width: '380px', marginBottom: '20px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            setFreeSearchRole(e.target.value);
                            setPage(0);
                        }}
                    />
                    <RolesList />
                </div>
            </div>);
    }

    const getEmployeesTab = () => {
        return (
            <div
                style={{
                    width: "100%",
                    height: '100%',
                    marginRight: "100px",
                    backgroundColor: '#fff',
                    justifyContent: "center",
                    padding: '0 20px 20px 20px'
                }}
            >
                {/* TITLE */}
                <div
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        display: "flex",
                        paddingTop: '20px'
                    }}
                >
                    <Typography variant="h6" gutterBottom component="div">
                        Employees Dashboard
                    </Typography>
                </div>
                <div>
                    <TextField
                        value={freeSearchEmp}
                        size="small"
                        placeholder="Search Employee"
                        onChange={(e) => {
                            setFreeSearchEmp(e.target.value);
                            setPage(0);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button style={{ float: 'right' }} onClick={() => setShowAddEmpDialog(prev => !prev)}>Add Employee +</Button>
                </div>
                {showAddEmpDialog && <div style={{
                    position: 'absolute',
                    height: '480px',
                    backgroundColor: '#F9F9F9',
                    width: '400px',
                    zIndex: '10',
                    borderStyle: 'solid',
                    padding: '10px',
                    borderWidth: 'thin',
                    top: '280px',
                    right: '60px'
                }}>
                    <div style={{ width: '100%', paddingLeft: '12px', paddingTop: '10px' }}>
                        <Label>Add Employee</Label>
                    </div>
                    <div style={{ width: '100%' }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            size="small"
                            value={valueFirstNameEmp}
                            onChange={handleChangeEmpFirstName}
                            style={{ marginRight: "20px", marginTop: "20px", marginLeft: "10px", backgroundColor: '#fff' }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            size="small"
                            value={valueLastNameEmp}
                            onChange={handleChangeEmpLastName}
                            style={{ marginRight: "20px", marginTop: "20px", marginLeft: "10px", backgroundColor: '#fff' }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            size="small"
                            value={valueEmailEmp}
                            onChange={handleChangeEmpEmail}
                            style={{ marginRight: "20px", marginTop: "20px", marginLeft: "10px", backgroundColor: '#fff' }}
                        />
                    </div>
                    <div style={{ width: '100%', padding: '12px' }}>
                        <PhoneInput
                            defaultCountry="IL"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={handleChangePhoneName}
                            className="custom-phone-input"
                            style={{ marginRight: "127px", marginTop: "20px", height: '39px' }}
                        />
                    </div>
                    <div style={{ width: '100%', padding: '12px' }}>
                        {/* <Label>Select Roles</Label> */}
                        <div>
                            <AsyncSelect
                                isMulti
                                cacheOptions
                                onChange={(allSelected) => setSelectedRoles(allSelected.map((item: any) => item?.value))}
                                loadOptions={(inputVal, cb) => {
                                    getRoles().then(RolesFromServer => {
                                        cb(RolesFromServer.map(item => ({
                                            value: item,
                                            label: item
                                        })));
                                    })
                                }}
                                key={`${roleSelectKey}`}
                                defaultOptions
                                placeholder={'Select roles...'}
                            />
                        </div>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Button
                            id={"addEmpButton"}
                            variant="contained"
                            disableElevation={true}
                            style={{ marginTop: "20px", marginRight: "10px", float: 'right' }}
                            onClick={(event) => {
                                var newEmp: NewEmployeeDTO = {
                                    firstName: valueFirstNameEmp,
                                    lastName: valueLastNameEmp,
                                    fullName: valueFirstNameEmp.concat(" ").concat(valueLastNameEmp),
                                    email: valueEmailEmp,
                                    phoneNumber: phoneNumber,
                                    roles: selectedRoles
                                };

                                if (valueFirstNameEmp === "") {
                                    console.log("Employee first name is empty");
                                    globalStore.notificationStore.show({ message: "Employee first name is empty", severity: "error" });
                                }
                                else if (valueLastNameEmp === "") {
                                    console.log("Employee last name is empty");
                                    globalStore.notificationStore.show({ message: "Employee last name is empty", severity: "error" });
                                }
                                else if (valueEmailEmp.length === 0) {
                                    console.log("Employee email is empty");
                                    globalStore.notificationStore.show({ message: "Employee email is empty", severity: "error" });
                                }
                                else if (phoneNumber.length === 0) {
                                    console.log("Employee phone is empty");
                                    globalStore.notificationStore.show({ message: "Employee phone is empty", severity: "error" });
                                }
                                else if (selectedRoles.length === 0) {
                                    console.log("Employee roles is empty");
                                    globalStore.notificationStore.show({ message: "Employee roles is empty", severity: "error" });
                                }
                                else {
                                    sendNewEmployee(newEmp);
                                }
                                setShowAddEmpDialog(false);
                            }}
                        >Add Employee
                        </Button>
                    </div>
                </div>}
                <EnhancedTableToolbar
                    selectedEmpToRemove={selectedEmpToRemove}
                    employees={employees}
                    setEmployees={setEmployees}
                    numSelected={selectedEmpToRemove.length}
                    tableRows={tableRows}
                    setTableRows={setTableRows}
                    setSelectedEmpToRemove={setSelectedEmpToRemove} />
                <div style={{ overflow: 'auto', height: '390px' }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selectedEmpToRemove.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={tableRows.length}
                            />
                            {<TableBody>
                                {tableRows
                                    .filter(row => {
                                        return row.firstName?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                                            row.lastName?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                                            row.email?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                                            row.phoneNumber?.toLowerCase()?.includes(freeSearchEmp.toLowerCase())
                                    })
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((employee: EmployeeDTO, index: number) => {
                                        const isItemSelected = isSelected((employee.id || "*error*").toString());
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                sx={{ height: '20px' }}
                                                key={employee.id}
                                                selected={isItemSelected}
                                            >

                                                <TableCell
                                                    padding="checkbox"
                                                    onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }} />
                                                </TableCell>
                                                <TableCell
                                                    onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    width={'20%'}
                                                >
                                                    {employee.firstName}
                                                </TableCell>
                                                <TableCell
                                                    padding="none"
                                                    width={'20%'}
                                                    onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}>
                                                    {employee.lastName}
                                                </TableCell>
                                                <TableCell
                                                    padding="none"
                                                    width={'20%'}
                                                    onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}>
                                                    {employee.email}
                                                </TableCell>
                                                <TableCell
                                                    padding="none"
                                                    width={'25%'}
                                                    onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}>
                                                    {employee.phoneNumber}
                                                </TableCell>
                                                <TableCell padding="none" width={'15%'}>
                                                    <RolesListForEmp employee={employee} employees={employees} setEmployees={setEmployees}
                                                        tableRows={tableRows} setTableRows={setTableRows} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            }
                        </Table>
                    </TableContainer>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tableRows.filter(row => {
                        return row.firstName?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                            row.lastName?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                            row.email?.toLowerCase()?.includes(freeSearchEmp.toLowerCase()) ||
                            row.phoneNumber?.toLowerCase()?.includes(freeSearchEmp.toLowerCase())
                    }).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>);
    }


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value, 10);
        setRowsPerPage(number);
        setPage(0);
    };



    const getCurrentTab = () => {
        switch (currentTab) {
            case EmpsSubTab.Employees:
                return getEmployeesTab();
            case EmpsSubTab.Roles:
                return getRolesTab();
            default:
                console.log('unsupported tab')
                return <div />;
        }
    }

    const clearComponentsAfterAddNewEmp = () => {
        setValueFirstNameEmp("");
        setValueLastNameEmp("")
        setValueEmailEmp("");
        setValuePhoneEmp("");
        setRoleSelectKey(prev => prev + 1);
    }

    const multiFilterSearchEmp = (arr: EmployeeDTO[], searchVal: string): EmployeeDTO[] => {
        const searchValLC = searchVal.toLowerCase();
        let filterByName = arr.filter((emp) => {
            return emp.fullName?.toLowerCase().includes(searchValLC);
        });
        let filterByRole = arr.filter((emp) => {
            let flag = false;

            for (let i = 0; i < (emp.roles || []).length; i++) {

                if ((emp.roles || [])[i].toLocaleLowerCase().includes(searchValLC)) {
                    flag = true;
                    break;
                }

            }

            return flag;
        });
        let filterByPhone = arr.filter((emp) => {
            return emp.phoneNumber?.toLowerCase().includes(searchValLC);
        });
        let filterByEmail = arr.filter((emp) => {
            return emp.email?.toLowerCase().includes(searchValLC);
        });


        let sumAllFilter = filterByName.concat(filterByRole, filterByPhone, filterByEmail);

        return sumAllFilter.filter((emp, index) => {
            let indexof: number = -1;
            for (let i = 0; i < sumAllFilter.length; i++) {
                if (sumAllFilter[i].id === emp.id) {
                    indexof = i;
                    break;
                }
            }

            return indexof === index;
        });
    }

    const sendNewEmployee = async (employee: NewEmployeeDTO): Promise<void> => {
        try {
            // POST REQUEST
            const res = await (new EmployeeApi()).addEmployee({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                roles: employee.roles
            },
                { credentials: 'include' });

            var EmpToAdd: EmployeeDTO = {
                firstName: employee.firstName,
                lastName: employee.lastName,
                fullName: employee.fullName,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                roles: employee.roles,
                id: res.employeeId
            };

            var tempemps = employees;
            tempemps.unshift(EmpToAdd);

            if (!tableRows.includes(EmpToAdd)) {
                var temprows = tableRows;
                temprows.unshift(EmpToAdd);
            }

            clearComponentsAfterAddNewEmp();
            //we dont need to get the password
            console.log(res.message);
            globalStore.notificationStore.show({ message: res.message || "**error**", severity: "success" });
            //we need to send an email to the employee for sign in to the system
        } catch (err) {
            console.log('failed to set employee');
            globalStore.notificationStore.show({ message: "failed to set employee", severity: "error" });
        }
    }

    const fetchEmployees = async () => {
        const employeesFromServer = await getEmployees();
        setEmployees(employeesFromServer);
        setTableRows(employeesFromServer);
    }

    const fetchRoles = async () => {
        const RolesFromServer = await getRoles();
        setValueRoles(RolesFromServer);
        setRoleRows(RolesFromServer);
    }

    React.useEffect(() => {
        fetchEmployees();
        fetchRoles();
    }, []);

    const deleteRole = async (roleToRemove: string): Promise<void> => {
        if (roleRows.includes(roleToRemove) === false) {
            console.log(`Can not delete role '${roleToRemove}' because he is not exsists`);
        }
        else {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].roles?.includes(roleToRemove)) {
                    console.log(`Can not delete role '${roleToRemove}' because the employee '${employees[i].fullName}' has it`);
                    globalStore.notificationStore.show({ message: `Can not delete role '${roleToRemove}' because the employee '${employees[i].fullName}' has it`, severity: "error" });
                    return;
                }
            }

            try {
                //DELETE REQURST
                const res = await (new RoleApi()).removeRole(roleToRemove, { credentials: 'include' });
                setRoleSelectKey(prev => prev + 1);
                var updateRoles = valueRoles;
                var index1 = updateRoles.indexOf(roleToRemove);
                if (index1 !== -1) {
                    updateRoles.splice(index1, 1);//somehow this row update roleRows too and rerander the list of roles
                }                                 //just when they equal
                var updateRoleRows = roleRows;
                var index2 = updateRoleRows.indexOf(roleToRemove);
                if (index2 !== -1) {
                    updateRoleRows.splice(index2, 1);
                }
                //setRoleRows([...updateRoleRows]);
                console.log(res.message);
                globalStore.notificationStore.show({ message: res.message || "**error**", severity: "success" });

            }
            catch (err) {
                console.log(`Failed to delete role '${roleToRemove}'`);
                globalStore.notificationStore.show({ message: `Failed to delete role '${roleToRemove}'`, severity: "error" });
            }
        }
    }

    const addNewRole = async (newRole: string): Promise<void> => {
        if (roleRows.includes(newRole)) {
            console.log(`Can not add role '${newRole}' because he is already exsists`);
            globalStore.notificationStore.show({ message: `Can not add role '${newRole}' because he is already exsists`, severity: "error" });
        }
        else {
            try {
                // POST REQUEST
                const res: GenericResponseDTO = await (new RoleApi()).addNewRole({ role: newRole }, { credentials: 'include' });
                setRoleSelectKey(prev => prev + 1);
                var updateRoles = valueRoles;
                updateRoles.unshift(newRole);//somehow this row update roleRows too and rerander the list of roles
                //just when they equal
                if (roleRows.includes(newRole) === false) {
                    var updateRoleRows = roleRows;
                    updateRoleRows.unshift(newRole);
                    //setRoleRows(roleRows);
                }
                console.log(res.message);
                globalStore.notificationStore.show({ message: res.message || "*error*", severity: "success" });
            } catch (err) {
                console.log(`Failed to add new role '${newRole}'`);
                globalStore.notificationStore.show({ message: `Failed to add new role '${newRole}'`, severity: "error" });
            }
        }
    }


    const renderRow = (props: ListChildComponentProps) => {
        const { index, style } = props;

        return (
            <ListItem style={style} key={index} component="div" disablePadding
                secondaryAction={

                    <IconButton edge="end" aria-label="delete" style={{ marginLeft: "110px" }} onClick={(event) => {
                        deleteRole(roleRows[index]);
                    }}>
                        <DeleteIcon />
                    </IconButton>
                }>
                <ListItemButton>
                    <ListItemText primary={`${roleRows[index]}`} />
                </ListItemButton>
            </ListItem>
        );
    }

    const addRoleToEmp = async (employee: EmployeeDTO, role: string): Promise<void> => {
        try {
            // POST REQUEST
            const res = await (new RoleApi()).addRoleToEmp(employee.id || "*error*", role, { credentials: 'include' });
            var emplyeesAfterChange: EmployeeDTO[] = employees;
            emplyeesAfterChange.map(emp => {
                if (emp.id === employee.id) {
                    emp.roles?.unshift(role);
                }
            });

            setEmployees([...emplyeesAfterChange]);
            console.log(res.message);
            globalStore.notificationStore.show({ message: res.message || "*error*", severity: "success" });
            //console.log(`employees: ${JSON.stringify(employees, undefined, 2)}`)
        }
        catch (err) {
            console.log(`Failed to add role: '${role}' to employee: '${employee.fullName}'`);
            globalStore.notificationStore.show({ message: `Failed to add role: '${role}' to employee: '${employee.fullName}'`, severity: "error" });
        }
    }

    const RolesList = () => {
        return (
            <List style={{ width: '380px', overflow: 'auto', height: '335px' }}>
                {roleRows
                    .filter((role) => role.toLowerCase().includes(freeSearchRole.toLowerCase()))
                    .map((role, index: number) => {
                        return (
                            <ListItem component="div" disablePadding key={index.toString()}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" style={{ marginLeft: "110px" }} onClick={(event) => {
                                        deleteRole(role);
                                    }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                <ListItemButton>
                                    <ListItemText primary={`${role}`} />
                                </ListItemButton>
                            </ListItem>);
                    })}
            </List>
        );
    }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof EmployeeDTO,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        switch (property) {
            case "firstName":
                {
                    if (order === 'asc')
                        tableRows.sort((e1, e2) => e1.firstName?.localeCompare(e2.firstName || "a") || 0);
                    else
                        tableRows.sort((e1, e2) => e2.firstName?.localeCompare(e1.firstName || "a") || 0);
                    break;
                }
            case "lastName":
                {
                    if (order === 'asc')
                        tableRows.sort((e1, e2) => e1.lastName?.localeCompare(e2.lastName || "a") || 0);
                    else
                        tableRows.sort((e1, e2) => e2.lastName?.localeCompare(e1.lastName || "a") || 0);
                    break;
                }
            case "email":
                {
                    if (order === 'asc')
                        tableRows.sort((e1, e2) => e1.email?.localeCompare(e2.email || "a") || 0);
                    else
                        tableRows.sort((e1, e2) => e2.email?.localeCompare(e1.email || "a") || 0);
                    break;
                }
            case "phoneNumber":
                {
                    if (order === 'asc')
                        tableRows.sort((e1, e2) => e1.phoneNumber?.localeCompare(e2.phoneNumber || "a") || 0);
                    else
                        tableRows.sort((e1, e2) => e2.phoneNumber?.localeCompare(e1.phoneNumber || "a") || 0);
                    break;
                }
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = tableRows.map((n) => n.id || "*error*");
            setSelectedEmpToRemove(newSelecteds);
            return;
        }
        setSelectedEmpToRemove([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selectedEmpToRemove.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedEmpToRemove, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedEmpToRemove.slice(1));
        } else if (selectedIndex === selectedEmpToRemove.length - 1) {
            newSelected = newSelected.concat(selectedEmpToRemove.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedEmpToRemove.slice(0, selectedIndex),
                selectedEmpToRemove.slice(selectedIndex + 1),
            );
        }

        setSelectedEmpToRemove(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: string) => selectedEmpToRemove.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty employees.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

    const handleChangePhoneName = (newPhone: E164Number | undefined) => {
        setValuePhoneEmp(newPhone as string);
    };

    const handleChangeEmpFirstName = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const name: string = e.target.value.toString();
        if (onlyLetters(name) || name.length === 0)
            setValueFirstNameEmp(name);
    };

    const handleChangeEmpLastName = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const name: string = e.target.value.toString();
        if (onlyLetters(name) || name.length === 0)
            setValueLastNameEmp(name);
    };

    const handleChangeEmpEmail = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueEmailEmp(e.target.value);
    };

    const handleChangeAddRoleToEmp = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueAddRoleToEmp(e.target.value);
    };

    const handleChangeNewRole = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const role: string = e.target.value.toString();
        if (onlyLetters(role) || role.length === 0)
            setValueNewRole(role);
    };

    return (<>
        <div style={{
            width: '100%',
            height: '600px',
            display: 'flex'
        }}>
            <div style={{
                width: '20%', height: '100%', backgroundColor: '#fff', marginRight: '10px ', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '8px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}>
                <div style={{ width: '100%', color: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', display: 'flex' }}><h3>Settings</h3></div>
                <div><Button style={{ width: '100%', paddingTop: '10px', borderRadius: '0px', backgroundColor: currentTab === EmpsSubTab.Roles ? '#EFF8FF' : '' }} onClick={() => setCurrentTab(EmpsSubTab.Roles)}>Roles</Button></div>
                <div><Button style={{ width: '100%', paddingTop: '10px', borderRadius: '0px', backgroundColor: currentTab === EmpsSubTab.Employees ? '#EFF8FF' : '' }} onClick={() => setCurrentTab(EmpsSubTab.Employees)}>Employees</Button></div>
            </div>
            <div style={{
                width: '80%', height: '100%', overflow: 'hidden', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '8px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}>
                {getCurrentTab()}
            </div>
        </div>
    </>
    );
});