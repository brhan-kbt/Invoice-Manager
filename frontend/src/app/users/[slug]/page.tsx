'use client'
import axiosInstance from '@/components/AxiosInstance/AxiosInstance'
import DefaultLayout from '@/components/DefaultLayout'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'


interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}
function EditUser() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const router = useRouter();
  const param = usePathname();
  const id = param?.split('/')[2];

  const handleFormErrors = (errorData: Record<string, string[]>) => {
    setErrors(errorData);
  };

  const handleInputChange = (e:any) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('====================================');
    console.log(formData);
    console.log('====================================');

    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        formData
      );

      console.log(response.data);
      router.push('/users');
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.errors) {
        handleFormErrors(error.response.data.errors);
      } else {
        console.error('Error submitting form:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
        );
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: response.data.password,
          role: response.data.role,
        });

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <DefaultLayout>
    <Header/>

    <div style={{
      height:'100vh'
    }} className="rounded-sm border border-stroke bg-white shadow-default px-5 md:px-20">

    <div className='mt-5 flex justify-end'>
    <a href='/users/add'
      className=" 401Px:flex-shrink-0  cursor-pointer rounded-lg border
            border-stroke bg-[#004AAD] p-3
            text-white transition hover:bg-opacity-90"
      >

      Back
      </a>
    </div>
      <div className="flex flex-wrap items-center " >

        <div className="hidden w-full xl:block xl:w-1/3">
          <div className="px-26 py-17.5 text-center">

          <div className="py-16">
                <p className="text-2xl font-bold 2xl:px-20 text-gray-300">
                &#47; &#47; InvoiceEase
                  </p>


                  <p className="text-3xl font-bold 2xl:px-20 text-gray-500">
                    Register User
                  </p>
            </div>
            <Link className="mb-5.5 inline-block" href="/">

              <Image
                src={"/logo.png"}
                alt="Logo"
                width={200}
                height={50}
              />
            </Link>




          </div>
        </div>

        <div className="w-full  xl:w-2/3  ">
          <div className="w-full p-4 ">

            {
              errorMessage && (
                <h3 className="text-center font-bold text-[#c03030]">{errorMessage}</h3>
              )
            }

            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black ">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your Full Name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                  />

                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black ">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    required
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                  />

                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black" >
                   Password
                </label>
                <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    name="password"
                    placeholder="******"
                    value=''

                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                  />

                <span className="absolute right-4 top-4" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>


                </div>
              </div>


              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black" >
                   Role
                </label>
                <div className="relative">
                  <select name="role"
                  value={formData.role}
                  id="role" onChange={handleInputChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none">
                    <option value="">Select Role</option>
                    <option  value="ADMIN" >Admin</option>
                    <option value="USER">User</option>
                  </select>
                </div>
              </div>



              <div className="mb-5">
                <input
                  type="submit"
                  value="Update"
                  className="w-full cursor-pointer rounded-lg border
                    border-stroke bg-[#004AAD] p-4
                    text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
  )
}

export default EditUser