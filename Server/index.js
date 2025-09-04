const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');

const axios = require('axios');
const path = require('path');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());

app.use(cors());

  
const db = mysql.createConnection(process.env.DATABASE_URL)

const db2 = mysql.createConnection(process.env.DATABASE_URL2)




// Connect to the first database
db.connect((err) => {
    if (err) {
        console.error('mydata database connection failed: ', err);
    } else {
        console.log('mydata database connected successfully');
    }
});

// Connect to the second database
db2.connect((err) => {
    if (err) {
        console.error('users_info database connection failed: ', err);
    } else {
        console.log('users_info database connected successfully');
    }
});

const jwtSecret = 'tpqi';



app.get('/', (req, res) => {
    res.send('This is my backend running... ')
})



app.post('/register', (req, res) => {
  const { id,email,password,firstNameTH,lastNameTH,firstNameEN,lastNameEN,phone,line,address } = req.body;

  // Additional validations can be added here

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Password hashing error' });
    }

    const newUser = { id,email, password: hash,firstNameTH,lastNameTH,firstNameEN,lastNameEN,phone,line,address};
    db2.query('INSERT INTO user SET ?', newUser, (err, results) => {
      if (err) {
        // You might want to handle specific errors like unique constraint violations
        return res.status(500).json({ error: 'User registration failed' });
      }
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db2.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err || !isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: '1h' });
      return res.json({ token });
    });
  });
});

app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  bcrypt.hash(newPassword, 10, (hashErr, hash) => {
    if (hashErr) {
      return res.status(500).json({ error: 'Password hashing error' });
    }

    // Update the user's password in the database
    db2.query('UPDATE user SET password = ? WHERE email = ?', [hash, email], (updateErr, results) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Password reset failed' });
      }

      if (results.affectedRows === 0) {
        // No user found with the provided email
        return res.status(404).json({ error: 'User not found' });
      }

      // Password reset successful
      return res.status(200).json({ message: 'Password reset successful' });
    });
  });
});




//////////////////////////////////////////////////////////////////

app.get('/getProfile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
    SELECT 
      u.id,
      u.email,
      u.profileimage,
      u.firstNameTH,
      u.lastNameTH,
      u.firstNameEN,
      u.lastNameEN,
      u.phone,
      u.line,
      u.address
      FROM user AS u
      WHERE email = ? 
    `;

    db2.query(getProfileQuery, [userEmail], (err, results) => {
      if (err) {
        console.error('Error Fetching User Skills:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User Skills not found' });
      }

      // Send the user profile information as a JSON response
      const userProfile = results[0]; // Assuming there's only one result
      return res.status(200).json({ success: true, data: userProfile });
    });
  });
});

app.get('/getProfileById/:id', (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
      SELECT 
        u.id,
        u.email,
        u.profileimage,
        u.firstNameTH,
        u.lastNameTH,
        u.firstNameEN,
        u.lastNameEN,
        u.phone,
        u.line,
        u.address
      FROM user AS u
      WHERE u.email = ? and u.id = ?
    `;

    db2.query(getProfileQuery, [userEmail, userId], (err, results) => {
      if (err) {
        console.error('Error Fetching User Profile:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User Profile not found' });
      }

      const userProfile = results[0]; // Assuming there's only one result
      return res.status(200).json({ success: true, data: userProfile });
    });
  });
});

app.put('/updateProfile/:id', (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }
    
    const userEmail = decodedToken.email;

    // Extract updated profile information from the request body
    const { firstNameTH, lastNameTH, firstNameEN, lastNameEN, phone, line, address } = req.body;

    const updateProfileQuery = `
      UPDATE user
      SET
        firstNameTH = ?,
        lastNameTH = ?,
        firstNameEN = ?,
        lastNameEN = ?,
        phone = ?,
        line = ?,
        address = ?
      WHERE email = ? AND id = ?
    `;

    // Use parameterized queries to prevent SQL injection
    db2.query(
      updateProfileQuery,
      [firstNameTH, lastNameTH, firstNameEN, lastNameEN, phone, line, address, userEmail, userId],
      (updateErr) => {
        if (updateErr) {
          // Log the error for debugging purposes
          console.error('Error updating user profile:', updateErr);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        // Profile update was successful
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
      }
    );
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Check that 'uploads' is the correct destination
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/uploadProfileImage/:id', upload.single('actualFieldName'), (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.filename;

    const updateProfileQuery = `
      UPDATE user
      SET profileimage = ?
      WHERE email = ? AND id = ?
    `;

    const getProfileQuery = `
      SELECT 
        profileimage
      FROM user
      WHERE email = ? AND id = ?
    `;

    db2.query(updateProfileQuery, [uploadedFilePath, userEmail, userId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating user profile with new image path:', updateErr);
        return res.status(500).json({ success: false, error: 'Failed to update user profile' });
      }

      db2.query(getProfileQuery, [userEmail, userId], (profileErr, results) => {
        if (profileErr) {
          console.error('Error fetching updated user profile:', profileErr);
          return res.status(500).json({ success: false, error: 'Failed to fetch updated user profile' });
        }

        if (results.length === 0) {
          return res.status(404).json({ success: false, error: 'Updated user profile not found' });
        }

        const updatedUserProfile = results[0];
        // Construct a relative path or URL path for the client
        const relativePath = 'uploads/' + updatedUserProfile.profileimage;
        res.status(200).json({ success: true, data: { ...updatedUserProfile, profileimage: relativePath } });
      });
    });
  });
});


//////////////////////////////////////////////////////////////////

// Function to check if a string is a valid URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

