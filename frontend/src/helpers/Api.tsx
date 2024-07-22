import axios from "axios";
import { API_ROUTES } from "../apiRoutes";
import { Dayjs } from "dayjs";

// Data Types
export type EmergencyContactProfile = {
    first_name: '',
    last_name: '',
    contact_number: '',
    notes: '',
};

// get user by uid
export async function getUserByUid(uid: string, authTokens: any) {
    try {
        const response = await axios({
            method: "GET",
            url: API_ROUTES.USERS_UID(uid),
            headers: {
                'X-JWT': authTokens
            },
        })
        if (response.status === 200) {
            return response.data;
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

// POST new user
export async function PostNewUser(data: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.USERS,
            data: data,
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// PATCH/UPDATE the user by uid
export async function PatchUserByUid(uid: string, userData: any, authTokens: any) {
    try {
        const response = await axios({
			method: "PATCH",
			url: API_ROUTES.USERS_UID(uid),
            data: userData,
			headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// DELETE user by uid
export async function DeleteUserByUid(uid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "DELETE",
			url: API_ROUTES.USERS_UID(uid),
			headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// LOGIN/SIGN IN the user
export async function LoginUser(data: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.AUTH_LOGIN,
            data: data,
		})
        return response.status;
    } catch (error) {
        console.error('Error logging in user:', error);
    }
}

// GET auth user email by username
export async function GetAuthUserEmailByUsername(username: string) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.USERS_USERNAME_EMAIL(username),
		})
        if (response.status === 200) {
            return response.data['email'];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// get the user id by contact number
export async function getIdByContactNumber(contactNumber: string, isChild: boolean, authTokens: any) {
    try {
        const response = await axios({
            method: "GET",
            url: API_ROUTES.USERS_CONTACT_NUMBER(contactNumber),
            params: {
                isChild: isChild, // Pass child flag as a query parameter
            },
            headers: {
                'X-JWT': authTokens
            },
        })
        if (response.status === 200) {
            return response.data;
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

// get the user id by username
export async function getIdByUsername(username: string, authTokens: any) {
    try {
        const response = await axios({
            method: "GET",
            url: API_ROUTES.USERS_USERNAME(username),
            headers: {
                'X-JWT': authTokens
            },
        })
        if (response.status === 200) {
            return response.data;
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}


// GET holiday data
// https://date.nager.at/Api
// https://date.nager.at/api/v3/publicholidays/{year}/{country_code}
export async function GetHolidayApiData(countryCode: string) {
    try {
        // get current year
        const currentYear: number = new Date().getFullYear();
        const response = await axios({
			method: "GET",
			url: API_ROUTES.PUBLIC_HOLIDAY_API(countryCode, currentYear),
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// POST the valid state of the invite code and return the business id if valid
export async function ValidateCode(code: any) {
    try {
        const response = await axios({
			method: "POST",
            data: code,
			url: API_ROUTES.VALIDATE_INVITE_CODE,
		})
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        console.error('Error validating data:', error);
    }
}

// POST and approve new staff user
export async function PostApproveStaffUser(staffUid: string, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.APPROVE_NEW_STAFF_USER(staffUid),
            data: data,
			headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// POST and check user info
export async function CheckUsers(queryParam: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.AUTH_CHECK,
            params: queryParam,
		})
        if (response.status === 200) {
            return response.data['status'];
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// POST and create new chargebee checkout url
export async function PostChargebeeNewCheckoutUrl(data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.CHARGEBEE_NEW_CHECKOUT_URL,
            data: data,
            headers: {
				'X-JWT': authTokens
			},
		})
        return response;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// GET a chargebee checkout url and view the status
export async function GetChargebeeCheckoutUrl(hostedPageUrl: any, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.CHARGEBEE_GET_CHECKOUT_URL(hostedPageUrl),
            data: data,
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// GET a subscription for an owner 
export async function GetOwnerSubscription(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_GET_CHECKOUT_URL(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// GET a payment for an owner 
export async function GetOwnerPayment(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_GET_CHECKOUT_URL(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// POST a cancel subscription request for an owner 
export async function CancelChargebeeSubscription(ownerUid: string, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
			url: API_ROUTES.CHARGEBEE_CANCEL_SUBSCRIPTION(ownerUid),
            data: data,
            headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Get a hosted page url to update a subscription for an owner 
export async function GetChargebeeUpdateSubscriptionCheckoutUrl(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_UPDATE_SUBSCRIPTION(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get a hosted page url to update a payment method for an owner 
export async function GetChargebeeUpdatePaymentMethodCheckoutUrl(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_UPDATE_PAYMENT_METHOD(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get invoice data for subscription
export async function GetChargebeeInvoiceData(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_INVOICE_DATA(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get invoice pdf for subscription
export async function GetChargebeeInvoicePDF(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_INVOICE_PDF(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get chargebee subscription data
export async function GetChargebeeSubscription(ownerUid: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_GET_SUBSCRIPTION(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Get status of chargebee subscription verification
export async function GetChargebeeSubscriptionVerification(subscriptionId: string, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
			url: API_ROUTES.CHARGEBEE_VERIFY_SUBSCRIPTION(subscriptionId),
            headers: {
				'X-JWT': authTokens
			},
		})
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Send verify/confirm email 
export async function VerifyConfirmEmail(ownerUid: string, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
            data: data,
			url: API_ROUTES.EMAIL_VERIFY_CONFIRM(ownerUid),
            headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Create email verification token
export async function EmailVerifyToken(data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "POST",
            data: data,
			url: API_ROUTES.EMAIL_VERIFY_TOKEN,
            headers: {
				'X-JWT': authTokens
			},
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// PATCH cookies
export async function PatchCookies(userUid: string, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "PATCH",
            data: data,
			url: API_ROUTES.COOKIES_UID(userUid),
			headers: {
				'X-JWT': authTokens
			},
            withCredentials: true, // allow cookies
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// GET cookies
export async function GetCookies(userUid: string, httponly: boolean, authTokens: any) {
    try {
        const response = await axios({
			method: "GET",
            params: {
                httponly: httponly,
            },
			url: API_ROUTES.COOKIES_UID(userUid),
			headers: {
				'X-JWT': authTokens
			},
            withCredentials: true, // allow cookies
		})
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// DELETE cookies
export async function DeleteCookies(userUid: string, data: any, authTokens: any) {
    try {
        const response = await axios({
			method: "DELETE",
            data: data,
			url: API_ROUTES.COOKIES_UID(userUid),
			headers: {
				'X-JWT': authTokens
			},
            //withCredentials: true, // allow cookies
		})
        return response.status;
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// GET auth user email by uid
export async function GetAuthUserEmailByUid(staffUid: string, data: any) {
    try {
        const response = await axios({
			method: "POST",
            data: data,
			url: API_ROUTES.USERS_UID_EMAIL(staffUid),
		})
        if (response.status === 200) {
            return response;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}