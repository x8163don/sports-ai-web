import React from 'react';
import {Outlet} from 'react-router-dom';


export default function SideMenuLayout({children, isShowMenu}) {
    const menu = React.Children.toArray(children).find(child => child.type === SideMenuLayout.Menu);
    return <div className="flex h-full max-h-full w-full max-w-full">
        {isShowMenu &&
            <div className="flex-none h-full max-h-full w-60">
                {menu}
            </div>
        }
        <div className="flex-grow h-full max-h-full">
            <Outlet/>
        </div>
    </div>
}

SideMenuLayout.Menu = ({children}) => <>{children}</>;
