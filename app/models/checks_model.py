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
    def get_recent_checks(endpoint_id, start_date=None, end_date=None, limit=10):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        sql_parts = ["SELECT status_code, latency_ms, is_up, checked_at FROM checks WHERE endpoint_id = %s"]
        params = [endpoint_id]

        if start_date:
            sql_parts.append("AND checked_at >= %s")
            params.append(start_date)

        if end_date:
            sql_parts.append("AND checked_at <= %s")
            params.append(f"{end_date} 23:59:59")

        sql_parts.append("ORDER BY checked_at DESC LIMIT %s")
        params.append(limit)

        query = " ".join(sql_parts)
        
        cur.execute(query, tuple(params))
        results = cur.fetchall()
        
        cur.close()
        conn.close()
        return results[::-1]

    @staticmethod
    def get_uptime_stats(endpoint_id):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                COUNT(*) as total_checks,
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
    
    @staticmethod
    def delete_old_checks():
        conn = get_db_connection()
        cur = conn.cursor()
        
        try: 
            query = """
                DELETE FROM checks WHERE checked_at < (NOW() - INTERVAL '7 days')
            """
            cur.execute(query)
            conn.commit()

            return cur.rowcount
        
        finally:
            cur.close()
            conn.close()