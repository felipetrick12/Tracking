import { userVar } from '@/app/ApolloConfig';
import { GET_ME } from '@/graphql/queries/auth';
import { useQuery, useReactiveVar } from '@apollo/client';

export const useUser = () => {
	const user = useReactiveVar(userVar);

	const { loading, error } = useQuery(GET_ME, {
		skip: !!user,
		onCompleted: (data) => {
			if (data?.me) {
				userVar(data.me);
			}
		}
	});

	return { user, loading, error };
};
