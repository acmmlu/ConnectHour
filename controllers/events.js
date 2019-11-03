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

exports.get_registered_volunteers=function(req,res){
    let eid = req.params.id;
    let query ='SELECT V.FIRST_NAME AS "FirstName", V.LAST_NAME AS "LastName", V.EMAIL AS "Email"'+
    'FROM VOLUNTEER_TAB V INNER JOIN ATTENDING A ON A.VOLUNTEERID=V.ID WHERE A.EVENTID=?'
    try {
        g.query(query, [eid], function(result, fields) {
            console.log(result,eid)
            res.send(result);  
        });
        } catch (error) {
            console.log(error);
        }
}

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
                console.log(req.body)
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
        console.log(req.body)
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

exports.delete_event = function(req,res){
    console.log(req.params)
    let query_1 = 'DELETE FROM ATTENDING WHERE EVENTID = ?;';
    let params_1 = [req.params.id];
    let query_2 = 'DELETE FROM EVENT WHERE ORGANIZER = ? AND ID = ?;';
    let params_2 = [req.params.organizer, req.params.id];
    try {
        g.query(query_1,params_1, function(err,result) {
            g.query(query_2,params_2, function(err,result) {
                res.send("Event Deleted");
            });
        });
    } catch (error) {
        res.send(error);
    }

}

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


exports.activityTracking = function(req,res){
   try{
       let vol_id = req.params.volunteer;
       console.log(vol_id)
       g.pool.getConnection(function(err, connection){
           if (err) throw err;
           let query = 'SELECT E.ID as "EventId", E.NAME AS "EventName", E.DESCRIPTION AS "Description", E.ORGNAME AS "OrganizationName",' +
           'E.STREETNUMBER AS "Streetnumber", E.STREETNAME AS "Streetname", E.CITY AS "City",'+
           'E.STATE AS "State", E.ZIP AS "ZIP", E.START AS "StartTime", E.END AS "EndTime"' +
           'FROM EVENT E INNER JOIN ATTENDING A ON E.ID=A.EVENTID WHERE A.VOLUNTEERID=?';
          
           connection.execute(query, [vol_id], function(err,result,fields) {
               if (err) throw err;
               
               let to_day = new Date();
               try {
                   result = result.filter(history =>{
                       return (new Date(history["EndTime"])).getTime() < to_day.getTime()
       
                   })
                 
                   res.send(result);
               } catch(error) {
                   console.log("event with id " + event_id + " does not exist");
               }
           });
       });
   }
   catch(error){
   }
}
