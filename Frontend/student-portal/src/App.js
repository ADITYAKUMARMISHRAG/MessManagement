import React, { useState } from 'react';
import axios from 'axios';
import ManagerDashboard from './ManagerDashboard';
import PathDrawing from './PathDrawing'; // << this line
import './App.css';


function App() {
  const [form, setForm] = useState({
  name: '',
  roll_no: '',
  start_date: '',
  end_date: '',
  email: ''
});




  const [view, setView] = useState('student'); // 'student' or 'manager'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };






  const handleSubmit = async (e) => {
  e.preventDefault();

  const nameRegex = /^[A-Za-z\s]+$/;
  const rollRegex = /^[0-9]{2}[A-Za-z]{2}[0-9]{4}$/;

  if (!nameRegex.test(form.name)) {
    alert("Invalid name! Use only letters and spaces.");
    return;
  }

  if (!rollRegex.test(form.roll_no)) {
    alert("Invalid roll number! Format should be like 21CS1234.");
    return;
  }

  const startDate = new Date(form.start_date);
  const endDate = new Date(form.end_date);

  if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
    alert("Please enter a valid leave date range.");
    return;
  }

  try {
    const res = await axios.post('http://localhost:3001/submit-leave', form);
    alert(res.data.message);
  } catch (err) {
    alert("Error submitting form");
  }
};









  

  return (

  <div className="container">
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  <img
    src="/RGIPT.png"
    alt="RGIPT Logo"
    className="logo"
  />
</div>

    <><h1 style={{
  color: "white",
  textAlign: "center",
  marginBottom: "20px"
}}>
  RGIPT MESS REFUND PORTAL
</h1>

    </>

    <button onClick={() => setView('student')}>Student Portal</button>
    <button onClick={() => setView('manager')}>Manager Dashboard</button>
    <hr />

    {view === 'student' && (
      <>
       <div style={{ display: 'flex', justifyContent: 'center' }}>
  <PathDrawing />
</div>

        <h2>Student Leave Form</h2>
       <form onSubmit={handleSubmit}>
  <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
  <input name="roll_no" placeholder="Roll Number" onChange={handleChange} /><br /><br />
  <input name="email" placeholder="Email" type="email" onChange={handleChange} /><br /><br />
 <label style={{ color: 'white' }}>Start Date of Leave:</label><br />
<input name="start_date" type="date" onChange={handleChange} /><br /><br />

<label style={{ color: 'white' }}>Last Date of Leave:</label><br />
<input name="end_date" type="date" onChange={handleChange} /><br /><br />

  <button type="submit">Submit Leave</button>
</form>


      </>
    )}

    {view === 'manager' && <ManagerDashboard />}



    <footer className="footer">
  © {new Date().getFullYear()} Aditya Kumar Mishra. All rights reserved.
</footer>

  </div>
);
}

export default App;


