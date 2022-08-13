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
import { Paper } from '@mui/material';
import { observer } from 'mobx-react';
import { EmployeeApi, EmployeeDTO, EmployeesDTO, NewEmployeeDTO, RoleApi, RoleDTO, RolesDTO } from '../swagger/stubs';
import AsyncSelect from 'react-select/async';
import cssVars from '@mui/system/cssVars';
import { FormControlUnstyledContext } from '@mui/base';
import { isGenerator } from 'mobx/dist/internal';


const Root = styled('div')(
    ({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
        };
  font-size: 14px;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;



interface TagProps extends ReturnType<AutocompleteGetTagProps> {
    label: string;
}

function Tag(props: TagProps) {
    const { label, onDelete, ...other } = props;
    return (
        <div {...other}>
            <span>{label}</span>
            <CloseIcon onClick={onDelete} />
        </div>
    );
}




const sendNewEmployee = async (employee: NewEmployeeDTO, employees: EmployeeDTO[], setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>): Promise<void> => {
    try {
        // POST REQUEST
        const res = await (new EmployeeApi()).addEmployee({
            name: employee.name,
            phoneNumber: employee.phoneNumber,
            roles: employee.roles
        });


        //the id is the name just for now
        var EmpToAdd: EmployeeDTO = { name: employee.name, phoneNumber: employee.phoneNumber, roles: employee.roles, id: employee.name };


        var tempemps = employees;
        tempemps.unshift(EmpToAdd);//PROBLEM: ADD EMP WITHOUT ID!!!
        setEmployees([...tempemps]);
        console.log("Sucsses to set employee");
    } catch (err) {
        console.log('failed to set employee');
    }
}

const getEmployees = async (): Promise<EmployeeDTO[]> => {
    try {
        // GET REQUEST
        const res: EmployeesDTO = await (new EmployeeApi()).getAllEmployees();
        const employees: EmployeeDTO[] = res.employees ?? [];
        //console.log(`employees: ${JSON.stringify(employees, undefined, 2)}`)
        return employees;
    } catch (err) {
        console.log('failed to get employees');
        return [];
    }
}



const getRoles = async (): Promise<string[]> => {
    try {
        // GET REQUEST
        const res: RolesDTO = await (new RoleApi()).getAllRoles();
        return res?.names ?? [];
    } catch (err) {
        console.log('failed to get roles');
        return [];
    }
}




const deleteRoleForEmp = async (employee: EmployeeDTO, role: string): Promise<void> => {
    console.log(employee.name + "role: " + role);


    //need to dominant this buuton to when a press on it it wiil not press the whole row or just to call setSelected() with specific row
    //need to POST requst to the server to delete this role from the specific employee
    //need to re-rander the table og employees
}

interface RolesListForEmpProps {
    employee: EmployeeDTO;
}

function RolesListForEmp(props: RolesListForEmpProps) {
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    var lines = [];

    for (let i = 0; i < (props?.employee?.roles || []).length; i++) {
        lines.push(
            <ListItem
                key={i}
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(event) => {
                        deleteRoleForEmp(props.employee, (props?.employee?.roles || [])[i]);
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
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: ' Employee name',
    },
    {
        id: 'phoneNumber',
        numeric: false,
        disablePadding: false,
        label: 'Phone number',
    },
    {
        id: 'roles',
        numeric: false,
        disablePadding: false,
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
                {headCells.map((headCell) => (
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
                ))}
            </TableRow>
        </TableHead>
    );
}


const deleteSelectedEmp = async (selectedEmpToRemove: readonly string[], employees: EmployeeDTO[], setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>): Promise<void> => {
    for (let i = 0; i < selectedEmpToRemove.length; i++) {
        try {
            //DELETE REQURST
            const res = await (new EmployeeApi()).removeEmployee(selectedEmpToRemove[i]);
            setEmployees(employees.filter(emp => emp.id !== selectedEmpToRemove[i]))
            console.log("Sucsses to remove employee: " + selectedEmpToRemove[i]);
        } catch (err) {
            console.log("failed to remove employee: " + selectedEmpToRemove[i]);
        }
    }
}

interface ButtonAddNewEmpProps {
    employees: EmployeeDTO[];
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
    id: string;
    disableElevation: boolean;
    selectedRoles: string[];
    phoneNumber: string;
    valueNameEmp: string;
}

const onclickAddEmp = (employees: EmployeeDTO[], setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>,
    valueNameEmp: string, phoneNumber: string, selectedRoles: string[]): void => {
    var newEmp: NewEmployeeDTO = { name: valueNameEmp, phoneNumber: phoneNumber, roles: selectedRoles };

    if (valueNameEmp.length === 0 || !valueNameEmp.match(/[a-z]/i)) {
        console.log("Employee name is not valid");
    }
    else if (phoneNumber.length === 0) {
        console.log("Employee phone is empty");
    }
    else if (selectedRoles.length === 0) {
        console.log("Employee roles is empty");
    }
    else {
        sendNewEmployee(newEmp, employees, setEmployees);
    }
}

const ButtonAddNewEmp = (props: ButtonAddNewEmpProps) => {
    const { employees, setEmployees, id, disableElevation, selectedRoles, phoneNumber, valueNameEmp } = props;

    return (
        <Button id={id} variant="contained" disableElevation={disableElevation} style={{ marginTop: "20px", marginRight: "10px" }} onClick={(event) => {
            onclickAddEmp(employees, setEmployees,
                valueNameEmp, phoneNumber, selectedRoles);
        }}
        >Add Employee</Button>
    );
}


interface EnhancedTableToolbarProps {
    selectedEmpToRemove: readonly string[];
    employees: EmployeeDTO[];
    setEmployees: React.Dispatch<React.SetStateAction<EmployeeDTO[]>>;
    numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { selectedEmpToRemove, employees, setEmployees, numSelected } = props;

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
                    Employees
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={(event) => {
                        deleteSelectedEmp(selectedEmpToRemove, employees, setEmployees);
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
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
    const [valueNameEmp, setValueNameEmp] = React.useState("");

    const fetchEmployees = async () => {
        const employeesFromServer = await getEmployees();
        setEmployees(employeesFromServer);
    }

    React.useEffect(() => {
        fetchEmployees();
    }, []);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof EmployeeDTO,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = employees.map((n) => n.id || "*error*");
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

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: string) => selectedEmpToRemove.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty employees.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;







    //the type of the event is wrong
    const handleChangePhoneName = (newPhone: E164Number | undefined) => {
        setValuePhoneEmp(newPhone as string);
    };



    const handleChangeEmpName = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const name: string = e.target.value.toString();
        if (name[name.length - 1] < '0' || name[name.length - 1] > '9' || name.length === 0)
            setValueNameEmp(e.target.value);
    };

    /// console.log(`selected roles: ${JSON.stringify(selectedRoles, undefined, 2)}`)

    return (<>
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            < div style={{ display: 'flex' }}>
                <TextField id="nameEmpTextField" label="Name" variant="outlined" value={valueNameEmp} onChange={handleChangeEmpName} style={{ marginRight: "20px", marginTop: "20px", marginLeft: "10px" }} />
                <PhoneInput id="phoneEmpTextField" defaultCountry="IL" placeholder="Enter phone number" value={phoneNumber}
                    onChange={handleChangePhoneName} style={{ marginRight: "20px", marginTop: "20px" }} />

                <div style={{ display: "inline-block", marginRight: "20px", marginTop: "20px" }}>
                    <Label>Enter Roles</Label>
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
                            defaultOptions
                        />
                    </div>
                </div>
                <ButtonAddNewEmp employees={employees} setEmployees={setEmployees} id={"addEmpButton"}
                    valueNameEmp={valueNameEmp} phoneNumber={phoneNumber} selectedRoles={selectedRoles}
                    disableElevation={true}></ButtonAddNewEmp>
            </div>

            <EnhancedTableToolbar selectedEmpToRemove={selectedEmpToRemove} employees={employees} setEmployees={setEmployees} numSelected={selectedEmpToRemove.length} />
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
                        rowCount={employees.length}
                    />
                    {<TableBody>
                        {//stableSort<EmployeeDTO>(employees, getComparator(order, orderBy))
                            employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((employee: EmployeeDTO, index: number) => {
                                    const isItemSelected = isSelected((employee.id || "*error*").toString());
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={employee.id}
                                            selected={isItemSelected}>

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
                                            >
                                                {employee.name}
                                            </TableCell>
                                            <TableCell align="right"
                                                onClick={(event) => handleClick(event, (employee.id || "*error*").toString())}>
                                                {employee.phoneNumber}
                                            </TableCell>
                                            <TableCell align="right">
                                                <RolesListForEmp employee={employee} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                                )
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={employees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    </>
    );
});


function employee(employee: any, i: number) {
    throw new Error('Function not implemented.');
}
/*
ללחוץ על הכפתור ולהוסיף עובדים לטבלה עם בדיקת תקינות קלט
אם מוחקים לי תפקיד מסויים אני צריך לעדכן במערכת עצמת ולמחוק מהטבלה
לגרום לכפתורים של הזבל לעבוד ולמחוק באמת את מה שלא צריך
לתקן את הכפתור של לעבור על עמוד הבא או לתת יותר מידע באותו עמוד
הטקסטפילד של המספר להפוך אותו לכזה של טלפון
לאסור על לצרף אותו אותו בן אדם בדיוק


*/

