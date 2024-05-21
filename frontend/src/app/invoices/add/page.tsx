'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axiosInstance from '@/components/AxiosInstance/AxiosInstance';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/DefaultLayout';
import Header from '@/components/Header';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/components/models';
interface Item {
  description: string;
  quantity: number;
  price: number;
}

function AddInvoice() {
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        clientName: '',
        dueDate: '',
        totalAmount: 0,
        items: [] as Item[], // Initialize items as an empty array
        userId: 0,
        id: 0,
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState(0);
    const router = useRouter();


    useEffect(() => {
      const token = localStorage.getItem("invoice-token");
      if (token) {
          try {
              const decoded: User = jwtDecode(token);
              const decodedUserId = decoded.userId;
              setUserId(decodedUserId);
              setFormData((prevData) => ({
                  ...prevData,
                  userId: decodedUserId,
              }));
          } catch (error) {
              console.error("Failed to decode token", error);
          }
      }
  }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        console.log('====================================');
        console.log(formData);
        console.log('====================================');

        const totalAmount = formData.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        setFormData((prevData) => ({
            ...prevData,
            totalAmount: totalAmount,
        }));

         try {
             const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, formData);
             console.log(response.data);
             router.push('/invoices');
         } catch (error:any) {
             if (error.response && error.response.data) {
                 setErrorMessage(error.response.data.message);
             } else {
                 setErrorMessage('Register failed. Please try again later.');
             }
         }
    };

    const handleItemChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newItems = [...formData.items];

      switch (name) {
          case 'description':
              newItems[index].description = value;
              break;
          case 'quantity':
              newItems[index].quantity = parseInt(value, 10); // Convert value to number
              break;
          case 'price':
              newItems[index].price = parseFloat(value); // Convert value to float
              break;
          default:
              break;
      }

      setFormData({ ...formData, items: newItems });

      const totalAmount = formData.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      setFormData((prevData) => ({
        ...prevData,
        totalAmount: totalAmount,
    }));
  };





    const addNewItem = () => {
        setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 0, price: 0 }] });
    };

    const removeItem = (index: number) => {
      const newItems = [...formData.items];
      newItems.splice(index, 1);

      setFormData((prevData) => {
          const totalAmount = newItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
          return {
              ...prevData,
              items: newItems,
              totalAmount: totalAmount,
          };
      });
  };


    return (
        <DefaultLayout>
            <Header />
            <div className="rounded-sm bg-white shadow-default px-5 md:px-20">
                <div className="mt-5 flex justify-end">

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap">
                        <div className="w-full xl:w-1/2 px-5">
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black">Invoice Number</label>
                                <input
                                    type="text"
                                    name="invoiceNumber"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Enter your Invoice Number"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black">Client Name</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Enter Client Name"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    required
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                                />
                            </div>
                            <h2>Total Items: {formData.items.length}</h2>
                            <h2>Total Amount: {formData.totalAmount}</h2>
                        </div>
                        <div className="w-full  xl:w-1/2 px-5">
                            {errorMessage && <h3 className="text-center font-bold text-[#c03030]">{errorMessage}</h3>}
                            <div className="mb-4">
                                {formData.items.map((item, index) => (

                                    <div key={index} className="col-12 mb-3 card">
                                        <h2 className="mb-2.5 block font-medium text-black">Item {index + 1}</h2>

                                        <input
                                            type="text"
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, e)}
                                            placeholder="Enter Item Name"
                                            className="rounded-lg w-full border my-1 border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary mx-1 focus-visible:shadow-none"
                                        />
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, e)}
                                            placeholder="Enter Quantity"

                                            className="rounded-lg w-full my-1 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary mx-1 focus-visible:shadow-none"
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(index, e)}
                                            placeholder="Enter Price"
                                            className="rounded-lg w-full border my-1 border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary mx-1 focus-visible:shadow-none"
                                        />
                                        <div className="flex justify-end">
                                        <button type="button" className='text-red-500 py-3' onClick={() => removeItem(index)}>
                                            <FaTrash className="text-red-500" />
                                        </button>
                                        </div>

                                    </div>
                                ))}
                                <div className='flex justify-end'>
                                  <button type="button" onClick={addNewItem} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600">
                                     <span className="flex items-center gap-2">
                                        <FaPlus/>
                                        Item

                                     </span>
                                  </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end">
                        <input type="submit" value="Submit" className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 cursor-pointer" />
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
}

export default AddInvoice;
