'use client';

import { LOGIN_MUTATION } from '@/graphql/mutations';
import { useToast } from '@/hooks/use-toast';
import { useApolloClient, useMutation } from '@apollo/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { userVar } from './ApolloConfig';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
	const router = useRouter();
	const client = useApolloClient();
	const { toast } = useToast();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
		credentials: 'include',
		onCompleted: async (data) => {
			if (data?.login?.user) {
				toast({ title: '✅ Login Successful!' });
				userVar(data.login.user);
				// await client.resetStore();
				router.push('/dashboard');
				router.refresh();
			}
		},
		onError: (error) => {
			toast({ variant: 'destructive', title: '❌ Login Failed', description: error.message });
		}
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login({ variables: { email, password } });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-white px-4">
			<Card className="w-full max-w-sm shadow-md">
				<CardHeader className="text-center">
					<Image src="/assets/images/logo.png" alt="Logo" width={100} height={100} className="mx-auto" />
					<CardTitle className="text-2xl font-bold text-primary mt-2">Pinnacle Management</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						{/* Email Field */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						{/* Password Field */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pr-10"
								/>
								<button
									type="button"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
									onClick={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? '🙈' : '👁️'}
								</button>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={loginLoading}>
							{loginLoading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
