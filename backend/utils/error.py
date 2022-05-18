class UnauthorizedError(Exception):
    '''授权失败 的异常'''

    def __init__(self, message):
        self.response_context = {
            'data': message,
            'status': 401
        }

        super().__init__('授权失败')
