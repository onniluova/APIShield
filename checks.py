from db_conn import get_db_connection
from flask import Flask, jsonify, request

def checkForLatencyAnomaly(current_user):
    data = request.get_json()
    endpoint_id = data.get('endpoint_id')
    
    conn = None 

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute('SELECT latency_ms FROM checks WHERE endpoint_id = %s ORDER BY checked_at DESC LIMIT 10;', (endpoint_id,))
        rows = cur.fetchall()
        
        if not rows:
            return jsonify({"message": "No data to analyze"}), 200

        latencies = [row[0] for row in rows]
        avg_ms = sum(latencies) / len(latencies)
        latest_latency = latencies[0]

        if latest_latency > (avg_ms * 3):
            response = jsonify({
                "error": "High latency detected",
                "details": f"Current: {latest_latency}ms, Average: {int(avg_ms)}ms"
            })
            status = 500
        else:
            response = jsonify({
                "status": "normal",
                "average_ms": int(avg_ms),
                "latest_ms": latest_latency
            })
            status = 200

        cur.close()
        conn.close()
        
        return response, status

    except Exception as e:
        if conn: conn.close()
        return jsonify({"error": str(e)}), 500