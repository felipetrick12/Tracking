'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

// ✅ GraphQL Mutation to Create an Organization
const CREATE_ORGANIZATION = gql`
	mutation CreateOrganization(
		$name: String!
		$address: String
		$city: String
		$state: String
		$zipCode: String
		$phone: String
		$notes: String
		$admins: [ID]
	) {
		createOrganization(
			name: $name
			address: $address
			city: $city
			state: $state
			zipCode: $zipCode
			phone: $phone
			notes: $notes
			admins: $admins
		) {
			id
			name
			address
			city
			state
			zipCode
			phone
		}
	}
`;

const AddOrganizationForm = ({ onOrganizationCreated }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		phone: '',
		notes: ''
	});

	// ✅ Apollo Mutation Hook
	const [createOrganization, { loading, error }] = useMutation(CREATE_ORGANIZATION, {
		onCompleted: (data) => {
			onOrganizationCreated(data.createOrganization); // 🔄 Update table
			setIsOpen(false); // Close modal after success
		}
	});

	// ✅ Handle Input Change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// ✅ Handle Form Submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		await createOrganization({ variables: formData });
	};

	return (
		<>
			{/* 🔹 Open Modal Button */}
			<button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
				Add Organization
			</button>

			{/* 🔹 Modal */}
			{isOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-lg font-bold mb-4">Create Organization</h2>
						<form onSubmit={handleSubmit} className="space-y-3">
							<input
								type="text"
								name="name"
								placeholder="Organization Name"
								className="border p-2 w-full"
								onChange={handleChange}
								required
							/>
							<input
								type="text"
								name="address"
								placeholder="Address"
								className="border p-2 w-full"
								onChange={handleChange}
							/>
							<input
								type="text"
								name="city"
								placeholder="City"
								className="border p-2 w-full"
								onChange={handleChange}
							/>
							<input
								type="text"
								name="state"
								placeholder="State"
								className="border p-2 w-full"
								onChange={handleChange}
							/>
							<input
								type="text"
								name="zipCode"
								placeholder="Zip Code"
								className="border p-2 w-full"
								onChange={handleChange}
							/>
							<input
								type="text"
								name="phone"
								placeholder="Phone"
								className="border p-2 w-full"
								onChange={handleChange}
							/>
							<textarea
								name="notes"
								placeholder="Notes"
								className="border p-2 w-full"
								onChange={handleChange}
							></textarea>

							{/* 🔹 Submit Button */}
							<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
								{loading ? 'Creating...' : 'Create'}
							</button>

							{/* 🔹 Close Modal Button */}
							<button onClick={() => setIsOpen(false)} className="ml-2 bg-gray-300 px-4 py-2 rounded-md">
								Cancel
							</button>

							{/* 🔹 Error Message */}
							{error && <p className="text-red-500">{error.message}</p>}
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddOrganizationForm;
