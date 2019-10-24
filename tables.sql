-- Volunteer account info
CREATE TABLE VOLUNTEER_TAB(
    ID INT(11) NOT NULL AUTO_INCREMENT,
    FIRST_NAME VARCHAR(20) NOT NULL,
    LAST_NAME VARCHAR(30) NOT NULL,
    AGE INT CHECK (AGE >= 18),
    EMAIL VARCHAR(30) NOT NULL UNIQUE,
    CITY VARCHAR(30),
    STATE VARCHAR(30),
    PASSWORD VARCHAR(64) NOT NULL,
    VERIFIED BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ID)
);

-- Organizer account info
CREATE TABLE ORGANIZER_TAB(
    ID INT(11) NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(20) NOT NULL,
    EMAIL VARCHAR(30) NOT NULL UNIQUE,
    CITY VARCHAR(30),
    STATE VARCHAR(30),
    PASSWORD VARCHAR(64) NOT NULL,
    VERIFIED BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ID)
);

-- Events scheduled by organizers
CREATE TABLE EVENT(
    ID INT(11) NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(32) NOT NULL,
    DESCRIPTION VARCHAR(500),
    ORGANIZER INT(11),
    ORGNAME VARCHAR(20),
    STREETNUMBER INT(11),
    STREETNAME VARCHAR(30),
    CITY VARCHAR(30),
    STATE VARCHAR(30),
    ZIP VARCHAR(5),
    START DATETIME,
    END DATETIME,
    FOREIGN KEY (ORGANIZER) REFERENCES ORGANIZER_TAB(ID),
    PRIMARY KEY (ID)
);

-- Pairs of volunteers and events they are scheduled to attend
CREATE TABLE ATTENDING(
    VOLUNTEERID INT(11),
    EVENTID INT(11),
    FOREIGN KEY (VOLUNTEERID) REFERENCES VOLUNTEER_TAB(ID),
    FOREIGN KEY (EVENTID) REFERENCES EVENT(ID),
    PRIMARY KEY (VOLUNTEERID, EVENTID)
);
-- INSERT INTO VOLUNTEER_TAB VALUES(1,'Milan','Chheta',23,'mchheta@iu.edu','Mumbai','Maharashtra','abc456', FALSE);
-- INSERT INTO VOLUNTEER_TAB VALUES(2,'Luke','Lovett',23,'lalovett@iu.edu','Chicago','Illinois','xyz321', FALSE);
-- INSERT INTO VOLUNTEER_TAB VALUES(3,'Sonia','Kargutkar',26,'skargutk@iu.edu','Mumbai','Maharashtra','jkl446', FALSE);
-- INSERT INTO VOLUNTEER_TAB VALUES(4,'Bhakti','Narvekar',23,'bnarvekr@iu.edu','Bloomington','Indiana','efg569', FALSE);
-- INSERT INTO VOLUNTEER_TAB VALUES(5,'Bhumika','Agrawal',23,'bagrawal@iu.edu','Indore','Madhya Pradesh','zwe123', FALSE);

-- INSERT INTO ORGANIZER_TAB VALUES('O1','Alzheimer\'s Association','aa@gmail.com','Bloomington','Indiana','abc', FALSE);
-- INSERT INTO ORGANIZER_TAB VALUES('O2','American Cancer Society','acs@gmail.com','Bloomington','Indiana','xyz', FALSE);
-- INSERT INTO ORGANIZER_TAB VALUES('O3','Stepping Stones, Inc.','ssi@gmail.com','Bloomington','Indiana','123', FALSE);
-- INSERT INTO ORGANIZER_TAB VALUES('O4','Hope Housing & Restoration Center','hhr@gmail.com','Bloomingon','Indiana','456', FALSE);
-- INSERT INTO ORGANIZER_TAB VALUES('O5','Volunteers in Medicine','vim@gmail.com','Bloomington','Indiana','789', FALSE);
