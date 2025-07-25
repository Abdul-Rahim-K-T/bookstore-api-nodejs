import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(json());
app.use('/api/users', userRoutes);

app.use((req, res) =>{
    res.status(404).json({ message: 'Route not found' });
});


app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});