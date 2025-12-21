from flask import Blueprint, request, jsonify
from app.auth import tokenRequired
from app.models.endpoint_model import EndpointModel
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
    
    return jsonify({
        "message": "Endpoint created successfully",
        "endpoint_id": new_id,
    }), 201

@endpoints_bp.route('/runUrl', methods=['POST'])
@tokenRequired
def runUrl(current_user):
    data = request.get_json()
    endpoint_id = data.get('endpoint_id')

    endpoint_row = EndpointModel.get_by_id(endpoint_id)

    if not endpoint_row:
        return jsonify({"error": "Not a valid endpoint"}), 400

    user_id = endpoint_row[0]
    url = endpoint_row[1]

    if user_id != int(current_user['user_id']):
        return jsonify({"error": "Unauthorized access"}), 403

    result = CheckService.perform_check(endpoint_id, url)

    return jsonify({
        "message": "Data check ran.",
        "data": result,
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