import React from 'react'
import "./LockComponent.css"

export default function LockComponent({
  data
}) {
  return <div className='LockComponentCard'>
    <p>Lock Id: {data.lock_id}</p>
    <p>Available: {data.available ? "Yes" : "No"}</p>
    <p>Date Rented: {data.date_rented === -1 ? "N/A" : Date(data.date_rented)}</p>
    <p>User Id: {data.user_id_using === "" ? "N/A" : data.user_id_using}</p>
    <p>First Name: {data.user_first_name === "" ? "N/A" : data.user_first_name}</p>
    <p>Last Name: {data.user_last_name === "" ? "N/A": data.user_last_name}</p>
  </div>;
}
