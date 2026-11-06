// @flow strict
import Link from 'next/link';
import { BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function PostCard({ post }) {
  return (
    <div className="border border-line hover:border-edge transition-all duration-500 bg-surface rounded-lg relative group flex flex-col">
      <div className="h-1 w-full rounded-t-lg bg-gradient-to-r from-[#0a66c2] via-violet-500 to-pink-500" />
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center text-accent text-sm">
          <p className="flex items-center gap-2">
            <FaLinkedin size={16} className="text-[#0a66c2] bg-white rounded-sm" />
            {formatDate(post.date)}
          </p>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1">
              <BsHeartFill />
              <span>{post.reactions}</span>
            </p>
            {post.comments > 0 &&
              <p className="flex items-center gap-1">
                <FaCommentAlt />
                <span>{post.comments}</span>
              </p>
            }
          </div>
        </div>

        <Link target='_blank' href={post.url}>
          <p className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-violet-500'>
            {post.title}
          </p>
        </Link>

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs text-accent border border-accent/40 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <p className='text-sm lg:text-base text-soft pb-4 line-clamp-4 flex-1'>
          {post.excerpt}
        </p>

        <Link
          target='_blank'
          href={post.url}
          className="flex items-center gap-1 hover:gap-3 text-sm text-violet-400 hover:text-pink-500 transition-all duration-200 w-fit"
        >
          <span>Read on LinkedIn</span>
          <FaArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
