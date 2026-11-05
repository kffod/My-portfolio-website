// @flow strict
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { linkedinActivity, linkedinPosts } from "@/utils/data/linkedin-posts";
import PostCard from "../components/homepage/linkedin-posts/post-card";

export const metadata = {
  title: "LinkedIn Posts | Sachin Jadhav",
  description: "Posts by Sachin Jadhav on LinkedIn: Claude certifications, DXC Technology, cybersecurity and more.",
};

function page() {
  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All LinkedIn Posts
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          linkedinPosts.map((post, i) => (
            <PostCard post={post} key={i} />
          ))
        }
      </div>

      <div className="flex justify-center mt-8 lg:mt-12">
        <Link
          target="_blank"
          href={linkedinActivity}
          className="flex items-center gap-2 rounded-full bg-[#0a66c2] px-6 py-3 text-sm font-medium uppercase tracking-wider text-white no-underline hover:bg-[#004182] transition-all duration-200"
        >
          <FaLinkedin size={18} />
          <span>See all activity on LinkedIn</span>
        </Link>
      </div>
    </div>
  );
};

export default page;
