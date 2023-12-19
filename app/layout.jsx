import React from 'react'
import { Inter, Poppins } from 'next/font/google'
import './bootswatch.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['300'] })

export const metadata = {
  title: 'TaskTrove',
  description: 'A project management system',
}

export default function RootLayout({ children }) {
    return (
            <html lang="en">

                <body className={poppins.className}>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
                    {children}
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-modal/3.14.3/react-modal.min.js"
                        integrity="sha512-MY2jfK3DBnVzdS2V8MXo5lRtr0mNRroUI9hoLVv2/yL3vrJTam3VzASuKQ96fLEpyYIT4a8o7YgtUs5lPjiLVQ=="
                        crossorigin="anonymous"
                        referrerpolicy="no-referrer"></script>
                </body>
            </html>
    )
}
