from django.conf import settings
from jwt import encode as jwt_encode, decode as jwt_decode, ExpiredSignatureError

from datetime import datetime, timedelta, timezone

from user.models import User

jwt_config = {
    'key': settings.SECRET_KEY,
    'exp': (datetime.now(tz=timezone.utc) + timedelta(days=30*6)).timestamp(),
    'algorithm': 'HS256'
}


def create_jwt(payload: dict) -> str:
    '''
    创建 JWT, payload 为: { uid: Player.id }
    '''
    payload['exp'] = jwt_config['exp']

    return jwt_encode(payload, key=jwt_config['key'], algorithm=jwt_config['algorithm'])


def check_jwt(encoded: str):
    '''
    检查 JWT, 返回 具体玩家的 数据库模型对象
    '''

    try:
        payload = jwt_decode(encoded, key=jwt_config['key'], algorithms=[
                             jwt_config['algorithm']])
    except ExpiredSignatureError:
        # 令牌过期
        return False, '授权已过期, 重新登录'
    except Exception:
        # 伪令牌!
        return False, '授权信息被拒, 重新登录'

    # TODO: 令牌未过期, 但玩家被拉黑, 删除 (is_delete=True) 等情况
    player = User.objects.get(id=payload['uid'])

    return True, player
