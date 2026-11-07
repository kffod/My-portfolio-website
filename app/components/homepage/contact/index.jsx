// @flow strict
import { personalData } from '@/utils/data/personal-data';
import Link from 'next/link';
import { BiLogoLinkedin } from "react-icons/bi";
import { BsYoutube } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaFacebook } from 'react-icons/fa';
import { IoLogoGithub } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import ContactWithoutCaptcha from './contact-without-captcha';

function ContactSection() {
  return (
    <div id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
      <h2 className="sr-only">Contact</h2>
      <div aria-hidden="true" className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <span className="bg-raised w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-raised"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <ContactWithoutCaptcha />

        <div className="lg:w-3/4 ">
          <div className="flex flex-col gap-5 lg:gap-9">
            <p className="text-sm md:text-xl flex items-center gap-3">
              <MdAlternateEmail
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>{personalData.email}</span>
            </p>
            <p className="text-sm md:text-xl flex items-center gap-3">
              <CiLocationOn
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>
                {personalData.address}
              </span>
            </p>
          </div>
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            <Link target="_blank" href={personalData.github} className="m-btn rounded-full">
              <IoLogoGithub
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.linkedIn} className="m-btn rounded-full">
              <BiLogoLinkedin
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.youtube} className="m-btn rounded-full">
              <BsYoutube
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.facebook} className="m-btn rounded-full">
              <FaFacebook
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-accent transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;