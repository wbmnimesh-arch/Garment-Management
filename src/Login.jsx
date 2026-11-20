
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!employeeId.trim() || !password.trim()) {
      setMessage("කරුණාකර සියලු තොරතුරු ඇතුළත් කරන්න.");
      return;
    }
    setMessage("පිවිසෙමින්...");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "පිවිසීමට නොහැකි විය.");
      setMessage(`${data.user.fullName}, ඔබ සාර්ථකව පිවිසුණා.`);
    } catch (error) {
      setMessage(error.message || "සේවාදායකයට සම්බන්ධ විය නොහැක.");
    }
  }

  return (
    <div className="login-page">

      {/* LEFT BRANDING SECTION */}
      <section className="login-brand">
        <h2 className="login-logo">STITCHFLOW</h2>

        <div className="brand-message">
          <h1>
            වැඩත්, පැමිණීමත්
            <br />
            එකම පද්ධතියක.
          </h1>

          <p>ඔබගේ සේවා කටයුතු - ඉතාමත් පහසුවෙන්</p>
        </div>

        {/* Fingerprint Design */}
        <div className="fingerprint-area">
          <div className="fingerprint-circle">
            <svg
              viewBox="0 0 200 200"
              className="fingerprint-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="87" stroke="#70D5C0" strokeWidth="2.5" />

              <path
                d="M43 112 C43 66 69 40 100 40 C131 40 157 66 157 112"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M53 119 C53 77 73 51 100 51 C127 51 147 77 147 119"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M64 125 C64 88 79 64 100 64 C121 64 136 88 136 125"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M76 131 C76 104 84 84 100 84 C116 84 124 104 124 131"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M100 105 C88 105 84 118 84 133 V158"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M116 133 V158"
                stroke="#A0E9D9"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <p className="brand-footer">ආරක්ෂිත සේවා පද්ධතිය</p>
      </section>

      {/* RIGHT LOGIN SECTION */}
      <section className="login-form-section">

        <div className="login-form-container">

          <div className="login-heading">
            <h2>පද්ධතියට ඇතුළු වන්න</h2>
            <p>ඔබගේ සේවක අංකය සහ මුරපදය භාවිතා කරන්න.</p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="employeeId">
                සේවක අංකය / පරිශීලක නාමය
              </label>

              <input
                id="employeeId"
                type="text"
                placeholder="උදා: EMP-0241"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">මුරපදය</label>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="ඔබගේ මුරපදය ඇතුළත් කරන්න"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              ඇතුළු වන්න
            </button>

            {message && (
              <p className="login-message">{message}</p>
            )}

          </form>

          <div className="forgot-password">
            <span>මුරපදය අමතකද?</span>
            <a href="mailto:hr@example.com">
              HR හෝ පරිපාලකගෙන් උදව් ලබා ගන්න
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
