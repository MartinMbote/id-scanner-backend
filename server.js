const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace this with your actual MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/';

mongoose.connect(mongoURI);

// Updated schema to include all necessary fields
const dataSchema = new mongoose.Schema({
  phone: String,
  department: String,
  sharedString: String,
  idName: String,
  dateTime: String
});

const Data = mongoose.model('Data', dataSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/data', async (req, res) => {
  const { phone, department, sharedString, idName, dateTime } = req.body;
  const newData = new Data({
    phone,
    department,
    sharedString,
    idName,
    dateTime
  });

  try {
    const savedData = await newData.save();
    res.json(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET endpoint to retrieve data
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
