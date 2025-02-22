'use client';
import { useMutation } from '@apollo/client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { useAuth } from '@/context/AuthProvider';
import { LOGIN_MUTATION } from '@/graphql/mutations';
import Image from 'next/image';

const LoginPage = () => {
	const { auth, setAuth } = useAuth(); // ✅ Verificar si el usuario ya está autenticado
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);

	const [login, { loading }] = useMutation(LOGIN_MUTATION, {
		credentials: 'include', // 🔥 Enviar cookies con la solicitud
		onCompleted: (data) => {
			if (data?.login?.user) {
				toast.success('✅ Login Successful! Redirecting...');

				// ✅ Guardar usuario en el estado global (ya no manejamos token manualmente)
				setAuth({ user: data.login.user });

				// 🚀 Redirigir al dashboard
				router.push('/dashboard');
			}
		},
		onError: (error) => {
			toast.error('❌ Login Failed: Invalid credentials.');
			console.log('Login Error:', error.message);
		}
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login({ variables: { email, password } });
	};

	return (
		<div className="flex min-h-screen flex-col justify-center items-center bg-white ">
			<Toaster position="top-right" />

			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<Image
					className="mx-auto"
					src={'/assets/Images/Vector.png'}
					alt="Your Company"
					width={200}
					height={20}
				/>
				<h2 className="mt-5 text-center text-[25px] font-bold  text-sm text-primary font-bold">
					Pinnacle Management
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* ✅ Campo de Email */}
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

					{/* ✅ Campo de Password */}
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
								{showPassword ? (
									<EyeIcon className="w-5 h-5 text-gray-500" />
								) : (
									<EyeSlashIcon className="w-5 h-5 text-gray-500" />
								)}
							</button>
						</div>
					</div>

					{/* ✅ Botón de Login */}
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
