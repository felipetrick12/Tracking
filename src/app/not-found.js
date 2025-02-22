import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white text-white text-center px-6">
			<h1 className="text-6xl font-bold text-black">404</h1>
			<h2 className="text-2xl font-semibold text-black mt-4">Page Not Found</h2>
			<p className="text-gray-400 mt-2">Sorry, the page you are looking for does not exist.</p>

			<Link href="/">
				<button className="mt-6 px-6 py-3 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-300 transition">
					Go Back Home
				</button>
			</Link>
		</div>
	);
}
