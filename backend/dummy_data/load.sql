-- Some initial data to play with.  These INSERT statements should succeed.
-- Do NOT modify this section.
INSERT INTO People VALUES
  (0, 'Albus Dumbledore', 'Fawkes the phoenix', 'Thestral tail-hair'),
  (1, 'Minerva McGonagall', NULL, 'dragon heartstring'),
  (2, 'Pomona Sprout', NULL, NULL),
  (3, 'Filius Flitwick', NULL, NULL),
  (4, 'Severus Snape', NULL, NULL);
INSERT INTO Teacher VALUES
  (0), (1), (2), (3), (4);
INSERT INTO House VALUES
  ('Gryffindor', 1),
  ('Hufflepuff', 2),
  ('Ravenclaw', 3),
  ('Slytherin', 4);
INSERT INTO People VALUES
  (11, 'Harry Potter', 'Hedwig the owl', 'phoenix feather'),
  (12, 'Hermione Granger', 'Crookshanks the cat', 'dragon heartstring'),
  (13, 'Ron Weasley', 'Scabbers the rat', 'unicorn tail hair'),
  (21, 'Cedric Diggory', NULL, 'unicorn hair'),
  (22, 'Laura Madley', NULL, NULL),
  (31, 'Cho Chang', NULL, NULL),
  (32, 'Luna Lovegood', NULL, NULL),
  (41, 'Draco Malfoy', 'eagle owl', 'dragon heartstring'),
  (42, 'Marcus Flint', NULL, NULL);
INSERT INTO Student VALUES
  (11, 1991, 'Gryffindor'),
  (12, 1991, 'Gryffindor'),
  (13, 1991, 'Gryffindor'),
  (21, 1989, 'Hufflepuff'),
  (22, 1994, 'Hufflepuff'),
  (31, 1990, 'Ravenclaw'),
  (32, 1992, 'Ravenclaw'),
  (41, 1991, 'Slytherin'),
  (42, 1986, 'Slytherin');
INSERT INTO Deed(student_id, datetime, points, description) VALUES
  (11, '1991-09-06 10:00:00', -1, 'Cheekiness'),
  (12, '1991-10-31 13:00:00', -5, 'Claimed to have gone looking for the troll'),
  (11, '1991-10-31 18:00:00', 5, 'For saving Hermione from the troll'),
  (13, '1991-10-31 18:00:00', 5, 'For saving Hermione from the troll'),
  (41, '1992-02-22 07:00:00', -20, 'Wandering the corridors at night'),
  (12, '1992-09-02 11:30:00', 10, 'Getting full marks on Lockhart''s quiz'),
  (13, '1993-10-10 15:30:00', -50, 'For throwing a crocodile heart at Draco Malfoy');
INSERT INTO Subject VALUES
  ('Charms'),
  ('Defence against the Dark Arts'),
  ('Arithmancy'),
  ('Potions'),
  ('Transfiguration');
INSERT INTO Offering
(SELECT 'Charms', year, 3
 FROM generate_series(1986, 1998) as year);
INSERT INTO Offering VALUES('Defence against the Dark Arts', 1996, 4);
INSERT INTO Offering
(SELECT 'Potions', year, 4
 FROM generate_series(1986, 1995) as year);
INSERT INTO Offering VALUES('Transfiguration', 1955, 0);
INSERT INTO Offering
(SELECT 'Transfiguration', year, 1
 FROM generate_series(1986, 1998) as year);
INSERT INTO Grade VALUES
  (13, 'Potions', 1992, 'P'),
  (13, 'Potions', 1993, 'T'),
  (13, 'Transfiguration', 1994, 'P');
INSERT INTO FavoriteSubject VALUES
  (11, 'Defence against the Dark Arts'),
  (12, 'Arithmancy'),
  (13, 'Charms'),
  (21, 'Defence against the Dark Arts'),
  (31, 'Charms'),
  (41, 'Potions');
