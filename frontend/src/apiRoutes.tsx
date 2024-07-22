//const BASE_URL = 'https://website.com';
const BASE_URL = 'http://localhost:8000';
//const BASE_URL = 'https://dev.website.com';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';
const GEOAPIFY_API_KEY = '09c676a64439453ba2380eab97232940';
const PUBLIC_HOLIDAY_BASE_URL = 'https://date.nager.at/api/v3';

export const API_ROUTES = {
    // auth tokens
    TOKEN: `${BASE_URL}/api/token/`,
    TOKEN_REFRESH: `${BASE_URL}/api/token/refresh`,
    TOKEN_BLACKLIST: `${BASE_URL}/api/token/blacklist`,

    // auth user
    USER: `${BASE_URL}/api/register/`,
    USERS: `${BASE_URL}/api/users/`,
    AUTH_LOGIN: `${BASE_URL}/api/users/auth/login/`,
    AUTH_LOGOUT: `${BASE_URL}/api/users/auth/logout/`,
    AUTH_CHECK: `${BASE_URL}/api/users/auth/check/`,
    USERS_ID: (userId: number) => `${BASE_URL}/api/users/id/${userId}`,
    USERS_UID: (userUid: string) => `${BASE_URL}/api/users/uid/${userUid}`,
    USERS_UID_EMAIL: (userUid: string) => `${BASE_URL}/api/users/id/email/${userUid}`,
    USERS_CONTACT_NUMBER: (contact_number: string) => `${BASE_URL}/api/users/contact-number/${contact_number}`,
    USERS_USERNAME: (username: string) => `${BASE_URL}/api/persons/username/${username}`,
    USERS_USERNAME_EMAIL: (username: string) => `${BASE_URL}/api/users/username/${username}/email/`,
    USER_INFO_UID: (userUid: string) => `${BASE_URL}/api/persons/id/${userUid}`,
    USER_INFO_UID_EMAIL: (userUid: string) => `${BASE_URL}/api/persons/id/${userUid}/email/`,
    APPROVE_NEW_STAFF_USER: (staffUid: string) => `${BASE_URL}/api/approve/staffs/${staffUid}`,

    // backend routes
    VALIDATE_INVITE_CODE: `${BASE_URL}/api/businesses/validate-code/`,
    EMAIL_VERIFY_TOKEN: `${BASE_URL}/api/businesses/verify/email/token/`,
    EMAIL_VERIFY_CONFIRM: (userUid: string) => `${BASE_URL}/api/businesses/verify/users/user/${userUid}`,

    // cookies
    COOKIES: `${BASE_URL}/api/businesses/cookies/`,
    COOKIES_UID: (userUid: string) => `${BASE_URL}/api/businesses/cookies/${userUid}`,

    // 3RD PARTY API ROUTES
    // GeoApify routes - https://apidocs.geoapify.com/
    // https://api.geoapify.com/v1/geocode/autocomplete?text={searchText}&apiKey={key}&limit=5
    GEOAPIFY_ADDRESS_LOOKUP: (searchText: string) => `${GEOAPIFY_BASE_URL}/geocode/autocomplete?text=${searchText}&apiKey=${GEOAPIFY_API_KEY}&limit=5`,

    // holiday api
    // https://date.nager.at/Api
    // https://date.nager.at/api/v3/publicholidays/{year}/{country_code}
    PUBLIC_HOLIDAY_API: (countryCode: string, year: number) => `${PUBLIC_HOLIDAY_BASE_URL}/publicholidays/${year}/${countryCode}`,

    // chargebee api
    CHARGEBEE_NEW_CHECKOUT_URL: `${BASE_URL}/api/businesses/subscriptions/checkout/create/`,
    CHARGEBEE_GET_CHECKOUT_URL: (hostedPageUrl: string) => `${BASE_URL}/api/businesses/subscriptions/checkout/get/${hostedPageUrl}`,
    CHARGEBEE_CANCEL_SUBSCRIPTION: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/cancel/owners/owner/${ownerUid}`,
    CHARGEBEE_UPDATE_SUBSCRIPTION: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/checkout/update/owners/owner/${ownerUid}`,
    CHARGEBEE_UPDATE_PAYMENT_METHOD: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/payments/checkout/update/owners/owner/${ownerUid}`,
    CHARGEBEE_INVOICE_DATA: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/invoices/owners/owner/${ownerUid}`,
    CHARGEBEE_INVOICE_PDF: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/invoices/pdf/owners/owner/${ownerUid}`,
    CHARGEBEE_GET_SUBSCRIPTION: (ownerUid: string) => `${BASE_URL}/api/businesses/subscriptions/owners/owner/${ownerUid}`,
    CHARGEBEE_VERIFY_SUBSCRIPTION: (subscriptionId: string) => `${BASE_URL}/api/businesses/verify/subscriptions/subscription/${subscriptionId}`,
};