app.post('/usersSkills', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;
    const usersSkills = req.body;

    // Perform validation on usersSkills here

    usersSkills.email = userEmail;

    // Check if link_skill is a valid URL
    if (isValidUrl(usersSkills.link_skill)) {
      try {
        // Check the URL status code
        const response = await axios.head(usersSkills.link_skill);
        const statusCode = response.status;

        if (statusCode === 200) {
          // Insert into the database if the URL is valid and returns status code 200
          db.query('INSERT INTO users_skills SET ?', usersSkills, (err, results) => {
            if (err) {
              // Handle specific database errors if needed
              return res.status(500).json({ error: 'Insertion failed' });
            }
            return res.status(201).json({ message: 'Record inserted successfully' });
          });
        } else {
          return res.status(400).json({ error: 'Invalid URL or URL is not accessible' });
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid URL or URL is not accessible' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  });
});



app.get('/getUsersSkills/:id', (req, res) => {
  const id = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
      SELECT
        u.id_unit_code AS unit_id,
        u.unit_code,
        u.name AS unit_name,
        skill.id_skill,
        skill.name_skill,
        us.email,
        us.id_skill AS user_skill_id,
        us.link_skill
      FROM unit_code AS u 
      LEFT JOIN u_skill ON u_skill.id_unit_code = u.id_unit_code 
      LEFT JOIN skill ON skill.id_skill = u_skill.id_skill 
      LEFT JOIN users_skills AS us ON us.id_skill = skill.id_skill
      WHERE email = ? AND u.id_unit_code = ?
    `;

    db.query(getProfileQuery, [userEmail, id], (err, results) => {
      if (err) {
        console.error('Error Fetching User Skills:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User Skills not found' });
      }

      // Initialize arrays to store skill data
      const skillData = [];
      const skillSet = new Set();

      // Iterate through the query result to collect skill data
      for (const row of results) {
        const skillItem = {
          id_skill: row.id_skill,
          name_skill: row.name_skill,
          link_skill: row.link_skill,
        };

        if (!skillSet.has(JSON.stringify(skillItem))) {
          skillData.push(skillItem);
          skillSet.add(JSON.stringify(skillItem));
        }
      }

      // Send the data, including the array of skill data
      res.status(200).json({
        success: true,
        data: {
          id_unit_code: results[0].unit_id,
          name_skills: skillData,
        },
      });
    });
  });
});


app.put('/updateUserSkill/:id', (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const userSkillId = req.params.id;
    const { link_skill } = req.body;
    const userEmail = decodedToken.email;

    // Extract link_skill directly from req.body
    const updatedLinkSkill = req.body.link_skill;

    // Update the SQL query to set link_skill directly
    db.query('UPDATE users_skills SET link_skill = ? WHERE id_skill = ? AND email = ?', [updatedLinkSkill, userSkillId, userEmail], (err, result) => {
      if (err) {
        console.error('Error Updating User Skill:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'User Skill not found' });
      }
      res.status(200).json({ success: true, message: 'User Skill updated successfully' });
    });
  });
});


app.delete('/deleteUserSkill/:id', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    const userSkillId = req.params.id;

    const deleteQuery = 'DELETE FROM users_skills WHERE id_skill = ?';

    db.query(deleteQuery, [userSkillId], (err, result) => {
      if (err) {
        console.error('Error Deleting User Skill:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'User Skill not found' });
      }
      res.status(200).json({ success: true, message: 'User Skill deleted successfully' });
    });
  });
});


//////////////////////////////////////////////////////////////////




app.post('/usersKnowledge', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;
    const usersKnowledge = req.body;

    // Validate usersKnowledge here

    usersKnowledge.email = userEmail;

    if (isValidUrl(usersKnowledge.link_knowlege)) { // Fix typo in property name
      try {
        // Check the URL status code
        const response = await axios.head(usersKnowledge.link_knowlege); // Fix typo in property name
        const statusCode = response.status;

        if (statusCode === 200) {

          db.query('INSERT INTO users_knowlege SET ?', usersKnowledge, (err, results) => {
            if (err) {
              // Handle specific database errors if needed
              return res.status(500).json({ error: 'Insertion failed' });
            }

            return res.status(201).json({ message: 'Record inserted successfully' });
          });
        } else {
          return res.status(400).json({ error: 'Invalid URL or URL is not accessible' });
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid URL or URL is not accessible' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  });
});


app.get('/getUsersKnowledge/:id', (req, res) => {
  const id = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
        SELECT
        u.id_unit_code AS unit_id,
        u.unit_code,
        u.name AS unit_name,
        knowlege.id_knowlege,
        knowlege.name_knowlege,
        uk.email,
        uk.id_knowlege AS user_knowlege_id,
        uk.link_knowlege
      FROM unit_code AS u 
      LEFT JOIN u_knowlege ON u_knowlege.id_unit_code = u.id_unit_code 
      LEFT JOIN knowlege ON knowlege.id_knowlege = u_knowlege.id_knowlege 
      LEFT JOIN users_knowlege AS uk ON uk.id_knowlege = knowlege.id_knowlege
      WHERE email = ? AND u.id_unit_code = ?
    `;

    db.query(getProfileQuery, [userEmail, id], (err, results) => {
      if (err) {
        console.error('Error Fetching User Skills:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User Skills not found' });
      }

      // Initialize arrays to store skill data
      const KnowledgeData = [];
      const KnowledgeSet = new Set();

      // Iterate through the query result to collect skill data
      for (const row of results) {
        const KnowledgeItem = {
          id_knowlege: row.id_knowlege,
          name_knowlege: row.name_knowlege,
          link_knowlege: row.link_knowlege,
        };

        if (!KnowledgeSet.has(JSON.stringify(KnowledgeItem))) {
          KnowledgeData.push(KnowledgeItem);
          KnowledgeSet.add(JSON.stringify(KnowledgeItem));
        }
      }

      // Send the data, including the array of skill data
      res.status(200).json({
        success: true,
        data: {
          id_unit_code: results[0].unit_id,
          name_knowlege: KnowledgeData,
        },
      });
    });
  });
});


