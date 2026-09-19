# RoyalWheels

RoyalWheels is a Django-powered vehicle rental platform that connects customers with rental partners. Customers can browse verified cars and bikes, create bookings, and manage their reservations. Partners can manage vehicles, bookings, expenses, and profile information through a dedicated dashboard.

## Features

- Customer registration, login, and OTP verification
- Car and bike browsing with vehicle details and images
- Booking management and rental period tracking
- Partner dashboard for vehicles, bookings, expenses, and revenue
- Admin workflows for verifying partners and vehicles
- Support for profile photos, vehicle galleries, and booking documents
- SQLite for local development and PostgreSQL for production

## Technology

- Python 3.8+
- Django 6.0.2
- SQLite3 or PostgreSQL
- HTML, CSS, and vanilla JavaScript
- Gunicorn and WhiteNoise for deployment
- Optional Twilio integration for OTP delivery

## Getting Started

### Prerequisites

- Python 3.8 or newer
- Git

### Install the project

```bash
git clone https://github.com/afaquehk/RoyalWheels.git
cd RoyalWheels
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### Configure and migrate the database

Set the required environment variables before starting the application. At minimum, configure a unique `SECRET_KEY`, `DEBUG`, and `ALLOWED_HOSTS`. Email, Twilio, and production database settings can be added when those services are enabled.

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_partners
```

The `seed_partners` command is optional and loads demo partner data.

### Run locally

From the `backend` directory:

```bash
python manage.py runserver
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a browser.

## Project Structure

```text
backend/
├── app/                    # Application models, views, forms, templates, and assets
├── backend/                # Django settings and WSGI/ASGI configuration
├── management/             # Custom management commands
├── media/                  # Uploaded profile, vehicle, and booking files
├── migrations/             # Database schema migrations
├── db.sqlite3              # Local development database
└── manage.py               # Django command-line utility
```

The main application code is in `backend/app`. Static files are stored in `backend/app/static`, and templates are stored in `backend/app/templates`.

## Production Deployment

The repository includes configuration for Render, Vercel, and other WSGI-compatible hosts. Render can use `render.yaml`, while the `Procfile` starts the application with Gunicorn:

```text
web: cd backend && gunicorn backend.wsgi --log-file -
```

For production deployments:

- Set `DEBUG=False`.
- Use a strong, private `SECRET_KEY`.
- Configure `ALLOWED_HOSTS` and trusted origins for the deployed domain.
- Use PostgreSQL instead of the development SQLite database.
- Run migrations and collect static files during deployment.
- Store uploaded media in durable object storage when required by the hosting platform.
- Configure HTTPS and secure session and CSRF cookies.

See [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific deployment details.

## Useful Commands

Run these commands from `backend`:

```bash
python manage.py test
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
```

## License

No license has been specified for this project yet.
