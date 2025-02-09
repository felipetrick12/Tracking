import CLogin from '@/components/Login';
import RootLayout from './layout';

export default function Home() {
	console.log('se renderiza');

	return (
		<RootLayout>
			<CLogin />
		</RootLayout>
	);
}
