from app.db_conn import get_db_connection

class CheckModel:
    @staticmethod
    def save_check(endpoint_id, status, latency, is_up, checked_at):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            query = """
                INSERT INTO checks (endpoint_id, status_code, latency_ms, is_up, checked_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """
            cur.execute(query, (endpoint_id, status, latency, is_up, checked_at))
            check_id = cur.fetchone()[0]
            conn.commit()
            return check_id
        finally:
            cur.close()
            conn.close()