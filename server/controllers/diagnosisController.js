const Diagnosis = require('../models/Diagnosis');
const Document = require('../models/Document');

// GET /api/diagnosis
exports.getDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({})
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(diagnoses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/diagnosis/:id
exports.getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) return res.status(404).json({ error: 'Diagnosis record not found' });
    res.json(diagnosis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/diagnosis/:id
exports.deleteDiagnosis = async (req, res) => {
  try {
    const deleted = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Diagnosis record not found' });
    res.json({ message: 'Diagnosis record deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const documentsCount = await Document.countDocuments();
    const diagnosesCount = await Diagnosis.countDocuments();
    const healthyCount = await Diagnosis.countDocuments({ healthStatus: 'Healthy' });
    const issuesCount = diagnosesCount - healthyCount;

    const allDiagnoses = await Diagnosis.find({}, 'healthScore healthStatus question primaryProblem createdAt').sort({ createdAt: -1 });

    let avgHealthScore = 0;
    if (allDiagnoses.length > 0) {
      const totalScore = allDiagnoses.reduce((acc, curr) => acc + (curr.healthScore || 0), 0);
      avgHealthScore = Math.round(totalScore / allDiagnoses.length);
    }

    const recentDiagnoses = allDiagnoses.slice(0, 5);

    res.json({
      documentsCount,
      questionsTested: diagnosesCount,
      healthyCount,
      issuesCount,
      avgHealthScore,
      recentDiagnoses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
