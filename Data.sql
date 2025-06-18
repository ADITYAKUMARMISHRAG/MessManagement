CREATE DATABASE mess_refund;

USE mess_refund;

CREATE TABLE leave_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  roll_no VARCHAR(20),
  start_date DATE,
  end_date DATE
);

SELECT * FROM leave_records;

