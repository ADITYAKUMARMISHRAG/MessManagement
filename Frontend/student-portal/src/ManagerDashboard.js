import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManagerDashboard() {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/refunds')
      .then(res => setRefunds(res.data))
      .catch(err => console.error('Error fetching refunds:', err));
  }, []);

  return (
    <div>
      <h2>Refund Details</h2>
     <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Roll No</th>
      <th>Total Leave Days</th>
      <th>Refund (₹)</th>
    </tr>
  </thead>
  <tbody>
    {refunds.map((entry, index) => (
      <tr key={index}>
        <td>{entry.name}</td>
        <td>{entry.roll_no}</td>
        <td>{entry.days}</td>
        <td>{entry.refund}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );


}






export default ManagerDashboard;
