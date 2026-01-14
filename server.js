const axios = require("axios");
const express = require('express');
const app = express();
const session = require('express-session');
const bodyparser = require('body-parser');
const db = require('./db');
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 9000;


app.use(session({
  secret: 'capstone',
  resave: false,
  saveUninitialized: true
}));


app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');


// [NEW] Database Setup Route (Run once)
app.get('/clean_whitespace', (req, res) => {
  // One-time cleanup script to TRIM all identifying fields in users and responders
  const queries = [
    "UPDATE users SET firstname = TRIM(firstname), lastname = TRIM(lastname), email = TRIM(email), contact_number = TRIM(contact_number)",
    "UPDATE responders SET firstname = TRIM(firstname), lastname = TRIM(lastname), email = TRIM(email), contact_number = TRIM(contact_number)"
  ];

  let logs = [];
  let queryIndex = 0;

  function runNext() {
    if (queryIndex >= queries.length) {
      return res.send(`<h2>Whitespace Cleanup Finished</h2><pre>${logs.join('\n')}</pre><p><a href="/adminpage">Back to Admin</a></p>`);
    }

    db.query(queries[queryIndex], (err, result) => {
      if (err) {
        logs.push(`[ERROR] Query ${queryIndex + 1}: ${err.message}`);
      } else {
        logs.push(`[SUCCESS] Query ${queryIndex + 1} updated ${result.affectedRows} rows.`);
      }
      queryIndex++;
      runNext();
    });
  }
  runNext();
});

app.get('/setup_db', (req, res) => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS responders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            username VARCHAR(255),
            password VARCHAR(255),
            contact_number VARCHAR(50),
            email VARCHAR(255),
            station_id INT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            status ENUM('active', 'inactive', 'deployed', 'offline') DEFAULT 'offline',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (station_id) REFERENCES stations(id)
    )`,
    `CREATE TABLE IF NOT EXISTS deploys (
            id INT AUTO_INCREMENT PRIMARY KEY,
            responder_id INT,
            station_id INT,
            incident_id INT,
            user_id INT,
            status ENUM('pending', 'resolved', 'cancelled by user', 'cancelled by admin') DEFAULT 'pending',
            deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL,
            remarks TEXT,
            FOREIGN KEY (responder_id) REFERENCES responders(id),
            FOREIGN KEY (station_id) REFERENCES stations(id),
            FOREIGN KEY (incident_id) REFERENCES disaster_reports(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
    // Separate ALTERs and remove IF NOT EXISTS to be safe, relying on error suppression
    `ALTER TABLE disaster_reports ADD COLUMN responder_confirmed_at TIMESTAMP NULL`,
    `ALTER TABLE disaster_reports ADD COLUMN user_confirmed_at TIMESTAMP NULL`
  ];

  let logs = [];
  let queryIndex = 0;

  function runNext() {
    if (queryIndex >= queries.length) {
      return res.send(`<h2>Database Setup Report</h2><pre>${logs.join('\n')}</pre><p>Process Finished.</p>`);
    }

    db.query(queries[queryIndex], (err) => {
      if (err) {
        // Ignore duplicate column errors (Code 1060)
        if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes("Duplicate column")) {
          logs.push(`[SKIP] Query ${queryIndex + 1}: Column already exists.`);
        } else {
          logs.push(`[ERROR] Query ${queryIndex + 1}: ${err.message}`);
        }
      } else {
        logs.push(`[SUCCESS] Query ${queryIndex + 1} executed.`);
      }
      queryIndex++;
      runNext();
    });
  }
  runNext();
});

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat,
        lon,
        units: "metric",
        appid: process.env.OWM_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});



//weather
app.get('/weather', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.render('pages/weather', { users: results, username: req.session.username, apiKey: process.env.OWM_API_KEY });
    });
  } else {
    res.redirect('/visitor');
  }
});


// index
app.get('/', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    res.render('pages/index', { username: req.session.username, apiKey: process.env.OWM_API_KEY });
  } else {
    res.redirect('/visitor');
  }
});

