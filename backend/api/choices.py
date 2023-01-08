#for different users

NGO="Ngo"
DONOR="Donor"
ADMIN="Admin"

ROLES=(
    (NGO, NGO),
    (DONOR, DONOR),
    (ADMIN, ADMIN)
)


#choices for verification status
NONE='none'
DETAILS_FILLED = 'details_filled'
EMAIL_VERIFIED='email_verified'
ADMIN_VERIFIED='admin_verified'

NGO_VERIFICATION_STATUS_CHOICES = (
        (NONE, NONE),
        (DETAILS_FILLED, DETAILS_FILLED),
        (EMAIL_VERIFIED, EMAIL_VERIFIED),
        (ADMIN_VERIFIED, ADMIN_VERIFIED)
)


#food request choices
PENDING='pending'
ACCEPT='accept'
PICKEDUP='pickedup'

STATUS_CHOICES = (
        (PENDING, PENDING),
        (ACCEPT, ACCEPT),
        (PICKEDUP, PICKEDUP)
)


#food type choices
LUNCH='lunch'
DINNER='dinner'
BREAKFAST='breakfast'
FOOD_TYPE_CHOICES = (
        (LUNCH, LUNCH),
        (DINNER, DINNER),
        (BREAKFAST, BREAKFAST)
)