INSERT INTO quads VALUES
('raven', '{Craven, Bassett, Pegram}'),
('cardinal', '{Crowell, Giles, Wilson}'),
('eagle', '{Edens, Bell Tower, Trinity}'),
('robin', '{Few, Gilbert-Addoms, Southgate}'),
('blue jay', '{Keohane, Blackwell, Randolph}'),
('owl', '{Kilgo, Alspaugh, Brown}'),
('dove', '{Wannamaker, East House, West House}');

INSERT INTO users VALUES
('jq39', 'password', 'Jason', 'Qiu', '12262000', 3, 'Philadelphia, PA', 'cardinal', 'computer science', NULL, 'jsonqiu', DEFAULT),
('ajl88', 'psswrd', 'Andrew', 'Lee', '12241999', 4, 'Centreville, VA', 'blue jay', 'economics', NULL, 'andrewandylee', DEFAULT),
('rz97', 'word', 'Ray', 'Zhang', '10102001', 3, 'Beijing, China', 'dove', 'biophysics', NULL, 'roastyraybaybay', DEFAULT),
('dp239', 'yeet', 'Donghan', 'park', '03092001', 3, 'palisades park, NJ', 'eagle', 'ECE/CS', NULL, 'dongimon', DEFAULT);

INSERT INTO admin VALUES
('rz97', 'Resident Assistant', 'rz97@duke.edu'),
('dp239', 'Resident Assistant', 'dp239@duke.edu');

INSERT INTO points (net_id, date, point_value, reason) VALUES
('dp239', '09022021', 5, 'Attended open house');

INSERT INTO events (title, time, date, end_time, end_date, description, location, tags) VALUES
('spikeball tournament', '1200', '09272021', '1400', '10102021', 'spikeball lit; winners get kool prizes; good good lots fun', 'Abele Quad', '{Sports}'),
('countdown to craziness', '1200', '10102021', '1200', '10112021', 'Which quad is the craziest???', 'Cameron Indoor Stadium', '{Duke basketball}'),
('hack duke 2021', '0800', '11232021', '1800', '11242021', 'have a good time hackin!', 'Bostock Library', '{Social, Hackathon}'),
('andrew''s birthday', '0000', '12242021', '1159', '12242021', 'yayayay; happy bdayz; much old', 'hollows a3001', '{Social}'),
('thanksgiving break', '0000', '11242021', '1159', '11282021', 'wow; much fun; good break; eat some good turkey, yum yum', null, '{holiday}');

INSERT INTO favorited_events VALUES
('dp239', 4);

-- run quad_events.py to generate these values instead...
INSERT INTO quad_events VALUES
('raven', 1),
('cardinal', 1),
('eagle', 1),
('robin', 1),
('blue jay', 1),
('owl', 1),
('dove', 1),
('raven', 2),
('cardinal', 2),
('eagle', 2),
('robin', 2),
('blue jay', 2),
('owl', 2),
('dove', 2),
('raven', 3),
('cardinal', 3),
('eagle', 3),
('robin', 3),
('blue jay', 3),
('owl', 3),
('dove', 3),
('raven', 4),
('cardinal', 4),
('eagle', 4),
('robin', 4),
('blue jay', 4),
('owl', 4),
('dove', 4),
('raven', 5),
('cardinal', 5),
('eagle', 5),
('robin', 5),
('blue jay', 5),
('owl', 5),
('dove', 5);