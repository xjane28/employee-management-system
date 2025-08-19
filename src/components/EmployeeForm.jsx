import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeForm() {
  const [employee, setEmployee] = useState([]); // lista zaposlenika
  const [department, setDepartment] = useState([]); // lista odjela
  const [employeename, setEmployeeName] = useState('');
  const [salary, setSalary] = useState('');
  const [departmentno, setDepartmentNo] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchEmployee = async () => {
    const res = await axios.get('http://localhost:5000/employee');
    setEmployee(res.data);
  };

  const fetchDepartment = async () => {
    const res = await axios.get('http://localhost:5000/department');
    setDepartment(res.data);
  };

  useEffect(() => {
    fetchEmployee();
    fetchDepartment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { employeename, salary, departmentno };

    if (editId) {
      await axios.put(`http://localhost:5000/employee/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/employee', payload);
    }

    setEmployeeName('');
    setSalary('');
    setDepartmentNo('');
    fetchEmployee();
  };

  const handleEdit = (emp) => {
    setEmployeeName(emp.employeename);
    setSalary(emp.salary);
    setDepartmentNo(emp.departmentno);
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/employee/${id}`);
    fetchEmployee();
  };

  return (
    <div>
      <h2>Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={employeename}
          onChange={e => setEmployeeName(e.target.value)}
          placeholder="Employee Name"
          required
        />
        <input
          type="number"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          placeholder="Salary"
          required
        />
        <select
          value={departmentno}
          onChange={e => setDepartmentNo(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {department.map(d => (
            <option key={d.id} value={d.id}>{d.departmentname}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {employee.map(emp => (
          <li key={emp.id}>
            {emp.employeename} - Salary: {emp.salary} - Dept: {department.find(d => d.id === emp.departmentno)?.departmentname || ''}
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeForm;
