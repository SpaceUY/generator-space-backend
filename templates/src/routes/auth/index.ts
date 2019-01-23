import { Router } from 'express';
const app = Router();

import register from './register';
import currentUser from './currentUser';

app.use('/register', register);
app.use('/currentUser', currentUser);

export default app;
