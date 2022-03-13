import React from 'react'
import { NavLink } from "react-router-dom";

function NavBar( { user }) {
   
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-primary">
            {user.name}
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                {!user.role && (
                    <React.Fragment>
                        <NavLink className="nav-link" to='/Register'>
                            Register
                        </NavLink>
                        <NavLink className="nav-link" to='/Login'>
                            Login
                        </NavLink>
                    </React.Fragment>
                )}

                {(user.role === "USER" || user.role === "MANAGER") && (
                    <React.Fragment>
                        <NavLink className="nav-link" to="/TimeEntries">
                            TimeEntries
                        </NavLink>
                    </React.Fragment>
                )}

                {user.role === "MANAGER" && ( 
                    <React.Fragment>       
                        <NavLink className="nav-link" to="/Controlers">
                            Controlers
                        </NavLink>
                        <NavLink className="nav-link" to="/WorkOrders">
                            WorkOrders
                        </NavLink>
                    </React.Fragment>    
                )}
                
                {user.role && (    
                    <React.Fragment> 
                        <NavLink className="nav-link" to="/Logout">
                            Logout
                        </NavLink>
                    </React.Fragment>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar