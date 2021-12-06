from sqlalchemy import create_engine
import pandas as pd
import psycopg2
import random

#engine = create_engine('postgresql://me:cs316@localhost:5432/postgres')
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

#select all event ids
df_id = pd.read_sql_query('select id from events',con=conn)
#get list of quad names
quad_names = pd.read_sql_query('select name from quads', con=conn)
quad_list = quad_names['name'].tolist()
# create empty df to insert into quad_events
dict = {
    'quad_name':[],
    'event_id':[]
} 
df = pd.DataFrame(dict)

#create random combos of event ids and quads
for i in range(len(df_id)):
    id = df_id.iloc[i, 0]
    all_or_one = random.choice([0,1])
    if all_or_one == 0:
        random_quad = random.sample(quad_list, 1)
        df.loc[len(df.index)] = [random_quad, id]
    else:
        for q in quad_list:
            df.loc[len(df.index)] = [q, id]

print(df)

def execute_many(conn, df, table):
    """
    Using cursor.executemany() to insert the dataframe
    """
    # Create a list of tupples from the dataframe values
    tuples = [tuple(x) for x in df.to_numpy()]
    # Comma-separated dataframe columns
    cols = ','.join(list(df.columns))
    # SQL quert to execute
    query  = "INSERT INTO %s(%s) VALUES(%%s,%%s)" % (table, cols)
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

execute_many(conn, df, 'quad_events')