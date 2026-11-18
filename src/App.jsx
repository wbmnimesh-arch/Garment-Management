
import { useState } from "react";
import "./App.css";

const menuItems = [
  "Dashboard",
  "Employees",
  "Attendance Device",
  "Live Attendance",
  "Time Review",
  "Leave Requests",
  "Payroll",
  "Reports",
];

const workTypes = [
  {
    title: "The Owner",
    description: "All Control and Salary Approval",
    color: "dark",
  },
  {
    title: "The Manager",
    description: "Team · Attendance · Leave",
    color: "blue",
  },
  {
    title: "Human Resources",
    description: "Employee Data · Salary Preparation",
    color: "lBlue",
  },
  {
    title: "The Employee",
    description: "Own Attendance · Worksheet",
    color: "llBlue",
  },
];

const firstSteps = [
  { number: "01", title: "Account", description: "New Employee Information" },
  { number: "02", title: "Password", description: "First Time Setup" },
  { number: "03", title: "Orders", description: "Service Number + Password" },
  { number: "04", title: "Position", description: "The Relevant Page" },
];

const nextSteps = [
  { number: "05", title: "Finger / Face ID", description: "Finger-off Notes" },
  { number: "06", title: "Calculate The Time", description: "Working Hours + OverTime" },
  { number: "07", title: "HR Check", description: "Corrects Mistakes" },
  { number: "08", title: "Approval", description: "Salary Slips Are Issued" },
];

function StepRow({ steps }) {
  return (
    <div className="steps-row">
      {steps.map((step, index) => (
        <div className="step-wrapper" key={step.number}>
          <div className="step-card">
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>

          {index !== steps.length - 1 && (
            <span className="step-arrow">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Login states
  const [selectedRole, setSelectedRole] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleMenuClick(item) {
    setActiveMenu(item);
    setIsMenuOpen(false);
  }

  // Select a role and open login page
  function handleRoleClick(role) {
    setSelectedRole(role);

    window.setTimeout(() => {
      setShowLogin(true);
    }, 300);
  }

  // Return to role selection
  function handleBack() {
    setShowLogin(false);
    setEmployeeId("");
    setPassword("");
    setMessage("");
  }

  // Sign in form
  function handleSignIn(event) {
    event.preventDefault();

    if (!employeeId.trim() || !password.trim()) {
      setMessage("Please enter your Employee ID and Password.");
      return;
    }

    setMessage("Login details submitted successfully. Authentication is not connected yet.");
  }

  return (
    <div className="app-container">

      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMenuOpen ? "sidebar-open" : ""}`}>

        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">✂</span>
            <span>CUT FREE</span>
          </div>

          <button
            className="mobile-close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="sidebar-menu">
          <p className="menu-heading">MAIN MENU</p>

          {menuItems.map((item) => (
            <button
              key={item}
              className={`menu-item ${activeMenu === item ? "active" : ""}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="menu-dot">●</span>
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">DN</div>
          <div>
            <h4>Dinuka Nimesh</h4>
            <p>Administrator</p>
          </div>
        </div>

      </aside>

      <main className="main-content">

        <header className="top-header">

          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? "×" : "☰"}
            </button>

            <div>
              <h1>Garment Work and Attendance System</h1>
              <p>Welcome to CUT FREE Management System</p>
            </div>
          </div>

          <div className="header-right">
            <span className="status-dot"></span>
            <span>System Online</span>
          </div>

        </header>

        <section className="page-content">

          {!showLogin ? (

            <>
              <div className="page-title">
                <div>
                  <p className="small-title">WORKFLOW OVERVIEW</p>
                  <h2>Positions and Steps</h2>
                </div>
                <span className="step-count">08 STEPS</span>
              </div>

              <section className="content-section">
                <h4 className="section-heading">System Positions</h4>

                <div className="roles-grid">
                  {workTypes.map((role) => (
                    <button
                      type="button"
                      className={`role-card ${role.color} ${
                        selectedRole === role.title ? "selected" : ""
                      }`}
                      key={role.title}
                      onClick={() => handleRoleClick(role.title)}
                    >
                      <h3>{role.title}</h3>
                      <p>{role.description}</p>
                      <span className="role-select-text">
                        Click to Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="content-section">
                <h4 className="section-heading">01 - 04 | Initial Process</h4>
                <StepRow steps={firstSteps} />
              </section>

              <section className="content-section">
                <h4 className="section-heading">
                  05 - 08 | Attendance & Salary Process
                </h4>
                <StepRow steps={nextSteps} />
              </section>
            </>

          ) : (

            <div className="login-page">

              <div className="login-card">

                <div className="login-brand">
                  <span className="login-logo">✂</span>
                  <h2>CUT FREE</h2>
                  <p>Garment Management System</p>
                </div>

                <div className="login-form-section">

                  <p className="small-title">WELCOME BACK</p>
                  <h2>Sign In</h2>
                  <p className="login-subtitle">
                    Please enter your details to access your account.
                  </p>

                  <div className="selected-role">
                    <span>YOUR ROLE</span>
                    <strong>{selectedRole}</strong>
                  </div>

                  <form onSubmit={handleSignIn}>

                    <label htmlFor="employeeId">Employee ID / Username</label>
                    <input
                      id="employeeId"
                      type="text"
                      placeholder="Enter your Employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="forgot-password">
                      Forgot Password? Contact HR Department.
                    </div>

                    {message && (
                      <p className="login-message">{message}</p>
                    )}

                    <button type="submit" className="sign-in-btn">
                      SIGN IN →
                    </button>

                  </form>

                  <button
                    type="button"
                    className="back-btn"
                    onClick={handleBack}
                  >
                    ← Back to Role Selection
                  </button>

                </div>

              </div>

            </div>

          )}

        </section>
      </main>
    </div>
  );
}
