# INSERT INTO users (net_id, password, first_name, last_name, birthday, year, hometown, quad, degree, bio, insta, bday_cal) VALUES
# ('jq39', 'password', 'Jason', 'Qiu', '12262000', 3, 'Philadelphia, PA', 'cardinal', 'computer science', NULL, 'jsonqiu', DEFAULT),

import pandas as pd
import random
from faker import Faker
from random import randrange
from datetime import datetime
import numpy as np
import psycopg2
import string

# netid_initials = ['jz', 'at', 'mmm', 'jk', 'yoo', 'yee', 'nah', 'ikr', 'lol', 'dbd']
# netid_numbers = ['1', '472', '36', '27', '111', '99', '101', '124', '999', '777']
quads = ['cardinal', 'blue jay', 'dove', 'eagle', 'robin', 'raven', 'owl']
fake = Faker()
first_names = [fake.unique.first_name() for i in range(500)]
last_names = [fake.unique.last_name() for i in range(500)]
dict = {
    'net_id':[],
    'password':[],
    'first_name':[],
    'last_name':[],
    'birthday':[],
    'year':[],
    'hometown':[],
    'quad':[],
    'degree':[],
    'bio':[],
    'insta':[]
    #'bday_cal':[]
} 
df = pd.DataFrame(dict)

for i in range(500):
    #generate 4-character password
    password = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 4))
    
    #generate random first name
    first_name = first_names[i]
    #generate random last name
    last_name = last_names[i]
    
    #generate net_ID
    net_id = (first_name[:1] + last_name[:1] + str(i+1)).lower()

    #generate random birthday
    d1 = datetime.strptime(f'1/1/1999', '%m/%d/%Y')
    d2 = datetime.strptime(f'1/1/2004', '%m/%d/%Y')
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
    birthday = month_str + day_str + year_str
    
    #generate random year
    year = random.randint(1,4)
    
    #generate random hometown
    hometown = fake.city() + ", " + fake.country_code()
    
    #generate random quad
    quad = random.choice(quads)

    #generate random degree
    degree = "Undecided"

    #generate random bio
    bio = fake.sentence()

    #generate random bio
    insta = "@" + net_id

    #add to df
    df.loc[len(df.index)] = [net_id, password, first_name, last_name, birthday, year, hometown, quad, degree, bio, insta]

print(df)

#from sqlalchemy import create_engine
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
    query  = "INSERT INTO %s(%s) VALUES(%%s,%%s,%%s,%%s,%%s,%%s,%%s,%%s,%%s,%%s,%%s)" % (table, cols)
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

execute_many(conn, df, 'users')