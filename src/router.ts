import express from 'express';

const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    res.status(200).end();
  } catch {
    res.status(500).end();
  }
});

export default router;
