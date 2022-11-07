import { atom } from 'recoil';
import { localStorage } from '@/utils';

export const defaultUserState = {
	id: null,
	username: '',
	avatar: null,

	createTime: null,

	// API 访问令牌
	token: '',
};

const state = localStorage.get('user', defaultUserState);

export const userAtom = atom({
	key: 'userAtom',
	// default value, aka initial value
	default: state,
});
