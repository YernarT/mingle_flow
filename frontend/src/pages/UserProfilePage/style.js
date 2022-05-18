import styled from 'styled-components';
import { scrollStyle } from '@/assets/style';

export const UserProfileStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 40px;

	padding-bottom: 40px;

	.user-info {
		display: flex;
		align-items: center;

		.avatar {
			width: 125px;
			height: 125px;

			margin-right: 36px;
		}

		.info {
			* {
				margin-bottom: 0;
			}
		}

		.edit-profile {
			margin-left: auto;
		}

		@media screen and (max-width: 700px) {
			& {
				flex-direction: column;
				justify-content: center;

				.avatar {
					margin-bottom: 20px;
					margin-right: 0;
				}

				.info {
					width: 100%;
					align-items: center;
				}

				.edit-profile {
					margin-top: 20px;
					width: 100%;
				}
			}
		}
	}

	.team-section,
	.task-section {
		.header {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 15px;

			margin-bottom: 15px;

			.title {
				margin-bottom: 0;
			}

			button {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.teams,
		.tasks {
			display: flex;
			gap: 20px;

			> * {
				flex-basis: 50%;
			}

			@media screen and (max-width: 920px) {
				flex-direction: column;

				> * {
					flex-basis: 100%;
				}
			}
		}
	}
`;

export const TeamsStyled = styled.ul`
	padding: 0;
	margin: 0;

	${({ hasTeam }) =>
		hasTeam
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

export const TeamItemStyled = styled.li`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;

	cursor: pointer;

	.team-icon {
		font-size: 2rem;
	}

	.team-name {
		text-align: center;
	}
`;

export const TasksStyled = styled.ul`
	padding: 0;
	margin: 0;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;

	overflow: auto hidden;
	${scrollStyle}
`;

export const TaskItemStyled = styled.li`
	width: 100%;
	padding: 8px 16px;
	border: 1px solid #000;

	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background: aliceblue;
	}

	.task-name {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		margin-bottom: 0;
	}
`;
