import { useHistory } from 'react-router-dom';
import { useMount } from 'ahooks';

export default function useAuth(token, beforeReplace) {
	const history = useHistory();

	useMount(() => {
		if (!token) {
			beforeReplace && beforeReplace();
			history.replace('/login');
		}
	});
}
