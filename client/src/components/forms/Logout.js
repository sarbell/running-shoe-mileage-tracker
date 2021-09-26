import React from 'react'
import { useCookies } from 'react-cookie'

function Logout(){
    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    
    removeCookie('token')
    document.location = '/'

    return <> </>
  
}

export default Logout;