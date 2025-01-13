import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import Cookies from "js-cookie";
import {check} from "../../api/auth.js";

export default function ProtectedRoute({children, redirectTo = "/login"}) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = Cookies.get("token");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                await check(token);
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to fetch chat response:', e);
                Cookies.remove("token");
                Cookies.remove("refreshToken");
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace/>;
    }

    return <>
        {children}
    </>
};