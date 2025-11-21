import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import ScrollToTop from "./components/ScrollToTop"

import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Projects from "./pages/Projects.jsx"
import Education from "./pages/Education.jsx"
import Services from "./pages/Services.jsx"
import Contact from "./pages/Contact.jsx"
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminRoute from "./routes/AdminRoute";
import NewProject from "./pages/NewProject";

function App() {
  return (
    <div className="main-content">
      <Navbar />   {/* navbar component */}
      <ScrollToTop />  {/* This resets scroll on route change */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/education" element={<Education />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin/projects/new"
          element={
            <AdminRoute>
              <NewProject />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
