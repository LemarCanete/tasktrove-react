import React from 'react'
import Link from 'next/link'

import { BsSearch, BsFillPersonFill } from 'react-icons/bs'

export default function Top() {
  return (
        <div id="search" className="input-group input-group-lg mt-3 w-100">
            <BsSearch className="fa-solid fa-magnifying-glass position-absolute mt-3 ms-2 z-1 fs-5"/>
            <input type="text" className="ps-5 form-control rounded-0 bg-transparent" />
            <Link href="./Profile" className="position-absolute end-0 mt-2 me-2 z-1"><BsFillPersonFill className="fa-solid fa-circle-user fs-3"/></Link>
        </div>
  )
}
