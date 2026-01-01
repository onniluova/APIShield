import time
import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.models.endpoint_model import EndpointModel
from app.services.check_service import CheckService
from app.models.checks_model import CheckModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_scheduler(app):
    if app.debug and os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        return

    scheduler = BackgroundScheduler()
    
    scheduler.add_job(lambda: scheduleEndpoints(app), 'interval', seconds=180)
    scheduler.add_job(deleteOldChecks, 'interval', seconds=600)
    
    scheduler.start()
    logger.info("Scheduler started successfully")

def scheduleEndpoints(app):
    with app.app_context():
        try:
            logger.info("Running scheduled checks...")
            endpoints = EndpointModel.get_every_endpoint()

            if not endpoints:
                logger.info("No endpoints to check.")
                return

            for endpoint in endpoints:
                CheckService.perform_check(endpoint['id'], endpoint['url'])
            
            logger.info(f"Checked {len(endpoints)} endpoints.")
            
        except Exception as e:
            logger.error(f"Scheduler crashed: {e}")

def deleteOldChecks():
    try:
        deleted = CheckModel.delete_old_checks()
        logger.info(f"Cleaned up {deleted} old check records.")
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")