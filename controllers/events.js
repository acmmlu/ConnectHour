const g = require("../globals");

exports.findById = function(req, res) {
  try {
    let event_id = req.params.id;

    g.pool.getConnection(function(err, connection) {
      if (err) throw err;

      let query =
        'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
        '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
        'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' +
        'E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" FROM EVENT E WHERE E.ID = ?;';
      connection.execute(query, [event_id], function(err, result, fields) {
        if (err) throw err;

        let event;
        try {
          event = result[0];
          res.send(event);
        } catch (error) {
          console.log("event with id " + event_id + " does not exist");
        }
      });
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.get_events = function(req, res) {
  try {
    let org_id = req.params.organizer;

    g.pool.getConnection(function(err, connection) {
      if (err) throw err;

      let query =
        'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
        '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
        'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "ZIP", ' +
        'E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" FROM EVENT E WHERE E.ORGANIZER = ?;';
      connection.execute(query, [org_id], function(err, result, fields) {
        try {
          result = result.sort(function(a, b) {
            a = new Date(a["StartTime"]);
            b = new Date(b["StartTime"]);
            return a > b ? 1 : -1;
          });
        } catch (error) {
          console.log(error);
        }
        let to_day = new Date();

        result = result.filter(history => {
          return new Date(history["EndTime"]).getTime() > to_day.getTime();
        });
        res.send(result);
      });
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.get_registered = function(req, res) {
  let vid = req.params.volunteer;

  let query =
    'SELECT E.ID as "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
    '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
    'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' +
    'E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" FROM EVENT E INNER JOIN ATTENDING A ON ' +
    "E.ID = A.EVENTID WHERE A.VOLUNTEERID = ?";

  g.query(query, [vid], function(result, fields) {
    try {
      let to_day = new Date();
      result = result.filter(history => {
        return new Date(history["EndTime"]).getTime() > to_day.getTime();
      });
      result = result.sort(function(a, b) {
        a = new Date(a["StartTime"]);
        b = new Date(b["StartTime"]);
        return a > b ? 1 : -1;
      });
    } catch (error) {
      console.log(error);
    }
    res.send(result);
  });
};

exports.get_registered_volunteers = function(req, res) {
  let eid = req.params.id;
  let query =
    'SELECT V.ID AS "volID" ,V.FIRST_NAME AS "FirstName", V.LAST_NAME AS "LastName", V.EMAIL AS "Email"' +
    "FROM VOLUNTEER_TAB V INNER JOIN ATTENDING A ON A.VOLUNTEERID=V.ID WHERE A.EVENTID=?";
  try {
    g.query(query, [eid], function(result, fields) {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.create_event = function(req, res) {
  try {
    let event = req.body;

    g.pool.getConnection(function(err, connection) {
      if (err) throw err;

      let query =
        "INSERT INTO EVENT" +
        "(NAME, DESCRIPTION, ORGANIZER, TAG, STREETNUMBER, STREETNAME, CITY, STATE, ZIP, START, END)" +
        "VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?);";
      let params = [
        event.EventName,
        event.Description,
        event.OrganizationId,
        event.Tag,
        event.StreetNumber,
        event.StreetName,
        event.City,
        event.State,
        event.ZIP,
        event.date + " " + event.StartTime,
        event.date + " " + event.EndTime
      ];
      connection.execute(query, params, function(err, result, fields) {
        if (err) throw err;

        // Notify all subscribers
        try {
            query = "SELECT V.EMAIL FROM VOLUNTEER_TAB V " +
                "INNER JOIN SUBSCRIBED S ON V.ID = S.VOLUNTEERID " +
                "WHERE S.ORGANIZERID = ?";

            g.query(query, [event.OrganizationId], function(result, fields) {
                for (let e of result) {
                    g.transport.sendMail({
                        from: "Connect Hour <connecthourofficial@gmail.com>",
                        to: e["EMAIL"],
                        subject: "New Event",
                        text:
                        "An Organizer you are subscribed to has created a new event. Log in to check it out!"
                    }, function(err, info) {
                        if (err) throw err;
                        console.log(info);
                    });
                }
            
                res.send("success");
            });
        } catch (error) {
            res.send(error);
        }
      });
    });
  } catch (error) {
    res.status(422);
    console.log(error);
  }
};

exports.edit_event = function(req, res) {
  let evt = req.body;
  let query =
    "UPDATE EVENT SET NAME = ?, DESCRIPTION = ?" +
    ", STREETNUMBER = ?, STREETNAME = ?, CITY = ?, STATE = ?" +
    ", ZIP = ?, START = ?, END = ?, TAG = ? " +
    "WHERE  ID = ?;";

  let params = [
    evt.EventName,
    evt.Description,
    evt.StreetNumber,
    evt.StreetName,
    evt.City,
    evt.State,
    evt.ZIP,
    evt.date + " " + evt.StartTime,
    evt.date + " " + evt.EndTime,
    evt.Tag,
    req.params.id
  ];

  g.query(query, params, function(result, fields) {
    let q2 =
      "SELECT V.EMAIL FROM VOLUNTEER_TAB V INNER JOIN ATTENDING A ON V.ID = A.VOLUNTEERID INNER JOIN EVENT E ON A.EVENTID = E.ID WHERE E.ID = ?;";

    g.query(q2, [req.params.id], function(result, fields) {
      for (let e of result) {
        g.transport.sendMail(
          {
            from: "Connect Hour <connecthourofficial@gmail.com>",
            to: e["EMAIL"],
            subject: "Event info updated",
            text:
              "An event you are subscribed to, " +
              evt.EventName +
              ", has had its information updated. Please log in to view the changes."
          },
          function(err, info) {
            if (err) throw err;
            console.log(info);
          }
        );
      }

      res.send("success");
    });
  });
};

exports.register = function(req, res) {
  let query = "INSERT INTO ATTENDING VALUES (?, ?);";
  let params = [req.params.volunteer, req.params.id];
  try {
    g.query(query, params, function(result, fields) {
      res.send(req.body);
    });
  } catch (error) {
    res.send("already registered");
  }
};
exports.delete_event = function(req,res){
    console.log(req.params)
    let query_1 = 'DELETE FROM ATTENDING WHERE EVENTID = ?;';
    let params_1 = [req.params.id];
    let query_2 = 'DELETE FROM EVENT WHERE ORGANIZER = ? AND ID = ?;';
    let params_2 = [req.params.organizer, req.params.id];
    let query_3 = 'SELECT V.EMAIL FROM VOLUNTEER_TAB V INNER JOIN ATTENDING A ON V.ID = A.VOLUNTEERID INNER JOIN EVENT E ON A.EVENTID = E.ID WHERE E.ID = ?;'

    try {
        g.query(query_3,params_1, function(result, fields) {
            g.query(query_1,params_1, function(resul, fields) {
                g.query(query_2, params_2, function(resu, fields) {
                    for (let e of result) {
                        g.transport.sendMail({
                            from: "Connect Hour <connecthourofficial@gmail.com>",
                            to: e["EMAIL"],
                            subject: "Event cancelled",
                            text: "An event you are subscribed to has been cancelled."
                        }, function(err, info) {
                            if (err) throw err;
                            console.log(info);
                        });
                    }
                    res.send("success");
                });
            });
        });
  } catch (error) {
    res.send(error);
  }
};

exports.activityTracking = function(req, res) {
  try {
    let vol_id = req.params.volunteer;
    g.pool.getConnection(function(err, connection) {
      if (err) throw err;
      let query =
        'SELECT E.ID as "EventId", E.NAME AS "EventName", E.DESCRIPTION AS "Description", E.ORGNAME AS "OrganizationName", ' +
        'E.STREETNUMBER AS "Streetnumber", E.STREETNAME AS "Streetname", E.CITY AS "City", ' +
        'E.STATE AS "State", E.ZIP AS "ZIP", E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" ' +
        "FROM EVENT E INNER JOIN ATTENDING A ON E.ID=A.EVENTID WHERE A.VOLUNTEERID=?";

      connection.execute(query, [vol_id], function(err, result, fields) {
        if (err) throw err;

        let to_day = new Date();
        try {
          result = result.filter(history => {
            return new Date(history["EndTime"]).getTime() < to_day.getTime();
          });

          res.send(result);
        } catch (error) {
          console.log("event with id " + event_id + " does not exist");
        }
      });
    });
  } catch (error) {}
};

exports.activityOrg = function(req, res) {
  try {
    let org_id = req.params.organizer;

    g.pool.getConnection(function(err, connection) {
      if (err) throw err;
      let query =
        'SELECT ID as "EventId", NAME AS "EventName", DESCRIPTION AS "Description", ORGNAME AS "OrganizationName", ' +
        'STREETNUMBER AS "Streetnumber", STREETNAME AS "Streetname", CITY AS "City", ' +
        'STATE AS "State", ZIP AS "ZIP", START AS "StartTime", END AS "EndTime", TAG AS "Tag" ' +
        "FROM EVENT WHERE ORGANIZER=?";

      connection.execute(query, [org_id], function(err, result, fields) {
        if (err) throw err;

        let to_day = new Date();
        try {
          result = result.filter(history => {
            return new Date(history["EndTime"]).getTime() < to_day.getTime();
          });

          res.send(result);
        } catch (error) {
          console.log("event with id " + event_id + " does not exist");
        }
      });
    });
  } catch (error) {}
};

exports.subscribe = function(req, res) {
  let orgid = req.params.organizer;
  let query = "INSERT INTO SUBSCRIBED VALUES (?, ?)";
  let query_1 =
    "SELECT * FROM SUBSCRIBED WHERE VOLUNTEERID = ? AND ORGANIZERID = ?";
  let params = [req.params.volunteer, orgid];
  try {
    g.query(query, params, function(result, fields) {
      res.send("success");
    });
  } catch (error) {
    res.send("already subscribed");
  }
};
exports.unsubscribe = function(req, res) {
  let query =
    "DELETE FROM SUBSCRIBED WHERE VOLUNTEERID = ? AND ORGANIZERID = ?";

  let params = [req.params.volunteer, req.params.organizer];

  try {
    g.query(query, params, function(result, fields) {
      res.send("success");
    });
  } catch (error) {
    res.send("not subscribed for this organizer");
  }
};

exports.issubsbribed = function(req, res) {
  let query =
    "SELECT * FROM SUBSCRIBED WHERE VOLUNTEERID = ? AND ORGANIZERID = ?";
  let params = [req.params.volunteer, req.params.organizer];

  try {
    g.query(query, params, function(result, fields) {
      console.log("Subscribed", result.length);
      if (result.length > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.get_subscribed = function(req, res) {
  let query =
    "SELECT ID as 'volId', FIRST_NAME AS 'FirstName' ,LAST_NAME AS 'LastName',EMAIL AS 'Email' FROM VOLUNTEER_TAB WHERE ID IN ( SELECT VOLUNTEERID FROM SUBSCRIBED WHERE ORGANIZERID = ?)";

  let params = [req.params.organizer];
  try {
    g.query(query, params, function(result, fields) {
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
};

exports.get_subscribed_org = function(req, res) {
  let query =
    "SELECT ID as 'orgId', NAME AS 'Name',EMAIL AS 'Email' FROM ORGANIZER_TAB WHERE ID IN ( SELECT ORGANIZERID FROM SUBSCRIBED WHERE VOLUNTEERID = ?)";

  let params = [req.params.volunteer];
  
  try {
    g.query(query, params, function(result, fields) {
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
};
