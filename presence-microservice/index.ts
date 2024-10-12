import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Employee Microservice is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Employee Microservice run on ${port}`);
});
