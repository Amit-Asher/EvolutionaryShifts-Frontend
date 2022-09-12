import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';
import { observer } from 'mobx-react';
import { LoginApi, SettingsApi } from '../swagger/stubs';

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export const ForgetPasswordPage = observer(() => {
    const [valueEmailUser, setValueEmailUser] = React.useState<string>("");
    const [generatePassword, setGeneratePassword] = React.useState<string>("");

    const handleChangeUserEmail = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueEmailUser(e.target.value);
    };

    const generatePasswordToUser = async (): Promise<void> => {
        try{
            // POST REQUEST   
            const res = await (new LoginApi()).generatePasswordForUser(valueEmailUser, { credentials: 'include' });
            if(res.success)
                setGeneratePassword("Your new password is: " + res.newPassword);
            else
                setGeneratePassword("Your email not in the system. Please try again or sign in");
                
            //we dont need to get the password and we dont need to send id of employee
            //res.newPassword
            console.log(res.message);
            //need to send an email to the user that contain his new password
        }catch (err) {
            console.log(`Failed to generate password to User with email: ${valueEmailUser}`);
        }
    }

     return (<>
         <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <div style={{marginBottom: "10px"}}>
                <TextField id="EmailUserTextField" label="Email" variant="outlined" value={valueEmailUser}
                     onChange={handleChangeUserEmail} style={{marginTop: "20px"}} />
            </div>
             <Button id="generatepasswordButton" disableElevation={true} variant="contained" style={{marginLeft: "15px"}}
              onClick={async (event) => {
                await generatePasswordToUser();
                    {/**
                        if user exsists send to his email new temp password from b.e
                        else tell that he is not and he need to sign up below or in prev page
                    */}
                     }}
             >Generate new password
             </Button>

             <Label>{generatePassword}</Label>
         </Container>
         </>);

});