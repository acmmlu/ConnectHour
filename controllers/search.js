const g = require('../globals');

exports.search = function(req, res) {
    let search_str = '%' + req.query.q + '%';

    let query = 'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", O.NAME AS "OrganizationName", ' +
        'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' + 
        'E.START AS "StartTime", E.END AS "EndTime" FROM EVENT E INNER JOIN ORGANIZER_TAB O ON E.ORGANIZER = O.ID ' +
        "WHERE (E.NAME LIKE ?) OR (E.DESCRIPTION LIKE ?) OR (O.NAME LIKE ?)";

    g.query(query, [search_str, search_str, search_str], function(result, fields) {
        console.log(result);
        
        for (let param of Object.keys(req.query)) {
            if (param === "date") {
                result = result.filter(function(row) {
                    return row["StartTime"].includes(req.query[param]) || row["EndTime"].includes(req.query[param]);
                });
            }
            if (param === "city") {
                result = result.filter(function(row) {
                    console.log(row);
                    return row["City"].includes(req.query[param]);
                });
            }
        }
        res.send(result);
    });
};
