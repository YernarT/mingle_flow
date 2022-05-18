import styled from 'styled-components';

export const EditProfileStyled = styled.div`
	.form-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.edit-form {
			flex-basis: 50%;

			.submit-btn {
				margin-top: 8px;
			}
		}

		.avatar-form {
			flex-basis: 50%;
			display: flex;
			justify-content: center;

			.avatar-wrap {
				width: 200px;
				height: 200px;
				border-radius: 50%;

				position: relative;
				overflow: hidden;

				.ant-avatar {
					width: 200px;
					height: 200px;
				}

				&:hover {
					.mask {
						top: 125px;
					}
				}

				.mask {
					position: absolute;
					top: 200px;
					left: 50%;
					transform: translateX(-50%);

					width: 200px;
					height: 100px;
					padding: 16px 24px;

					text-align: center;
					color: #fff;
					background: rgba(0, 0, 0, 0.25);

					cursor: pointer;
					transition: top 0.3s ease;
				}

				.avatar-input {
					display: none;
				}
			}
		}
	}

	@media screen and (max-width: 700px) {
		.title {
			text-align: center;
		}

		.form-wrap {
			flex-direction: column-reverse;
			gap: 24px;

			.edit-form {
				width: 100%;
			}
		}
	}
`;
