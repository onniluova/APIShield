import time
import requests
from datetime import datetime, UTC
from app.models.checks_model import CheckModel

class CheckService():
    @staticmethod
    def perform_check(endpoint_id, url):
        start_time = time.time()
        
        try:
            response = requests.get(url, timeout=10)
            status_code = response.status_code
            is_up = 200 <= status_code < 400
        except: 
            status_code = 0
            is_up = False
        
        end_time = time.time()
        latency_ms = int((end_time - start_time) * 1000)
        checked_at = datetime.now(UTC)

        checked_id = CheckModel.save_check(endpoint_id, status_code, latency_ms, is_up, checked_at)

        return {
            "endpoint_id": endpoint_id,
            "status": status_code,
            "latency_ms": latency_ms,
            "is_up": is_up,
            "checked_at": checked_at.isoformat()
        }
    @staticmethod
    def check_anomaly(endpoint_id):
        conn = get_db_connection()
        try:
            cur = conn.cursor()

            cur.execute("""
                SELECT latency_ms FROM checks 
                WHERE endpoint_id = %s 
                ORDER BY checked_at DESC 
                LIMIT 10
            """, (endpoint_id,))
            
            rows = cur.fetchall()
            
            if not rows:
                return {"status": "no_data"}

            latencies = [row[0] for row in rows]
            avg_ms = sum(latencies) / len(latencies)
            latest_latency = latencies[0]

            if latest_latency > (avg_ms * 3):
                return {
                    "status": "anomaly",
                    "latest": latest_latency,
                    "average": int(avg_ms)
                }
            
            return {
                "status": "normal",
                "latest": latest_latency,
                "average": int(avg_ms)
            }
        finally:
            cur.close()
            conn.close()