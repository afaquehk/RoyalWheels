from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Booking, Expense, OwnerProfile, Vehicle


class OwnerProfitTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="owner1",
            password="TestPass123!",
        )
        self.owner = OwnerProfile.objects.create(
            user=self.user,
            business_name="City Rentals",
        )
        self.vehicle = Vehicle.objects.create(
            owner=self.owner,
            category=Vehicle.Category.CAR,
            name="Creta",
            brand="Hyundai",
            model_year=2023,
            registration_number="KA01AB1234",
            rent_per_day=Decimal("1800.00"),
        )

    def test_owner_profit_calculation(self):
        Booking.objects.create(
            customer_name="Asha",
            customer_phone="9999999999",
            owner=self.owner,
            vehicle=self.vehicle,
            start_date="2026-02-01",
            end_date="2026-02-03",
            total_price=Decimal("5400.00"),
            status=Booking.Status.COMPLETED,
        )
        Booking.objects.create(
            customer_name="Rahul",
            customer_phone="8888888888",
            owner=self.owner,
            vehicle=self.vehicle,
            start_date="2026-02-04",
            end_date="2026-02-04",
            total_price=Decimal("1800.00"),
            status=Booking.Status.CANCELLED,
        )
        Expense.objects.create(
            owner=self.owner,
            title="Service",
            amount=Decimal("1200.00"),
        )

        self.assertEqual(self.owner.total_revenue, Decimal("5400.00"))
        self.assertEqual(self.owner.total_expenses, Decimal("1200.00"))
        self.assertEqual(self.owner.total_profit, Decimal("4200.00"))
