const pool = require('./db');
const crypto = require('crypto');

const calculateHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

exports.addStudent = async (name, email) => {
  const result = await pool.query(
    'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
};

exports.addProject = async (year, url) => {
  const result = await pool.query(
    'INSERT INTO projects (year, url) VALUES ($1, $2) RETURNING *',
    [year, url]
  );
  return result.rows[0];
};

exports.addAssignment = async (studentId, projectId) => {
  const result = await pool.query(
    'INSERT INTO project_assignments (student_id, project_id) VALUES ($1, $2) RETURNING *',
    [studentId, projectId]
  );
  return result.rows[0];
};

exports.addFile = async (projectId, path, content) => {
  const hash = calculateHash(content);
  
  const contentRes = await pool.query(
    'INSERT INTO contents (hash, content) VALUES ($1, $2) ON CONFLICT (hash) DO UPDATE SET hash = EXCLUDED.hash RETURNING id',
    [hash, content]
  );
  const contentId = contentRes.rows[0].id;
  
  const fileRes = await pool.query(
    'INSERT INTO files (path, project_id, content_id) VALUES ($1, $2, $3) RETURNING *',
    [path, projectId, contentId]
  );
  
  return fileRes.rows[0];
};

exports.findMatches = async () => {
  const result = await pool.query(`
    SELECT 
      s1.name AS student1,
      p1.year AS year1,
      f1.path AS path1,
      s2.name AS student2,
      p2.year AS year2,
      f2.path AS path2
    FROM files f1
    JOIN files f2 ON f1.content_id = f2.content_id AND f1.id < f2.id
    JOIN projects p1 ON f1.project_id = p1.id
    JOIN projects p2 ON f2.project_id = p2.id
    JOIN project_assignments pa1 ON pa1.project_id = p1.id
    JOIN students s1 ON pa1.student_id = s1.id
    JOIN project_assignments pa2 ON pa2.project_id = p2.id
    JOIN students s2 ON pa2.student_id = s2.id
  `);
  
  return result.rows;
};