"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { RiMenu3Fill } from 'react-icons/ri';
import Image from "next/image";

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);

            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

  return (
    <div className='px-3 sm:px-10 md:px-20 py-5 shadow-lg flex justify-between'>
        <div>
            <Link className="mb-5.5 inline-block" href="/">
            <Image
            src={"/logo.png"}
            alt="Logo"
            width={50}
            height={10}
            />
            </Link>
        </div>
        <nav className='flex justify-between items-center'>
            <div className='hidden gap-10 sm:flex'>
                <a href="#">Dashboard</a>
                <a href="#">My Invoices</a>
                <a href="#">User Info</a>
            </div>
            <div className='relative sm:hidden' ref={menuRef}>
                {/* Toggle menu button */}
                <p className='text-2xl cursor-pointer hover:bg-opacity-30 font-bold' onClick={toggleMenu}>
                    <RiMenu3Fill />
                </p>
                {/* Conditionally render menu items based on isMenuOpen state */}
                {isMenuOpen && (
                    <div className="absolute
                    -right-2 mt-9 bg-white
                     border border-gray-200
                      rounded shadow-lg p-4
                      flex flex-col gap-3
                      w-36
                      "


                      >
                        <a href="#" onClick={closeMenu}>Dashboard</a>
                        <a href="#" onClick={closeMenu}>My Invoices</a>
                        <a href="#" onClick={closeMenu}>User Info</a>
                    </div>
                )}
            </div>
        </nav>
    </div>
  )
}

export default Header