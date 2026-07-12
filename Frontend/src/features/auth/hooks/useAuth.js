// 2nd page of 4tear architecture.

import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context  // 3rd page is here.


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (!data?.user) {
                throw new Error("Login response did not include a user.")
            }
            setUser(data.user)
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })  // 4th page is here.
            if (!data?.user) {
                throw new Error("Register response did not include a user.")
            }
            setUser(data.user)
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            // NOTE: Do NOT use document.cookie to check for the token.
            // The backend sets the cookie as httpOnly:true (for XSS protection),
            // which makes it completely invisible to JavaScript's document.cookie.
            // Always call getMe() and let the server decide:
            //   - 200 → user is authenticated, set user state
            //   - 401 → cookie missing/invalid, set user to null
            try {
                const data = await getMe()
                setUser(data?.user ?? null)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}