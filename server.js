const  express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) =>{
    res.send('API is working');
});

app.listen(300, ()=> {
    console.log('Server is running on port 3000');
})