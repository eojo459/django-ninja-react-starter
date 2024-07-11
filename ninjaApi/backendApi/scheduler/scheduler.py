import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.shortcuts import get_object_or_404
from django_apscheduler.jobstores import DjangoJobStore, register_events
from django.utils import timezone
from django_apscheduler.models import DjangoJobExecution
import sys
from datetime import date, datetime, time, timedelta
from requests import Response
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from backend.utils.report_templates.html_reports import create_timesheet_report
from staff.models import StaffAttendance, StaffWorkingHours
from staff.serializers import StaffAttendanceSerializer
from backend.utils.email_templates.email import auto_clocked_out_email, auto_clocked_out_staff_email, reminder_clock_in_staff_email, reminder_clock_out_staff_email
from backend.utils.helper import Status, TimeStatus, TimesheetCalculate, auto_clock_out_triggered, calculate_time_with_offset, convert_date, convert_datetime_time, convert_time, convert_to_utc, datetime_to_time_str, end_of_week, format_time, get_day_of_week, get_end_of_month, get_start_of_month, get_timezone_offset_from_timestamp, get_working_schedule_end, is_bi_weekly_day, start_of_previous_week, start_of_week, time_to_timestamp
from user.models import BusinessOwner, User
from user.serializers import BusinessOwnerSerializer
from businessManagement.models import BusinessProfile, BusinessSchedule, Cookies, EmailNotification, EmailNotify, Payments, PayrollInformation, StaffActivity, SubmittedTimesheets, Subscriptions, Timesheet, TimesheetStatus
from businessManagement.serializers import BusinessProfileSerializer, EmailNotifySerializer, PaymentSerializer, StaffActivityLogSerializer, StaffActivitySerializer, SubmittedTimesheetsSerializer, SubscriptionSerializer, TimesheetSerializer
from backend.utils.chargebee_util import cancel_subscription
from django.db.models import Q, F
from django_apscheduler import util
from apscheduler.triggers.cron import CronTrigger
from decouple import config
import boto3

session = boto3.session.Session()
client = session.client('s3',
                        region_name='sfo3',
                        endpoint_url='https://sfo3.digitaloceanspaces.com',
                        aws_access_key_id=config('VH_SPACES_KEY'),
                        aws_secret_access_key=config('VH_SPACES_SECRET'))

@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
  """
  This job deletes APScheduler job execution entries older than `max_age` from the database.
  It helps to prevent the database from filling up with old historical records that are no
  longer useful.
  
  :param max_age: The maximum length of time to retain historical job execution records.
                  Defaults to 7 days.
  """
  DjangoJobExecution.objects.delete_old_job_executions(max_age)

# check and cancel any expired subscriptions
def check_expired_subscriptions():
    # TODO: get the acounts that have ran out of days and remove their VIP access
    pass

# send email reminders to notify staff to clock in 
def email_reminder_clock_in():
    # TODO: send email notifications on a schedule
    pass

# start the scheduler
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    
    # check for expired subscriptions every 24 hours
    scheduler.add_job(
        check_expired_subscriptions, 
        'interval', 
        hours=24, 
        id='check_expired_subscriptions', 
        max_instances=1,
        replace_existing=True,
    )

    # check for expired auth accounts everyday
    scheduler.add_job(
        check_expired_auth_accounts, 
        'cron', 
        day_of_week='mon-sun',
        hour='1', 
        # 'interval',
        # minutes=2,
        id='check_expired_auth_accounts', 
        max_instances=1,
        replace_existing=True,
    )

    # send email reminders to clock in every 5 minutes
    scheduler.add_job(
        email_reminder_clock_in, 
        'interval', 
        minutes=5, 
        id='email_reminder_clock_in', 
        max_instances=1,
        replace_existing=True,
    )
 
    # clear and delete old job executions
    scheduler.add_job(
        delete_old_job_executions,
        trigger=CronTrigger(
            day_of_week="mon", hour="00", minute="00"
        ),  # Midnight on Monday, before start of the next work week.
        id="delete_old_job_executions",
        max_instances=1,
        replace_existing=True,
    )
    register_events(scheduler)
    scheduler.start()
    print("Scheduler started...", file=sys.stdout)