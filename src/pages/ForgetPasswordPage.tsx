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
import { EmployeeApi, EmployeeDTO, EmployeesDTO, GenericResponseDTO, NewEmployeeDTO, RoleApi, RolesDTO, SettingsApi } from '../swagger/stubs';
import AsyncSelect from 'react-select/async';
import cssVars from '@mui/system/cssVars';
import { FormControlUnstyledContext } from '@mui/base';
import { isGenerator } from 'mobx/dist/internal';
import { companyService } from '../services/companyService';









export const ForgetPasswordPage = observer(() => {
    const [valueEmailEmp, setValueEmailEmp] = React.useState("");

    const handleChangeEmpEmail = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueEmailEmp(e.target.value);
    };

     return (<>
         <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{marginBottom: "10px"}}>
                <TextField id="EmailUserTextField" label="Email" variant="outlined" value={valueEmailEmp}
                     onChange={handleChangeEmpEmail} style={{ marginRight: "20px", marginTop: "20px", marginLeft: "10px" }} />
            </div>
             <Button id="generatepasswordButton" disableElevation={true} variant="contained" onClick={(event) => {
                    {/**
                        if user exsists send to his email new temp password
                        else tell that he is not and he need to sign up below or in prev page
                    */}
                     }}
             >Generate new password
             </Button>

         </Paper>
         </>);

});