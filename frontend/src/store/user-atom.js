/**
 * 用户相关全局状态
 */

import { atom } from 'recoil';
import { getLatestState, localStorage } from '@/utils';

export const defaultUserState = {
	id: null,
	username: '',
	avatar: null,

	createTime: null,

	// API 访问令牌
	token: '',
};

const [isValid, state] = getLatestState(
	localStorage.get('user', {}),
	defaultUserState,
);

// LocalStorage内数据"过期"
if (!isValid) {
	localStorage.set('user', state);
}

export const userAtom = atom({
	key: 'userAtom',
	// default value, aka initial value
	default: state,
});
