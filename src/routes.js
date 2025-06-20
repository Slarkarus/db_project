const express = require('express');
const router = express.Router();
const {
  addStudent,
  addProject,
  addAssignment,
  addFile,
  findMatches
} = require('./controllers');

router.post('/students', async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await addStudent(name, email);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { year, url } = req.body;
    const project = await addProject(year, url);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assignments', async (req, res) => {
  try {
    const { studentId, projectId } = req.body;
    const assignment = await addAssignment(studentId, projectId);
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects/:id/files', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { path, content } = req.body;
    const file = await addFile(projectId, path, content);
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/matches', async (req, res) => {
  try {
    const matches = await findMatches();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;