// about user
app.get('/aboutuser', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/aboutuser', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/survival-tips', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/survival-tips', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


// SOS
app.get('/send-sos', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/sos', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/report', async (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const { disaster_type, location, lat, lon } = req.body; // Expecting lat/lon from hidden inputs

    let finalLat = lat;
    let finalLon = lon;
    let locationToStore = location || "";

    // 1. If Text Location provided but No Coords -> Geocode (Address to Lat/Lon)
    if ((!finalLat || !finalLon) && location) {
      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: { q: location, format: "json", limit: 1 },
          headers: { 'User-Agent': 'CitySafeApp/1.0' }
        });
        if (response.data && response.data.length > 0) {
          finalLat = response.data[0].lat;
          finalLon = response.data[0].lon;
        }
      } catch (geoErr) {
        console.error("Geocoding failed:", geoErr.message);
      }
    }

    // 2. If Coords provided (or found) -> Reverse Geocode (Lat/Lon to Address)
    // This overrides the text location to be precise, or fills it if empty.
    if (finalLat && finalLon) {
      try {
        const revRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: { lat: finalLat, lon: finalLon, format: "json" },
          headers: { 'User-Agent': 'CitySafeApp/1.0' }
        });
        if (revRes.data && revRes.data.display_name) {
          locationToStore = revRes.data.display_name;
        }
      } catch (e) {
        console.error("Reverse Geocoding failed:", e.message);
      }
    }

    const sql = `INSERT INTO disaster_reports (user_id, disaster_type, location, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [userId, disaster_type, locationToStore, finalLat, finalLon], (err, result) => {
      if (err) throw err;
      res.send(`<script>alert('Disaster Reported Successfully!'); window.location.href='/sos-otw';</script>`);
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/sos-otw', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/sos-otw', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// [NEW] API to track responder location
app.get('/api/responder-track/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const responderId = req.params.id;
    db.query('SELECT latitude, longitude, status FROM responders WHERE id = ?', [responderId], (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(results[0]);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ********************************************************* test *** nearby stations ********************************************
//NEARBY LOCS
app.get('/nearby-stations', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/nearby-stations', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

//SCAN DATABASE HARDCODED LOCS
app.post('/nearby-stations', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const { lat, lng } = req.body;
    console.log("Received lat/lng:", lat, lng);

    const radius = 11200;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude.' });
    }

    const sql = `
      SELECT name, type, address, latitude, longitude, (
        6371 * acos(
          cos(radians(?)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM stations
      HAVING distance < ?
      ORDER BY distance
    `;

    db.query(sql, [latNum, lngNum, latNum, radius], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Stations found:', results);
      res.json(results);
    });
  } else {
    res.redirect('/login');
  }
});




// (Removed Request Help / Post Request routes as per new SOS-only workflow)



// edit own account
app.get('/editaccount', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render('pages/editprofile', { user: results[0], username: req.session.username });
      } else {
        res.send(`<script>alert('Not Found user!');</script>`);
      }
    });
  } else {
    res.redirect('/login');
  }
});
// update profile 
app.post('/update-account', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    let { firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password } = req.body;

    // Trim names and primary IDs
    firstname = firstname ? firstname.trim() : "";
    lastname = lastname ? lastname.trim() : "";
    email = email ? email.trim() : "";
    contact_number = contact_number ? contact_number.trim() : "";

    db.query('UPDATE users SET firstname = ?, lastname = ?, street_address = ?, barangay = ?, city = ?, province = ?, postal_code = ?, country = ?, email = ?,contact_number = ?, landmark = ?, address_type = ?, additional_instructions = ?, password = ? WHERE id = ?', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, userId], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  } else {
    res.redirect('/login')
  }
});

app.get('/help-user', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/help-user', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


// ********************************* visitor ******************************************
app.get('/visitor', (req, res) => {
  res.render('pages/visitor', { apiKey: process.env.OWM_API_KEY })
});

app.get('/about', (req, res) => {
  res.render('pages/about')
});

app.get('/services', (req, res) => {
  res.render('pages/services')
});

app.get('/contact', (req, res) => {
  res.render('pages/contact')
});

app.get('/help', (req, res) => {
  res.render('pages/help')
});

app.get('/login', (req, res) => {
  res.render('pages/login')
});

app.get('/register', (req, res) => {
  res.render('pages/signup')
});

// **************************************** visitor end **********************************

// *************************************** login process **********************************
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  const cleanIdentifier = identifier ? identifier.trim().replace(/\s+/g, ' ') : '';

  // Check Users Table First (Email, Full Name, or Contact Number)
  db.query('SELECT * FROM users WHERE (TRIM(email) = ? OR TRIM(CONCAT(TRIM(firstname), " ", TRIM(lastname))) = ? OR TRIM(contact_number) = ?) AND password = ?', [cleanIdentifier, cleanIdentifier, cleanIdentifier, password], (err, users) => {
    if (err) { console.error("Login User Error:", err); throw err; }

    if (users.length > 0) {
      req.session.loggedin = true;
      req.session.username = users[0].firstname + ' ' + users[0].lastname;
      req.session.role = users[0].role; // 'user' or 'admin'
      req.session.userId = users[0].id;

      db.query('UPDATE users SET status = "active" WHERE id = ?', [users[0].id]);

      if (users[0].role === 'admin') {
        res.redirect('/adminpage');
      } else {
        res.redirect('/');
      }
    } else {
      // Check Responders Table (Email, Username, Full Name, or Contact Number)
      db.query('SELECT * FROM responders WHERE (TRIM(email) = ? OR TRIM(username) = ? OR TRIM(CONCAT(TRIM(firstname), " ", TRIM(lastname))) = ? OR TRIM(contact_number) = ?) AND password = ?', [cleanIdentifier, cleanIdentifier, cleanIdentifier, cleanIdentifier, password], (err, responders) => {
        if (err) { console.error("Login Responder Error:", err); throw err; }

        if (responders.length > 0) {
          req.session.loggedin = true;
          req.session.username = responders[0].firstname + ' ' + responders[0].lastname;
          req.session.role = 'responder';
          req.session.userId = responders[0].id;

          db.query('UPDATE responders SET status = "active" WHERE id = ?', [responders[0].id]);
          res.redirect('/responder');
        } else {
          res.send(`<script>window.location.href='/login'; alert('Wrong Password or Identity!');</script>`);
        }
      });
    }
  });
});

// *************************************** responder **********************************

app.get('/responder', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const query = `
      SELECT dr.id, dr.disaster_type, dr.location, dr.latitude, dr.longitude, dr.status, dr.reported_at, u.firstname, u.lastname
      FROM disaster_reports dr
      LEFT JOIN users u ON dr.user_id = u.id
      WHERE dr.status NOT IN ('resolved', 'cancelled by user', 'cancelled by admin')
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching reports for responder:", err);
        // Fallback with empty reports if DB fails, to avoid crashing the page
        res.render('pages/responder', {
          username: req.session.username,
          apiKey: process.env.OWM_API_KEY,
          page: 'dashboard',
          role: 'responder',
          reports: []
        });
      } else {
        res.render('pages/responder', {
          username: req.session.username,
          apiKey: process.env.OWM_API_KEY,
          page: 'dashboard',
          role: 'responder',
          reports: results
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

// [NEW] Dedicated Responding Page (Active Mission)
app.get('/responding', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const responderId = req.session.userId;

    // 1. Get Active Mission Details
    const missionSql = `
      SELECT d.*, 
        dr.disaster_type, 
        dr.location,
        dr.latitude AS incident_lat, 
        dr.longitude AS incident_lng,
        dr.status AS incident_status,
        dr.reported_at,
        dr.user_confirmed_at,
        u.firstname, u.lastname, u.contact_number, u.email
      FROM deploys d
      JOIN disaster_reports dr ON d.incident_id = dr.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.responder_id = ? AND d.status = 'pending'
      LIMIT 1
    `;

    db.query(missionSql, [responderId], (err, missionRows) => {
      if (err) { console.error(err); return res.redirect('/responder'); }

      if (missionRows.length === 0) {
        // No active mission, go back to dashboard
        return res.redirect('/responder');
      }

      const mission = missionRows[0];

      // 2. Get Nearby Reports (Same logic as responder dashboard, for reference)
      const nearbySql = `
        SELECT dr.id, dr.disaster_type, dr.location, dr.latitude, dr.longitude, dr.status, dr.reported_at, u.firstname, u.lastname
        FROM disaster_reports dr
        LEFT JOIN users u ON dr.user_id = u.id
        WHERE dr.status NOT IN ('resolved', 'cancelled by user', 'cancelled by admin') 
        AND dr.id != ?
      `;

      db.query(nearbySql, [mission.incident_id], (err, reportRows) => {
        res.render('pages/responding', {
          username: req.session.username,
          apiKey: process.env.OWM_API_KEY,
          page: 'responding', // Special page identifier
          role: 'responder',
          mission: mission,
          reports: reportRows || []
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/aboutresponder', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    res.render('pages/aboutresponder', { username: req.session.username, page: 'about', role: 'responder' });
  } else {
    res.redirect('/login');
  }
});

// [NEW] Responder History
app.get('/responder-history', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const responderId = req.session.userId;
    const sql = `
      SELECT 
        dr.id, 
        dr.disaster_type, 
        dr.location, 
        dr.reported_at, 
        dr.resolution_remarks,
        dr.responder_message,
        dr.user_message,
        dr.resolved_by,
        d.resolved_at,
        d.status
      FROM deploys d
      JOIN disaster_reports dr ON d.incident_id = dr.id
      WHERE d.responder_id = ? AND d.status = 'resolved'
      ORDER BY d.resolved_at DESC
    `;

    db.query(sql, [responderId], (err, results) => {
      if (err) { console.error(err); return res.redirect('/responder'); }

      res.render('pages/responder-history', {
        username: req.session.username,
        page: 'history', // Sidebar active state
        role: 'responder',
        reports: results
      });
    });
  } else {
    res.redirect('/login');
  }
});

// Legacy Redirect (in case of cached sidebar)
app.get('/responder/history', (req, res) => res.redirect('/responder-history'));

app.get('/api/responder-reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const query = `
      SELECT dr.id, dr.disaster_type, dr.location, dr.latitude, dr.longitude, dr.status, dr.reported_at, u.firstname, u.lastname
      FROM disaster_reports dr
      LEFT JOIN users u ON dr.user_id = u.id
      WHERE dr.status NOT IN ('resolved', 'cancelled by user', 'cancelled by admin')
    `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/responder/location', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const { lat, lng } = req.body;
    const userId = req.session.userId;
    // Update RESPONDERS table
    db.query('UPDATE responders SET latitude = ?, longitude = ?, status = "active" WHERE id = ?', [lat, lng, userId], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update location' });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/api/responders', (req, res) => {
  // Query RESPONDERS table
  const query = `
    SELECT 
      r.id, r.firstname, r.lastname, r.latitude, r.longitude, r.status, r.contact_number, r.station_id,
      s.latitude as station_lat, s.longitude as station_lng, s.name as station_name,
      (SELECT COUNT(*) FROM deploys d WHERE d.responder_id = r.id) as deploys_count
    FROM responders r
    LEFT JOIN stations s ON r.station_id = s.id
    WHERE r.status != "offline"
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/stations', (req, res) => {
  const query = 'SELECT * FROM stations';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/deploy', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const { responderId, lat, lng, incidentId, type } = req.body;

    // 1. Get Responder's Status and Station ID first (from responders table)
    db.query('SELECT status, station_id FROM responders WHERE id = ?', [responderId], (err, resRes) => {
      if (err) { console.error(err); return res.status(500).json({ error: 'DB Error' }); }

      if (resRes.length === 0) return res.status(404).json({ error: 'Responder not found' });

      const responder = resRes[0];
      if (responder.status === 'deployed') {
        return res.status(400).json({ success: false, message: 'Responder is already deployed and cannot be reassigned until the current incident is resolved.' });
      }

      const stationId = responder.station_id;

      db.query('SELECT user_id FROM disaster_reports WHERE id = ?', [incidentId], (err, incRes) => {
        const reporterId = incRes.length > 0 ? incRes[0].user_id : null;

        // 2. Transaction Queries
        const insertDeploy = `INSERT INTO deploys (responder_id, station_id, incident_id, user_id, status) VALUES (?, ?, ?, ?, 'pending')`;
        const updateResponder = `UPDATE responders SET status = 'deployed' WHERE id = ?`;
        const updateIncident = `UPDATE disaster_reports SET status = 'responding', responder_id = ? WHERE id = ?`;

        db.beginTransaction(err => {
          if (err) return res.status(500).json({ error: err.message });

          db.query(insertDeploy, [responderId, stationId, incidentId, reporterId], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

            db.query(updateResponder, [responderId], (err) => {
              if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

              db.query(updateIncident, [responderId, incidentId], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

                db.commit(err => {
                  if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
                  res.json({ success: true, message: 'Deployed successfully' });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/api/incidents', (req, res) => {
  const reportsQuery = `
        SELECT 
            dr.id, 
            dr.user_id, 
            dr.disaster_type, 
            dr.location, 
            dr.latitude,
            dr.longitude,
            dr.reported_at as time, 
            dr.status,
            dr.responder_id,
            dr.responder_confirmed_at,
            dr.user_confirmed_at,
            "disaster_report" as type,
            CONCAT(r.firstname, ' ', r.lastname) as responder_name
        FROM disaster_reports dr
        LEFT JOIN responders r ON dr.responder_id = r.id
        ORDER BY dr.reported_at DESC
    `;

  db.query(reportsQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });

});

app.post('/api/respond', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const { reportId } = req.body;
    const responderId = req.session.userId;

    // 1. Check if responder is already busy
    db.query('SELECT status, station_id FROM responders WHERE id = ?', [responderId], (err, resRes) => {
      if (err || resRes.length === 0) return res.status(500).json({ error: 'DB Error' });

      if (resRes[0].status === 'deployed') {
        return res.json({ success: false, message: 'You are already deployed to another incident. Please resolve it first.' });
      }

      const stationId = resRes[0].station_id;

      // 2. Transact: Update Report, Update Responder, Insert Deploy
      db.query('SELECT user_id FROM disaster_reports WHERE id = ?', [reportId], (err, incRes) => {
        const reporterId = incRes.length > 0 ? incRes[0].user_id : null;

        db.beginTransaction(err => {
          const q1 = 'UPDATE disaster_reports SET status = "responding", responder_id = ? WHERE id = ?';
          const q2 = 'UPDATE responders SET status = "deployed" WHERE id = ?';
          const q3 = 'INSERT INTO deploys (responder_id, station_id, incident_id, user_id, status) VALUES (?, ?, ?, ?, "pending")';

          db.query(q1, [responderId, reportId], (err) => {
            if (err) return db.rollback(() => res.json({ success: false }));
            db.query(q2, [responderId], (err) => {
              if (err) return db.rollback(() => res.json({ success: false }));
              db.query(q3, [responderId, stationId, reportId, reporterId], (err) => {
                if (err) return db.rollback(() => res.json({ success: false }));

                db.commit(err => {
                  if (err) return db.rollback(() => res.json({ success: false }));
                  res.json({ success: true, message: 'You are now responding to this SOS.' });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

app.get('/api/my-current-mission', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const responderId = req.session.userId;
    const sql = `
      SELECT d.*, 
        dr.disaster_type, 
        dr.location,
        dr.latitude,
        dr.longitude,
        CONCAT(u.firstname, ' ', u.lastname) as reported_by,
        u.contact_number as reporter_contact,
        dr.reported_at
      FROM deploys d
      JOIN disaster_reports dr ON d.incident_id = dr.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.responder_id = ? AND d.status = 'pending'
      LIMIT 1
    `;
    db.query(sql, [responderId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows[0] || null);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});



// *************************************** login end **********************************



//**************************************** register processs *********************************
app.post('/register', (req, res) => {
  let { firstname, lastname, contact_number, password } = req.body;

  firstname = firstname ? firstname.trim().replace(/\s+/g, ' ') : "";
  lastname = lastname ? lastname.trim().replace(/\s+/g, ' ') : "";
  contact_number = contact_number ? contact_number.trim().replace(/\s+/g, ' ') : "";

  db.query('INSERT INTO users (firstname, lastname, contact_number, password) VALUES (?, ?, ?, ?)', [firstname, lastname, contact_number, password], (err) => {
    if (err) throw err;
    res.send(`<script>window.location.href='/login'; alert('Registered Successfully! Please Login.');</script>`);

  });
});
// ****************************************register end ********************************************

app.get('/api/me', (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role === 'responder') {
      db.query('SELECT id, status, "responder" as role FROM responders WHERE id = ?', [req.session.userId], (err, results) => {
        res.json(results[0] || {});
      });
    } else {
      db.query('SELECT id, role, status FROM users WHERE id = ?', [req.session.userId], (err, results) => {
        res.json(results[0] || {});
      });
    }
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// [NEW] API for User History Polling
app.get('/api/my-reports-list', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const query = `
      SELECT dr.*, 
             r.firstname as responder_name, r.lastname as responder_last, 
             s.name as station_name 
      FROM disaster_reports dr
      LEFT JOIN responders r ON dr.responder_id = r.id
      LEFT JOIN stations s ON r.station_id = s.id
      WHERE dr.user_id = ?
      ORDER BY dr.reported_at DESC
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// [NEW] Dual-Confirmation Resolution
app.post('/api/resolve', (req, res) => {
  if (!req.session.loggedin) return res.status(401).json({ error: 'Unauthorized' });

  const { incidentId, remarks } = req.body;
  const role = req.session.role; // 'responder' or 'user'
  const now = new Date();

  let updateField = '';
  let msgField = '';

  if (role === 'responder') {
    updateField = 'responder_confirmed_at = ?';
    msgField = 'responder_message = ?';
  } else if (role === 'user') {
    updateField = 'user_confirmed_at = ?';
    msgField = 'user_message = ?';
  } else {
    return res.status(403).json({ error: 'Invalid role' });
  }

  // Update status and save specific message
  db.query(`UPDATE disaster_reports SET ${updateField}, ${msgField} WHERE id = ?`, [now, remarks, incidentId], (err) => {
    if (err) return res.status(500).json({ error: 'DB Error' });

    // Check if BOTH confirmed
    db.query('SELECT responder_confirmed_at, user_confirmed_at, responder_id, responder_message, user_message FROM disaster_reports WHERE id = ?', [incidentId], (err, rows) => {
      if (rows.length > 0) {
        const r = rows[0];
        if (r.responder_confirmed_at && r.user_confirmed_at) {
          // Full Resolution
          const responderId = r.responder_id;
          const resolvedByName = req.session.username || 'Unknown';

          // Combine remarks for general view
          const combinedRemarks = `Responder: ${r.responder_message || '-'} | User: ${r.user_message || '-'}`;

          const q1 = `UPDATE disaster_reports SET status = 'resolved', resolution_remarks = ?, resolved_by = ? WHERE id = ?`;
          const q2 = `UPDATE responders SET status = 'active' WHERE id = ?`; // Free the responder
          // Save Responder's own message in their deploy log
          const q3 = `UPDATE deploys SET status = 'resolved', resolved_at = NOW(), remarks = ? WHERE incident_id = ? AND status = 'pending'`;

          db.query(q1, [combinedRemarks, resolvedByName, incidentId]);
          db.query(q2, [responderId]);
          db.query(q3, [r.responder_message || 'Resolved', incidentId]);

          return res.json({ success: true, status: 'resolved' });
        }
      }
      res.json({ success: true, status: 'waiting_for_other' });
    });
  });
});




// [NEW] User Reports History
app.get('/my-reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const sql = `
            SELECT dr.*, 
                r.firstname as responder_name, 
                r.lastname as responder_last, 
                r.email as responder_email,
                r.contact_number as responder_contact,
                s.name as station_name
            FROM disaster_reports dr
            LEFT JOIN responders r ON dr.responder_id = r.id
            LEFT JOIN stations s ON r.station_id = s.id
            WHERE dr.user_id = ?
            ORDER BY dr.reported_at DESC
        `;
    db.query(sql, [userId], (err, results) => {
      if (err) console.error(err);
      res.render('pages/my-reports', {
        reports: results || [],
        username: req.session.username
      });
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/api/cancel_report', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const { id } = req.body;
    // Fetch current status first
    db.query('SELECT status, responder_id FROM disaster_reports WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) return res.json({ success: false });

      const report = results[0];

      if (report.status === 'responding') {
        // Complex Cancel: Free responder
        const responderId = report.responder_id;

        // Transaction
        db.beginTransaction(err => {
          db.query('UPDATE disaster_reports SET status = "cancelled by user" WHERE id = ?', [id]);
          db.query('UPDATE responders SET status = "active" WHERE id = ?', [responderId]);
          db.query('UPDATE deploys SET status = "cancelled by user", remarks = "User Cancelled" WHERE incident_id = ? AND status = "pending"', [id]);

          db.commit(err => {
            res.json({ success: true });
          });
        });
      } else {
        // Simple Cancel
        db.query('UPDATE disaster_reports SET status = "cancelled by user" WHERE id = ?', [id], (err) => {
          res.json({ success: true });
        });
      }
    });
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

app.post('/api/admin/cancel_report', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const { id } = req.body;
    db.query('SELECT status, responder_id FROM disaster_reports WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) return res.json({ success: false });

      const report = results[0];

      if (report.status === 'responding') {
        const responderId = report.responder_id;
        db.beginTransaction(err => {
          db.query('UPDATE disaster_reports SET status = "cancelled by admin" WHERE id = ?', [id]);
          db.query('UPDATE responders SET status = "active" WHERE id = ?', [responderId]);
          db.query('UPDATE deploys SET status = "cancelled by admin", remarks = "Admin Cancelled" WHERE incident_id = ? AND status = "pending"', [id]);

          db.commit(err => {
            res.json({ success: true });
          });
        });
      } else {
        db.query('UPDATE disaster_reports SET status = "cancelled by admin" WHERE id = ?', [id], (err) => {
          res.json({ success: true });
        });
      }
    });
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});

// [NEW] Admin Stats API
app.get('/api/admin/responders_list', (req, res) => {
  // List responders with Deploy Count
  const sql = `
     SELECT r.id, r.firstname, r.lastname, r.station_id, s.name as station_name, r.status, r.contact_number, r.created_at,
     (SELECT COUNT(*) FROM deploys d WHERE d.responder_id = r.id) as deploy_count
     FROM responders r
     LEFT JOIN stations s ON r.station_id = s.id
   `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/deploys_history', (req, res) => {
  // History of Deploys
  const sql = `
      SELECT d.*, 
        CONCAT(r.firstname, ' ', r.lastname) as responder_name, 
        s.name as station_name,
        dr.disaster_type,
        CONCAT(u.firstname, ' ', u.lastname) as reported_by
      FROM deploys d
      LEFT JOIN responders r ON d.responder_id = r.id
      LEFT JOIN stations s ON d.station_id = s.id
      LEFT JOIN disaster_reports dr ON d.incident_id = dr.id
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.deployed_at DESC
    `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/my-deploys', (req, res) => {
  if (req.session.loggedin && req.session.role === 'responder') {
    const responderId = req.session.userId;
    const sql = `
      SELECT d.*, 
        dr.disaster_type, 
        dr.location,
        dr.latitude,
        dr.longitude,
        CONCAT(u.firstname, ' ', u.lastname) as reported_by,
        dr.reported_at
      FROM deploys d
      JOIN disaster_reports dr ON d.incident_id = dr.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.responder_id = ?
      ORDER BY d.deployed_at DESC
    `;
    db.query(sql, [responderId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ************************* for admin ************************************

app.get('/adminpage', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    //post per day
    db.query(`
      SELECT 
        DAYNAME(created_at) AS day,
        COUNT(*) AS total
      FROM users
      GROUP BY day
      ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    `, (err, chartData) => {
      if (err) throw err;

      //risk level chart
      const riskLevelQuery = `
        SELECT risk_level, COUNT(*) AS total
        FROM risk_assessments
        GROUP BY risk_level;
      `;
      db.query(riskLevelQuery, (err, riskResults) => {
        if (err) throw err;

        //checklist completed chart
        const checklistQuery = `
          SELECT
            SUM(near_river = 1) AS near_river,
            SUM(near_fault = 1) AS near_fault,
            SUM(has_emergency_kit = 1) AS has_emergency_kit,
            SUM(has_evacuation_plan = 1) AS has_evacuation_plan
          FROM risk_assessments;
        `;
        db.query(checklistQuery, (err, checklistResults) => {
          if (err) throw err;

          //trend graph
          const trendQuery = `
            SELECT DATE(assessed_at) AS date, AVG(risk_score) AS avg_score
            FROM risk_assessments
            GROUP BY DATE(assessed_at)
            ORDER BY date ASC;
          `;
          db.query(trendQuery, (err, trendResults) => {
            if (err) throw err;

            //hazards chart
            const hazardsQuery = `
              SELECT 
                SUM(near_river = 1) AS near_river,
                SUM(near_fault = 1) AS near_fault
              FROM risk_assessments;
            `;
            db.query(hazardsQuery, (err, hazardsResults) => {
              if (err) throw err;

              //high, noderate, low risk
              const highRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'High'
                ORDER BY ra.assessed_at DESC;
              `;
              const moderateRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Moderate'
                ORDER BY ra.assessed_at DESC;
              `;
              const lowRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Low'
                ORDER BY ra.assessed_at DESC;
              `;

              db.query(highRiskQuery, (err, highRiskUsers) => {
                if (err) throw err;
                db.query(moderateRiskQuery, (err, moderateRiskUsers) => {
                  if (err) throw err;
                  db.query(lowRiskQuery, (err, lowRiskUsers) => {
                    if (err) throw err;

                    const riskTables = {
                      High: highRiskUsers,
                      Moderate: moderateRiskUsers,
                      Low: lowRiskUsers
                    };

                    //user list
                    db.query('SELECT * FROM users', (err, results) => {
                      if (err) throw err;

                      db.query('SELECT count(*) as totalusers FROM users', (err, totaluserresults) => {
                        if (err) throw err;

                        const totalUsers = totaluserresults[0].totalusers;

                        db.query('SELECT count(*) as totalrequests FROM disaster_reports', (err, totalrequestsresults) => {
                          if (err) throw err;

                          const totalRequests = totalrequestsresults[0].totalrequests;

                          res.render('pages/adminpage', {
                            chartData,
                            username: req.session.username,
                            riskLevelData: riskResults,
                            checklistData: checklistResults[0],
                            trendData: trendResults,
                            hazardsData: hazardsResults[0],
                            users: results,
                            riskTables,
                            totalUsers,
                            totalRequests
                          })
                        })
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});


app.get('/userslist', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, users) => {
      if (err) throw err;
      db.query(`
        SELECT r.*, s.name as station_name 
        FROM responders r 
        LEFT JOIN stations s ON r.station_id = s.id
      `, (err, responders) => {
        if (err) throw err;
        res.render('pages/userslist', {
          users,
          responders,
          username: req.session.username
        });
      });
    });
  } else {
    res.redirect('/login')
  }

});

app.get('/status-overview', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT firstname, lastname, city, barangay, contact_number, status FROM users', (err, users) => {
      if (err) throw err;
      db.query(`
        SELECT r.firstname, r.lastname, r.contact_number, r.status, s.name as station_name 
        FROM responders r 
        LEFT JOIN stations s ON r.station_id = s.id
      `, (err, responders) => {
        if (err) throw err;
        res.render('pages/status-overview', {
          users,
          responders,
          username: req.session.username
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/addusers', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/addusers', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// add user
app.post('/add', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    let { firstname, lastname, street_address,
      barangay, city, province, postal_code,
      country, email, contact_number, landmark,
      address_type, additional_instructions, password, role } = req.body;

    firstname = firstname ? firstname.trim() : "";
    lastname = lastname ? lastname.trim() : "";
    email = email ? email.trim() : "";
    contact_number = contact_number ? contact_number.trim() : "";

    db.query('INSERT INTO users (firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role], (err) => {
      if (err) throw err;
      res.redirect('/adminpage');
    });
  } else {
    res.redirect('/login')
  }

});

// DELETE user
app.get('/admin-delete/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    console.log(`[ADMIN] Deletion requested for User ID: ${userId} by Admin: ${req.session.username}`);

    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) {
        console.error("[ERROR] Deletion failed:", err);
        return res.send(`<script>alert('Failed to delete user: ${err.message}'); window.location.href='/userslist';</script>`);
      }

      console.log(`[SUCCESS] Delete result:`, result);

      if (result.affectedRows === 0) {
        return res.send(`<script>alert('No user found with ID: ${userId}. Refreshing list.'); window.location.href='/userslist';</script>`);
      }

      res.redirect('/userslist');
    });
  } else {
    res.redirect('/login')
  }

});


// edit form
app.get('/edit/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      res.render('pages/edit', { user: results[0], username: req.session.username });
    });
  } else {
    res.redirect('/login')
  }

});

// Update user
app.post('/update/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    let { firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role } = req.body;

    firstname = firstname ? firstname.trim() : "";
    lastname = lastname ? lastname.trim() : "";
    email = email ? email.trim() : "";
    contact_number = contact_number ? contact_number.trim() : "";

    db.query('UPDATE users SET firstname = ?, lastname = ?, street_address = ?, barangay = ?, city = ?, province = ?, postal_code = ?, country = ?, email = ?,contact_number = ?, landmark = ?, address_type = ?, additional_instructions = ?, password = ?, role = ? WHERE id = ?', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role, userId], (err) => {
      if (err) throw err;
      res.redirect('/userslist');
    });
  } else {
    res.redirect('/login')
  }
});

app.get('/aboutadmin', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/aboutadmin', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// reports
app.get('/reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    //post per day
    db.query(`
      SELECT 
        DAYNAME(created_at) AS day,
        COUNT(*) AS total
      FROM users
      GROUP BY day
      ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    `, (err, chartData) => {
      if (err) throw err;

      //risk level chart
      const riskLevelQuery = `
        SELECT risk_level, COUNT(*) AS total
        FROM risk_assessments
        GROUP BY risk_level;
      `;
      db.query(riskLevelQuery, (err, riskResults) => {
        if (err) throw err;

        //checklist completed chart
        const checklistQuery = `
          SELECT
            SUM(near_river = 1) AS near_river,
            SUM(near_fault = 1) AS near_fault,
            SUM(has_emergency_kit = 1) AS has_emergency_kit,
            SUM(has_evacuation_plan = 1) AS has_evacuation_plan
          FROM risk_assessments;
        `;
        db.query(checklistQuery, (err, checklistResults) => {
          if (err) throw err;

          //trend graph
          const trendQuery = `
            SELECT DATE(assessed_at) AS date, AVG(risk_score) AS avg_score
            FROM risk_assessments
            GROUP BY DATE(assessed_at)
            ORDER BY date ASC;
          `;
          db.query(trendQuery, (err, trendResults) => {
            if (err) throw err;

            //hazards chart
            const hazardsQuery = `
              SELECT 
                SUM(near_river = 1) AS near_river,
                SUM(near_fault = 1) AS near_fault
              FROM risk_assessments;
            `;
            db.query(hazardsQuery, (err, hazardsResults) => {
              if (err) throw err;

              //high, noderate, low risk
              const highRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'High';
              `;
              const moderateRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Moderate';
              `;
              const lowRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Low';
              `;

              db.query(highRiskQuery, (err, highRiskUsers) => {
                if (err) throw err;
                db.query(moderateRiskQuery, (err, moderateRiskUsers) => {
                  if (err) throw err;
                  db.query(lowRiskQuery, (err, lowRiskUsers) => {
                    if (err) throw err;

                    const riskTables = {
                      High: highRiskUsers,
                      Moderate: moderateRiskUsers,
                      Low: lowRiskUsers
                    };

                    //user list
                    db.query('SELECT * FROM users', (err, results) => {
                      if (err) throw err;

                      res.render('pages/reports', {
                        chartData,
                        username: req.session.username,
                        riskLevelData: riskResults,
                        checklistData: checklistResults[0],
                        trendData: trendResults,
                        hazardsData: hazardsResults[0],
                        users: results,
                        riskTables
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/assessment-results', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.session.userId;
    db.query(`SELECT 
        risk_assessments.*, 
        users.firstname, 
        users.lastname 
      FROM 
        risk_assessments 
      JOIN 
        users ON risk_assessments.user_id = users.id 
      ORDER BY 
        risk_assessments.assessed_at DESC`, (err, results) => {
      if (err) throw err;
      res.render('pages/assessment-results-admin', { assessments: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


//view all posts
// --- RESPONDER REGISTRATION ROUTES ---

app.get('/addresponder', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM stations', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Database Error");
      } else {
        res.render('pages/addresponder', { username: req.session.username, stations: results });
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/addresponder', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    let { firstname, lastname, email, contact_number, password, station_id } = req.body;

    // Trim
    firstname = firstname ? firstname.trim().replace(/\s+/g, ' ') : "";
    lastname = lastname ? lastname.trim().replace(/\s+/g, ' ') : "";
    email = email ? email.trim().replace(/\s+/g, ' ') : "";
    contact_number = contact_number ? contact_number.trim().replace(/\s+/g, ' ') : "";

    // Default address values for responders
    const street_address = "Station Assigned";
    const barangay = "N/A";
    const city = "Iloilo City";
    const province = "Iloilo";
    const postal_code = "5000";
    const country = "Philippines";
    const landmark = "N/A";
    const address_type = "Work";
    const additional_instructions = "N/A";
    const role = "responder";

    // Insert logic into responders table
    const sql = `INSERT INTO responders (firstname, lastname, email, contact_number, password, username, station_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`;

    const values = [firstname, lastname, email, contact_number, password, email, station_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.send(`<script>alert('Failed to create responder account.'); window.location.href='/addresponder';</script>`);
      } else {
        res.send(`<script>alert('Responder Created Successfully!'); window.location.href='/adminpage';</script>`);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//sos reports result
app.get('/disaster-reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const disasterReportsQuery = `
      SELECT 
        dr.id,
        CONCAT(users.firstname, ' ', users.lastname) AS sender,
        dr.disaster_type,
        dr.location,
        dr.latitude,
        dr.longitude,
        dr.reported_at,
        dr.status
      FROM disaster_reports dr
      JOIN users ON users.id = dr.user_id
      ORDER BY dr.reported_at DESC;
    `;

    db.query(disasterReportsQuery, (err, reports) => {
      if (err) throw err;
      res.render('pages/disaster-reports', { reports, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


// ************************************ end for admin **************************************************************

// *****************************************assess risk *****************************************************
app.get('/risk-results', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    db.query('SELECT * FROM risk_assessments WHERE user_id = ? ORDER BY assessed_at DESC', [userId], (err, results) => {
      if (err) throw err;
      res.render('pages/riskassessmentresult', { assessments: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/assess-risk', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    res.render('pages/riskassessment', { username: req.session.username });
  } else {
    res.redirect('/login');
  }
});

app.post('/assess-risk', (req, res) => {
  const { nearRiver, nearFault, hasKit, hasPlan } = req.body;
  const userId = req.session.userId;

  let score = 0;
  if (nearRiver === 'true') score += 3;
  if (nearFault === 'true') score += 3;
  if (hasKit === 'false') score += 2;
  if (hasPlan === 'false') score += 2;

  let level = 'Low';
  if (score >= 5 && score <= 7) level = 'Moderate';
  else if (score >= 8) level = 'High';

  const query = `
    INSERT INTO risk_assessments 
    (user_id, near_river, near_fault, has_emergency_kit, has_evacuation_plan, risk_score, risk_level) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    nearRiver === 'true',
    nearFault === 'true',
    hasKit === 'true',
    hasPlan === 'true',
    score,
    level
  ];

  db.query(query, values, (err) => {
    if (err) throw err;
    res.redirect('/risk-results');
  });
});

app.post('/delete-result/:id', (req, res) => {
  const assessmentId = req.params.id;
  const userId = req.session.userId;

  const sql = 'DELETE FROM risk_assessments WHERE id = ? AND user_id = ?';
  db.query(sql, [assessmentId, userId], (err) => {
    if (err) throw err;
    res.redirect('/risk-results');
  });
});
//**************************************** end of assessment tool *************************************


// edit responder
app.get('/edit-responder/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const responderId = req.params.id;
    db.query('SELECT * FROM responders WHERE id = ?', [responderId], (err, results) => {
      if (err) throw err;
      db.query('SELECT * FROM stations', (err, stations) => {
        if (err) throw err;
        res.render('pages/editresponder', { responder: results[0], stations: stations, username: req.session.username });
      });
    });
  } else {
    res.redirect('/login')
  }

});

// Update responder
app.post('/update-responder/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const responderId = req.params.id;
    let { firstname, lastname, email, contact_number, password, station_id } = req.body;

    firstname = firstname ? firstname.trim().replace(/\s+/g, ' ') : "";
    lastname = lastname ? lastname.trim().replace(/\s+/g, ' ') : "";
    email = email ? email.trim().replace(/\s+/g, ' ') : "";
    contact_number = contact_number ? contact_number.trim().replace(/\s+/g, ' ') : "";

    db.query('UPDATE responders SET firstname = ?, lastname = ?, email = ?, contact_number = ?, password = ?, station_id = ? WHERE id = ?', [firstname, lastname, email, contact_number, password, station_id, responderId], (err) => {
      if (err) throw err;
      res.redirect('/userslist');
    });
  } else {
    res.redirect('/login')
  }
});

// DELETE responder
app.get('/admin-delete-responder/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const responderId = req.params.id;
    db.query('DELETE FROM responders WHERE id = ?', [responderId], (err) => {
      if (err) {
        console.error("Responder deletion failed:", err);
        return res.send(`<script>alert('Failed to delete responder: ${err.message}'); window.location.href='/userslist';</script>`);
      }
      res.redirect('/userslist');
    });
  } else {
    res.redirect('/login')
  }
});

app.get('/logout', (req, res) => {
  const userId = req.session.userId;
  const role = req.session.role;

  if (userId) {
    if (role === 'responder') {
      db.query('UPDATE responders SET status = "offline" WHERE id = ?', [userId]);
    } else {
      db.query('UPDATE users SET status = "offline" WHERE id = ?', [userId]);
    }
  }

  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/visitor');
    }
  });
});

app.get('/api/status-overview', (req, res) => {
  const usersQuery = 'SELECT id, status FROM users';
  const respondersQuery = 'SELECT id, status FROM responders';

  db.query(usersQuery, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(respondersQuery, (err, responders) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ users, responders });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on http://localhost:${PORT}`);
});