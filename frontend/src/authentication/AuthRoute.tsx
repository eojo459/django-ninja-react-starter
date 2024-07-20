import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "./SupabaseAuthContext";

const AuthRoute = () => {
	let { user, session } = useAuth();
	let role;
	if ((user == null && session == null) || (user == undefined && session == undefined)) {
        // Authentication is still loading
		console.log("NOTHING -- NULL");
        return <Navigate to="/" />;
    }
	else {
		role = session?.user.user_metadata.role;
	}

	switch(role) {
		case "ADMIN":
		case "USER":
			return <Outlet/>;
		default:
			return <Navigate to="/login" />;
	}
};

export default AuthRoute;