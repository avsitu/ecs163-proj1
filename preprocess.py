import psycopg2
import sys
import numpy as np
import csv 

conn_string = "host='localhost' dbname='postgres' user='postgres' password='password'"
conn = psycopg2.connect(conn_string)
cursor = conn.cursor()
print "Connected!\n"

def ImportTable():
	query = '''
	DROP TABLE IF EXISTS public.ecs163_proj1;
	CREATE TABLE public.ecs163_proj1
	(
	  "satisfaction_level" real,
	  "last_evaluation" real,
	  "number_project" int,
	  "average_monthly_hours" int,	
	  "time_spend_company" int,
	  "Work_accident" int,
	  "is_left" int,
	  "promotion_last_5years" int,	
	  "department" text,
	  "salary" text
	);'''

	cursor.execute(query)
	cursor.execute("COPY ecs163_proj1 FROM '/home/alvin/Downloads/HR_comma_sep.csv' DELIMITER ',' CSV HEADER;")
	conn.commit()

def graph1():
	cursor.execute("SELECT DISTINCT(department) FROM ecs163_proj1")
	depts = cursor.fetchall()
	for d in depts:
		cursor.execute("SELECT COUNT(department) FROM ecs163_proj1 WHERE department='%s';"%d[0])
		total = cursor.fetchone()[0]
		cursor.execute("SELECT COUNT(department) FROM ecs163_proj1 WHERE department='%s' AND is_left=1;"%d[0])
		left = cursor.fetchone()[0]
		print '%s: %f' %(d[0],float(left)/total)

def graph4():
	f_in = csv.writer(open('data/graph4.csv', 'w'), lineterminator='\n')
	f_in.writerow(['dept', 'min', '25th', '50th', '75th', 'max','min', '25th', '50th', '75th', 'max'])
	cursor.execute("SELECT DISTINCT(department) FROM ecs163_proj1")
	depts = map(lambda d: d[0], cursor.fetchall())
	for d in depts:
		row = [d]
		cursor.execute("SELECT average_monthly_hours FROM ecs163_proj1 WHERE department='%s' and is_left=0" %d)
		hours_stayed = map(lambda d: d[0], cursor.fetchall())
		cursor.execute("SELECT average_monthly_hours FROM ecs163_proj1 WHERE department='%s' and is_left=1" %d)
		hours_left = map(lambda d: d[0], cursor.fetchall())
		for p in [0, 25, 50, 75, 100]:
			row.append(np.percentile(hours_stayed, p))
		for p in [0, 25, 50, 75, 100]:
			row.append(np.percentile(hours_left, p))
		f_in.writerow(row)
# ImportTable()

graph4()