import {Menu} from "react-daisyui";
import {Link} from "react-router-dom";

export default function SideMenu() {
    return <Menu className="gap-1">
        <Menu.Item><Link to="/dashboard/posts">Post</Link></Menu.Item>
        <Menu.Item><Link to="/dashboard/knowledge-base">Knowledge Base</Link></Menu.Item>
    </Menu>
}