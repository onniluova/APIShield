from app.db_conn import get_db_connection
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash

class AuthModel:
    @staticmethod
    def get_users():
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('SELECT id, username, role FROM users;')
            users = cur.fetchall()

            return users

        finally:
            cur.close()
            conn.close()
    
    @staticmethod
    def create_user(u_name, u_pass):
        hashed_password = generate_password_hash(u_pass)

        try:
            conn = get_db_connection()
            cur = conn.cursor()

            query = ("INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;")

            cur.execute(query, (u_name, hashed_password))

            new_id = cur.fetchone()[0]
            conn.commit()

            return new_id

        finally:
            cur.close()
            conn.close()