

Royal Wheels is a full-stack vehicle rental platform built with Django. The application provides a complete workflow for customers to browse rental vehicles, submit bookings, manage their reservations, and interact with rental partners.

The platform also provides rental partners with a dedicated management dashboard for managing vehicles, bookings, business expenses, revenue, and profitability.

## Project Overview

Royal Wheels is designed as a two-sided vehicle rental platform consisting of:

- A customer-facing vehicle rental interface
- A rental partner management system
- A Django-based backend
- Database-driven vehicle, booking, user, and business management
- OTP-based authentication and account verification
- Administrative controls through Django Admin
- REST-style JSON endpoints for dynamic application functionality

The application supports both car and bike rentals and provides separate workflows for customers, rental partners, and administrators.

## Key Features

### Customer Features

- Customer registration and authentication
- OTP-based email or phone verification
- Password recovery using OTP verification
- Browse available cars and bikes
- View vehicle details, specifications, pricing, and images
- Browse verified rental partners
- Book vehicles using daily or hourly rental units
- Upload required identification and driving licence documents
- View booking history
- Track booking status
- View rental duration and outstanding balance
- Customer profile management
- Payment workflow interface prepared for payment gateway integration

### Rental Partner Features

- Business account registration
- OTP-based account verification
- Password recovery
- Partner profile management
- Add and manage rental vehicles
- Edit and delete vehicle listings
- Upload multiple vehicle images
- Manage vehicle availability
- View incoming booking requests
- Approve or reject bookings
- Mark bookings as completed
- Track business expenses
- Monitor revenue and expenses
- Calculate business profit
- View booking statistics through the partner dashboard

### Administration

- Django Admin interface
- User and partner management
- Vehicle management
- Booking management
- Partner verification
- Vehicle verification
- Management of application records
- Demonstration data seeding through a Django management command

## Technology Stack

### Backend

- Python 3.12
- Django 6.0.2
- Django ORM
- Django Authentication
- Django Sessions
- Django Forms

### Frontend

- HTML5
- CSS3
- JavaScript
- Django Templates

The frontend uses server-rendered Django templates with JavaScript for dynamic functionality. No separate frontend build system is required.

### Database

- SQLite for development
- PostgreSQL for production

### Additional Technologies

- WhiteNoise for static file serving
- Gunicorn for production application serving
- Twilio for SMS OTP delivery
- SMTP for email OTP delivery
- REST-style JSON endpoints
- Environment-based configuration

### Deployment

Deployment configuration is included for:

- Render
- Railway
- Vercel

Render is configured for production deployment with PostgreSQL support.

## System Architecture

Royal Wheels follows a server-rendered Django architecture.

```text
                    Client
                      |
                      v
              Django Templates
                      |
              HTML / CSS / JS
                      |
                      v
              Django Application
                /           \
               /             \
        Page Views        JSON Endpoints
               \             /
                \           /
                  Django ORM
                      |
                      v
              Database Layer
             /              \
          SQLite          PostgreSQL
