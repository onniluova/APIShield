from flask import Blueprint, request, jsonify, make_response
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
        return jsonify({"message": "This user has no endpoints"}), 200
    
    return jsonify({
        "message": "Endpoints fetched succesfully",
        "endpoints": endpoints
    }), 201

@endpoints_bp.route('/<int:endpoint_id>/delete', methods=['DELETE'])
@tokenRequired
def deleteEndpoint(current_user, endpoint_id):
    user_id = current_user['user_id']

    endpoint = EndpointModel.get_by_id(endpoint_id)

    if not endpoint or endpoint['user_id'] != user_id:
         return jsonify({"error": "Endpoint not found or unauthorized"}), 403

    EndpointModel.delete_endpoint(endpoint_id)
    
    return jsonify({
        "message": f"Endpoint {endpoint_id} deleted succesfully.",
    }), 201 

@endpoints_bp.route('/<int:id>/stats', methods=['GET'])
@tokenRequired
def get_endpoint_stats(current_user, id):
    user_id = current_user['user_id']
    
    endpoint = EndpointModel.get_by_id(id)

    if not endpoint or endpoint['user_id'] != user_id:
         return jsonify({"error": "Endpoint not found or unauthorized"}), 403

    start_date = request.args.get('start_date') 
    end_date = request.args.get('end_date')
    limit = request.args.get('limit', default=20, type=int)

    history = CheckModel.get_recent_checks(id, limit=limit, start_date=start_date, end_date=end_date)

    uptime = CheckModel.get_uptime_stats(id)

    response = make_response(jsonify({
        "history": history,
        "uptime": uptime,
        "endpoint_name": endpoint['name'],
        "endpoint_url": endpoint['url']
    }))

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response