import React, { useEffect } from "react";
import {  Route, Navigate } from "react-router-dom"

const Privateroute = ({  children }) => {
    let token = localStorage.getItem('token')

    return (
        <>
                {token?.length>0 ?
                        children
                    :
                    <Navigate to='/' />
                }
        </>
    )
}

export default Privateroute