app.put('/updateUserKnowledge/:id', (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const userKnowledgeId = req.params.id;
    const { link_knowlege } = req.body;
    const userEmail = decodedToken.email;

    // Extract link_skill directly from req.body
    const updatedLinkKnowledge = req.body.link_knowlege;

    // Update the SQL query to set link_skill directly
    db.query('UPDATE users_knowlege SET link_knowlege = ? WHERE id_knowlege = ? AND email = ?', [updatedLinkKnowledge, userKnowledgeId, userEmail], (err, result) => {
      if (err) {
        console.error('Error Updating User Skill:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'User Skill not found' });
      }
      res.status(200).json({ success: true, message: 'User Skill updated successfully' });
    });
  });
});


app.delete('/deleteUserKnowledge/:id', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    const userKnowledgeId = req.params.id;

    const deleteQuery = 'DELETE FROM users_knowlege WHERE id_knowlege = ?';

    db.query(deleteQuery, [userKnowledgeId], (err, result) => {
      if (err) {
        console.error('Error Deleting User Skill:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'User Skill not found' });
      }
      res.status(200).json({ success: true, message: 'User Skill deleted successfully' });
    });
  });
});


//////////////////////////////////////////////////////////////////


app.get('/sprofile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
    SELECT 
        us.email,
        cl.id_career_level, 
        level.id_level, level.name_level,
        career.id_career, career.name_career, 
        skill.id_skill,skill.name_skill
    FROM career_level AS cl 
    JOIN level ON cl.id_level = level.id_level
    JOIN career ON cl.id_career = career.id_career
    LEFT JOIN cl_skills AS cls ON cl.id_career_level = cls.id_career_level
    LEFT JOIN skill ON cls.id_skill = skill.id_skill
    LEFT JOIN users_skills AS us ON us.id_skill = skill.id_skill
    WHERE us.email = ?
    `;

    db.query(getProfileQuery, [userEmail], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }
    
      const userProfile = {
        email: userEmail,
        careerLevels: {}
      };
    
      results.forEach(row => {
        if (!userProfile.careerLevels[row.id_career_level]) {
          userProfile.careerLevels[row.id_career_level] = {
            level: {
              id: row.id_level,
              name: row.name_level
            },
            career: {
              id: row.id_career,
              name: row.name_career
            },
            skills: new Set()
          };
        }
    
        if (row.id_skill) {
          userProfile.careerLevels[row.id_career_level].skills.add(row.id_skill);
        }
      });
    
      for (const level in userProfile.careerLevels) {
        userProfile.careerLevels[level].skillCount = userProfile.careerLevels[level].skills.size;
        delete userProfile.careerLevels[level].skills;
      }
    
      res.json(userProfile);
    });
  });
});

app.get('/COUNTSkill', (req, res) => {
  const sql = `
    SELECT cl.id_career_level, COUNT(DISTINCT cls.id_skill) AS skill_count
    FROM career_level AS cl
    LEFT JOIN cl_skills AS cls ON cl.id_career_level = cls.id_career_level 
    LEFT JOIN skill ON cls.id_skill = skill.id_skill
    GROUP BY cl.id_career_level
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
  
    const countskill = {
      careerLevels: {}
    };
  
    results.forEach(row => {
      countskill.careerLevels[row.id_career_level] = {
        skillCount: row.skill_count
      };
    });
  
    res.json(countskill);
  });
});

app.get('/kprofile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
    SELECT 
        uk.email,
        cl.id_career_level, 
        level.id_level, level.name_level,
        career.id_career, career.name_career, 
        knowlege.id_knowlege,knowlege.name_knowlege
    FROM career_level AS cl 
    JOIN level ON cl.id_level = level.id_level
    JOIN career ON cl.id_career = career.id_career
    LEFT JOIN cl_knowlege AS clk ON cl.id_career_level = clk.id_career_level
    LEFT JOIN knowlege ON clk.id_knowlege = knowlege.id_knowlege
    LEFT JOIN users_knowlege AS uk ON uk.id_knowlege = knowlege.id_knowlege
    WHERE uk.email = ?
    `;

    db.query(getProfileQuery, [userEmail], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }
    
      const userProfile = {
        email: userEmail,
        careerLevels: {}
      };
    
      results.forEach(row => {
        if (!userProfile.careerLevels[row.id_career_level]) {
          userProfile.careerLevels[row.id_career_level] = {
            level: {
              id: row.id_level,
              name: row.name_level
            },
            career: {
              id: row.id_career,
              name: row.name_career
            },
            knowledges: new Set()
          };
        }
    
        if (row.id_knowlege) {
          userProfile.careerLevels[row.id_career_level].knowledges.add(row.id_knowlege);
        }
      });
    
      for (const level in userProfile.careerLevels) {
        userProfile.careerLevels[level].knowledgeCount = userProfile.careerLevels[level].knowledges.size;
        delete userProfile.careerLevels[level].knowledges;
      }
    
      res.json(userProfile);
    });
  });
});

app.get('/COUNTKnowladge', (req, res) => {
  const sql = `
  SELECT cl.id_career_level, COUNT(DISTINCT clk.id_knowlege) AS knowledge_count
    FROM career_level AS cl
    LEFT JOIN cl_knowlege AS clk ON cl.id_career_level = clk.id_career_level 
    LEFT JOIN knowlege ON clk.id_knowlege = knowlege.id_knowlege
    GROUP BY cl.id_career_level
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
  
    const countknowledge = {
      careerLevels: {}
    };
  
    results.forEach(row => {
      countknowledge.careerLevels[row.id_career_level] = {
        knowledgeCount: row.knowledge_count
      };
    });
  
    res.json(countknowledge);
  });
});

//////////////////////////////////////////////////////////////////




