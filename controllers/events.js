const g = require('../globals');

exports.findById = function(req, res) {
    try {
        let event_id = req.params.id;

        g.pool.getConnection(function (err, connection) {
            if (err) throw err;

            let query = 'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
                '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
                'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' + 
                'E.START AS "StartTime", E.END AS "EndTime" FROM EVENT E WHERE E.ID = ?;';
            connection.execute(query, [event_id], function(err, result, fields) {
                if (err) throw err;

                let event;
                try {
                    event = result[0];
                    res.send(event);
                } catch(error) {
                    console.log("event with id " + event_id + " does not exist");
                }
            });
        });
    } catch(error) {
        res.status(422);
        console.log(error);
    }
};

exports.get_events = function(req, res) {
    try{
        let org_id = req.params.organizer;

        g.pool.getConnection(function(err, connection) {
            if (err) throw err;

            let query = 'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
                '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
                'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "ZIP", ' + 
                'E.START AS "StartTime", E.END AS "EndTime" FROM EVENT E WHERE E.ORGANIZER = ?;';
            connection.execute(query, [org_id], function(err, result, fields) {
                try {
                    result = result.sort(function(a, b) {
                        a = new Date(a["StartTime"])
                        b = new Date(b["StartTime"])
                        return a > b ? 1 : -1
                    })
                } catch (error) {
                    console.log(error);
                }
                res.send(result);
            });
        });
    } catch(error) {
        res.status(422);
        console.log(error);
    }
};

exports.get_registered = function(req, res) {
    let vid = req.params.volunteer;

    let query = 'SELECT E.ID as "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", ' +
        '(SELECT O.NAME FROM ORGANIZER_TAB O WHERE ID=E.ORGANIZER) AS "OrganizationName", ' +
        'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' + 
        'E.START AS "StartTime", E.END AS "EndTime" FROM EVENT E INNER JOIN ATTENDING A ON ' +
        'E.ID = A.EVENTID WHERE A.VOLUNTEERID = ?';
    g.query(query, [vid], function(result, fields) {
        try {
            result = result.sort(function(a, b) {
                a = new Date(a["StartTime"])
                b = new Date(b["StartTime"])
                return a > b ? 1 : -1
            })
        } catch (error) {
            console.log(error);
        }
        res.send(result);  
    });
};

exports.create_event = function(req, res) {
    try {
        let event = req.body;
    
        g.pool.getConnection(function(err, connection) {
            if (err) throw err;
    
            let query = "INSERT INTO EVENT" + 
                "(NAME, DESCRIPTION, ORGANIZER, STREETNUMBER, STREETNAME, CITY, STATE, ZIP, START, END)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            let params = [
                event.EventName,
                event.Description,
                event.OrganizationId,
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
                res.send("Event Created");
            });
           
        });
    } catch(error) {
        res.status(422);
        console.log(error);
    }
};

exports.edit_event = function(req, res) {
    let evt = req.body;
    let query = 'UPDATE EVENT SET NAME = ?, DESCRIPTION = ?' +
        ', STREETNUMBER = ?, STREETNAME = ?, CITY = ?, STATE = ?' +
        ', ZIP = ?, START = ?, END = ? ' +
        'WHERE ORGANIZER = ? AND ID = ?;';
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
        req.params.organizer,
        req.params.id
    ];
    g.query(query, params, function(result, fields) {
        res.send(req.body);
    });
};

exports.register = function(req, res) {
    let query = 'INSERT INTO ATTENDING VALUES (?, ?);';
    let params = [req.params.volunteer, req.params.id];
    try {
        g.query(query, params, function(result, fields) {
            res.send("success");
        });
    } catch(error) {
        res.send("already registered");
    }
};

exports.unregister = function(req, res) {
    let query = 'DELETE FROM ATTENDING WHERE VOLUNTEERID = ? AND EVENTID = ?;';
    let params = [req.params.volunteer, req.params.id];

    try {
        g.query(query, params, function(result, fields) {
            res.send("success");
        });
    } catch (error) {
        res.send("not registered for this event");
    }
};
