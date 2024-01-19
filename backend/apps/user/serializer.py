from django.contrib.auth.hashers import check_password
from django.core.validators import FileExtensionValidator


from rest_framework import serializers
from user.models import User

from utils.custom_exception import CustomException


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(label='ID', read_only=True)
    username = serializers.CharField(
        label='Аты-жөн', max_length=24, trim_whitespace=True, error_messages={
            'blank': 'Аты-жөн міндетті',
            'required': 'Аты-жөн міндетті',
            'max_length': 'Аты-жөн 24 таңбадан аспауы қажет',
        })
    password = serializers.CharField(label='Құпия сөз', max_length=254, trim_whitespace=True, write_only=True, error_messages={
        'blank': 'Құпия сөз міндетті',
        'required': 'Құпия сөз міндетті',
        'max_length': 'Құпия сөз 254 таңбадан аспауы қажет',
    })
    avatar = serializers.FileField(label='Аватар', required=False, validators=[
                                   FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])])
    create_time = serializers.DateTimeField(
        label='Тіркелген уақыт', read_only=True)

    class Meta:
        model = User
        fields = '__all__'
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=User.objects.all(),
                fields=['username'],
                message='Аты-жөн тіркелген'
            )
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        label='Аты-жөн', max_length=24, trim_whitespace=True, error_messages={
            'blank': 'Аты-жөн міндетті',
            'required': 'Аты-жөн міндетті',
            'max_length': 'Аты-жөн 24 таңбадан аспауы қажет',
        })
    password = serializers.CharField(label='Құпия сөз', max_length=254, trim_whitespace=True, write_only=True, error_messages={
        'blank': 'Құпия сөз міндетті',
        'required': 'Құпия сөз міндетті',
        'max_length': 'Құпия сөз 254 таңбадан аспауы қажет',
    })

    def is_correct(self):
        """校验数据正确性, 返回 User模型对象"""
        username, password = self.initial_data['username'], self.initial_data['password']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise CustomException(message='Аты-жөн тіркелмеген')

        if not check_password(password, user.password):
            raise CustomException(message='Құпиясөз қате')

        return user


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        label='Аты-жөн', max_length=24, trim_whitespace=True, error_messages={
            'blank': 'Аты-жөн міндетті',
            'required': 'Аты-жөн міндетті',
            'max_length': 'Аты-жөн 24 таңбадан аспауы қажет',
        })
    password = serializers.CharField(label='Құпия сөз', max_length=254, trim_whitespace=True, write_only=True, error_messages={
        'blank': 'Құпия сөз міндетті',
        'required': 'Құпия сөз міндетті',
        'max_length': 'Құпия сөз 254 таңбадан аспауы қажет',
    })

    def register(self):
        """校验数据正确性, 返回 User模型对象"""
        username, password = self.initial_data['username'], self.initial_data['password']

        if User.objects.filter(username=username).exists():
            raise CustomException(message='Аты-жөн тіркелген')

        return User.objects.create(username=username, password=password)
