import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import Dashboard from "./components/layout/dashboard.jsx";
import SideMenuLayout from "./components/layout/SidemenuLayout.jsx";
import {useState} from "react";
import SideMenu from "./components/base/SideMenu.jsx";
import KnowledgeBasesPage from "./pages/KnowledgeBasesPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./api/base.js";
import ProtectedRoute from "./components/base/ProtectedRoute.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import KnowledgeBasePage from "./pages/KnowledgeBasePage.jsx";

function App() {

    const [showMenu, setShowMenu] = useState(true)

    return <QueryClientProvider client={queryClient}>
        <Router basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>

                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <Dashboard onHamburgerClick={() => setShowMenu((prev) => !prev)}>
                                <SideMenuLayout isShowMenu={showMenu}>
                                    <SideMenuLayout.Menu>
                                        <SideMenu/>
                                    </SideMenuLayout.Menu>
                                </SideMenuLayout>
                            </Dashboard>
                        </ProtectedRoute>
                    }
                >
                    <Route path="post/:id" element={<ChatPage/>}/>
                    <Route path="posts" element={<PostsPage/>}/>
                    <Route path="knowledge-base/:id" element={<KnowledgeBasePage/>}/>
                    <Route path="knowledge-base" element={<KnowledgeBasesPage/>}/>
                </Route>
            </Routes>
        </Router>
    </QueryClientProvider>
}

export default App
