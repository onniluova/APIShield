import random
import string
import json
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash
from app.db_conn import get_db_connection

class AuthModel:
    
    @staticmethod
    def get_users():
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT id, username, email, role FROM users")
                return cur.fetchall()

    @staticmethod
    def login(u_name):
        # Huom: login-metodi vain hakee käyttäjän, hash-tarkistus tehdään routessa
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = "SELECT id, password, role, settings FROM users WHERE username = %s;"
                cur.execute(query, (u_name,))
                return cur.fetchone()

    @staticmethod
    def create_user(u_name, u_pass):
        hashed_password = generate_password_hash(u_pass)
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;"
                cur.execute(query, (u_name, hashed_password))
                new_id = cur.fetchone()[0]
                conn.commit()
                return new_id

    @staticmethod
    def delete_user(user_id):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
                rows_deleted = cur.rowcount
                conn.commit()
                return rows_deleted

    @staticmethod
    def update_user_settings(user_id, new_settings):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = """
                    UPDATE users 
                    SET settings = settings || %s 
                    WHERE id = %s
                    RETURNING settings;
                """
                cur.execute(query, (json.dumps(new_settings), user_id))
                updated_settings = cur.fetchone()[0]
                conn.commit()
                return updated_settings

    @staticmethod
    def get_or_create_google_user(google_id, email, name):
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # 1. Etsi käyttäjä
                cur.execute("SELECT id, username, role, settings FROM users WHERE google_id = %s;", (google_id,))
                user = cur.fetchone()
                if user:
                    return user

                # 2. Jos ei löydy, luodaan uusi
                base_name = name.replace(" ", "") if name else "User"
                username = f"{base_name}{''.join(random.choices(string.digits, k=4))}"

                query = """
                    INSERT INTO users (username, email, google_id, role) 
                    VALUES (%s, %s, %s, 'user') 
                    RETURNING id, username, role;
                """
                cur.execute(query, (username, email, google_id))
                new_user = cur.fetchone()
                conn.commit()
                return new_user

    @staticmethod
    def save_refresh_token(user_id, refresh_token):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET refresh_token = %s WHERE id = %s", (refresh_token, user_id))
                conn.commit()

    @staticmethod
    def get_stored_refresh_token(user_id):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT refresh_token FROM users WHERE id = %s", (user_id,))
                token = cur.fetchone()
                return token[0] if token else None

    @staticmethod
    def clear_refresh_token(user_id):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE users SET refresh_token = NULL WHERE id = %s", (user_id,))
                conn.commit()