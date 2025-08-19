import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DepartmentForm() {
  const [departments, setDepartments] = useState([]);
  const [departmentname, setDepartmentName] = useState('');
  const [departmentlocation, setDepartmentLocation] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/department');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { departmentname, departmentlocation };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/department/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/department', payload);
      }
      setDepartmentName('');
      setDepartmentLocation('');
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (dept) => {
    setDepartmentName(dept.departmentname);
    setDepartmentLocation(dept.departmentlocation);
    setEditId(dept.id); // Now using id (which maps to departmentno)
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/department/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Department</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={departmentname}
          onChange={e => setDepartmentName(e.target.value)}
          placeholder="Department Name"
          required
        />
        <input
          value={departmentlocation}
          onChange={e => setDepartmentLocation(e.target.value)}
          placeholder="Department Location"
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {departments.map(dept => (
          <li key={dept.id}>
            {dept.departmentname} - {dept.departmentlocation}
            <button onClick={() => handleEdit(dept)}>Edit</button>
            <button onClick={() => handleDelete(dept.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentForm;