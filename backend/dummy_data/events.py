#INSERT INTO events (title, time, date, description, location, tags) VALUES
#('Spikeball Tournament', '1200', '10102021', NULL, 'Abele Quad', '{Sports}'),
#('Countdown to Craziness', '1200', '10102021', 'Which quad is the craziest???', 'Cameron Indoor Stadium', '{Duke basketball}');
import pandas as pd
import random
from faker import Faker
from random import randrange
from datetime import datetime

event_org_list = ['Basketball', 'Soccer', 'Spikeball', 'Computer Science', 'Statistical Science', 'AIV', 'DIIG', 'Simple Charity', 'DML']
event_type = ['Mixer', 'Rager', 'Party', 'Tournament', 'Kickback', 'Hackathon', 'Large Group', 'GBM', 'Interest Meeting']
num_events = 500
fake = Faker()
dict = {
    'title':[],
    'time':[],
    'date':[],
    'description':[],
    'location':[],
    'tags':[]
} 
df = pd.DataFrame(dict)

for i in range(num_events):
    #generate event title
    title = random.choice(event_org_list) + " " + random.choice(event_type)
    #generate event start time
    hour = random.randint(0, 23)
    min = random.randint(0,59)
    start_time = str(hour)+str(min)
    #generate event end time
    end_hour = random.randint(hour, 23)
    end_min = random.randint(min, 59)
    end_time = str(end_hour) + str(end_min)
    #generate event date
    d1 = datetime.strptime(f'1/1/2021', '%m/%d/%Y')
    d2 = datetime.strptime(f'1/1/2023', '%m/%d/%Y')
    date = fake.date_between(d1, d2)
    month = date.month
    day = date.day
    year = date.year
    
    year_str = str(year)
    if month > 9:
        month_str = str(month)
    else:
        month_str = '0' + str(month)
    
    if day > 9:
        day_str = str(day)
    else:
        day_str = '0' + str(day)
    date_str = month_str + day_str + year_str
    #generate description
    description = fake.sentence()
    #location
    location_list = ['WU', 'Hollows A 3001', 'Bryant Center', 'Main Quad', 'Chapel', 'UNC', 'Panera']
    location = random.choice(location_list)
    #tags - tbd

    #add to df
    df.loc[len(df.index)] = [title, start_time, end_time, date_str, description, location, None]

print(df)

from sqlalchemy import create_engine
#i'm guessing username: me, password: cs316, mydatabase: postgres
#engine = create_engine('postgresql://username:password@localhost:5432/mydatabase')
engine = create_engine('postgresql://me:cs316@localhost:5432/postgres')
df.to_sql('events_dummy', engine)