const express = require('express');
const app = express();
const path = require('path');

app.use('/public', express.static(path.join(__dirname, '../src', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src' ,'index.html'));
});

app.listen(3000);