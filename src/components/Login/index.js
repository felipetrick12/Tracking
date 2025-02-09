'use client';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CLogin = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log('Data', { email, password });

			const { data } = await login({ variables: { email, password } });

			console.log('Data', data);

			if (data?.login?.token) {
				localStorage.setItem('token', data.login.token); // Save token
				router.push('/dashboard'); // Redirect to Dashboard
			}
		} catch (err) {
			console.error('Login Error:', err.message);
		}
	};

	console.log('error', error);

	return (
		<div className="flex min-h-screen flex-col justify-center align-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					className="mx-auto h-10 w-auto"
					src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
					alt="Your Company"
				/>
				<h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-900">
							Email address
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
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-900">
							Password
						</label>
						<div className="mt-2">
							<input
								type="password"
								name="password"
								id="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
							/>
						</div>
					</div>

					{error && <p className="text-red-500">{error.message}</p>}

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-indigo-600"
							disabled={loading}
						>
							{loading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CLogin;
