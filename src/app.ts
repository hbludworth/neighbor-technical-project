import express from 'express';
import router from './router';

const app = express();

app.use((req, res, next) => {
  // Sets CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
  );

  // Intercept OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
  } else {
    next();
  }
});

app.use(express.json());

app.use(router);

export default app;
