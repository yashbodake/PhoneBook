from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import re
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from database import SessionLocal, engine, get_db
from models import User, Contact, Base
from schemas import UserBase, UserCreate, UserLogin, UserResponse, ContactBase, ContactCreate, ContactUpdate, ContactResponse, Token, TokenData
from utils import verify_password, get_password_hash, authenticate_user, create_access_token, get_current_user, oauth2_scheme

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Phonebook API", description="API for managing contacts in a phonebook application")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create tables if database is available
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not connect to database: {e}")
    print("Make sure PostgreSQL is running and configured in your .env file")


# API Routes
@app.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/contacts", response_model=list[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Contact).filter(Contact.user_id == current_user.id)

    if search:
        # Ensure case-insensitive search by converting both sides to lowercase
        search_lower = func.lower(search)
        query = query.filter(
            (func.lower(Contact.name).contains(search_lower)) |
            (func.lower(Contact.phone_number).contains(search_lower))
        )

    contacts = query.offset(skip).limit(limit).all()
    return contacts


@app.post("/contacts", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(contact: ContactCreate,
                  current_user: User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    # Validate phone number format
    contact.phone_number = ContactBase.validate_phone(contact.phone_number)

    # Check if phone number already exists
    existing_contact = db.query(Contact).filter(
        Contact.phone_number == contact.phone_number,
        Contact.user_id == current_user.id
    ).first()
    if existing_contact:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already exists"
        )

    db_contact = Contact(
        name=contact.name,
        phone_number=contact.phone_number,
        email=contact.email,
        address=contact.address,
        user_id=current_user.id
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.get("/contacts/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int,
               current_user: User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact


@app.put("/contacts/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact_update: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    # Update fields if provided
    if contact_update.name is not None:
        contact.name = contact_update.name
    if contact_update.phone_number is not None:
        # Validate phone number format
        validated_phone = ContactBase.validate_phone(contact_update.phone_number)
        # Check if new phone number already exists for current user
        existing_contact = db.query(Contact).filter(
            Contact.phone_number == validated_phone,
            Contact.id != contact_id
        ).first()
        if existing_contact:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already exists"
            )
        contact.phone_number = validated_phone
    if contact_update.email is not None:
        contact.email = contact_update.email
    if contact_update.address is not None:
        contact.address = contact_update.address

    db.commit()
    db.refresh(contact)
    return contact


@app.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int,
                  current_user: User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}