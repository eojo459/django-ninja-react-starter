from datetime import date
from typing import List
from django.shortcuts import get_object_or_404
from ninja import Router, Schema
from .models import User

router = Router()

################
# MODEL SCHEMAS
################
class UserIn(Schema):
    uid: str
    first_name: str
    last_name: str
    username: str
    email: str
    street: str
    street_2: str
    city: str
    province: str
    country: str
    country_code: str
    postal_code: str
    gender: str
    role: str
    cell_number: str
    work_number: str
    home_number: str
    pin_code: str
    password: str
    notes: str
    last_logged_in: date
    password_changed_at: date
    date_joined: date
    active: bool
    archived: bool
    confirm_email: bool
    pending_approval: bool
    date_of_birth: date

class UserOutFull(Schema):
    id: str
    uid: str
    first_name: str
    last_name: str
    username: str
    email: str
    street: str
    street_2: str
    city: str
    province: str
    country: str
    country_code: str
    postal_code: str
    gender: str
    role: str
    cell_number: str
    work_number: str
    home_number: str
    pin_code: str
    password: str
    notes: str
    last_logged_in: date
    password_changed_at: date
    date_joined: date
    active: bool
    archived: bool
    confirm_email: bool
    pending_approval: bool
    date_of_birth: date

class UserOut(Schema):
    id: str
    uid: str
    first_name: str
    last_name: str
    username: str
    email: str
    active: bool
    archived: bool
    confirm_email: bool
    role: str

################################
# API CONTROLLER METHODS
################################

@router.post("/users")
def create_user(request, payload: UserIn):
    employee = User.objects.create(**payload.dict())
    return {"id": employee.id}

@router.get("/users/{user_uid}", response=UserOut)
def get_user_by_uid(request, user_uid: str):
    user = get_object_or_404(User, uid=user_uid)
    return user

@router.get("/users/{user_id}", response=UserOut)
def get_user_by_id(request, user_id: str):
    user = get_object_or_404(User, id=user_id)
    return user

@router.get("/users", response=List[UserOut])
def list_users(request):
    users_list = User.objects.all()
    return users_list

@router.put("/users/{user_uid}")
def update_user_by_uid(request, user_uid: str, payload: UserIn):
    user = get_object_or_404(User, uid=user_uid)
    for attr, value in payload.dict().items():
        setattr(user, attr, value)
    user.save()
    return {"success": True}

@router.put("/users/{user_id}")
def update_user_by_id(request, user_id: str, payload: UserIn):
    user = get_object_or_404(User, id=user_id)
    for attr, value in payload.dict().items():
        setattr(user, attr, value)
    user.save()
    return {"success": True}

@router.delete("/users/{user_uid}")
def delete_user_by_uid(request, user_uid: str):
    user = get_object_or_404(User, uid=user_uid)
    user.delete()
    return {"success": True}