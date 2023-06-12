import axios, { AxiosError } from "axios";
import User from "./User";
import Domain from "./Domain";
import Machine from "./Machine";
import ApiError from "./ApiError";
import Image from "./Image";
import MachineState from "./MachineStatus";

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

    public static Delete = async (id: string): Promise<boolean | ApiError | undefined> => {
        try {
            
            const response = await axios.delete(url(`/api/domain/${id}`), {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            if (response.status == 200) return true;
            return false;
        } catch (error) {
            if (error instanceof AxiosError && error.response != undefined) {
                const apiError = error.response.data as ApiError;
                return new ApiError(apiError.code, apiError.message);
            }

            return;
        }
    }

    public static Update = async (id: string, target: string): Promise<boolean | ApiError | undefined> => {
        try {
            
            const response = await axios.patch(url(`/api/domain/${id}`), {
                target
            }, 
            {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            if (response.status == 200) return true;
            return false;
        } catch (error) {
            if (error instanceof AxiosError && error.response != undefined) {
                const apiError = error.response.data as ApiError;
                return new ApiError(apiError.code, apiError.message);
            }

            return;
        }
    }

    public static Check = async (domain: string, tld: string): Promise<boolean | ApiError | undefined> => {
        try {
            
            const response = await axios.post(url("/api/domain/check"), {
                domain,
                tld                
            }, 
            {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            if (response.status == 200) return true;
            return false;
        } catch (error) {
            if (error instanceof AxiosError && error.response != undefined) {
                const apiError = error.response.data as ApiError;
                return new ApiError(apiError.code, apiError.message);
            }

            return;
        }
    }

    public static Register = async (domain: string, tld: string, target: string): Promise<Domain | ApiError | undefined> => {
        try {
            const response = await axios.post(url("/api/domain/register"), {
                domain,
                tld,
                target
            }, { headers: { Authorization: ControllerOptions.Authorization} })

            if (response.status == 200) return response.data as Domain;
            return undefined;
            
        } catch (error) {
            if (error instanceof AxiosError && error.response != undefined) {
                const apiError = error.response.data as ApiError;
                return new ApiError(apiError.code, apiError.message);
            }

            return;
        }
    }

    public static GetById = async(id: string): Promise<Domain | undefined> => {
        try {
            const response = await axios.get(url(`/api/domain/${id}`), 
            { headers: { Authorization: ControllerOptions.Authorization} })

            if (response.status == 200) return response.data as Domain;
            return undefined;
            
        } catch (error) {
            return;
        }
    }
}

export class MachineController {
    public static List = async (): Promise<Machine[] | undefined> => {
        try {
            const response = await axios.get(url("/api/machine/list"), {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            return response.data as Machine[]
        } catch {
            return;
        }
    }

    public static Create = async (name: string, imageId: string): Promise<Machine | ApiError | undefined> => {
        try {
            const response = await axios.post(url("/api/machine/create"), {
                name,
                imageId
            }, { headers: { Authorization: ControllerOptions.Authorization} })

            if (response.status == 200) return response.data as Machine;
            return undefined;
            
        } catch (error) {
            if (error instanceof AxiosError && error.response != undefined) {
                const apiError = error.response.data as ApiError;
                return new ApiError(apiError.code, apiError.message);
            }

            return;
        }
    }

    public static Delete = async (id: string): Promise<undefined> => {
        try {
            await axios.delete(url(`/api/machine/${id}`), {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })
        } catch {
            return;
        }
    }

    public static GetStatus = async (id: string): Promise<MachineState> => {
        const response = await axios.get(url(`/api/machine/${id}/status`), { headers: { Authorization: ControllerOptions.Authorization} })

        return response.data as MachineState;
    }

    public static Toggle = async (id: string): Promise<MachineState> => {
        const response = await axios.post(url(`/api/machine/${id}/toggle`), {}, {
            headers: {
                Authorization: ControllerOptions.Authorization
            }
        });

        return response.data as MachineState;
    }
}

export class ImageController {
    public static List = async (): Promise<Image[] | undefined> => {
        try {
            const response = await axios.get(url("/api/image/list"), {
                headers: {
                    Authorization: ControllerOptions.Authorization
                }
            })

            return response.data as Image[]
        } catch {
            return;
        }
    }
}