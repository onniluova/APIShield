import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

pg_pool = None

def init_db_pool():
    """Alustaa yhteyspoolin. Kutsutaan app.py:ssä kerran."""
    global pg_pool
    
    url = os.getenv("DATABASE_URL")
    if not url:
        dbname = os.getenv("DB_NAME")
        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
        host = "localhost"
        url = f"postgresql://{user}:{password}@{host}/{dbname}"

    if url and url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    pg_pool = psycopg2.pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=20,
        dsn=url
    )

@contextmanager
def get_db_connection():
    """
    Context manager, joka hakee yhteyden poolista ja palauttaa sen automaattisesti.
    Käyttö: with get_db_connection() as conn: ...
    """
    global pg_pool
    if not pg_pool:
        init_db_pool()
        
    conn = pg_pool.getconn()
    try:
        yield conn
    finally:
        pg_pool.putconn(conn)