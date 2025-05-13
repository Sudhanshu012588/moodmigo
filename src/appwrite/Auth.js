import {account,ID} from './config';
import { Navigate } from 'react-router-dom';
export const login = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    try {
        const session = await account.createEmailPasswordSession(email, password);
        if (session) {
            const { jwt } = await account.createJWT();
            localStorage.setItem("token", jwt);
            console.log("JWT Token:", jwt);
            
        }
        return session;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Failed to log in: " + error.message);
    }
}



export const signup = async (name, email, password) => {
    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
    }
    try {
        const user = await account.create(ID.unique(), email, password, name);
        console.log("User created:", user);
        // await account.deleteSession('current');
        return user;
    } catch (error) {
        console.error("Signup error:", error);
        throw new Error("Failed to sign up: " + error.message);
    }
}
export const fetchUser = async () => {
    try {
        const session = await account.getSession('current');
       
        const user = await account.get();
        return user;
    } catch (error) {
        console.error("Fetch user error:", error);
        throw new Error("Failed to fetch user: " + error.message);
    }
}
// export const logout = async () => {}