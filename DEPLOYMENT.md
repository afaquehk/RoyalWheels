# RoyalWheels - Vehicle Rental Platform

A Django-based two-sided marketplace for vehicle rentals, connecting customers with rental partners.

## Features

- **Customer Portal**: Browse vehicles, search by category, book rentals, track bookings
- **Partner Dashboard**: Manage vehicles, bookings, expenses, and revenue tracking
- **Admin Panel**: Partner and vehicle verification workflow
- **Authentication**: OTP-based verification (email/SMS via Twilio)
- **Payment Ready**: Integration points for Razorpay/Stripe/PayPal

## Tech Stack

- **Backend**: Django 6.0.2, Python 3.8+
- **Database**: SQLite3 (development) / PostgreSQL (production)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Render, Railway, or Vercel

## Local Development Setup

### 1. Clone and Setup

```bash
git clone https://github.com/afaquehk/RoyalWheels.git
cd RoyalWheels

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required variables:
- `SECRET_KEY`: Django secret key (generate: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- `DEBUG=True` (development only)
- `ALLOWED_HOSTS=localhost,127.0.0.1`

### 3. Database Setup

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser  # Create admin user
python manage.py seed_partners    # Load demo data (optional)
```

### 4. Run Development Server

```bash
python manage.py runserver
```

Visit: http://localhost:8000/

## Production Deployment

### Environment Variables (Set on platform)

```
SECRET_KEY=your-generated-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/royalwheels
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_FROM_NUMBER=+1234567890
```

### Deploy on Render

1. Connect GitHub repo to Render
2. Set environment variables in Render dashboard
3. Add build command: `pip install -r requirements.txt && cd backend && python manage.py migrate && python manage.py collectstatic --noinput`
4. Set start command: `gunicorn backend.wsgi --bind 0.0.0.0:8000` (Render handles this via Procfile)

### Deploy on Railway

1. Connect GitHub repo to Railway
2. Set environment variables
3. Railway auto-detects Python and Procfile

### Deploy on Vercel

Note: Vercel has limitations with file uploads. Recommend Render or Railway instead.

## Project Structure

```
backend/
├── app/                    # Main Django app
│   ├── models.py          # Database models
│   ├── views.py           # API endpoints and views
│   ├── urls.py            # URL routing
│   ├── forms.py           # Form validation
│   ├── admin.py           # Admin configuration
│   ├── templates/         # HTML templates
│   └── static/            # CSS, JS, images
├── backend/               # Django project settings
│   ├── settings.py        # Configuration
│   ├── urls.py            # Root URLs
│   ├── wsgi.py            # WSGI application
│   └── asgi.py            # ASGI application
├── manage.py              # Django CLI
└── db.sqlite3             # Database (dev only)
```

## Database Models

- **OwnerProfile**: Rental partner accounts
- **Vehicle**: Rentable cars/bikes
- **VehicleImage**: Gallery images
- **Booking**: Rental reservations
- **Expense**: Business expenses

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/vehicles/` | GET | List all verified vehicles |
| `/api/bookings/` | GET | List bookings |
| `/api/dashboard/` | GET | Owner dashboard stats |
| `/api/otp/send/` | POST | Send OTP |
| `/api/otp/verify/` | POST | Verify OTP |
| `/api/bookings/create/` | POST | Create booking |
| `/api/expenses/add/` | POST | Add expense |

## Troubleshooting

### Static Files Not Loading
```bash
cd backend
python manage.py collectstatic --noinput
```

### Database Migrations Failed
```bash
python manage.py makemigrations
python manage.py migrate
```

### Port Already in Use
```bash
python manage.py runserver 8001
```

## Security Notes

⚠️ **Before production:**
- Change `SECRET_KEY` to a unique value
- Set `DEBUG=False`
- Configure `ALLOWED_HOSTS`
- Use PostgreSQL instead of SQLite
- Enable HTTPS
- Set up email/SMS credentials
- Configure S3 or similar for media storage

## Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Reviews and ratings system
- [ ] Search backend optimization
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced analytics dashboard

## Support

For issues, create an issue on GitHub.

## License

Private repository
