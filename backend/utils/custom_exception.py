from rest_framework.views import set_rollback, Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.exceptions import (
    APIException,  # 所有异常的基类
    NotAuthenticated,  # 尚未认证
    AuthenticationFailed,  # 认证失败
    NotAcceptable,  # 要获取的数据格式不支持
    MethodNotAllowed,  # 请求方式不支持
    ValidationError,  # 校验失败
    ParseError,  # 解析错误
    PermissionDenied,  # 权限决绝
    UnsupportedMediaType,  # 不支持的媒体类型
    Throttled  # 限流异常
)


def custom_exception_handler(exc, context):
    """
    备注: `context` 值为
    { 
      'view': <app.views.SomeView object at 0x000001E4A1AD1D00>,
      'args': (), 'kwargs': {},
      'request': <rest_framework.request.Request: POST '/api/somethings/'> 
    }
    """

    # print('custom exception handler\nerror detail: \n', exc.detail, '\n\n')

    # 回滚数据
    set_rollback()

    # 校验 异常
    if isinstance(exc, ValidationError):

        for value in exc.detail.values():
            error_message = value[0]

            if isinstance(error_message, list):
                error_message = error_message[0]

            return Response(data={'message': error_message}, status=HTTP_400_BAD_REQUEST)

    # 解析 异常
    if isinstance(exc, ParseError):
        return Response(data={'message': '解析异常, 确保数据格式正确'}, status=HTTP_400_BAD_REQUEST)

    # 权限 异常
    if isinstance(exc, PermissionDenied):
        exc = PermissionDenied(detail='权限不足')

    # 限流 异常
    if isinstance(exc, Throttled):
        headers = {
            'Retry-After': exc.wait
        }

        return Response(data={'message': f'服务器繁忙'}, status=exc.status_code, headers=headers)

    if isinstance(exc, APIException):
        headers = {}

        if getattr(exc, 'auth_header', None):
            headers['WWW-Authenticate'] = exc.auth_header

        if isinstance(exc.detail, (list, dict)):
            data = exc.detail
        else:
            data = {'message': exc.detail}

        return Response(data, status=exc.status_code, headers=headers)

    # 自定义 异常
    if isinstance(exc, CustomException):
        return Response(data=exc.data, status=exc.status)

    return None


class CustomException(Exception):
    """用于统一异常的返回格式"""

    def __init__(
        self,
        # 错误信息
        message: str,
        # 数据
        data=None,
        # 响应状态码
        status_code=HTTP_400_BAD_REQUEST,
    ):

        self.message = message
        self.status = status_code
        if data is None:
            self.data = {'message': message}
        else:
            self.data = data

    def __str__(self):
        return self.message
