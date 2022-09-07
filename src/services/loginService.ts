import { globalStore } from './../stores/globalStore';
import { LoginApi, SchemaDTO, SchemaFamilyDTO } from './../swagger/stubs/api';
import { arrangementService } from './arrangementService';

export namespace loginService {

    export async function doLogin(email: string, password: string): Promise<void> {
        try {
            const res: any = await (new LoginApi()).doLogin({
                username: email,
                password
            },{ credentials: 'include' });
            console.log(JSON.stringify(res));
            
            if (!res.success) {
                throw new Error("Failed to login");
            }
            keepAlive();
            await globalStore.arrangementStore.initialize();
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
            keepAlive();
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
            // stopKeepAlive();
        } catch (err) {
            console.error('Failed to signout');
            throw err;
        }
    }

    export async function doSlientLogin(): Promise<void> {
        try {
            const res: any = await (new LoginApi()).doSilentLogin({ credentials: 'include' });            
            if (!res.success) {
                throw new Error("Failed to login");
            }
            keepAlive();
            await globalStore.arrangementStore.initialize();
        } catch (err) {
            console.error('Failed to login');
            throw err;
        }
    }

    export async function keepAlive(): Promise<void> {
        setTimeout(async () => {
            (new LoginApi).keepAlive({ credentials: 'include' });
            keepAlive(); // loop forever. (note that this is not on stack)
        }, 1000 * 60); // every 1 minutes (token invalidation occur on 5 minutes)
    }
}