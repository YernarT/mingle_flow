from django.http import JsonResponse
from django.contrib.auth.hashers import check_password

from user.models import User
from user.serializer import user_serializer

from utils.auth import get_jwt
from utils.request_middleware import API_View
from utils.error import UnauthorizedError


class LoginAPI(API_View):
    model_cls = User
    query_set = User.objects.all()

    def post(self, request):
        data = self.get_data(request)
        username = data['username']
        password = data['password']

        try:
            user_model = self.query_set.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Авторизация сәтсіз болды'}, status=400)

        if check_password(password, user_model.password):
            return JsonResponse({'message': 'авторизация сәтті болды',
                                 'access_token': get_jwt(user_model.id),
                                 'user': user_serializer(request, user_model)
                                 }, status=200)

        return JsonResponse({'message': 'Авторизация сәтсіз болды'}, status=400)


class RegisterAPI(API_View):
    model_cls = User
    query_set = User.objects.all()

    def post(self, request):
        data = self.get_data(request)
        username = data['username']

        try:
            have_same_username_user = self.query_set.get(username=username)
        except User.DoesNotExist:
            have_same_username_user = False

        if have_same_username_user:
            return JsonResponse({'message': 'Пайдаланушы атауы тіркелген'}, status=400)

        user_model = self.model_cls.objects.create(**data)

        return JsonResponse({'message': 'Тіркелу сәтті аяқталды',
                             'access_token': get_jwt(user_model.id),
                             'user': user_serializer(request, user_model)
                             }, status=201)


class UserAPI(API_View):
    model_cls = User
    query_set = User.objects.all()

    def put(self, request):

        try:
            user = self.get_user(request)['model']
        except (UnauthorizedError) as e:
            return JsonResponse(**e.response_context)

        data = self.get_data(request)
        username = data['username']

        try:
            have_same_username_user = self.query_set.get(username=username)
        except User.DoesNotExist:
            have_same_username_user = False

        if have_same_username_user:
            return JsonResponse({'message': 'Пайдаланушы атауы бос емес'}, status=400)

        user.username = username
        user.save()

        return JsonResponse({
            'username': username,
            'message': 'Сәтті өзгертілді'
        }, status=200)


class UserAvatarAPI(API_View):
    model_cls = User
    query_set = User.objects.all()

    def post(self, request):
        try:
            user = self.get_user(request)['model']
        except (UnauthorizedError) as e:
            return JsonResponse(**e.response_context)

        avatar = request.FILES.get('avatar')

        if not avatar:
            return JsonResponse({
                'message': 'Суретді жүктеу керек'
            }, status=400)

        user.avatar = avatar
        user.save()

        return JsonResponse({
            'avatar': user_serializer(request, user)['avatar']
        }, status=201)
