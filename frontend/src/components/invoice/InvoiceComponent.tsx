'use client'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../AxiosInstance/AxiosInstance'
import { useRouter } from 'next/navigation'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'
import { Invoice, Pagination, User } from '../models'


function InvoiceComponent() {


  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, invoicesPerPage: 8 });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

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
  }, []);


  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  // Paginate invoices
  const indexOfLastInvoice = pagination.currentPage * pagination.invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - pagination.invoicesPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Handle pagination change
  const handlePaginationChange = (pageNumber: number) => {
    setPagination({ ...pagination, currentPage: pageNumber });
  };

  // Handle search term change
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to the first page when searching
  };

  // Filter invoices based on the search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered invoices
  const indexOfLastFilteredProject =
  pagination.currentPage * pagination.invoicesPerPage;
const indexOfFirstFilteredProject =
  indexOfLastFilteredProject - pagination.invoicesPerPage;

const paginatedFilteredInvoices = filteredInvoices.slice(
  indexOfFirstFilteredProject,
  indexOfLastFilteredProject
);

const handleEditInvoice = (invoiceId: number) => {
  router.push(`/invoices/${invoiceId}`);
};


const handleViewInvoice = (invoiceId: number) => {
  router.push(`/invoices/${invoiceId}/view`);
};




const handleDeleteInvoice = (invoiceId: number) => {
    // Show a SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this invoice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result:any) => {
      if (result.isConfirmed) {
        deleteInvoice(invoiceId);
      }
    });
  };

  const deleteInvoice = async (invoiceId: number) => {
    try {
      await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`);

      Swal.fire('Deleted!', 'The Invoice has been deleted.', 'success');
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire('Error', 'An error occurred while deleting the category.', 'error');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className='px-5 md:px-20 mt-5 md:mt-20'>

    <div className="mx-auto ">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className=" font-bold text-4xl ">
              List of  Invoices
            </h2>

            <nav>
              <a href='/invoices/add'

               className=" 401Px:flex-shrink-0  cursor-pointer rounded-lg border
                      border-stroke bg-[#004AAD] p-3
                      text-white transition hover:bg-opacity-90"
               >

                Add Invoice
              </a>
            </nav>
          </div>
       </div>

      <div className="flex pt-10 flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative ">
        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 "
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="table-search"
          className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  "
          placeholder="Search for items"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>

      </div>
       <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-stroke">
          <table  className="w-full  text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-black uppercase text-black-2 bg-black/30  ">
                  <tr>
                      <th scope="col" className="px-6 py-3 font-bold ">
                          No#
                      </th>
                      <th scope="col" className="px-6 py-3 font-bold ">
                          Invoice Number
                      </th>
                      <th scope="col" className="px-6 py-3 font-bold ">
                          Client Name
                      </th>

                      <th scope="col" className="px-6 py-3 font-bold ">
                          Due Date
                      </th>

                      {
                        userRole === 'ADMIN' &&
                        <th scope="col" className="px-6 py-3 font-bold ">
                        User Name
                    </th>

                      }

                      <th scope="col" className="px-6 py-3 font-bold ">
                          Total Items
                      </th>

                      <th scope="col" className="px-6 py-3 font-bold ">
                          Total Amount
                      </th>

                      <th scope="col" className="px-6 py-3 font-bold ">
                          Action
                      </th>
                  </tr>
              </thead>
              <tbody className=''>

              {paginatedFilteredInvoices.map((invoice) => (
                <tr key={invoice.id} className=" border-t border-stroke bg-white/10  text-black  hover:bg-gray-50 ">
                  <td className="px-6 py-4">{invoice.id}</td>
                  <td className="px-6 py-4">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4" >{invoice.clientName} </td>

                  <td className="px-6 py-4" >{formatDate(invoice.dueDate)} </td>
                  {
                    userRole === 'ADMIN' &&
                    <td className="px-6 py-4" >{invoice.user?.name ?? 'N/A'} </td>
                  }
                  <td className="px-6 py-4" >{invoice.items.length} </td>
                  <td className="px-6 py-4" >{invoice.totalAmount} </td>
                  <td className="px-6 py-4">
                     <span className='flex gap-5'>
                     <button
                          onClick={() => handleViewInvoice(invoice.id)}
                      className='border p-1 rounded-md border-blue-500'>
                       <FaEye className='text-blue-500'/>
                      </button>
                      <button
                          onClick={() => handleEditInvoice(invoice.id)}
                      className='border p-1 rounded-md border-green-500'>
                       <FaEdit className='text-green-500'/>
                      </button>
                      <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                      className='border p-1 rounded-md border-red-500'>
                       <FaTrash className='text-red-500'/>

                      </button>
                     </span>
                  </td>
                </tr>
              ))}
              </tbody>
          </table>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <span>
            Page{' '}
            <strong>
              {pagination.currentPage} of {Math.ceil(filteredInvoices.length / pagination.invoicesPerPage)}
            </strong>{' '}
          </span>
        </div>
        <div>
          <button
          className='px-5'
            onClick={() => handlePaginationChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePaginationChange(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage === Math.ceil(filteredInvoices.length / pagination.invoicesPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceComponent