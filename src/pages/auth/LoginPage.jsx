import {useMutation} from "@tanstack/react-query";
import {login} from "../../api/auth.js";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate()

    const {mutate: loginMutate} = useMutation({
        mutationFn: login, onError: (error) => {
            console.error('Failed to fetch chat response:', error);
        },
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, callback: (response) => {
                    loginMutate({thirdPartyToken: response.credential, loginType: "google"}, {
                        onSuccess: (data) => {
                            Cookies.set("token", data.access_token);
                            Cookies.set("refreshToken", data.refresh_token);
                            navigate("/dashboard/posts")
                        },
                    });
                },
            });

            window.google.accounts.id.renderButton(document.getElementById("g-login"), {
                theme: "outline",
                size: "large",
                shape: "circle",
                width: "350",
                height: "48",
                logo_alignment: "center",
            });
        }
    }, []);

    return <main className="min-h-screen flex items-center justify-center">

        <div className="card card-bordered w-full max-w-md p-8 shadow-lg rounded-lg">
            <div className="mb-8 flex justify-center">
            </div>
            <div className="flex justify-center">
                <div id="g-login"/>
            </div>
        </div>
    </main>
}

