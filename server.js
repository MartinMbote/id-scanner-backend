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
  dateTime: String,
  visitorTag: String,
  cleared: String,
});

const Data = mongoose.model('Data', dataSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/data', async (req, res) => {
  const { phone, department, sharedString, idName, dateTime, visitorTag } = req.body;
  const newData = new Data({
    phone,
    department,
    sharedString,
    idName,
    dateTime,
    visitorTag
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


/////////////////////////////////////////////////////////
//////////////////Add Departments///////////////////////

const departmentsDtaSchema = new mongoose.Schema({
  departmentName: String,  
});

const Departmentsdata = mongoose.model('Departmentsdata', departmentsDtaSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/departmentsdata', async (req, res) => {
  const { departmentName } = req.body;
  const newDepartmentsData = new Departmentsdata({
    departmentName
  });

  try {
    const savedData = await newDepartmentsData.save();
    res.json(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET endpoint to retrieve data
app.get('/api/departmentsdata', async (req, res) => {
  try {
    const data = await Departmentsdata.find();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

/////////////////////Departments////////////////////////
///////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//////////////////Add Departments///////////////////////

const visitorsBadgeSchema = new mongoose.Schema({
  visitorsBadge: String,  
});

const Visitorsbadgedata = mongoose.model('Visitorsbadgedata', visitorsBadgeSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/visitorsbadges', async (req, res) => {
  const { visitorsBadge } = req.body;
  const newVisitorsBadgeData = new Visitorsbadgedata({
    visitorsBadge
  });

  try {
    const savedData = await newVisitorsBadgeData.save();
    res.json(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET endpoint to retrieve data
app.get('/api/visitorsbadges', async (req, res) => {
  try {
    const data = await Visitorsbadgedata.find();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

/////////////////////Departments////////////////////////
///////////////////////////////////////////////////////



////////////////////////migration////////////////////////
const dataSchemaB = new mongoose.Schema({
  phone: String,
  department: String,
  sharedString: String,
  idName: String,
  dateTime: String,
  visitorTag: String,
  cleared: String,
});

const DataB = mongoose.model('DataB', dataSchemaB);

// Route to move a document from CollectionA to CollectionB
app.post('/api/migrate', async (req, res) => {
  try {
      const documentId = req.body.id;

      // Find the document in CollectionA
      const document = await Data.findById(documentId);

      if (!document) {
          return res.status(404).json({ message: 'Document not found' });
      }

      // Save the document to CollectionB
      const migratedDocument = new DataB(document.toObject());
      await migratedDocument.save();

      // Remove the document from CollectionA
      await Data.findByIdAndDelete(documentId);

      res.json({ message: 'Document migrated successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error.message);
  }
});
////////////////////////migration////////////////////////
/////////////////////////////////////////////////////////




////////////////////////Add cleared fiel to mongodb documents////////////////////////
app.put('/api/data/:id', async (req, res) => {
  const { id } = req.params; // The document ID from the URL
  const { cleared } = req.body; // The cleared status from the request body

  try {
    // Find the document by ID and update the cleared field
    const updatedData = await Data.findByIdAndUpdate(
      id, // The ID of the document to update
      { $set: { cleared: cleared || 'yes' } }, // Set the cleared field to 'yes'
      { new: true } // Return the updated document
    );

    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(updatedData);
  } catch (err) {
    res.status(400).send(err);
  }
});
////////////////////////add cleared////////////////////////
///////////////////////////////////////////////////////////



///////////////////////////
///////////////////////////
const usersDataSchema = new mongoose.Schema({
  name: String,
  staffid: String,
  email: String,
  password: String,
  role: String,
})

const Userdata = mongoose.model('Userdata', usersDataSchema);

app.post('/api/userdata', async (req, res) => {
  const {name, staffid, email, password, role} = req.body;

  const newUserData = new Userdata({
    name,
    staffid,
    email,
    password,
    role
  });

  try{
    savedUserData = await newUserData.save();
    res.json("New User Successfully Created");
  }catch(err) {
    res.status(400).send(err);
  }
});

app.get('/api/userdata', async (req, res) => {
  try {
    const userinfo = await Userdata.find();
    res.json(userinfo);
  } catch (err) {
    res.status(400).send(err);
  }
});
///////////////////////////
///////////////////////////




///////////////////////////
///////////////////////////
const appointmentsDataSchema = new mongoose.Schema({
  name: String,
  visiteemail: String,
  email: String,
  selectedDate: String,
})

const Appointmentsdata = mongoose.model('Appointmentsdata', appointmentsDataSchema);

app.post('/api/appointmentsdata', async (req, res) => {
  const {name, visiteemail, email, selectedDate} = req.body;

  const newAppointmentsData = new Appointmentsdata({
    name,
    visiteemail,
    email,
    selectedDate
  });

  try{
    savedAppointmentsData = await newAppointmentsData.save();
    res.json("New User Successfully Created");
  }catch(err) {
    res.status(400).send(err);
  }
});

app.get('/api/appointmentsdata', async (req, res) => {
  try {
    const appointmentsinfo = await Appointmentsdata.find();
    res.json(appointmentsinfo);
  } catch (err) {
    res.status(400).send(err);
  }
});
///////////////////////////
///////////////////////////





//////////////////////////
//////////////////////////

// Delete a user by ID from Userdata collection
app.delete('/api/appointmentsdata/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const result = await Appointmentsdata.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a appointment by ID from Userdata collection
app.delete('/api/userdata/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const result = await Userdata.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a department by ID from Departments collection
app.delete('/api/departmentsdata/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const result = await Departmentsdata.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: 'Department deleted successfully' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error('Error deleting Department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a record by ID from Data collection
app.delete('/api/data/:_id', async (req, res) => {
  try {
      const recordId = req.params._id;

      // Validate that the id is provided and is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(recordId)) {
          return res.status(400).json({ message: 'Invalid ID format' });
      }

      const result = await Data.findByIdAndDelete(recordId);

      if (result) {
          res.status(200).json({ message: 'Record deleted successfully' });
      } else {
          res.status(404).json({ message: 'Record not found' });
      }
  } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
