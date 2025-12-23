from app.db_conn import get_db_connection
from psycopg2.extras import RealDictCursor

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
    
    @staticmethod
    def get_recent_checks(endpoint_id, limit=50):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT status_code, latency_ms, is_up, checked_at 
            FROM checks 
            WHERE endpoint_id = %s 
            ORDER BY checked_at ASC 
            LIMIT %s
        """
        
        cur.execute(query, (endpoint_id, limit))
        results = cur.fetchall()
        
        cur.close()
        conn.close()
        return results

    @staticmethod
    def get_uptime_stats(endpoint_id):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                COUNT(*) as total_checks,
                -- FIX: Compare is_up to TRUE, not 1
                SUM(CASE WHEN is_up = TRUE THEN 1 ELSE 0 END) as successful_checks
            FROM checks 
            WHERE endpoint_id = %s
        """
        
        cur.execute(query, (endpoint_id,))
        stats = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not stats or stats['total_checks'] == 0:
            return 0
            
        return round((stats['successful_checks'] / stats['total_checks']) * 100, 2)