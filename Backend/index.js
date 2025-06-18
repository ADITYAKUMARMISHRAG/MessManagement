const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());


/*for otp system*/
const nodemailer = require('nodemailer');

const otpStore = {}; // Temporary in-memory OTP store: { email: otp }

// Email transporter (you can use Gmail or a test SMTP like Mailtrap)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',      // Replace with your Gmail
    pass: 'your_app_password'          // Use App Password, not your actual Gmail password
  }
});


app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = otp;

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Your OTP for Leave Submission',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      return res.status(500).json({ error: "Failed to send OTP" });
    } else {
      res.json({ message: "OTP sent successfully" });
    }
  });
});



app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email]; // Clear OTP after use
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});


/*otp sytem ends*/

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bhaukal@mishra', // your MySQL password
  database: 'mess_refund'
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection error:', err);
  } else {
    console.log('MySQL connected successfully.');
  }
});

app.post('/submit-leave', (req, res) => {
  const { name, roll_no, start_date, end_date } = req.body;

  const start = new Date(start_date);
  const end = new Date(end_date);

  const leave_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const sql = 'INSERT INTO leave_records (name, roll_no, start_date, end_date) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, roll_no, start_date, end_date], (err, result) => {
    if (err) {
      console.log('Insert error:', err);
      return res.status(500).json({ message: 'Error saving leave' });
    }

    return res.status(200).json({
      message: 'Leave saved successfully',
      leave_days: leave_days
    });
  });
});



app.get('/refunds', (req, res) => {
  const costQuery = "SELECT cost_per_day FROM mess_cost ORDER BY id DESC LIMIT 1";
  const leaveQuery = "SELECT name, roll_no, start_date, end_date FROM leave_records";

  db.query(costQuery, (costErr, costResult) => {
    if (costErr) {
      console.error("Cost fetch error:", costErr);
      return res.status(500).json({ error: "Error fetching cost" });
    }

    const costPerDay = costResult[0]?.cost_per_day || 0;

    db.query(leaveQuery, (leaveErr, leaveResult) => {
      if (leaveErr) {
        console.error("Leave fetch error:", leaveErr);
        return res.status(500).json({ error: "Error fetching leaves" });
      }

      const refundMap = new Map();

      leaveResult.forEach(entry => {
        const start = new Date(entry.start_date);
        const end = new Date(entry.end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (refundMap.has(entry.roll_no)) {
          const data = refundMap.get(entry.roll_no);
          data.days += days;
        } else {
          refundMap.set(entry.roll_no, {
            name: entry.name,
            roll_no: entry.roll_no,
            days: days
          });
        }
      });

      const result = Array.from(refundMap.values()).map(entry => ({
        ...entry,
        refund: entry.days * costPerDay
      }));

      res.json(result);
    });
  });
});



app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
