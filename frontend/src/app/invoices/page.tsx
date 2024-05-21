import DefaultLayout from '@/components/DefaultLayout'
import Header from '@/components/Header'
import InvoiceComponent from '@/components/invoice/InvoiceComponent'
import React from 'react'

function Invoice() {
  return (
    <DefaultLayout>
    <Header/>

    <InvoiceComponent/>

</DefaultLayout>
  )
}

export default Invoice