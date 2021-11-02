INSERT INTO quads VALUES
('Raven', '{Craven, Bassett, Pegram}'),
('Cardinal', '{Crowell, Alspaugh, Brown}'),
('Eagle', '{Edens, Bell Tower, Trinity}'),
('Robin', '{Few, Gilbert-Addoms, Southgate}'),
('Blue Jay', '{Keohane, Blackwell, Randolph}'),
('Owl', '{Kilgo, Giles, Wilson}'),
('Dove', '{Wannamaker, East House, West House}');

INSERT INTO users VALUES
('jq39', 'password', 'Jason', 'Qiu', '12262000', 3, 'Philadelphia, PA', 'Cardinal', 'Computer Science', NULL, '@jsonqiu', DEFAULT),
('Price', 'p1', 'Vince', 'Price', '01012001', NULL, NULL, NULL, NULL, NULL, NULL, FALSE),
('ajl88', 'psswrd', 'Andrew', 'Lee', '12241999', 4, 'Centreville, VA', 'Blue Jay', 'Economics', NULL, '@andrewandylee', DEFAULT),
('rz97', 'word', 'Ray', 'Zhang', '10102001', 3, 'Beijing, China', 'Dove', 'Biophysics', NULL, '@roastyraybaybay', DEFAULT);

INSERT INTO admin VALUES
('Price', 'President', 'president@duke.edu'),
('rz97', 'RA', 'rz97@duke.edu');

INSERT INTO points (netID, date, point_value, reason) VALUES
('jq39', '01012021', 5, 'Attended open house'),
('ajl88', '01012021', 10, 'Attended quad town hall'),
('rz97', '01012021', 50, 'Won best junior RA');

INSERT INTO events (title, time, date, description, location, tags) VALUES
('Spikeball Tournament', '1200', '10102021', NULL, 'Abele Quad', '{Sports}'),
('Countdown to Craziness', '1200', '10102021', 'Which quad is the craziest???', 'Cameron Indoor Stadium', '{Duke basketball}');

INSERT INTO favorited_events VALUES
('ajl88', );

INSERT INTO quad_events VALUES
('Blue Jay', );

INSERT INTO points_earned_by VALUES
('jq39', );