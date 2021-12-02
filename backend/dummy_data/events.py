#INSERT INTO events (title, time, date, end_time, end_date, description, location, tags) VALUES
#('Spikeball Tournament', '1200', '09272021', '1400', '10102021', 'spikeball lit; winners get kool prizes; good good lots fun', 'Abele Quad', '{Sports}'),
#('Countdown to Craziness', '1200', '10102021', '1200', '10112021', 'Which quad is the craziest???', 'Cameron Indoor Stadium', '{Duke basketball}'),
import pandas as pd
import random
from faker import Faker
from random import randrange
from datetime import datetime
import numpy as np
import psycopg2

event_org_list = ['Basketball', 'Soccer', 'Spikeball', 'Computer Science', 'Statistical Science', 'AIV', 'DIIG', 'Simple Charity', 'DML']
event_type = ['Mixer', 'Rager', 'Party', 'Tournament', 'Kickback', 'Hackathon', 'Large Group', 'GBM', 'Interest Meeting']
num_events = 81
fake = Faker()
dict = {
    'title':[],
    'time':[],
    'date':[],
    'end_time':[],
    'end_date':[],
    'description':[],
    'location':[],
    'tags':[]
} 
df = pd.DataFrame(dict)

for i in range(num_events):
    #generate event title
    type_event = random.choice(event_type)
    title = random.choice(event_org_list) + " " + type_event
    #generate event start time
    hour = random.randint(0, 23)
    min = random.randint(0,59)
    if hour > 9:
        hour_str = str(hour)
    else:
        hour_str = '0' + str(hour)
    
    if min > 9:
        min_str = str(min)
    else:
        min_str = '0' + str(min)

    start_time = hour_str + min_str
    #generate event end time
    end_hour = random.randint(hour, 23)
    end_min = random.randint(min, 59)
    if end_hour > 9:
        end_hour_str = str(end_hour)
    else:
        end_hour_str = '0' + str(end_hour)
    
    if end_min > 9:
        end_min_str = str(end_min)
    else:
        end_min_str = '0' + str(end_min)

    end_time = end_hour_str + end_min_str
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
    #generate end date (got lazy)
    end_date = date_str
    #generate description
    description = fake.sentence()
    #location
    location_list = ['WU', 'Hollows A 3001', 'Bryant Center', 'Main Quad', 'Chapel', 'UNC', 'Panera']
    location = random.choice(location_list)
    #tag = title.split() ''.join(tag[-1])
    tags = [type_event]

    #add to df
    df.loc[len(df.index)] = [title, start_time, date_str, end_time, end_date, description, location, tags]

print(df)

#i'm guessing username: me, password: cs316, mydatabase: postgres
#engine = create_engine('postgresql://username:password@localhost:5432/mydatabase')
#engine = create_engine('postgresql://me:cs316@localhost:5432/postgres')
#df.to_sql('events_dummy2', engine)
param_dic = {
    "host"      : "localhost",
    "database"  : "quadex",
    "port"      : "5432",
    "user"      : "me",
    "password"  : "cs316"
}

def connect(params_dic):
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params_dic)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        sys.exit(1) 
    print("Connection successful")
    return conn

conn = connect(param_dic)

def execute_many(conn, df, table):
    """
    Using cursor.executemany() to insert the dataframe
    """
    # Create a list of tupples from the dataframe values
    tuples = [tuple(x) for x in df.to_numpy()]
    # Comma-separated dataframe columns
    cols = ','.join(list(df.columns))
    # SQL quert to execute
    query  = "INSERT INTO %s(%s) VALUES(%%s,%%s,%%s,%%s,%%s,%%s,%%s,%%s)" % (table, cols)
    cursor = conn.cursor()
    try:
        cursor.executemany(query, tuples)
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error: %s" % error)
        conn.rollback()
        cursor.close()
        return 1
    print("execute_many() done")
    cursor.close()

execute_many(conn, df, 'events')