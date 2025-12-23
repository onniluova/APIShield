from flask import Blueprint, request, jsonify
from app.auth import tokenRequired
from app.models.endpoint_model import EndpointModel
from app.models.checks_model import CheckModel
from app.services.check_service import CheckService

endpoints_bp = Blueprint('endpoints', __name__)

@endpoints_bp.route('/addEndpoint', methods=['POST'])
@tokenRequired
def addEndpoint(current_user):
    data = request.get_json()
    user_id = current_user['user_id']
    url = data.get('url')
    name = data.get('name')

    if not url or not name:
        return jsonify({"error": "Missing url or name"}), 400

    new_id = EndpointModel.create(user_id, url, name)

    if not new_id:
        return jsonify({"error": "This endpoint already exists."}), 400

    CheckService.perform_check(new_id, url)
    
    return jsonify({
        "message": "Endpoint created successfully",
        "endpoint_id": new_id,
    }), 201

@endpoints_bp.route('/getEndpoints', methods=['GET'])
@tokenRequired
def getEndpoints(current_user):
    user_id = current_user['user_id']

    if not user_id:
        return jsonify({"error": "Missing user ID"}), 400

    endpoints = EndpointModel.get_all_endpoints(user_id)

    if not endpoints:
        return jsonify({"error": "This user has no endpoints"}), 400
    
    return jsonify({
        "message": "Endpoints fetched succesfully",
        "endpoints": endpoints
    }), 201

@endpoints_bp.route('/<int:id>/stats', methods=['GET'])
@tokenRequired
def get_endpoint_stats(current_user, id):
    user_id = current_user['user_id']
    
    endpoint = EndpointModel.get_by_id(id)

    if not endpoint or endpoint['user_id'] != user_id:
         return jsonify({"error": "Endpoint not found or unauthorized"}), 403

    history = CheckModel.get_recent_checks(id, limit=20)
    uptime = CheckModel.get_uptime_stats(id)

    return jsonify({
        "history": history,
        "uptime": uptime,
        "endpoint_name": endpoint['name'],
        "endpoint_url": endpoint['url']
    }), 200