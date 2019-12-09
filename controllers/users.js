const g = require("../globals");

exports.volunteerById = function(req, res) {
  let vid = req.params.volunteer;
  let response = {
    Description: "",
    StreetName: "",
    StreetNumber: "",
    City: "",
    State: "",
    ZIP: "",
    FirstName: "",
    LastName: "",
    Email: ""
  };
  let query =
    'SELECT P.STREETNUM as "StreetNumber", P.STREETNAME as "StreetName", P.ZIP as "ZIP", P.DESCRIPTION as "Description", ' +
    'T.CITY as "City", T.STATE as "State", T.EMAIL as "Email", T.FIRST_NAME as "FirstName", T.LAST_NAME as "LastName" ' +
    "FROM VOLUNTEER_PROFILE P RIGHT OUTER JOIN VOLUNTEER_TAB T ON P.ID = T.ID WHERE T.ID = ?";

  try {
    g.query(query, [vid], function(result, fields) {
      let row = result[0];
      for (let key of Object.keys(response)) {
        if (row && row[key]) {
          response[key] = row[key];
        }
      }
      res.send(response);
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.organizerById = function(req, res) {
  let oid = req.params.organizer;
  let response = {
    Description: "",
    StreetName: "",
    StreetNumber: "",
    City: "",
    State: "",
    ZIP: "",
    Name: "",
    Email: ""
  };
  let query =
    'SELECT P.STREETNUM as "StreetNumber", P.STREETNAME as "StreetName", P.ZIP as "ZIP", P.DESCRIPTION as "Description", ' +
    'T.CITY as "City", T.STATE as "State", T.EMAIL as "Email", T.NAME as "Name"' +
    "FROM ORGANIZER_PROFILE P RIGHT OUTER JOIN ORGANIZER_TAB T ON P.ID = T.ID WHERE T.ID = ?";

  try {
    g.query(query, [oid], function(result, fields) {
      let row = result[0];
      for (let key of Object.keys(response)) {
        if (row && row[key]) {
          response[key] = row[key];
        }
      }
      res.send(response);
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.edit_volProfile = function(req, res) {
  let profile = req.body;
  let query =
    "UPDATE VOLUNTEER_PROFILE SET STREETNUM = ?, DESCRIPTION = ?" +
    ", STREETNAME = ?, ZIP = ? " +
    "WHERE ID = ?";
  let query2 = "UPDATE VOLUNTEER_TAB SET CITY = ?, STATE = ? WHERE ID = ?";

  let params1 = [
    profile.StreetNumber,
    profile.Description,
    profile.StreetName,
    profile.ZIP,
    req.params.volunteer
  ];

  let params2 = [profile.City, profile.State, req.params.volunteer];

  try {
    g.query(query2, params2, function(result, fields) {
      g.query(query, params1, function(result, fields) {
        console.log(result);
        res.send(result);
      });
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.edit_orgProfile = function(req, res) {
  let profile = req.body;
  let query =
    "UPDATE ORGANIZER_PROFILE SET STREETNUM = ?, DESCRIPTION = ?" +
    ", STREETNAME = ?, ZIP = ? " +
    "WHERE ID = ?";
  let query2 = "UPDATE ORGANIZER_TAB SET CITY = ?, STATE = ? WHERE ID = ?";

  let params1 = [
    profile.StreetNumber,
    profile.Description,
    profile.StreetName,
    profile.ZIP,
    req.params.organizer
  ];

  let params2 = [profile.City, profile.State, req.params.organizer];

  try {
    g.query(query2, params2, function(result, fields) {
      g.query(query, params1, function(result, fields) {
        console.log(result);
        res.send(result);
      });
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.organizerId = function(req, res) {
  let oid = req.params.organizer;

  let query = "SELECT ORGANIZER FROM EVENT WHERE ID=?";

  g.query(query, [oid], function(result, fields) {
    res.send(result);
  });
};

exports.upload_photo = function(req, res) {
  let acct_type = req.params.type;
  let id = req.params.id;
  let file = req.files.photo;

  let table = "";
  if (acct_type === "vol") {
    table = "VOLUNTEER_PROFILE";
  } else {
    table = "ORGANIZER_PROFILE";
  }

  if (file.data) {
    // console.log(typeof file.data);
    // console.log(file.data.slice(0, 100));
    let query = "UPDATE " + table + " SET PFP = BINARY(?) WHERE ID = ?";
    let params = [file.data, id];

    try {
      g.query(query, params, function(result, fields) {
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(421).send(error);
    }
  } else {
    res.status(421).send("no picture");
  }
};

exports.get_pfp = function(req, res) {
  let acct_type = req.params.type;
  let id = req.params.id;

  let table = "";
  if (acct_type === "vol") {
    table = "VOLUNTEER_PROFILE";
  } else {
    table = "ORGANIZER_PROFILE";
  }

  let query = "SELECT PFP FROM " + table + " WHERE ID = ?";
  let params = [id];

  try {
    g.query(query, params, function(result, fields) {
      try {
        if (result.length > 0 && result[0]["PFP"]) {
          res.send(result[0]["PFP"].toString("binary"));
        } else {
          res.status(404).send("");
        }
      } catch (error) {
        console.log(id, error);
        res.status(404).send("");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("");
  }
};

// const fs = require("fs");
// const PDFDocument = require("pdfkit");

exports.donate = function(req, res) {
  let vid = req.params.volunteer;
  let oid = req.params.organizer;
  let amount = req.body.amount;
  console.log('req',req)
  // Get vol info
  g.query("select * from VOLUNTEER_TAB where ID = ?", [vid], function(vol_result, fields) {
    if (vol_result.length > 0) {
      g.query("select * from ORGANIZER_TAB where ID = ?", [oid], function(org_result, fields) {
        if (org_result.length > 0) {
          try {
            const message1 = {
              from: "Connect Hour <connecthourofficial@gmail.com>",
              to: org_result[0]["EMAIL"],
              subject: "You recieved a donation!",
              text: `The user ${vol_result[0]["EMAIL"]} has generously donated $${amount} to your cause!`
            }

            g.transport.sendMail(message1, function(err, info) {
                if (err) throw err;
                console.log(info);
            });

            const message2 = {
              from: "Connect Hour <connecthourofficial@gmail.com>",
              to: vol_result[0]["EMAIL"],
              subject: "Donation successful",
              text: `Your generous gift of $${amount} has been processed. Thank you so much for your support of ${org_result[0]["NAME"]}.`
            }

            g.transport.sendMail(message2, function(err, info) {
                if (err) throw err;
                console.log(info);
            });
          } catch(error) {
            console.log(error);
            res.status(421).send(error);
          }
        } else {
          res.status(404).send("org not found")
        }
      })
    } else {
      res.status(404).send("vol not found")
    }
  });
  
};
