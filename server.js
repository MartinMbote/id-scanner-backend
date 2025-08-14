const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();   //to load the .env variables
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY);
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

// app.use(cors());
app.use(cors({ origin: '*' })); // Open for testing — restrict later
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
  badgeId: String,
  checkoutTime: String,
  licencePlateNo: String,
});

const Data = mongoose.model('Data', dataSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/data', async (req, res) => {
  const { phone, department, sharedString, idName, dateTime, visitorTag, badgeId, checkoutTime, licencePlateNo } = req.body;

  // Encrypt individual fields
  const encryptedPhone = cryptr.encrypt(phone);
  // const encryptedDepartmentl = cryptr.encrypt(department);
  const encryptedSharedString = cryptr.encrypt(sharedString);
  const encryptedIdName = cryptr.encrypt(idName);
  // const encryptedDateTime = cryptr.encrypt(dateTime);
  // const encryptedVisitorTag = cryptr.encrypt(visitorTag);
  // const encryptedBadgeId = cryptr.encrypt(badgeId);

  const newData = new Data({
    phone: encryptedPhone,
    department,
    sharedString: encryptedSharedString,
    idName: encryptedIdName,
    dateTime,
    visitorTag,    
    badgeId,
    checkoutTime,
    licencePlateNo
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

    // Decrypt each of the Visitor's fields
    const decryptedVisitorInfo = data.map(visitor => {
      try {
        return {
          _id: visitor._id,
          phone: cryptr.decrypt(visitor.phone),
          department: visitor.department,
          sharedString: cryptr.decrypt(visitor.sharedString),
          idName: cryptr.decrypt(visitor.idName),
          dateTime: visitor.dateTime,
          visitorTag: visitor.visitorTag,
          cleared: visitor.cleared,
          badgeId: visitor.badgeId,
          checkoutTime: visitor.checkoutTime,
          licencePlateNo: visitor.licencePlateNo
        };
      } catch (decryptError) {
        console.error('Decryption error:', decryptError);
        return null; // Skip this appointment if decryption fails
      }
    }).filter(visitor => visitor !== null); // Filter out failed decryption

    // Send the decrypted data
    res.json(decryptedVisitorInfo);
  } catch (err) {
    res.status(400).send(err);
  }
});


// // Updated schema to include all necessary fields
// const dataSchema = new mongoose.Schema({
//   phone: String,
//   department: String,
//   sharedString: String,
//   idName: String,
//   dateTime: String,
//   visitorTag: String,
//   cleared: String,
//   badgeId: String,
// });

// const Data = mongoose.model('Data', dataSchema);

// // Updated POST endpoint to handle all the fields
// app.post('/api/data', async (req, res) => {
//   const { phone, department, sharedString, idName, dateTime, visitorTag, badgeId } = req.body;
//   const newData = new Data({
//     phone,
//     department,
//     sharedString,
//     idName,
//     dateTime,
//     visitorTag,
//     badgeId
//   });

//   try {
//     const savedData = await newData.save();
//     res.json(savedData);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // GET endpoint to retrieve data
// app.get('/api/data', async (req, res) => {
//   try {
//     const data = await Data.find();
//     res.json(data);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

/////////////////////////////////////////////////////////
//////////////////Logs///////////////////////

const activityLogRoutes = require('./routes/activityLogRoute');
app.use('/api/activity', activityLogRoutes);


/////////////////////////////////////////////////////////
//////////////////Logs///////////////////////




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
//////////////////Add & Delete Event Venues///////////////////////

const eventsSchemea = new mongoose.Schema({
  eventVenue: String,  
});

const eventsVenuesData = mongoose.model('eventsVenuesData', eventsSchemea);

