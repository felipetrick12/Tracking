import Link from 'next/link';

export default function Custom404() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white text-center px-6">
			<h1 className="text-6xl font-bold text-red-600">404</h1>
			<h2 className="text-2xl font-semibold text-gray-800 mt-4">Página no encontrada</h2>
			<p className="text-gray-500 mt-2">Lo sentimos, la página que buscas no existe.</p>

			<Link href="/">
				<button className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition">
					Volver al inicio
				</button>
			</Link>
		</div>
	);
}
