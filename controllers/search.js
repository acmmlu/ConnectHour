const g = require("../globals");

exports.search = function(req, res) {
  let search_str = "%" + req.query.q + "%";

  let query =
    'SELECT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", O.NAME AS "OrganizationName", ' +
    'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' +
    'E.START AS "StartTime", E.END AS "EndTime",E.TAG AS "Tag" FROM EVENT E INNER JOIN ORGANIZER_TAB O ON E.ORGANIZER = O.ID ' +
    "WHERE ((E.NAME LIKE ?) OR (E.DESCRIPTION LIKE ?) OR (O.NAME LIKE ?)) " +
    "AND E.ID NOT IN (SELECT A.EVENTID FROM ATTENDING A WHERE A.VOLUNTEERID = ?) ";
    console.log(req.query.id);

  g.query(query, [search_str, search_str, search_str, parseInt(req.query.id)], function(
    result,
    fields
  ) {
      
    let to_day = new Date();
    result = result.filter(history => {
      return new Date(history["EndTime"]).getTime() > to_day.getTime();
    });

    for (let param of Object.keys(req.query)) {
    
      if (param === "date") {
        result = result.filter(function(row) {
          return (
            row["StartTime"].includes(req.query[param]) ||
            row["EndTime"].includes(req.query[param])
          );
        });
      }
      if (param === "city") {
        result = result.filter(function(row) {
          return row["City"].includes(req.query[param]);
        });
      }
    }
    res.send(result);
  });
};

exports.recommended = function(req, res) {
  let query =
    'SELECT DISTINCT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", O.NAME AS "OrganizationName", ' +
    'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' +
    'E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" FROM EVENT E INNER JOIN ORGANIZER_TAB O ON E.ORGANIZER = O.ID ' +
    'WHERE E.TAG in (SELECT E.TAG FROM (SELECT EV.TAG, COUNT(EV.TAG) AS "NUM" FROM EVENT EV INNER JOIN ATTENDING A ' +
    'ON EV.ID = A.EVENTID WHERE A.VOLUNTEERID = ? GROUP BY EV.TAG) E HAVING "NUM" >= AVG("NUM")) AND E.ID NOT IN ' +
    '(SELECT A.EVENTID FROM ATTENDING A WHERE A.VOLUNTEERID = ?) ' +
    'AND NOW() < E.END LIMIT 6';

  g.query(query, [req.params.volunteer, req.params.volunteer], function(result, fields) {

    if (result.length > 0) {
      // let to_day = new Date();
      // result = result.filter(history => {
      //   return new Date(history["EndTime"]).getTime() > to_day.getTime();
      // });
      res.send(result);
    } else {
      // Recommend some other events
      let query =
        'SELECT DISTINCT E.ID AS "id", E.NAME AS "EventName", E.DESCRIPTION AS "Description", O.NAME AS "OrganizationName", ' +
        'E.STREETNUMBER AS "StreetNumber", E.STREETNAME AS "StreetName", E.CITY AS "City", E.STATE AS "State", E.ZIP AS "Zip", ' +
        'E.START AS "StartTime", E.END AS "EndTime", E.TAG AS "Tag" FROM EVENT E INNER JOIN ORGANIZER_TAB O ON E.ORGANIZER = O.ID ' +
        'AND E.ID NOT IN (SELECT A.EVENTID FROM ATTENDING A WHERE A.VOLUNTEERID = ?) ' +
        'AND NOW() < E.END LIMIT 6';

      g.query(query, [req.params.volunteer], function(result, fields) {
        // let to_day = new Date();
        // result = result.filter(history => {
        //   return new Date(history["EndTime"]).getTime() > to_day.getTime();
        // });
        res.send(result);
      });
    }
  });
};
