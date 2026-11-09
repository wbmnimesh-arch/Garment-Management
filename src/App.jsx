

const workTypes = [
  { title: "The Owner", detail: "All Control and Salary Approval", color: "dark" },
  { title: "The Manager", detail: "Team · Attendance · Leave", color: "green" },
  { title: "Human Resources", detail: "Employee Data · Salary Preparation", color: "coral" },
  { title: "The Employee", detail: "Own Attendance · Worksheet", color: "blue" },
];

const firstSteps = [
  { number: "01", title: "Account", detail: "New Employee Information" },
  { number: "02", title: "Password", detail: "First Time Setup" },
  { number: "03", title: "Orders", detail: "Service Number + Password" },
  { number: "04", title: "Position", detail: "The Relevant Page" },
];

const nextSteps = [
  { number: "05", title: "Finger / Face ID", detail: "Finger-off Notes" },
  { number: "06", title: "Calculate The Time", detail: "Working Hours + OverTime" },
  { number: "07", title: "HR Check", detail: "Corrects Mistakes." },
  { number: "08", title: "Approval", detail: "Salary Slips Are Issued" },
];

function StepRow({ steps }) {
  return (
    <div className="steps">
      {steps.map((step, index) => (
        <div className="step-wrap" key={step.number}>
          <article className="step-card">
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
          </article>
          {index < steps.length - 1 && <span className="arrow">➜</span>}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>Dinuka Nimesh</h1>
          <p>Garment Work and Attendance System</p>
        </div>
        <strong>Positions and Steps  ~ 08</strong>
      </header>

     

      <section>
        <h2>Roles</h2>
        <div className="work-types">
          {workTypes.map((item) => (
            <article className={`work-card ${item.color}`} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Before Arriving</h2>
        <StepRow steps={firstSteps} />

      
        <h2>From Attendance to Salary</h2>
        <StepRow steps={nextSteps} />
      </section>
    </main>
  );
}

export default App;