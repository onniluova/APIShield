from app.db_conn import get_db_connection

class EndpointModel:
    @staticmethod
    def create(user_id, url, name):
        conn = get_db_connection()
        cur = conn.cursor()
        try:

            cur.execute("SELECT id FROM endpoints WHERE name=%s AND url=%s", (name, url))
            if cur.fetchone():
                return None

            query = """
                INSERT INTO endpoints (user_id, url, name)
                VALUES (%s, %s, %s)
                RETURNING id;
            """
            cur.execute(query, (user_id, url, name))
            new_id = cur.fetchone()[0]
            conn.commit()
            return new_id
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_by_id(endpoint_id):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute('SELECT user_id, url FROM endpoints WHERE id = %s', (endpoint_id,))
            return cur.fetchone()
        finally:
            cur.close()
            conn.close()