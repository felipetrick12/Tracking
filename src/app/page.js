'use client';

import { LOGIN_MUTATION } from '@/graphql/mutations';
import { useApolloClient, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { userVar } from './ApolloConfig';

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);

	const client = useApolloClient();

	const [login] = useMutation(LOGIN_MUTATION, {
		credentials: 'include',
		onCompleted: async (data) => {
			if (data?.login?.user) {
				toast.success('✅ Login Successful! Redirecting...');
				userVar(data.login.user);
				await client.resetStore(); // 🔥 Resetea caché y vuelve a cargar `GET_ME`
				router.push('/dashboard');
			}
		}
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoginLoading(true);

		try {
			const { data } = await login({ variables: { email, password } });

			if (data?.login?.user) {
				toast.success('✅ Login Successful! Redirecting...');

				// 🚀 Redirect to a protected route to trigger the middleware
				router.push('/dashboard');
				router.refresh(); // 🔥 Ensure the middleware detects the new session
			}
		} catch (error) {
			toast.error('❌ Login Failed: Invalid credentials.');
			console.error('Login Error:', error.message);
		}

		setLoginLoading(false);
	};

	return (
		<div className="flex min-h-screen flex-col justify-center items-center bg-white ">
			<Toaster position="top-right" />

			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<Image className="mx-auto" src={'/assets/Images/logo.png'} alt="Your Company" width={200} height={20} />
				<h2 className="mt-5 text-center text-2xl font-bold text-primary font-bold">Pinnacle Management</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* ✅ Email Field */}
					<div>
						<label htmlFor="email" className="block text-sm text-[16px] text-primary font-bold">
							Email
						</label>
						<div className="mt-2">
							<input
								type="email"
								name="email"
								id="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-secondary focus:outline-primary sm:text-sm"
							/>
						</div>
					</div>

					{/* ✅ Password Field */}
					<div>
						<label htmlFor="password" className="block text-sm text-[16px] text-primary font-bold">
							Password
						</label>
						<div className="mt-2 relative">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								id="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-secondary focus:outline-primary sm:text-sm pr-10"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-3 flex items-center"
								onClick={() => setShowPassword((prev) => !prev)}
							>
								{showPassword ? '🙈' : '👁️'}
							</button>
						</div>
					</div>

					{/* ✅ Login Button */}
					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-secondary focus:outline-primary"
							disabled={loginLoading}
						>
							{loginLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
