import Link from "next/link";
import { formatDate, getBlogPosts } from "app/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Nextfolio Blog",
};

export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Entries</h1>
      <div>
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              className="flex flex-col space-y-1 mb-4 transition-all duration-200 hover:bg-[papayawhip] dark:hover:bg-[#574b3c] p-2 rounded-md"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col space-y-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:space-x-2">
                  <p className="text-black dark:text-white tracking-tight">
                    {post.metadata.title}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm shrink-0">
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-[85%] line-clamp-2">
                  {post.metadata.summary}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
