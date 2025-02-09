'use client';
import { Notification } from '@/components';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import withAuthRedirect from '@/hoc/withAuthRedirect';
import { useMutation } from '@apollo/client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginScreen = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [login, { loading: loginLoading, error }] = useMutation(LOGIN_MUTATION);
	const [notification, setNotification] = useState(null);

	/**
	 * Handles the login form submission.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setNotification(null);

		try {
			const { data } = await login({ variables: { email, password } });

			if (data?.login?.token) {
				localStorage.setItem('token', data.login.token); // ✅ Store token
				setNotification({ message: 'Login Successful!', type: 'success' });

				setTimeout(() => {
					router.push('/dashboard'); // ✅ Redirect after success
				}, 1500);
			}
		} catch (err) {
			setTimeout(() => {
				setNotification({ message: 'Login Failed! Please check your credentials.', type: 'error' });
			}, 10);
			console.error('Login Error:', err.message);
		}
	};

	return (
		<div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
			{notification && <Notification message={notification.message} type={notification.type} />}

			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					className="mx-auto h-10 w-auto"
					src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=primary&shade=600"
					alt="Your Company"
				/>
				<h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-primary">
					Sign in to your account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-primary">
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
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-secondary focus:outline-primary sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-primary">
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
								{showPassword ? (
									<EyeSlashIcon className="w-5 h-5 text-gray-500" />
								) : (
									<EyeIcon className="w-5 h-5 text-gray-500" />
								)}
							</button>
						</div>
					</div>

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

// ✅ Wrap `LoginScreen` with `withAuthRedirect`
export default withAuthRedirect(LoginScreen);
