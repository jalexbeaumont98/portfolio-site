// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // adjust path if needed
import "./Navbar.css"

function Navbar() {

    const navigate = useNavigate();
    const { auth, signout } = useAuth();
    const user = auth?.user || null;
    const isAdmin = user?.role === "admin";

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleLogoutClick = async () => {
        try {
            await signout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleNewProjectClick = () => {
        navigate("/admin/projects/new");
    };

    const handleNewQualificationClick = () => {
        navigate("/admin/qualifications/new");
    };

    const handleAdminContactsClick = () => {
        navigate("/admin/contacts/");
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src="/logo.gif" alt="Logo" />
            </div>

            <div className="nav-links">
                <div className="nav-left">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                    About
                </NavLink>
                <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
                    Projects
                </NavLink>
                <NavLink to="/education" className={({ isActive }) => (isActive ? "active" : "")}>
                    Education
                </NavLink>
                <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>
                    Services
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contact
                </NavLink>
                </div>
                 {/* Right side: admin + auth controls */}
            <div className="nav-right">
                {/* Admin-only: New Project */}
                {isAdmin && (
                    <button
                        type="button"
                        className="nav-button"
                        onClick={handleNewProjectClick}
                    >
                        Manage Projects
                    </button>
                )}

                {/* Admin-only: New Qual */}
                {isAdmin && (
                    <button
                        type="button"
                        className="nav-button"
                        onClick={handleNewQualificationClick}
                    >
                        Manage Qualifications
                    </button>
                )}

                {/* Admin-only: Access Contacts */}
                {isAdmin && (
                    <button
                        type="button"
                        className="nav-button"
                        onClick={handleAdminContactsClick}
                    >
                        Check Contacts
                    </button>
                )}

                {/* Auth-dependent: Login vs username + Logout */}
                {user ? (
                    <>
                        <span className="nav-username">Hi, {user.name}</span>
                        <button
                            type="button"
                            className="nav-button nav-logout"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="nav-button"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                )}
            </div>
            </div>
        </nav>
    )
}

export default Navbar