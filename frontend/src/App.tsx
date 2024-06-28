import { ReactNode, useState } from "react";
import "./App.css";
import LoginForm from "./components/Login_Page/LoginForm";
import RegisterForm from "./components/Login_Page/RegisterForm";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/Navigation";
import PersonalProfile from "./components/Profile_Page/Profile_Page";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound_page/NotFound";
import Home from "./components/Home_Page/Home_page";
import Tasks_Page from "./components/Tasks_Page/Task_Page";
import Grading_Page from "./components/Grading_Page/Grading_Page";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  const [, setShowLoginForm] = useState(true);

  const handleToggleForm = () => {
    setShowLoginForm((prevShowLoginForm) => !prevShowLoginForm);
  };

  interface MainLayoutProps {
    children: ReactNode;
  }

  const MainLayout = ({ children }: MainLayoutProps) => (
    <div style={{ display: "flex" }}>
      <NavigationBar />
      <div
        style={{
          flexGrow: 1,
          paddingLeft: "20",
          paddingRight: "20",
          marginTop: "20",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<LoginForm onToggleForm={handleToggleForm} />}
        />
        <Route
          path="/register"
          element={<RegisterForm onToggleForm={handleToggleForm} />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/*" element={<NotFound />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tasks_Page />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PersonalProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/grading"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Grading_Page />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
