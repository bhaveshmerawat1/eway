import CheckoutForm from '@/components/Products/Checkout/CheckoutForm'
import { CheckoutProvider } from '@/context/CheckoutContext'
import React from 'react'

export default function CheckOut() {
  return (
    <CheckoutProvider>
      <div className="min-h-screen bg-gray-100">
        <CheckoutForm />
      </div>
    </CheckoutProvider>
  )
}