app.get('/chartUnitcode/:id', (req, res) => {
  const id = req.params.id;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userEmail = decodedToken.email;

    const getProfileQuery = `
      SELECT
        cl.id_career_level,
        us.email,
        u.id_unit_code,
        COUNT(DISTINCT us.id_skill) + COUNT(DISTINCT uk.id_knowlege) AS total_count
      FROM
        career_level AS cl
        LEFT JOIN career AS c ON c.id_career = cl.id_career
        LEFT JOIN level AS l ON l.id_level = cl.id_level
        LEFT JOIN all_details AS ad ON ad.id_career_level = cl.id_career_level
        LEFT JOIN details AS d ON d.id_d = ad.id_d
        LEFT JOIN cl_uc AS clu ON clu.id_career_level = cl.id_career_level 
        LEFT JOIN unit_code AS u ON u.id_unit_code = clu.id_unit_code
        LEFT JOIN u_skill ON u_skill.id_unit_code = u.id_unit_code
        LEFT JOIN skill AS s ON s.id_skill = u_skill.id_skill
        LEFT JOIN u_knowlege ON u_knowlege.id_unit_code = u.id_unit_code
        LEFT JOIN knowlege AS k ON k.id_knowlege = u_knowlege.id_knowlege
        LEFT JOIN users_skills AS us ON us.id_skill = s.id_skill
        LEFT JOIN users_knowlege AS uk ON uk.id_knowlege = k.id_knowlege
      WHERE
        us.email = ? AND cl.id_career_level = ?
      GROUP BY
        u.id_unit_code;
    `;

    db.query(getProfileQuery, [userEmail, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const unitCodeArray = results.map(result => ({
        id_career_level: result.id_career_level,
        email: result.email,
        id_unit_code: result.id_unit_code,
        total_count: result.total_count
      }));

      res.json(unitCodeArray);
    });
  });
});


app.get('/COUNTunitcode', (req, res) => {
  const sql = `
  SELECT
    u.id_unit_code,
    COUNT(DISTINCT s.id_skill) + COUNT(DISTINCT k.id_knowlege) AS total_count
  FROM unit_code AS u 
  LEFT JOIN u_skill ON u_skill.id_unit_code = u.id_unit_code
  LEFT JOIN skill AS s ON s.id_skill = u_skill.id_skill
  LEFT JOIN u_knowlege ON u_knowlege.id_unit_code = u.id_unit_code
  LEFT JOIN knowlege AS k ON k.id_knowlege = u_knowlege.id_knowlege
  GROUP BY u.id_unit_code
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
  
    const countunitcode = {
      unitCodes: {}
    };
  
    results.forEach(row => {
      countunitcode.unitCodes[row.id_unit_code] = {
        totalCount: row.total_count
      };
    });
  
    res.json(countunitcode);
  });
});



//////////////////////////////////////////////////////////////////



app.get('/getCareerLevels', (req, res) => {
  const { name_career, name_level } = req.query;

  // Base SQL query
  let sql = `
  SELECT cl.id_career_level, c.name_career, l.name_level
  FROM career_level as cl
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  `;

  // Conditions for search
  const conditions = [];
  const params = [];

  if (name_career) {
    conditions.push('c.name_career LIKE ?');
    params.push(`%${name_career}%`);
  }

  if (name_level) {
    conditions.push('l.name_level LIKE ?');
    params.push(`%${name_level}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' OR ');
  }

  db.query(sql, params, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});


app.get('/getCareerLevels/:id', (req, res) => {
  const id = req.params.id; // Get the career level ID from the URL parameter
  const sql = `
  SELECT cl.id_career_level, c.name_career, l.name_level, 
  d.outcomes,uc.id_unit_code ,uc.unit_code, uc.name
      FROM career_level as cl
      LEFT JOIN career AS c ON c.id_career = cl.id_career
      LEFT JOIN level AS l ON l.id_level = cl.id_level
      LEFT JOIN all_details AS ad ON ad.id_career_level = cl.id_career_level
      LEFT JOIN details AS d ON d.id_d = ad.id_d
      LEFT JOIN cl_uc AS clu ON clu.id_career_level = cl.id_career_level 
    LEFT JOIN unit_code AS uc ON uc.id_unit_code = clu.id_unit_code
    WHERE cl.id_career_level = ?
    ORDER BY uc.id_unit_code ASC
  `;

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error Fetching Career Level:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      // Initialize arrays to store unit code and name
      const idunitCodeArray = [];
      const unitCodeArray = [];
      const unitNameArray = [];
      
      // Iterate through the query result to collect unit code and name
      for (const row of result) {
        idunitCodeArray.push(row.id_unit_code);
        unitCodeArray.push(row.unit_code);
        unitNameArray.push(row.name);
      }

      if (result.length === 0) {
        res.status(404).json({ status: false, error: 'Career Level not found' });
      } else {
        // Send all the data, including the arrays of unit code and name
        res.status(200).json({
          status: true,
          data: {
            id_career_level: result[0].id_career_level,
            name_career: result[0].name_career,
            name_level: result[0].name_level,
            outcomes: result[0].outcomes,
            id_unit_code: idunitCodeArray,
            unit_code: unitCodeArray,
            name: unitNameArray,
          }
        });
      }
    }
  });
});




