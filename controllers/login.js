const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const g = require('../globals');

exports.login = function(req, res) {
    let user_info = req.body;
    let token = getToken();
    let table;
    if (user_info.type === "Volunteer") {
        table = "VOLUNTEER_TAB";
    } else {
        table = "ORGANIZER_TAB";
    }

    let response_object = {
        "jwt": "",
        "id": "",
        "verification_token": "" + token
    }

    g.query('SELECT PASSWORD AS "PW", ID FROM ' + table + ' WHERE EMAIL = ?;', [user_info.email], function(result, fields) {
        let pw = "";
        try {
            pw = result[0]["PW"];
        } catch(error) {
            console.log("account not registered");
        }
        bcrypt.compare(user_info.password, pw, function(err, response) {
            if (err) {
                console.log("account not registered");
                throw err;
            }

            if (response) { // Correct password
                response_object["jwt"] = jwt.encode({"uid": result[0]["ID"]}, "Group2");
                response_object["id"] = result[0]["ID"];

                const message = {
                    from: "Connect Hour <connecthourofficial@gmail.com>",
                    to: user_info.email,
                    subject: "Login code",
                    text: "Here is your login code: " + token
                }

                g.transport.sendMail(message, function(err, info) {
                    if (err) throw err;
                    console.log(info);
                });
               
                res.send(response_object);
            } else { // Incorrect password
               
                res.status(401).send("Incorrect username/password");
            }
        })
    })
}

exports.register = function(req, res) {
    let user_info = req.body;
   

    // bcrypt.hash(user_info.Password, 8, function(err, hash) {
    //     user_info.Password = hash;
    // });
    console.log(user_info.Verified);

    let table;
    if (user_info.type === "Volunteer") {
        table = "VOLUNTEER";
    } else {
        table = "ORGANIZER";
    }

    if (user_info.Verified === "false") {
        // Create account
        let token = getToken();
       

        let query = "SELECT CASE WHEN EXISTS (SELECT EMAIL FROM " + table + "_TAB WHERE EMAIL = ?) THEN 1 ELSE 0 END AS \"exists\";";
        g.query(query, [user_info.Email], function(result, fields) {

            if (result[0]["exists"]) {
                res.status(401).send("Username already exists");
            } else { // Username is good

                // Hash password
                bcrypt.hash(user_info.Password, 8, function(err, hash) {

                    let response_object = {
                        "jwt": "",
                        "id": "",
                        "verification_token": "" + token
                    }
                    
                    // Create db entry
                    if (table === "VOLUNTEER") { // Volunteer
                        let vals = [user_info.Firstname, user_info.Lastname, user_info.Email, hash, user_info.City, user_info.State];
                        let query = "INSERT INTO " + table + "_TAB(FIRST_NAME,LAST_NAME,EMAIL,PASSWORD, CITY, STATE) VALUES (?, ?, ?, ?, ?, ?)";
                        
                        try {
                            g.query(query, vals, function(result, fields) {
                                verifyAccount(user_info.Email, token);
                                
                                try {
                                    g.query('SELECT ID FROM '+table+"_TAB WHERE EMAIL = ?", [user_info.Email], function(resul, field) {
                                        g.query('INSERT INTO '+table+'_PROFILE (ID) VALUES (?)', [resul[0].ID], function(resu, fiel) {
                                            res.send(response_object);
                                        });
                                    });
                                }catch (error) {
                                    res.send(error);
                                }
                            })
                        } catch (error) {
                            res.send(error);
                        }
                    } else { // Organizer
                        let vals = [user_info.Organization_name, user_info.Email, hash, user_info.City, user_info.State];
                        let query = "INSERT INTO " + table + "_TAB(NAME, EMAIL, PASSWORD, CITY, STATE) VALUES (?, ?, ?, ?, ?)";

                        try {
                            g.query(query, vals, function(result, fields) {
                                verifyAccount(user_info.Email, token);

                                try {
                                    g.query('SELECT ID FROM '+table+"_TAB WHERE EMAIL = ?", [user_info.Email], function(resul, field) {
                                        g.query('INSERT INTO '+table+'_PROFILE (ID) VALUES (?)', [resul[0].ID], function(resu, fiel) {
                                            res.send(response_object);
                                        });
                                    });
                                } catch (error) {
                                    res.send(error);
                                }
                            });
                        } catch (error) {
                            res.send(error);
                        }
                    }
                });
            }
        });
    } else {
        console.log('else');
        // Verify
        g.query("UPDATE " + table + "_TAB SET VERIFIED = TRUE WHERE EMAIL = ?;", [user_info.Email], function(result, fields) {
            res.status(200).send("Account Created");
        });
    }
}

