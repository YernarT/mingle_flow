from django.core.handlers.wsgi import WSGIRequest
from django.conf import settings

# 需要配置 python.analysis.extraPaths
from user.models import User

from cryptocode import encrypt, decrypt
from datetime import datetime, timedelta
from json import dumps, loads


def get_jwt(uid: int) -> str:
    # header = {
    # # 算法名称 cryptocode 加密库
    # 'alg': 'cryptocode',
    # # token 类型 (Json Web Token)
    # 'typ': 'JWT'
    # }

    payload = {
        # exp (expiration time) 过期时间
        'exp': '',
        # uid (user id) 用户 ID
        'uid': uid
    }

    # 签名
    signature = settings.SECRET_KEY

    now = datetime.now()
    token_limit = timedelta(days=365 * 100)

    payload['exp'] = (now + token_limit).strftime('%Y%m%d%H%M')

    token = encrypt(dumps(payload), signature)

    return token


def check_jwt(request: WSGIRequest):
    token = request.headers.get('X-AUTH-TOKEN', '')

    payload = decrypt(token, settings.SECRET_KEY)

    if token and payload:
        payload = loads(payload)
        exp = payload['exp']
        uid = payload['uid']

        now = datetime.now().strftime('%Y%m%d%H%M')
        # 判断 token 有效性
        if int(exp) - int(now) > 0:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                # 假token
                return False, {'message': 'X-AUTH-TOKEN жалған'}

            return True, user

        else:
            return False, {'message': 'Aвторизация мерзімі аяқталды', 're_auth': True}

    # 没token 或 假token
    return False, {'message': 'X-AUTH-TOKEN берілмеген'}