// Updated POST endpoint to handle all the fields
app.post('/api/eventvenues', async (req, res) => {
  const { eventVenue } = req.body;
  const newEventsVenues = new eventsVenuesData({
    eventVenue
  });

  try {
    const savedData = await newEventsVenues.save();
    res.json(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET endpoint to retrieve data
app.get('/api/eventvenues', async (req, res) => {
  try {
    const data = await eventsVenuesData.find();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
});


// Delete a department by ID from Departments collection
app.delete('/api/eventvenues/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const result = await eventsVenuesData.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: 'Venue deleted successfully' });
    } else {
      res.status(404).json({ message: 'Venue not found' });
    }
  } catch (error) {
    console.error('Error deleting Department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/////////////////////Event Venues////////////////////////
///////////////////////////////////////////////////////





/////////////////////////////////////////////////////////
//////////////////Add Visitors Badge///////////////////////

const visitorsBadgeSchema = new mongoose.Schema({
  visitorsBadge: String,  
  chosen: String,
});

const Visitorsbadgedata = mongoose.model('Visitorsbadgedata', visitorsBadgeSchema);

// Updated POST endpoint to handle all the fields
app.post('/api/visitorsbadges', async (req, res) => {
  const { visitorsBadge, chosen } = req.body;
  const newVisitorsBadgeData = new Visitorsbadgedata({
    visitorsBadge,
    chosen
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

// Example using Express.js and Mongoose
app.put('/api/visitorsbadges/:id', async (req, res) => {
  const { id } = req.params;
  const { chosen } = req.body; // Get the 'chosen' value from the request body

  try {
    // Find the document by ID and update the cleared field
    const updatedBadge = await Visitorsbadgedata.findByIdAndUpdate(
      id, // The ID of the document to update
      { $set: { chosen: String(chosen) } }, // Set the chosen field to the value from the request
      { new: true } // Return the updated document
    );  

    if (!updatedBadge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    res.status(200).json(updatedBadge);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

/////////////////////Visitors Badge////////////////////////
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
  checkoutTime: String,
});

const DataB = mongoose.model('DataB', dataSchemaB);

// Route to move a document from CollectionA to CollectionB
// app.post('/api/migrate', async (req, res) => {
//   try {
//       const documentId = req.body.id;

//       // Find the document in CollectionA
//       const document = await Data.findById(documentId);

//       if (!document) {
//           return res.status(404).json({ message: 'Document not found' });
//       }

//       // Save the document to CollectionB
//       const migratedDocument = new DataB(document.toObject());
//       await migratedDocument.save();

//       // Remove the document from CollectionA
//       await Data.findByIdAndDelete(documentId);

//       res.json({ message: 'Document migrated successfully' });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//       console.log(error.message);
//   }
// });


// app.post('/api/migrate', async (req, res) => {
//   try {
//     const documentId = req.body.id;

//     // Try to find the document in Data
//     let document = await Data.findById(documentId);

//     // If not found in Data, try Appointmentsdata
//     let sourceModel = Data;
//     if (!document) {
//       document = await Appointmentsdata.findById(documentId);
//       sourceModel = Appointmentsdata;
//     }

//     // If still not found, return 404
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found in both collections' });
//     }

//     // Migrate to DataB
//     const migratedDocument = new DataB(document.toObject());
//     await migratedDocument.save();

//     // Delete from the source collection
//     await sourceModel.findByIdAndDelete(documentId);

//     res.json({ message: 'Document migrated successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });


app.post('/api/migrate', async (req, res) => {
  try {
    const documentId = req.body.id;
    const checkoutTime = req.body.checkoutTime; // <-- Step 1: get checkout time

    // Try to find the document in Data
    let document = await Data.findById(documentId);

    // If not found in Data, try Appointmentsdata
    let sourceModel = Data;
    if (!document) {
      document = await Appointmentsdata.findById(documentId);
      sourceModel = Appointmentsdata;
    }

    // If still not found, return 404
    if (!document) {
      return res.status(404).json({ message: 'Document not found in both collections' });
    }

    // Convert to plain object and add checkoutTime
    const documentObject = document.toObject();
    documentObject.checkoutTime = checkoutTime; // <-- Step 2: add checkout time

    // Migrate to DataB
    const migratedDocument = new DataB(documentObject);
    await migratedDocument.save();

    // Delete from the source collection
    await sourceModel.findByIdAndDelete(documentId);

    res.json({ message: 'Document migrated successfully with checkoutTime' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});


////////////////////////migration////////////////////////
/////////////////////////////////////////////////////////


///////////////////////Retrieve Migrated Data from DataB//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// app.get('/api/datab', async (req, res) => {
//   try {
//     const documents = await DataB.find(); // Fetch all documents from DataB
//     res.json(documents);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Error fetching data from DataB' });
//   }
// });


// app.get('/api/datab', async (req, res) => {
//   try {
//     const documents = await DataB.find(); // Fetch all documents from DataB

//     // Decrypt each of the Visitor's fields
//     const decryptedMigratedInfo = documents.map(visitor => {
//       try {
//         return {
//           _id: visitor._id,
//           phone: visitor.phone ? cryptr.decrypt(visitor.phone) : null,
//           department: visitor.department,
//           sharedString: visitor.sharedString ? cryptr.decrypt(visitor.sharedString) : null,
//           idName: visitor.idName ? cryptr.decrypt(visitor.idName) : null,
//           dateTime: visitor.dateTime,
//           visitorTag: visitor.visitorTag,
//           cleared: visitor.cleared
//         };
//       } catch (decryptError) {
//         console.error('Decryption error:', decryptError);
//         return null; // Skip this visitor if decryption fails
//       }
//     }).filter(visitor => visitor !== null);
    

//     res.json(decryptedMigratedInfo);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Error fetching data from DataB' });
//   }
// });


const looksEncrypted = (value) =>
  typeof value === 'string' && value.length > 20 && /^[A-Za-z0-9+/=]+$/.test(value);

app.get('/api/datab', async (req, res) => {
  try {
    const documents = await DataB.find(); // Fetch all documents from DataB

    const decryptedMigratedInfo = documents.map(visitor => {
      try {
        return {
          _id: visitor._id,
          phone: looksEncrypted(visitor.phone) ? cryptr.decrypt(visitor.phone) : visitor.phone,
          department: visitor.department,
          sharedString: looksEncrypted(visitor.sharedString) ? cryptr.decrypt(visitor.sharedString) : visitor.sharedString,
          idName: looksEncrypted(visitor.idName) ? cryptr.decrypt(visitor.idName) : visitor.idName,
          dateTime: visitor.dateTime,
          visitorTag: visitor.visitorTag,
          cleared: visitor.cleared
        };
      } catch (decryptError) {
        console.error('Decryption error:', decryptError);
        return null; // Skip this visitor if decryption fails
      }
    }).filter(visitor => visitor !== null);

    res.json(decryptedMigratedInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching data from DataB' });
  }
});





///////////////////////Retrieve Migrated Data from DataB//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////





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



///////////////////////////ADD USERS///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
const bcrypt = require('bcrypt');

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

  // Encrypt individual fields
  const encryptedName = cryptr.encrypt(name);
  const encryptedStaffid = cryptr.encrypt(staffid);
  const encryptedEmail = cryptr.encrypt(email);
  // const encryptedPassword = cryptr.encrypt(password);  
  const hashedPassword = await bcrypt.hash(password, 10); // Password is hashed instead of encrypt

  const newUserData = new Userdata({
    name: encryptedName,
    staffid: encryptedStaffid,
    email: encryptedEmail,
    // password: encryptedPassword,
    password: hashedPassword, // store hashed password
    role
  });

  try{
    // savedUserData = await newUserData.save();
    await newUserData.save();
    res.json("New User Successfully Created");
  }catch(err) {
    res.status(400).send(err);
  }
});

// app.get('/api/userdata', async (req, res) => {
//   try {
//     const userinfo = await Userdata.find();
//     res.json(userinfo);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

app.get('/api/userdata', async (req, res) => {
  try {
    const userinfo = await Userdata.find();

    // Decrypt each of the Visitor's fields
    const decryptedUsersInfo = userinfo.map(user => {
      try {
        return {
          _id: user._id,
          name: cryptr.decrypt(user.name),
          staffid: cryptr.decrypt(user.staffid),
          email: cryptr.decrypt(user.email),
          // password: cryptr.decrypt(user.password),
          password: user.password,
          role: user.role
        };
      } catch (decryptError) {
        console.error('Decryption error:', decryptError);
        return null; // Skip this appointment if decryption fails
      }
    }).filter(user => user !== null); // Filter out failed decryption

    // Send the decrypted data
    res.json(decryptedUsersInfo);
  } catch (err) {
    res.status(400).send(err);
  }
});
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////




///////////////////////////ADD APPOINTMENTS + ENCRYPTION////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const appointmentsDataSchema = new mongoose.Schema({
  name: String,
  // visiteemail: String,
  email: String,
  selectedDate: String,
  AttendeeID: String,
  phoneNo: String,
  eventName: String,
  eventLocation: String,
  status: String,
  visitorTag: String,
  badgeId: String,
  checkInTime: String,
})

const Appointmentsdata = mongoose.model('Appointmentsdata', appointmentsDataSchema);

app.post('/api/appointmentsdata', async (req, res) => {
  const {name, email, selectedDate, AttendeeID, phoneNo, eventName, eventLocation, status, visitorTag, badgeId, checkInTime} = req.body;

  // Encrypt individual fields
  const encryptedName = cryptr.encrypt(name);
  // const encryptedVisiteEmail = cryptr.encrypt(visiteemail);
  const encryptedEmail = cryptr.encrypt(email);
  // const encryptedSelectedDate = cryptr.encrypt(selectedDate);

  const newAppointmentsData = new Appointmentsdata({
    name: encryptedName,
    // visiteemail: encryptedVisiteEmail,
    email: encryptedEmail,
    selectedDate,
    AttendeeID,
    phoneNo,
    eventName,
    eventLocation,
    status,
    visitorTag,
    badgeId,
    checkInTime
  });

  try{
    savedAppointmentsData = await newAppointmentsData.save();
    res.json("New User Successfully Created");
  }catch(err) {
    res.status(400).send(err);
  }
});

// app.get('/api/appointmentsdata', async (req, res) => {
//   try {
//     const appointmentsinfo = await Appointmentsdata.find();
//     res.json(appointmentsinfo);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

app.get('/api/appointmentsdata', async (req, res) => {
  try {
    const appointmentsinfo = await Appointmentsdata.find();
    
    // Decrypt each appointment's fields
    const decryptedAppointments = appointmentsinfo.map(appointment => {
      try {
        return {
          _id: appointment._id,
          name: cryptr.decrypt(appointment.name),
          // visiteemail: cryptr.decrypt(appointment.visiteemail),
          email: cryptr.decrypt(appointment.email),
          selectedDate: appointment.selectedDate,
          AttendeeID: appointment.AttendeeID,
          phoneNo: appointment.phoneNo,
          eventName: appointment.eventName,
          eventLocation: appointment.eventLocation,
          status: appointment.status,
          visitorTag: appointment.visitorTag,
          badgeId: appointment.badgeId,
          checkInTime: appointment.checkInTime
        };
      } catch (decryptError) {
        console.error('Decryption error:', decryptError);
        return null; // Skip this appointment if decryption fails
      }
    }).filter(appointment => appointment !== null); // Filter out failed decryption

    // Send the decrypted data
    res.json(decryptedAppointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(400).send('Error fetching appointments');
  }
});


///////////////////////////UPDATE APPOINTMENTS STATUS & CHOOSEN BADGE//////////////
////////////////////////////////////////////////////////////////////////////////////


app.put('/api/appointmentsdata/:attendeeID', async (req, res) => {
  const { attendeeID } = req.params;
  const { badgeId, visitorTag, status, checkInTime } = req.body;

  try {
    const updatedAppointment = await Appointmentsdata.findOneAndUpdate(
      { AttendeeID: attendeeID },
      { $set: { badgeId, visitorTag, status, checkInTime } }, // Add fields as needed
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});


///////////////////////////APPOINTMENTS TO UPDATE STATUS & CHOOSEN BADGE//////////////
////////////////////////////////////////////////////////////////////////////////////


//////////////////////////
//////////////////////////

// Delete an appointment by ID from Appointmentsdata collection
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


// Delete user by ID from Userdata collection
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


// Delete a visitors badges by ID from badges collection
app.delete('/api/visitorsbadges/:_id', async (req, res) => {
  try {
    const userId = req.params._id;
    const result = await Visitorsbadgedata.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: 'Badge deleted successfully' });
    } else {
      res.status(404).json({ message: 'Badge not found' });
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


//////////////////////////////Email Serrvices - Adding Users/////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});
//////////////////////////////Email Serrvices////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////Email Serrvices - Adding Appointments//////////////////
/////////////////////////////////////////////////////////////////////////////////////
const appointmentTransporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-appointment-email', (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message,
  };

  appointmentTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});
//////////////////////////////Email Serrvices////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



////////////////////////////// AUTHENTICATION ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// const users = require('./users');

app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Login route
app.post('/login', async (req, res) => {
  const { staffid, password } = req.body;

  try {
    const users = await Userdata.find();

    // Find the user with a matching decrypted staffid
    let matchedUser = null;
    for (let user of users) {
      const decryptedStaffid = cryptr.decrypt(user.staffid);
      if (decryptedStaffid === staffid) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid credentials (staffid)' });
    }

    // Compare password with hashed version
    const passwordMatch = await bcrypt.compare(password, matchedUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password)' });
    }


    // Decrypt the username
    let decryptedUsername;
    try {
      decryptedUsername = cryptr.decrypt(matchedUser.name);
    } catch (error) {
      console.error("Username decryption failed:", error.message);
      return res.status(500).json({ message: 'Failed to decrypt username' });
    }


    // Generate JWT token
    const token = jwt.sign(
      {
        id: matchedUser._id,
        staffid,
        name: decryptedUsername,
        role: matchedUser.role
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});
////////////////////////////// AUTHENTICATION ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


// const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
