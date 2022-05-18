import styled from 'styled-components';
import { scrollStyle } from '@/assets/style';

export const TeamPageStyled = styled.div`
	.team-name {
		text-align: center;
		width: 100%;
		display: block;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.box {
		display: flex;
		gap: 20px;

		@media screen and (max-width: 920px) {
			flex-direction: column;
		}

		> * {
			flex-basis: 50%;
		}

		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
`;

export const MembersStyled = styled.ul`
	padding: 0;
	margin: 0;

	${({ hasMember }) =>
		hasMember
			? `
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		`
			: `
		display: flex;
		justify-content: center;
		align-items: center;
		`};

	max-height: 200px;
	overflow: auto;
	${scrollStyle}
`;

export const TeamMemberStyled = styled.li`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;

	.avatar {
		width: 36px;
		height: 36px;
	}

	.username {
		text-align: center;
	}
`;
