import { LoginApi } from './../swagger/stubs/api';

export namespace loginService {

    export async function doLogin(email: string, password: string): Promise<void> {
        try {
            // todo: fix api- only email + password
            const res: any = await (new LoginApi()).doLogin({
                username: email,
                password
            },{ credentials: 'include' });
            console.log(JSON.stringify(res));
            
            if (!res.success) {
                throw new Error("Failed to login");
            }
        } catch (err) {
            console.error('Failed to login');
            throw err;
        }
    }

    export async function doLogout(): Promise<void> {
        try {
            const res: any = await (new LoginApi()).doLogout({ credentials: 'include' });
            if (!res.success) {
                throw new Error("Failed to logout");
            }
        } catch (err) {
            console.error('Failed to logout');
            throw err;
        }
    }

    export async function doSignup(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        comapnyName: string
    ): Promise<void> {
        try {
            // todo: fix api- manage this entire structure in the BE
            const res: any = await (new LoginApi()).doSignup({
                username: email,
                password
                // firstName,
                // lastName,
                // comapnyName
            }, { credentials: 'include' });
            if (!res.success) {
                throw new Error("Failed to signup");
            }
        } catch (err) {
            console.error('Failed to signup');
            throw err;
        }
    }

    export async function doSignout(): Promise<void> {
        try {
            // todo: fix api- no credentials needed here (get uesrname from context)
            const res: any = await (new LoginApi()).doSignout({}, { credentials: 'include' });
            if (!res.success) {
                throw new Error("Failed to signout");
            }
        } catch (err) {
            console.error('Failed to signout');
            throw err;
        }
    }
}