import DefaultLayout from '@/components/DefaultLayout'
import Header from '@/components/Header'
import UserComponent from '@/components/users/UserComponent'
import React from 'react'

function User() {
  return (
    <DefaultLayout>
        <Header/>
        <UserComponent/>
    </DefaultLayout>
  )
}

export default User