app.get('/getUnitCode/:id', (req, res) => {
  const id = req.params.id; // Get the career level ID from the URL parameter
  const sql = `
  SELECT
  u.id_unit_code, u.unit_code, u.name, u.description_unitcode,
   s.id_skill, s.name_skill, 
   k.id_knowlege, k.name_knowlege
   FROM unit_code AS u 
   LEFT JOIN u_skill ON u_skill.id_unit_code = u.id_unit_code
   LEFT JOIN skill AS s ON s.id_skill = u_skill.id_skill
   LEFT JOIN u_knowlege ON u_knowlege.id_unit_code = u.id_unit_code
   LEFT JOIN knowlege AS k ON k.id_knowlege = u_knowlege.id_knowlege
  WHERE u.id_unit_code = ?
  `;

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error Fetching Career Level:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ status: false, error: 'Career Level not found' });
      } else {
        // Initialize arrays to store skill, knowledge, and eoc data
        const skillData = [];
        const knowlegeData = [];


        const skillSet = new Set(); // To ensure uniqueness
        const knowlegeSet = new Set(); // To ensure uniqueness


        // Iterate through the query result to collect skill, knowledge, and eoc data
        for (const row of result) {
          const skillItem = {
            id_skill: row.id_skill,
            name_skill: row.name_skill,
          };

          if (!skillSet.has(JSON.stringify(skillItem))) {
            skillData.push(skillItem);
            skillSet.add(JSON.stringify(skillItem));
          }

          const knowlegeItem = {
            name_knowlege: row.name_knowlege,
            id_knowlege: row.id_knowlege,
          };

          if (!knowlegeSet.has(JSON.stringify(knowlegeItem))) {
            knowlegeData.push(knowlegeItem);
            knowlegeSet.add(JSON.stringify(knowlegeItem));
          }
        }

        // Send the data, including the arrays of skill, knowledge, and eoc data
        res.status(200).json({
          status: true,
          data: {
            id_unit_code: result[0].id_unit_code,
            unit_code: result[0].unit_code,
            name: result[0].name,
            description_unitcode: result[0].description_unitcode,

            name_skills: skillData,     // Array of skill data
            name_knowlege: knowlegeData, // Array of knowledge data
          },
        });
      }
    }
  });
});

app.get('/Occupational/:id', (req, res) => {
  const id = req.params.id; // Get the career level ID from the URL parameter
  const sql = `
  SELECT
  u.id_unit_code,u.unit_code, o.id_occupational, o.name_occupational
   FROM unit_code AS u 
   LEFT JOIN unit_occupational AS uo ON uo.id_unit_code = u.id_unit_code
   LEFT JOIN occupational AS o ON o.id_occupational = uo.id_occupational
   WHERE u.id_unit_code = ?
  `;

  db.query(sql, [id],(error, result) => {
    if (error) {
      console.error('Error Fetching Career Level:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ status: false, error: 'Career Level not found' });
      } else {
        // Initialize arrays to store skill, knowledge, and eoc data
        const NameoccupationalData = [];
        const NameoccupationalSet = new Set(); // To ensure uniqueness


        // Iterate through the query result to collect skill, knowledge, and eoc data
        for (const row of result) {
          const NameoccupationalItem = {
            id_occupational: row.id_occupational,
            name_occupational: row.name_occupational
          };

          if (!NameoccupationalSet.has(JSON.stringify(NameoccupationalItem))) {
            NameoccupationalData.push(NameoccupationalItem);
            NameoccupationalSet.add(JSON.stringify(NameoccupationalItem));
          }
        }

        // Send the data, including the arrays of skill, knowledge, and eoc data
        res.status(200).json({
          status: true,
          data: {
            id_unit_code: result[0].id_unit_code,
            name_occupational: NameoccupationalData,

          },
        });
      }
    }
  });
});

