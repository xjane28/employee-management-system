const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'company1',
  password: 'qqqq',
  port: 5432,
});

// GET all departments
app.get('/department', async (req, res) => {
  try {
    const result = await pool.query('SELECT departmentno AS id, departmentname, departmentlocation FROM department ORDER BY departmentno');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST new department
app.post('/department', async (req, res) => {
  try {
    const { departmentname, departmentlocation } = req.body;
    
    // First, get the next available departmentno
    const maxResult = await pool.query('SELECT COALESCE(MAX(departmentno), 0) + 1 AS next_id FROM department');
    const nextId = maxResult.rows[0].next_id;
    
    const result = await pool.query(
      'INSERT INTO department (departmentno, departmentname, departmentlocation) VALUES ($1, $2, $3) RETURNING departmentno AS id, departmentname, departmentlocation',
      [nextId, departmentname, departmentlocation]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT update department
app.put('/department/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentname, departmentlocation } = req.body;
    const result = await pool.query(
      'UPDATE department SET departmentname=$1, departmentlocation=$2 WHERE departmentno=$3 RETURNING departmentno AS id, departmentname, departmentlocation',
      [departmentname, departmentlocation, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE department
app.delete('/department/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM department WHERE departmentno=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET all employees
app.get('/employee', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT employeeno AS id, employeename, salary, departmentno, lastmodifydate FROM employee ORDER BY employeeno'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST new employee
app.post('/employee', async (req, res) => {
  try {
    const { employeename, salary, departmentno } = req.body;
    
    // Get the next available employeeno
    const maxResult = await pool.query('SELECT COALESCE(MAX(employeeno), 0) + 1 AS next_id FROM employee');
    const nextId = maxResult.rows[0].next_id;
    
    const result = await pool.query(
      'INSERT INTO employee (employeeno, employeename, salary, departmentno, lastmodifydate) VALUES ($1, $2, $3, $4, $5) RETURNING employeeno AS id, employeename, salary, departmentno, lastmodifydate',
      [nextId, employeename, salary, departmentno]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT update employee
app.put('/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeename, salary, departmentno } = req.body;
    const result = await pool.query(
      'UPDATE employee SET employeename=$1, salary=$2, departmentno=$3, lastmodifydate=$4 WHERE employeeno=$5 RETURNING employeeno AS id, employeename, salary, departmentno, lastmodifydate',
      [employeename, salary, departmentno, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE employee
app.delete('/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employee WHERE employeeno=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
