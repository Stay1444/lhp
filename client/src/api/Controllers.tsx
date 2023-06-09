import axios, { AxiosError } from "axios";
import User from "./User";
import Domain from "./Domain";

type Token = string;

export class ControllerOptions {
    public static Authorization: string | undefined;
}


const url = (path: string) => {
    return "http://localhost:5000" + path;
}

export class IdentityController {
    public static Me = async (): Promise<User | undefined> => {
        const response = await axios.get(url("/api/identity/me"), {
            headers: {
                Authorization: ControllerOptions.Authorization
            }
        })

        if (response.status != 200) return;

        return response.data as User;
    }

    public static Login = async (name: string): Promise<Token | undefined> => {
        const response = await axios.post(url("/api/identity/login"), {
            name: name
        })

        if (response.status != 200) {
            return;
        }

        return response.data.token as Token;
    }

    public static Register = async (name: string): Promise<Token | undefined> => {
        try {
            const response = await axios.post(url("/api/identity/register"), {
                name: name
            })
    
            if (response.status != 200) {
                throw new Error(response.data)
            }
    
            return response.data.token as Token;
        } catch(error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data);
            }
        }

    }
}

export class DomainController {
    public static List = async (): Promise<Domain[] | undefined> => {
        try {

            const response = await axios.get(url("/api/domain/list"), {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            return response.data as Domain[];
        } catch {
            return;
        }
    }
}