app.get('/Sector/:id', (req, res) => {
  const id = req.params.id; // Get the career level ID from the URL parameter
  const sql = `
  SELECT
  u.id_unit_code,u.unit_code, s.id_sector, s.name_sector
   FROM unit_code AS u 
   LEFT JOIN unit_sector AS us ON us.id_unit_code = u.id_unit_code
   LEFT JOIN sector AS s ON s.id_sector = us.id_sector
   WHERE u.id_unit_code = ?
  `;

  db.query(sql, [id],(error, result) => {
    if (error) {
      console.error('Error Fetching Career Level:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ status: false, error: 'Career Level not found' });
      } else {
        // Initialize arrays to store skill, knowledge, and eoc data
        const NamesectorData = [];


        const NamesectorSet = new Set(); // To ensure uniqueness


        // Iterate through the query result to collect skill, knowledge, and eoc data
        for (const row of result) {
          const NamesectorItem = {
            id_sector: row.id_sector,
            name_sector: row.name_sector
          };

          if (!NamesectorSet.has(JSON.stringify(NamesectorItem))) {
            NamesectorData.push(NamesectorItem);
            NamesectorSet.add(JSON.stringify(NamesectorItem));
          }
        }

        // Send the data, including the arrays of skill, knowledge, and eoc data
        res.status(200).json({
          status: true,
          data: {
            id_unit_code: result[0].id_unit_code,
            name_sector: NamesectorData,

          },
        });
      }
    }
  });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////





app.post('/createCareer', (req, res) => {
  const { name_career } = req.body;

  const newCareer = { name_career };

  db.query('INSERT INTO career SET ?', newCareer, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

  


app.get('/getCareer', (req, res) => {
  const sql = `
  SELECT * 
  FROM career
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getCareer/:id', (req, res) => {
  const careerId = req.params.id;

  db.query('SELECT * FROM career WHERE id_career = ?', [careerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const career = results[0];
    return res.json(career);
  });
});

// Update - Modify an existing record
app.put('/updateCareer/:id', (req, res) => {
  const careerId = req.params.id;
  const { name_career } = req.body;

  const updatedCareer = { name_career };

  db.query('UPDATE career SET ? WHERE id_career = ?', [updatedCareer, careerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteCareer/:id', (req, res) => {
  const careerId = req.params.id;

  db.query('DELETE FROM career WHERE id_career = ?', [careerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getLevel', (req, res) => {
  const sql = `
  SELECT * 
  FROM level
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CareerLevel
// Create - Add a new record
app.post('/createCareerLevel', (req, res) => {
  const { id_career	,id_level	 } = req.body;

  const careerLevelData = { id_career ,id_level};

  db.query('INSERT INTO career_level SET ?', careerLevelData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getCareerLevel', (req, res) => {
  const sql = `
  SELECT * 
  FROM career_level AS cl
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getCareerLevel/:id', (req, res) => {
  const careerlevelId = req.params.id;

  db.query('SELECT * FROM career_level WHERE id_career_level = ?', [careerlevelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const level = results[0];
    return res.json(level);
  });
});

// Update - Modify an existing record
app.put('/updateCareerLevel/:id', (req, res) => {
  const careerlevelId = req.params.id;
  const { id_career	,id_level } = req.body;

  const updatedcareerlevel = { id_career,id_level };

  db.query('UPDATE career_level SET ? WHERE id_career_level = ?', [updatedcareerlevel, careerlevelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteCareerLevel/:id', (req, res) => {
  const careerlevelId = req.params.id;

  db.query('DELETE FROM career_level WHERE id_career_level = ?', [careerlevelId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createAlldetails', (req, res) => {
  const { id_career_level	,id_d } = req.body;

  const AlldetailsData = { id_career_level	,id_d };

  db.query('INSERT INTO all_details SET ?', AlldetailsData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getAlldetails', (req, res) => {
  const sql = `
  SELECT * 
  FROM all_details AS ad 
  LEFT JOIN details AS d ON d.id_d = ad.id_d
  LEFT JOIN career_level AS cl ON cl.id_career_level = ad.id_career_level
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getAlldetails/:id', (req, res) => {
  const AlldetailsId = req.params.id;

  db.query('SELECT * FROM all_details WHERE id_all_details = ?', [AlldetailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const all_details = results[0];
    return res.json(all_details);
  });
});

// Update - Modify an existing record
app.put('/updateAlldetails/:id', (req, res) => {
  const AlldetailsId = req.params.id;
  const { id_career_level	,id_d	} = req.body;

  const updatedAlldetails = { id_career_level ,id_d };

  db.query('UPDATE all_details SET ? WHERE id_all_details = ?', [updatedAlldetails, AlldetailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteAlldetails/:id', (req, res) => {
  const AlldetailsId = req.params.id;

  db.query('DELETE FROM all_details WHERE id_all_details = ?', [AlldetailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createClAndUn', (req, res) => {
  const { id_career_level,id_unit_code } = req.body;

  const newcl_uc = { id_career_level,id_unit_code };

  db.query('INSERT INTO cl_uc SET ?', newcl_uc, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getClAndUns', (req, res) => {
  const sql = `
  SELECT * 
  FROM cl_uc
  LEFT JOIN unit_code AS un ON un.id_unit_code = cl_uc.id_unit_code
  LEFT JOIN career_level AS cl ON cl.id_career_level = cl_uc.id_career_level
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getClAndUns/:id', (req, res) => {
  const cl_ucId = req.params.id;

  db.query('SELECT * FROM cl_uc WHERE id_cl_uc = ?', [cl_ucId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const cl_uc = results[0];
    return res.json(cl_uc);
  });
});

// Update - Modify an existing record
app.put('/updateClAndUn/:id', (req, res) => {
  const cl_ucId = req.params.id;
  const { id_career_level,id_unit_code } = req.body;

  const updatedcl_uc = { id_career_level,id_unit_code };

  db.query('UPDATE cl_uc SET ? WHERE id_cl_uc = ?', [updatedcl_uc, cl_ucId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteClAndUn/:id', (req, res) => {
  const cl_ucId = req.params.id;

  db.query('DELETE FROM cl_uc WHERE id_cl_uc = ?', [cl_ucId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/createDetails', (req, res) => {
  const {  outcomes 	 } = req.body;

  const newdetails = { outcomes };

  db.query('INSERT INTO details SET ?', newdetails, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getDetails', (req, res) => {
  const sql = `
  SELECT * 
  FROM details
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getDetails/:id', (req, res) => {
  const detailsId = req.params.id;

  db.query('SELECT * FROM details WHERE id_d = ?', [detailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const details = results[0];
    return res.json(details);
  });
});

// Update - Modify an existing record
app.put('/updateDetails/:id', (req, res) => {
  const detailsId = req.params.id;
  const { outcomes } = req.body;

  const updateddetails = {  outcomes };

  db.query('UPDATE details SET ? WHERE id_d = ?', [updateddetails, detailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteDetails/:id', (req, res) => {
  const detailsId = req.params.id;

  db.query('DELETE FROM details WHERE id_d = ?', [detailsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//knowlege
// Create - Add a new record
app.post('/createKnowlege', (req, res) => {
  const { name_knowlege } = req.body;

  const newknowlege = { name_knowlege };

  db.query('INSERT INTO knowlege SET ?', newknowlege, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getKnowlege', (req, res) => {
  const sql = `
  SELECT * 
  FROM knowlege
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getKnowlege/:id', (req, res) => {
  const knowlegeId = req.params.id;

  db.query('SELECT * FROM knowlege WHERE id_knowlege = ?', [knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const knowlege = results[0];
    return res.json(knowlege);
  });
});

// Update - Modify an existing record
app.put('/updateKnowlege/:id', (req, res) => {
  const knowlegeId = req.params.id;
  const { name_knowlege } = req.body;

  const updatedknowlege = { name_knowlege };

  db.query('UPDATE knowlege SET ? WHERE id_knowlege = ?', [updatedknowlege, knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteKnowlege/:id', (req, res) => {
  const knowlegeId = req.params.id;

  db.query('DELETE FROM knowlege WHERE id_knowlege = ?', [knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//skill
// Create - Add a new record
app.post('/createSkill', (req, res) => {
  const { name_skill } = req.body;

  const newskill = { name_skill };

  db.query('INSERT INTO skill SET ?', newskill, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getSkill', (req, res) => {
  const sql = `
  SELECT * 
  FROM skill
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getSkill/:id', (req, res) => {
  const skillId = req.params.id;

  db.query('SELECT * FROM skill WHERE id_skill = ?', [skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const skill = results[0];
    return res.json(skill);
  });
});

// Update - Modify an existing record
app.put('/updateSkill/:id', (req, res) => {
  const skillId = req.params.id;
  const { name_skill } = req.body;

  const updatedskill = { name_skill };

  db.query('UPDATE skill SET ? WHERE id_skill = ?', [updatedskill, skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteSkill/:id', (req, res) => {
  const skillId = req.params.id;

  db.query('DELETE FROM skill WHERE id_skill = ?', [skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//unit_code
// Create - Add a new record
app.post('/createUnitcode', (req, res) => {
  const { unit_code ,name	,description_unitcode	} = req.body;

  const newunit_code = { unit_code ,name	,description_unitcode };

  db.query('INSERT INTO unit_code SET ?', newunit_code, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getUnitcode', (req, res) => {
  const sql = `
  SELECT * 
  FROM unit_code
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getUnitcode/:id', (req, res) => {
  const unit_codeId = req.params.id;

  db.query('SELECT * FROM unit_code WHERE id_unit_code = ?', [unit_codeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const unit_code = results[0];
    return res.json(unit_code);
  });
});

// Update - Modify an existing record
app.put('/updateUnitcode/:id', (req, res) => {
  const unit_codeId = req.params.id;
  const { unit_code ,name	,description_unitcode	 } = req.body;

  const updatedunit_code = { unit_code ,name	,description_unitcode	 };

  db.query('UPDATE unit_code SET ? WHERE id_unit_code = ?', [updatedunit_code, unit_codeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteUnitcode/:id', (req, res) => {
  const unit_codeId = req.params.id;

  db.query('DELETE FROM unit_code WHERE id_unit_code = ?', [unit_codeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createUskill', (req, res) => {
  const { id_unit_code,id_skill } = req.body;

  const newu_skill = { id_unit_code,id_skill };

  db.query('INSERT INTO u_skill SET ?', newu_skill, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getUskill', (req, res) => {
  const sql = `
  SELECT * 
  FROM u_skill AS us
  LEFT JOIN unit_code AS un ON un.id_unit_code = us.id_unit_code
  LEFT JOIN skill AS s ON s.id_skill = us.id_skill
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getUskill/:id', (req, res) => {
  const u_skillId = req.params.id;

  db.query('SELECT * FROM u_skill WHERE id_u_skill = ?', [u_skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const u_skill = results[0];
    return res.json(u_skill);
  });
});

// Update - Modify an existing record
app.put('/updateUskill/:id', (req, res) => {
  const u_skillId = req.params.id;
  const { id_unit_code,id_skill } = req.body;

  const updatedu_skill = { id_unit_code,id_skill };

  db.query('UPDATE u_skill SET ? WHERE id_u_skill = ?', [updatedu_skill, u_skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteUskill/:id', (req, res) => {
  const u_skillId = req.params.id;

  db.query('DELETE FROM u_skill WHERE id_u_skill = ?', [u_skillId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//unit-knowlege
// Create - Add a new record
app.post('/createUknowlege', (req, res) => {
  const { id_unit_code,id_knowlege } = req.body;

  const newu_knowlege = { id_unit_code,id_knowlege };

  db.query('INSERT INTO u_knowlege SET ?', newu_knowlege, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getUknowlege', (req, res) => {
  const sql = `
  SELECT * 
  FROM u_knowlege AS uk
  LEFT JOIN unit_code AS un ON un.id_unit_code = uk.id_unit_code
  LEFT JOIN knowlege AS k ON k.id_knowlege = uk.id_knowlege
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getUknowlege/:id', (req, res) => {
  const u_knowlegeId = req.params.id;

  db.query('SELECT * FROM u_knowlege WHERE id_u_knowlege = ?', [u_knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const u_knowlege = results[0];
    return res.json(u_knowlege);
  });
});

// Update - Modify an existing record
app.put('/updateUknowlege/:id', (req, res) => {
  const u_knowlegeId = req.params.id;
  const { id_unit_code,id_knowlege } = req.body;

  const updatedu_knowlege = { id_unit_code,id_knowlege };

  db.query('UPDATE u_knowlege SET ? WHERE id_u_knowlege = ?', [updatedu_knowlege, u_knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteUknowlege/:id', (req, res) => {
  const u_knowlegeId = req.params.id;

  db.query('DELETE FROM u_knowlege WHERE id_u_knowlege = ?', [u_knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createUnitOccupational', (req, res) => {
  const { id_unit_code,id_occupational } = req.body;

  const newu_unit_occupational   = { id_unit_code,id_occupational };

  db.query('INSERT INTO unit_occupational  SET ?', newu_unit_occupational  , (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getUnitOccupational', (req, res) => {
  const sql = `
  SELECT * 
  FROM unit_occupational AS uo
  LEFT JOIN unit_code AS un ON un.id_unit_code = uo.id_unit_code
  LEFT JOIN occupational AS o ON o.id_occupational = uo.id_occupational
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getUnitOccupational/:id', (req, res) => {
  const UnitoccupationalId = req.params.id;

  db.query('SELECT * FROM unit_occupational  WHERE id_unit_occupational = ?', [UnitoccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const Unitoccupational = results[0];
    return res.json(Unitoccupational);
  });
});

// Update - Modify an existing record
app.put('/updateUnitOccupational/:id', (req, res) => {
  const UnitoccupationalId = req.params.id;
  const { id_unit_code,id_occupational } = req.body;

  const updatedUnitoccupational = { id_unit_code,id_occupational };

  db.query('UPDATE unit_occupational SET ? WHERE id_unit_occupational = ?', [updatedUnitoccupational, UnitoccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteUnitOccupational/:id', (req, res) => {
  const UnitoccupationalId = req.params.id;

  db.query('DELETE FROM unit_occupational WHERE id_unit_occupational = ?', [UnitoccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createOccupational ', (req, res) => {
  const { name_occupational } = req.body;

  const newu_occupational  = { name_occupational };

  db.query('INSERT INTO unit_no9  SET ?', newu_occupational , (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getOccupational', (req, res) => {
  const sql = `
  SELECT * 
  FROM occupational
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getOccupational/:id', (req, res) => {
  const OccupationalId = req.params.id;

  db.query('SELECT * FROM occupational  WHERE id_occupational = ?', [OccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const Occupational = results[0];
    return res.json(Occupational);
  });
});

// Update - Modify an existing record
app.put('/updateOccupational/:id', (req, res) => {
  const OccupationalId = req.params.id;
  const { name_occupational } = req.body;

  const updateOccupational = { name_occupational };

  db.query('UPDATE occupational SET ? WHERE id_occupational = ?', [updateOccupational, OccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteOccupational/:id', (req, res) => {
  const OccupationalId = req.params.id;

  db.query('DELETE FROM occupational WHERE id_occupational = ?', [OccupationalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createUnitSector', (req, res) => {
  const { id_unit_code,id_sector } = req.body;

  const newu_unit_sector   = { id_unit_code,id_sector };

  db.query('INSERT INTO unit_sector  SET ?', newu_unit_sector , (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getUnitSector', (req, res) => {
  const sql = `
  SELECT * 
  FROM unit_sector AS us
  LEFT JOIN unit_code AS un ON un.id_unit_code = us.id_unit_code
  LEFT JOIN sector AS s ON s.id_sector = us.id_sector
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getUnitSector/:id', (req, res) => {
  const UnitSectorId = req.params.id;

  db.query('SELECT * FROM unit_sector  WHERE id_unit_sector = ?', [UnitSectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const UnitSector = results[0];
    return res.json(UnitSector);
  });
});

// Update - Modify an existing record
app.put('/updateUnitSector/:id', (req, res) => {
  const UnitSectorId = req.params.id;
  const { id_unit_code,id_sector } = req.body;

  const updatedUnitSector = { id_unit_code,id_sector };

  db.query('UPDATE unit_sector SET ? WHERE id_unit_sector = ?', [updatedUnitSector, UnitSectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteUnitSector/:id', (req, res) => {
  const UnitSectorId = req.params.id;

  db.query('DELETE FROM unit_sector WHERE id_unit_sector = ?', [UnitSectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/createSector', (req, res) => {
  const { name_sector } = req.body;

  const newu_sector  = { name_sector };

  db.query('INSERT INTO sector  SET ?', newu_sector , (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getSector', (req, res) => {
  const sql = `
  SELECT * 
  FROM sector
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

// Read - Retrieve a record by ID
app.get('/getSector/:id', (req, res) => {
  const sectorId = req.params.id;

  db.query('SELECT * FROM sector  WHERE id_sector = ?', [sectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Read operation failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const sector = results[0];
    return res.json(sector);
  });
});

// Update - Modify an existing record
app.put('/updateSector/:id', (req, res) => {
  const SectorId = req.params.id;
  const { name_sector } = req.body;

  const updateSector = { name_sector };

  db.query('UPDATE sector SET ? WHERE id_sector = ?', [updateSector, SectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

// Delete - Remove a record by ID
app.delete('/deleteSector/:id', (req, res) => {
  const sectorId = req.params.id;

  db.query('DELETE FROM sector WHERE id_sector = ?', [sectorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/createClSkill', (req, res) => {
  const { id_career_level,id_skill } = req.body;

  const newcl_skills = { id_career_level,id_skill };

  db.query('INSERT INTO cl_skills SET ?', newcl_skills, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getClSkill', (req, res) => {
  const sql = `
  SELECT * 
  FROM cl_skills AS cls
  LEFT JOIN career_level AS cl ON cl.id_career_level = cls.id_career_level
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  LEFT JOIN skill AS s ON s.id_skill = cls.id_skill
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

app.put('/updateClSkill/:id', (req, res) => {
  const cl_skillsId = req.params.id;
  const { id_career_level,id_skill } = req.body;

  const updatedcl_skills = { id_career_level,id_skill };

  db.query('UPDATE cl_skills SET ? WHERE id_cl_skills = ?', [updatedcl_skills, cl_skillsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

app.delete('/deleteClSkill/:id', (req, res) => {
  const cl_skillsId = req.params.id;

  db.query('DELETE FROM cl_skills WHERE id_cl_skills = ?', [cl_skillsId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/createClKnowlege', (req, res) => {
  const { id_career_level,id_knowlege } = req.body;

  const newcl_knowlege = { id_career_level,id_knowlege };

  db.query('INSERT INTO cl_knowlege SET ?', newcl_knowlege, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Create operation failed' });
    }

    return res.status(201).json({ message: 'Record created successfully' });
  });
});

app.get('/getClKnowlege', (req, res) => {
  const sql = `
  SELECT * 
  FROM cl_knowlege AS clk
  LEFT JOIN career_level AS cl ON cl.id_career_level = clk.id_career_level
  LEFT JOIN career AS c ON c.id_career = cl.id_career
  LEFT JOIN level AS l ON l.id_level = cl.id_level
  LEFT JOIN knowlege AS k ON k.id_knowlege = clk.id_knowlege
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.error('Error Connecting to DB:', error);
      res.status(500).json({ status: false, error: 'Database Error' });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

app.put('/updateClKnowlege/:id', (req, res) => {
  const cl_knowlegeId = req.params.id;
  const { id_career_level,id_knowlege } = req.body;

  const updatedcl_knowlege = { id_career_level,id_knowlege };

  db.query('UPDATE cl_knowlege SET ? WHERE id_cl_knowlege = ?', [updatedcl_knowlege, cl_knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Update operation failed' });
    }

    return res.json({ message: 'Record updated successfully' });
  });
});

app.delete('/deleteClKnowlege/:id', (req, res) => {
  const cl_knowlegeId = req.params.id;

  db.query('DELETE FROM cl_knowlege WHERE id_cl_knowlege = ?', [cl_knowlegeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Delete operation failed' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app

