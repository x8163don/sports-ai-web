import {Avatar, Button, Dropdown, Navbar} from "react-daisyui";
import {useEffect, useState} from "react";
import {me} from "../../api/customer.js";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Dashboard({children, onHamburgerClick}) {

    const [curUser, setCurUser] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        me().then(r => setCurUser(r));
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        navigate('/login');
    }

    return <div className="flex flex-col h-screen w-full">
        <Navbar className="flex-none">
            <Button className="btn btn-square btn-ghost"
                    onClick={onHamburgerClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </Button>

            <div className="flex-1">
                {/*<Button tag="a" className="text-xl normal-case" color="ghost">*/}
                {/*    Logo*/}
                {/*</Button>*/}
            </div>
            <div className="flex-none">
                <Dropdown end>
                    <Button tag="label" tabIndex={0} color="ghost" className="avatar" shape="circle">
                        <Avatar
                            src={curUser.avatar}
                            shape="circle"
                            size="xs"
                        />
                    </Button>
                    <Dropdown.Menu className="mt-3 z-[1] w-52 menu-sm">
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Navbar>

        <div className="flex-grow overflow-auto">
            {children}
        </div>
    </div>
}