exports.reset = function(req, res) {
    let user_info = req.body;

    let table;
    if (user_info.type === "Volunteer") {
        table = "VOLUNTEER";
    } else {
        table = "ORGANIZER";
    }

    if (user_info.Verified === "false") {
        let token = getToken();
        let response_object = {
            "jwt": "",
            "id": "",
            "verification_token": "" + token
        }
        

        g.query("SELECT * FROM " + table + " WHERE EMAIL = ?", [user_info.email], function(result, fields) {
            if (result.length > 0) {
                const message = {
                    from: "Connect Hour <connecthourofficial@gmail.com>",
                    to: user_info.email,
                    subject: "Password change",
                    text: "Your token to reset your password is: " + token
                }

                g.transport.sendMail(message, function(err, info) {
                    if (err) throw err;
                    console.log(info);
                });

                res.send(response_object);
            } else {
                
                res.status(401).send("Account does not exist");
            }
        });
    } else {
        bcrypt.hash(user_info.new_password, 8, function(err, hash) {
    
            let query = "UPDATE " + table + " SET PASSWORD = ? WHERE EMAIL = ?;";
            g.query(query, [hash, user_info.email], function(err, result, fields) {
                res.send("success");
            });
        });
    }
}

exports.googleLogIn = function(req, res) {
    let user_info = req.body;

    let table;
    if (user_info.type === "Volunteer") {
        table = "VOLUNTEER_TAB";
    } else {
        table = "ORGANIZER_TAB";
    }

    let query = "select * from " + table + "_TAB where EMAIL = ?";
    let params = [user_info.Email];
    
    g.query(query, params, function(result, fields) {

        let token = getToken();
        let response_object = {
            "jwt": "",
            "id": "",
            "verification_token": "" + token
        }

        if (result.length > 0) {
            // Sign in
            try {
                response_object["jwt"] = jwt.encode({"uid": result[0]["ID"]}, "Group2");
                response_object["id"] = result[0]["ID"];

                res.send(response_object);
            } catch(error) {
                console.log(error);
                res.status(400).send(error);
            }
        } else {
            // Create entry in db then sign in
            if (table === "VOLUNTEER") {
                query = "INSERT INTO VOLUNTEER_TAB(FIRST_NAME,LAST_NAME,EMAIL) VALUES (?, ?, ?)"
                params = [user_info.Firsntame, user_info.Lastname, user_info.Email];
            } else {
                query = "INSERT INTO VOLUNTEER_TAB(NAME,EMAIL) VALUES (?, ?)"
                params = [user_info.Organization_name, user_info.Email];
            }

            try {
                g.query(query, params, function(result, fields) {

                    query = "SELECT ID FROM " + table + "_TAB WHERE EMAIL = ?"
                    params = [user_info.Email];

                    g.query(query, params, function(result, fields) {
                        try {
                            response_object["jwt"] = jwt.encode({"uid": result[0]["ID"]}, "Group2");
                            response_object["id"] = result[0]["ID"];

                            res.send(response_object);
                        } catch(error) {
                            console.log(error);
                            res.status(400).send(error);
                        }
                    });
                });
            } catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        }
    })
}

function verifyAccount(email, token) {
    g.transport.sendMail({
        from: "<connecthourofficial@gmail.com>",
        to: email,
        subject: "Verify your Email Address",
        text: "Enter the following code to verify your account: " + token
    }, function(err, info) {
        if (err) throw err;
        console.log(info);
    });
}

function getToken() {
    return Math.floor(Math.random() * (899998)) + 100001;
}