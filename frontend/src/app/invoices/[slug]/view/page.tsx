'use client'
import DefaultLayout from '@/components/DefaultLayout'
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode';
import { Invoice, User } from '@/components/models';
import axiosInstance from '@/components/AxiosInstance/AxiosInstance';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import Image from 'next/image'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Item {
    description: string;
    quantity: number;
    price: number;
}
function ViewInvoice() {



    const [invoice, setInvoice] = useState<Invoice >({} as Invoice);
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(0);
    const router = useRouter();
    const param = usePathname();
    const id = param?.split('/')[2];
    useEffect(() => {


        // Fetch invoice data based on the id
        if (id) {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`)
                .then(response => {
                    setInvoice(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching invoice data:', error);
                });
        }
    }, [id]); // Fetch data when id changes

    const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString();
      };





    const downloadPDF = () => {
        console.log('====================================');
        const input = document.getElementById('downloadable') as HTMLInputElement;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save('invoice.pdf');
            });
    };

    const downloadExcel = () => {
        const csvContent = generateCSV(invoice.items);
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodedUri);
        link.setAttribute("download", "invoice.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove the link after download
    };



    const generateCSV = (items: any[]) => {
        if (!items || items.length === 0) return '';
        const headers = ['Description', 'Quantity', 'Price'];


        const rows = items.map((item: any) => `${item.description},${item.quantity},${item.price}`);
        return [headers.join(','), ...rows].join('\n');
    };

  return (

    <DefaultLayout>
        <Header/>


        <div className="  bg-white  p-8">
        <div className="flex justify-end bg-transparent gap-10 py-3 px-2 md:px-40">
                <button onClick={downloadPDF}><FaFilePdf className='text-3xl  text-red-600 '/> </button>
                <button onClick={downloadExcel}>< FaFileExcel className='text-3xl text-green-700'/></button>
        </div>
        <div className='px-2 py-2 md:px-40 md:py-20' id="downloadable">
            <div className='flex justify-center'>
                <Image
                  className='flex flex-col items-center justify-center'
                  src={"/logo.png"}
                  alt="Logo"
                  width={100}
                  height={50}
                />

            </div>
      <div className="flex flex-col gap-10 md:flex-row justify-between mb-6">
        <div>
          <h1 >{invoice.user?.name}</h1>
          <h1 >{invoice.user?.email}</h1>
        </div>
        <div>
          <h2 className="text-xl font-bold">Invoice #{invoice.invoiceNumber}</h2>
          <p >Client : {invoice.clientName}</p>
          <p>Due Date : {formatDate(invoice.dueDate)}</p>
        </div>
      </div>
      <hr className="mb-6 h-2 text-blue-500 "  />
      <table className="w-full mb-6 ">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice &&invoice.items && invoice.items.map((item, index) => (
                <tr key={index} className=" mb-2 border-b " >
                <td>{item.description}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">${item.price}</td>
                <td className="text-right">${Number(item.price) * Number(item.quantity)}</td>

                </tr>

          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <p className="font-bold">Total Amount: ${invoice.totalAmount}</p>
      </div>
      </div>

    </div>
    </DefaultLayout>
  )
}

export default ViewInvoice