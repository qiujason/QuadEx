INSERT INTO quads VALUES
('raven', '{Craven, Bassett, Pegram}'),
('cardinal', '{Crowell, Alspaugh, Brown}'),
('eagle', '{Edens, Bell Tower, Trinity}'),
('robin', '{Few, Gilbert-Addoms, Southgate}'),
('blue jay', '{Keohane, Blackwell, Randolph}'),
('owl', '{Kilgo, Giles, Wilson}'),
('dove', '{Wannamaker, East House, West House}');

INSERT INTO users VALUES
('jq39', 'password', 'Jason', 'Qiu', '12262000', 3, 'Philadelphia, PA', 'cardinal', 'computer science', NULL, 'jsonqiu', DEFAULT),
('ajl88', 'psswrd', 'Andrew', 'Lee', '12241999', 4, 'Centreville, VA', 'blue jay', 'economics', NULL, 'andrewandylee', DEFAULT),
('rz97', 'word', 'Ray', 'Zhang', '10102001', 3, 'Beijing, China', 'dove', 'biophysics', NULL, 'roastyraybaybay', DEFAULT),
('dp239', 'yeet', 'Donghan', 'park', '03092001', 3, 'palisades park, NJ', 'eagle', 'ECE/CS', NULL, 'dongimon', DEFAULT);

INSERT INTO admin VALUES
('Price', 'President', 'president@duke.edu'),
('rz97', 'RA', 'rz97@duke.edu');

INSERT INTO points (net_id, date, point_value, reason) VALUES
('jq39', '01012021', 5, 'Attended open house'),
('ajl88', '01012021', 10, 'Attended quad town hall'),
('rz97', '01012021', 50, 'Won best junior RA');

INSERT INTO events (title, time, date, end_time, end_date, description, location, tags) VALUES
('Spikeball Tournament', '1200', '09272021', '1400', '10102021', 'spikeball lit; winners get kool prizes; good good lots fun', 'Abele Quad', '{Sports}'),
('Countdown to Craziness', '1200', '10102021', '1200', '10112021', 'Which quad is the craziest???', 'Cameron Indoor Stadium', '{Duke basketball}'),
('HACK DUKE 2021', '0800', '11232021', '1800', '11082021', 'have a good time hackin!', 'Bostock Library', '{Social, Hackathon}'),
('andrew''s birthday', '0000', '12242021', '1159', '12242021', 'yayayay; happy bdayz; much old', 'hollows a3001', '{Social}'),
('thanksgiving break', '0000', '11242021', '1159', '11282021', 'wow; much fun; good break; eat some good turkey, yum yum', null, '{holiday}');

INSERT INTO favorited_events VALUES
('ajl88', 1), 
('ajl88', 2),
('ajl88', 3),
('ajl88', 4),
('ajl88', 5),
('dp239', 1),
('dp239', 2),
('dp239', 4),
('dp239', 5),
('jq39', 2),
('jq39', 4),
('jq39', 5);

INSERT INTO quad_events VALUES
('Blue Jay', 2);

INSERT INTO points_earned_by VALUES
('jq39', );