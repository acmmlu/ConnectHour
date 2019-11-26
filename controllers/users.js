const g = require('../globals');

exports.volunteerById = function(req, res) {
    let vid = req.params.volunteer;
    let response={
        Description: "",
        StreetName: "",
        StreetNumber: "",
        City: "",
        State: "",
        ZIP: "",
        FirstName: "",
        LastName: "",
        Email: ""
    }
    let query = 'SELECT P.STREETNUM as "StreetNumber", P.STREETNAME as "StreetName", P.ZIP as "ZIP", P.DESCRIPTION as "Description", ' +
        'T.CITY as "City", T.STATE as "State", T.EMAIL as "Email", T.FIRST_NAME as "FirstName", T.LAST_NAME as "LastName" ' +
        'FROM VOLUNTEER_PROFILE P RIGHT OUTER JOIN VOLUNTEER_TAB T ON P.ID = T.ID WHERE T.ID = ?';

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
}

exports.organizerById = function(req, res) {
    let oid = req.params.organizer;
    let response={
        Description: "",
        StreetName: "",
        StreetNumber: "",
        City: "",
        State: "",
        ZIP: "",
        Name: "",
        Email: ""
    }
    let query = 'SELECT P.STREETNUM as "StreetNumber", P.STREETNAME as "StreetName", P.ZIP as "ZIP", P.DESCRIPTION as "Description", ' +
        'T.CITY as "City", T.STATE as "State", T.EMAIL as "Email", T.NAME as "Name"' +
        'FROM ORGANIZER_PROFILE P RIGHT OUTER JOIN ORGANIZER_TAB T ON P.ID = T.ID WHERE T.ID = ?';

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
   
    let profile=req.body
    let query = 'UPDATE VOLUNTEER_PROFILE SET STREETNUM = ?, DESCRIPTION = ?' +
        ', STREETNAME = ?, ZIP = ? '+
        'WHERE ID = ?';
    let query2 = 'UPDATE VOLUNTEER_TAB SET CITY = ?, STATE = ? WHERE ID = ?';

    let params1 = [
        profile.StreetNumber,
        profile.Description,
        profile.StreetName,
        profile.ZIP,
        req.params.volunteer
    ];

    let params2 = [
        profile.City,
        profile.State,
        req.params.volunteer
    ];

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
        
    let profile=req.body
    let query = 'UPDATE ORGANIZER_PROFILE SET STREETNUM = ?, DESCRIPTION = ?' +
        ', STREETNAME = ?, ZIP = ? '+
        'WHERE ID = ?';
    let query2 = 'UPDATE ORGANIZER_TAB SET CITY = ?, STATE = ? WHERE ID = ?';

    let params1 = [
        profile.StreetNumber,
        profile.Description,
        profile.StreetName,
        profile.ZIP,
        req.params.organizer
    ];

    let params2 = [
        profile.City,
        profile.State,
        req.params.organizer
    ];

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

    let query = 'SELECT ORGANIZER FROM EVENT WHERE ID=?';

    
        g.query(query, [oid], function(result, fields) {
            res.send(result);
    
   
})}


exports.donate = async(req, res)=> {
    
       
   
}
