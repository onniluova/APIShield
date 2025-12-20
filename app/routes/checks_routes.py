from flask import Blueprint, request, jsonify
from app.auth import tokenRequired
from app.models.endpoint_model import EndpointModel
from app.services.check_service import CheckService

checks_bp = Blueprint('checks', __name__)

@checks_bp.route('/runUrl', methods=['POST'])
@tokenRequired
def runUrl(current_user):
    data = request.get_json()
    endpoint_id = data.get('endpoint_id')

    endpoint_row = EndpointModel.get_by_id(endpoint_id)
    if not endpoint_row:
        return jsonify({"error": "Endpoint not found"}), 404
    
    if endpoint_row[0] != int(current_user['user_id']):
        return jsonify({"error": "Unauthorized"}), 403

    url = endpoint_row[1]
    result = CheckService.perform_check(endpoint_id, url)

    return jsonify({"message": "Check complete", "data": result}), 200

@checks_bp.route('/latencyAnomalyCheck', methods=['POST'])
@tokenRequired
def runAnomalyCheck(current_user):
    data = request.get_json()
    endpoint_id = data.get('endpoint_id')
    
    endpoint_row = EndpointModel.get_by_id(endpoint_id)
    if not endpoint_row or endpoint_row[0] != int(current_user['user_id']):
        return jsonify({"error": "Unauthorized"}), 403

    result = CheckService.check_anomaly(endpoint_id)

    if result['status'] == 'anomaly':
        return jsonify({
            "error": "High latency detected",
            "details": result
        }), 500
    
    return jsonify({"status": "normal", "data": result}), 200