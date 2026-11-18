
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

  function handleMenuClick(item) {
    setActiveMenu(item);
    setIsMenuOpen(false);
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
                <div className={`role-card ${role.color}`} key={role.title}>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                </div>
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

        </section>
      </main>
    </div>
  );
}
