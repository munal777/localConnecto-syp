import { Navigate } from "react-router-dom";
import { userAuthentication } from "./auth";


function ProtectedRoute({children}) {
    const {isAuthorized} = userAuthentication();

    console.log(isAuthorized);
    
    if (isAuthorized === null) {
        return <div>Loading ...</div>
    } 

    if (
        isAuthorized && 
        (window.location.pathname === '/login' || window.location.pathname === '/signup')
    ) {
        return <Navigate to="/" />
    }

    return children;
}


export default ProtectedRoute;