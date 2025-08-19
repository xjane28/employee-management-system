import React from 'react';
import DepartmentForm from './components/DepartmentForm.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';

function App() {
  return (
    <div>
      <h1>Company Management</h1>
      <DepartmentForm />
      <hr />
      <EmployeeForm />
    </div>
  );
}

export default App;
