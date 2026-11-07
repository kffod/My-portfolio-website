// @flow strict
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { linkedinPosts } from '@/utils/data/linkedin-posts';
import PostCard from './post-card';

function LinkedInPosts() {

  return (
    <div id='posts' className="relative z-50 border-t my-12 lg:my-24 border-line">

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-edge to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <h2 className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md">
            LinkedIn Posts
          </h2>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          linkedinPosts.slice(0, 6).map((post, i) => (
            <PostCard post={post} key={i} />
          ))
        }
      </div>

      <div className="flex justify-center  mt-5 lg:mt-12">
        <Link
          className="m-btn m-arrow flex items-center gap-1 rounded-full bg-accent hover:bg-accent/90 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-page no-underline transition-all duration-200 ease-out hover:text-page hover:no-underline md:font-semibold"
          role="button"
          href="/posts"
        >
          <span>View All Posts</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default LinkedInPosts;
