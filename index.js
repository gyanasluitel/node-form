const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

// Get Login Form
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Submit Login Form
router.post('/login', (req, res) => {
  const username = 'gyanas';
  const password = 'test123';

  if (req.body.username === username && req.body.password === password) {
    const data = require('./data.json');
    console.log('success');
    res.status(200).send(data);
  } else {
    console.log('fail');
    res.status(500).send('fail');
  }
});

// Get Todos List
router.get('/todos', (req, res) => {
  // res.status(200).sendFile(path.join(__dirname, '/todo.html'));
  let data = fs.readFileSync('data.json');
  data = JSON.parse(data);
  res.status(200).send(data);
});

// Add a new todo to the Todos list
router.post('/todos', (req, res) => {
  let data = fs.readFileSync('data.json');
  data = JSON.parse(data);

  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;

  data.push({
    title: title,
    description: description,
    status: status,
  });

  let newData = JSON.stringify(data);
  fs.writeFile('data.json', newData, (err) => {
    if (err) throw err;
    console.log('New data added');
  });
  res.status(200).send(data);
});

// Delete Todo based on todo's title
router.delete('/todos/:title', (req, res) => {
  let data = fs.readFileSync('data.json');
  data = JSON.parse(data);

  const { title } = req.params;
  const found = data.some((element) => element.title === title);

  if (found) {
    data = data.filter((element) => element.title !== title);
    let newData = JSON.stringify(data);
    fs.writeFile('data.json', newData, (err) => {
      if (err) throw err;
      console.log('Deleted selected todo');
    });
    res.status(200).send(data);
  } else {
    res.status(400).send('No such todo');
  }
});

// Update Todo
router.put('/todos/:title', (req, res) => {
  let data = fs.readFileSync('data.json');
  data = JSON.parse(data);

  const { title } = req.params;
  const found = data.some((element) => element.title === title);

  if (found) {
    let { description, status } = req.body;
    let newData = data.map((element) => {
      if (element.title === title) {
        return { ...element, description: description, status: status };
      }
      return element;
    });

    newData = JSON.stringify(newData);
    fs.writeFile('data.json', newData, (err) => {
      if (err) throw err;
      console.log('Updated selected todo');
    });
    res.status(200).send(data);
  } else {
    res.status(400).send('No such todo');
  }
});

router.get('/logout', (req, res) => {
  res.send('Trying to logout!');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
