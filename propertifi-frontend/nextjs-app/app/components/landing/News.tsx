import React from 'react';

interface Post {
    category: string;
    title: string;
    excerpt: string;
    gradientFrom: string;
    gradientTo: string;
}

const NewsCard: React.FC<{ post: Post }> = ({ post }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group h-full flex flex-col">
        <div className="overflow-hidden">
            <div className={`w-full h-48 bg-gradient-to-br ${post.gradientFrom} ${post.gradientTo} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <p className="text-propertifi-blue font-semibold text-sm mb-2">{post.category}</p>
            <h3 className="text-lg font-bold text-propertifi-gray-900 mb-3 flex-grow">{post.title}</h3>
            <p className="text-propertifi-gray-500 mb-4 text-sm">{post.excerpt}</p>
            <a href="#" className="font-bold text-propertifi-orange hover:underline mt-auto">Read More &rarr;</a>
        </div>
    </div>
);

const News: React.FC = () => {
    const posts: Post[] = [
        {
            category: 'Rental Property Management',
            title: 'How Much do Property Management Services Cost in California?',
            excerpt: 'Property Management Services Cost in California has become a hot topic in the recent years, and for good reason. Most firms now quote a...',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-blue-700'
        },
        {
            category: 'Rental Property Management',
            title: '11 Benefits of Hiring a Property Management Company: Boost Cashflow & Cut Stress!',
            excerpt: 'A recent state-of-the-industry report indicates that nearly 36% of U.S. rental homes are now in the hands of property managers, ...',
            gradientFrom: 'from-orange-500',
            gradientTo: 'to-orange-700'
        },
        {
            category: 'Rental Property Management',
            title: 'How to Hire Commercial Property Management Services? 10 Smart Questions to Ask',
            excerpt: 'In the real estate market where even a single week of vacancy or a delayed repair can erode net operating income, owners quickly discover t...',
            gradientFrom: 'from-purple-500',
            gradientTo: 'to-purple-700'
        }
    ];

    return (
        <section className="py-20 bg-propertifi-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-propertifi-gray-900">
                        Latest News and <span className="text-propertifi-orange">Tips</span>
                    </h2>
                    <p className="mt-4 text-lg text-propertifi-gray-500">Insights and tips for effective property management</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <NewsCard key={index} post={post} />
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <a href="#" className="bg-propertifi-orange hover:bg-propertifi-orange-dark text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 text-lg">
                        View All Blog Posts
                    </a>
                </div>
            </div>
        </section>
    );
};

export default News;
