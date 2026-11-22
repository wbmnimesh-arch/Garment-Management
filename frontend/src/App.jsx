
import { useEffect, useState } from "react";
import "./App.css";

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: `Server returned an invalid response (${response.status}).` };
  }
}

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

const roles = [
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
  { number: "01", title: "Employee Registration", description: "Register new employees" },
  { number: "02", title: "Attendance Setup", description: "Connect attendance devices" },
  { number: "03", title: "Daily Attendance", description: "Record employee attendance" },
  { number: "04", title: "Time Review", description: "Review working hours" },
];

const nextSteps = [
  { number: "05", title: "Leave Management", description: "Manage employee leaves" },
  { number: "06", title: "Salary Preparation", description: "Calculate employee salary" },
  { number: "07", title: "Salary Approval", description: "Approve monthly salaries" },
  { number: "08", title: "Reports", description: "Generate system reports" },
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [selectedRole, setSelectedRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [signupId, setSignupId] = useState("");
  const [email, setEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.removeItem("cutfree_token");
    localStorage.removeItem("cutfree_user");
  }, []);

  function handleRoleSelect(role) {
    setSelectedRole(role);
    setShowLogin(true);
    setShowSignup(false);
    setMessage("");
  }

  function handleBack() {
    setShowLogin(false);
    setShowSignup(false);
    setSelectedRole(null);
    setMessage("");
    setEmployeeId("");
    setPassword("");
  }

  function handleBackToLogin() {
    setShowSignup(false);
    setMessage("");
  }

  async function handleSignIn(event) {
    event.preventDefault();
    if (!employeeId.trim() || !password.trim()) {
      setMessage("Please enter your Employee ID and Password.");
      return;
    }
    setMessage("Signing in...");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password, role: selectedRole }),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || `Request failed (${response.status}).`);
      setMessage(`Welcome, ${data.user.fullName}.`);
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !signupId.trim() ||
      !email.trim() ||
      !signupPassword ||
      !confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (signupPassword.length < 12) {
      setMessage("Use a password with at least 12 characters.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Submitting registration...");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, employeeId: signupId, email, password: signupPassword }),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || `Request failed (${response.status}).`);
      setSelectedRole("The Employee");
      setMessage(data.message);
      setFullName("");
      setSignupId("");
      setEmail("");
      setSignupPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    }
  }

  return (
    <div className="app-container">

      {/* MOBILE OVERLAY */}
      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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
            ✕
          </button>
        </div>

        <div className="sidebar-menu">
          <p className="menu-heading">MAIN MENU</p>

          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`menu-item ${activeMenu === item ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item);
                setIsMenuOpen(false);
              }}
            >
              <span className="menu-dot">●</span>
              {item}
            </button>
          ))}
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">D</div>
          <div>
            <h4>Dinuka Nimesh</h4>
            <p>Administrator</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <h1>Garment Work and Attendance System</h1>
              <p>Welcome to CUT FREE Management System</p>
            </div>
          </div>

          <div className="header-right">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        {/* DASHBOARD */}
        {!showLogin && (
          <div className="page-content">

            <div className="page-title">
              <div>
                <p className="small-title">OVERVIEW</p>
                <h2>{activeMenu}</h2>
              </div>

              <span className="step-count">8 WORKFLOW STEPS</span>
            </div>

            <section className="content-section">
              <h2 className="section-heading">
                Select Your Role
              </h2>

              <div className="roles-grid">
                {roles.map((role) => (
                  <div
                    key={role.title}
                    className={`role-card ${role.color} ${
                      selectedRole === role.title ? "selected" : ""
                    }`}
                    onClick={() => handleRoleSelect(role.title)}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                    <span className="role-select-text">
                      SELECT ROLE →
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-section">
              <h2 className="section-heading">
                Before Arriving
              </h2>
              <StepRow steps={firstSteps} />
            </section>

            <section className="content-section">
              <h2 className="section-heading">
                From Attendance to Salary
              </h2>
              <StepRow steps={nextSteps} />
            </section>

          </div>
        )}

        {/* LOGIN PAGE */}
        {showLogin && (
          <div className="login-page">

            <div className="login-card">

              <div className="login-brand">
                <div className="login-logo">✂</div>
                <h2>CUT FREE</h2>
                <p>Garment Management System</p>
              </div>

              <div className="login-form-section">

                {!showSignup ? (
                  <>
                    <h2>Welcome Back!</h2>
                    <p className="login-subtitle">
                      Sign in to continue to your account
                    </p>

                    <div className="selected-role">
                      <span>Selected Role</span>
                      <strong>{selectedRole}</strong>
                    </div>

                    <form onSubmit={handleSignIn}>
                      <label>Employee ID</label>
                      <input
                        type="text"
                        placeholder="Enter your Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />

                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <div className="forgot-password">
                        <button
                          type="button"
                          onClick={() =>
                            setMessage("Please contact HR to reset your password.")
                          }
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <button type="submit" className="sign-in-btn">
                        SIGN IN <span>→</span>
                      </button>
                    </form>

                    <div className="signup-divider">
                      <span>OR</span>
                    </div>

                    <button
                      type="button"
                      className="sign-up-btn"
                      onClick={() => {
                        setShowSignup(true);
                        setMessage("");
                      }}
                    >
                      CREATE NEW ACCOUNT <span>＋</span>
                    </button>
                  </>
                ) : (
                  <>
                    <h2>Create Account</h2>
                    <p className="login-subtitle">
                      New accounts start as Employees and need HR approval.
                    </p>

                    <form onSubmit={handleSignUp}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />

                      <label>Employee ID</label>
                      <input
                        type="text"
                        placeholder="Enter your Employee ID"
                        value={signupId}
                        onChange={(e) => setSignupId(e.target.value)}
                      />

                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <label>Password</label>
                      <input
                        type="password"
                        minLength={12}
                        maxLength={128}
                        placeholder="Create a password (12+ characters)"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />

                      <label>Confirm Password</label>
                      <input
                        type="password"
                        minLength={12}
                        maxLength={128}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                      <button type="submit" className="sign-in-btn create-account-btn">
                        CREATE ACCOUNT <span>→</span>
                      </button>
                    </form>

                    <button
                      type="button"
                      className="back-to-login-btn"
                      onClick={handleBackToLogin}
                    >
                      ← BACK TO SIGN IN
                    </button>
                  </>
                )}

                {message && (
                  <p className="login-message">{message}</p>
                )}

                <button
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                >
                  ← BACK TO ROLE SELECTION
                </button>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
