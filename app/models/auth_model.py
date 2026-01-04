from app.db_conn import get_db_connection
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash
import random
import string

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
    def login(u_name, u_pass):
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor()

            query = ("SELECT id, password, role FROM users WHERE username = %s;")
            cur.execute(query, (u_name,))
            user = cur.fetchone()

            return user
        finally:
            cur.close()
            conn.close()

    
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

    @staticmethod
    def delete_user(id):
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor()

            query = ("DELETE FROM users where id = %s")
            cur.execute(query, (id,))

            rows_deleted = cur.rowcount

            conn.commit()
            return rows_deleted
        except Exception as e:
            print(f"Error deleting user: {e}")
            if conn: conn.rollback()
            raise e
        finally:
            if cur: cur.close()
            if conn: conn.close()
    
    @staticmethod
    def get_or_create_google_user(google_id, email, name):
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)

            cur.execute("SELECT id, username, role FROM users WHERE google_id = %s;", (google_id,))
            user = cur.fetchone()

            if user:
                return user

            base_name = name.replace(" ", "") if name else "User"
            random_suffix = ''.join(random.choices(string.digits, k=4))
            username = f"{base_name}{random_suffix}"

            query = """
                INSERT INTO users (username, email, google_id, role) 
                VALUES (%s, %s, %s, 'user') 
                RETURNING id, username, role;
            """
            cur.execute(query, (username, email, google_id))
            new_user = cur.fetchone()
            
            conn.commit()
            return new_user

        except Exception as e:
            print(f"Error in google auth: {e}")
            if conn: conn.rollback()
            raise e
        finally:
            if cur: cur.close()
            if conn: conn.close()