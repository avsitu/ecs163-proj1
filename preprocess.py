import psycopg2
import sys
 
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

ImportTable()
# cursor.execute("SELECT DISTINCT(department) FROM ecs163_proj1")
# depts = cursor.fetchall()
# for d in depts:
# 	cursor.execute("SELECT COUNT(department) FROM ecs163_proj1 WHERE department='%s';"%d[0])
# 	total = cursor.fetchone()[0]
# 	cursor.execute("SELECT COUNT(department) FROM ecs163_proj1 WHERE department='%s' AND is_left=1;"%d[0])
# 	left = cursor.fetchone()[0]
# 	print '%s: %f' %(d[0],float(left)/total)