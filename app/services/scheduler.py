import time
import requests
from datetime import datetime, UTC
from apscheduler.schedulers.background import BackgroundScheduler
from app.models.endpoint_model import EndpointModel
from app.services.check_service import CheckService

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def start_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduleEndpoints, 'interval', seconds=30)
    scheduler.start()

def scheduleEndpoints():
    endpoints = EndpointModel.get_every_endpoint()

    for endpoint in endpoints:
        CheckService.perform_check(endpoint['id'], endpoint['url'])