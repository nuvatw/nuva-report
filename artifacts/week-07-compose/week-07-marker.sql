select
  current_database() as database_name,
  current_user as database_user,
  count(*) filter (where schemaname = 'public') as public_table_count
from pg_tables;
