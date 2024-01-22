from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED


from user.models import User
from user.serializer import UserSerializer, LoginSerializer

from utils.jwt import create_jwt
from utils.authentication import LoginRequiredAuthentication


class UserViewSet(ModelViewSet):
    """
    用户 API 类
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_authenticators(self):
        if self.request.method != 'POST':
            return [LoginRequiredAuthentication()]

        return super().get_authenticators()

    def get_serializer_context(self):
        """
        更新上下文对象
        对玩家做 增删改查 时, 需要确认权限
        """
        context = super().get_serializer_context()
        context.update({'request': self.request})

        return context

    def create(self, request, *args, **kwargs):
        """
        创建玩家后, 携带返回 `token` 令牌
        """
        response = super().create(request, *args, **kwargs)
        response.data['token'] = create_jwt({'uid': response.data['id']})

        return response


class LoginAPIView(APIView):
    """
    登录 API 类
    """

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        # 校验数据合法性
        serializer.is_valid(raise_exception=True)
        # 校验数据正确性 (错误时会抛出 CustomExeption, 通过 middleware 捕获)
        user = serializer.is_correct()
        # jwt 令牌
        token = create_jwt({'uid': user.id})
        # User模型 反序列化数据
        data = UserSerializer(instance=user, context={'request': request}).data
        data['token'] = token
        print(data)

        return Response({'data': data, 'Formatted': 1})
