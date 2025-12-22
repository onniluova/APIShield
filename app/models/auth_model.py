from app.db_conn import get_db_connection
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash

class AuthModel:
    @staticmethod
    def get_users():
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('SELECT id, username, role FROM users;')
            users = cur.fetchall()
            return users
        except Exception as e:
            print(f"Error fetching users: {e}")
            raise e
        finally:
            if cur: cur.close()
            if conn: conn.close()
    
    @staticmethod
    def create_user(u_name, u_pass):
        conn = None
        cur = None
        try:
            hashed_password = generate_password_hash(u_pass)
            conn = get_db_connection()
            cur = conn.cursor()

            query = ("INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;")
            cur.execute(query, (u_name, hashed_password))

            new_id = cur.fetchone()[0]
            conn.commit()
            return new_id
        except Exception as e:
            print(f"Error creating user: {e}")
            if conn: conn.rollback()
            raise e
        finally:
            if cur: cur.close()
            if conn: conn.close()