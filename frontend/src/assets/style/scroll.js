import { css } from 'styled-components';

export default css`
	// 丝滑滚动
	scroll-behavior: smooth;
	&::-webkit-scrollbar {
		width: 4px;
		height: 4px;
		background-color: transparent;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 0;
		background-color: transparent;
	}
	&:hover::-webkit-scrollbar-thumb {
		background-color: #1890ff;
	}
	&::-webkit-scrollbar-track {
		border-radius: 0;
	}
	&:hover::-webkit-scrollbar-track {
		background-color: #000;
	}
`;
