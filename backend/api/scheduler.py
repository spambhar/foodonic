from apscheduler.schedulers.background import BackgroundScheduler
from .jobs import delete_old_requests


def start_jobs():
    scheduler = BackgroundScheduler()

    # Set cron to runs every 20 min.
    cron_job = {'month': '*', 'day': '*/1', 'hour': '*', 'minute': '*'}

    # Add our task to scheduler.
    scheduler.add_job(delete_old_requests, 'cron', **cron_job)

    scheduler.start()
