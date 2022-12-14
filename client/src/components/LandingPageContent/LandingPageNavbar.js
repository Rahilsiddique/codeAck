import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const LandingPageNavbar = () => {
  const [nav, setNav] = useState(true);
  return (
    <div className={`w-full  top-0 z-30 scroll-smooth ${!nav && "sticky"}`}>
      <nav className="flex  w-full mx-auto justify-between bg-[#1D3557]  scroll-smooth">
        <div className=" flow-root p-4 w-full   text-whiteLike px-10">
          <div className="float-left">
            <span className=" font-semibold text-3xl tracking-tight">
              co
              <span className="transition duration-300 hover:hidden">
                de<span className="text-crimsonLike">A</span>
              </span>
              ck
            </span>
          </div>
          <div className="float-right hidden lg:block text-lg">
            <ul className="flex  px-6 ">
              <div className="pt-2">
                <a
                  href="#home"
                  className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                >
                  Home
                </a>
                <a
                  href="#about-us"
                  className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                >
                  About Us
                </a>
                <a
                  href="#contact-us"
                  className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                >
                  Contact Us
                </a>
              </div>
            </ul>
          </div>
        </div>

        <div
          onClick={() => setNav((prev) => !prev)}
          className="p-3 lg:hidden top-0 right-0 z-10 fixed"
        >
          {!nav ? (
            <AiOutlineClose color="crimsonLike" size={30} />
          ) : (
            <AiOutlineMenu color="crimsonLike" size={30} />
          )}
        </div>
        <div
          className={
            !nav
              ? "fixed left-0 top-0 w-[100%] h-screen border-r border-r-grey-900  bg-[#1D3557] ease-in-out duration-700"
              : "fixed left-[-100%] ease-in-out h-screen duration-700"
          }
        >
          {/* <h1 className='  w-full text-3xl font-bold text-[#00df9a] m-4'>React.</h1> */}
          <div className="flex items-center justify-center text-2xl flex-shrink-0 text-whiteLike mr-6 px-10">
            <span className="font-semibold text-3xl tracking-tight mt-4">
              co
              <span className="transition duration-300 hover:hidden">
                de<span className="text-crimsonLike">A</span>
              </span>
              ck
            </span>
          </div>
          <ul className="pt-24 uppercase ">
            <div
              className={`text-lg lg:w-auto justify-between px-10 lg:block ${
                nav && "hidden"
              }`}
            >
              <a
                href="#home"
                className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                onClick={() => setNav((prev) => !prev)}
              >
                Home
              </a>
              <a
                href="#about-us"
                className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                onClick={() => setNav((prev) => !prev)}
              >
                About Us
              </a>
              <a
                href="#contact-us"
                className="block mt-4 lg:inline-block lg:mt-0 text-ligthGreen hover:text-crimsonLike px-5 transition duration-300"
                onClick={() => setNav((prev) => !prev)}
              >
                Contact Us
              </a>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default LandingPageNavbar;
