import React from 'react'
import { useCookies } from 'react-cookie';
const cookies = useCookies['id']
const id = cookies['id']

const getUserId = () => {
  return (
    <div>getUserId</div>
  )
}

export default getUserId