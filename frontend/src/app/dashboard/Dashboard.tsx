'use client'
import axiosInstance from '@/components/AxiosInstance/AxiosInstance';
import { Invoice, User } from '@/components/models';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaFileInvoice } from 'react-icons/fa';

function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {

    const token = localStorage.getItem("invoice-token");
    if (token) {
        try {
            const decoded:User = jwtDecode(token);
            setUserRole(decoded.role);
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }
    fetchInvoices();
      fetchUsers();

  }, []);

  const fetchInvoices = async () => {

    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchUsers = async () => {
      try {
          const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
          setUsers(response.data);
          console.log(response.data);
          } catch (error) {
            console.error('Error fetching invoices:', error);
          }
  };

  return (
    <div className='py-10 px-20'>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <div className="flex justify-between items-start mb-2">
            <p className="text-lg font-semibold">Total Invoices</p>
            <FaFileInvoice className="text-xl text-gray-400" />
          </div>
          <div className="text-4xl font-bold text-primary mb-4">
            {invoices.length}
          </div>
          <div className="absolute bottom-6 right-6">
            <Link href="/invoices">
              <p className="text-green-500 hover:underline">
                View Invoices
              </p>
            </Link>
          </div>
        </div>

       {
       userRole === 'ADMIN' &&
       <div className="bg-white shadow-md rounded-lg p-6 relative">
          <div className="flex justify-between items-start mb-2">
            <p className="text-lg font-semibold">Total Users</p>
            <FaFileInvoice className="text-xl text-gray-400" />
          </div>
          <div className="text-4xl font-bold text-primary mb-4">
            {users.length}
          </div>
          <div className="absolute bottom-6 right-6">
            <Link href="/users">
              <p className="text-green-500 hover:underline">
                View Users
              </p>
            </Link>
          </div>
        </div>}
        {/* Add more cards here */}
      </div>
    </div>
  )
}

export default Dashboard