from django.contrib.auth.hashers import check_password
from django.core.validators import FileExtensionValidator


from rest_framework import serializers
from user.models import User

from utils.custom_exception import CustomException


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(label='ID', read_only=True)
    fullname = serializers.CharField(
        label='Аты-жөн', max_length=24, trim_whitespace=True, error_messages={
            'blank': 'Аты-жөн міндетті',
            'required': 'Аты-жөн міндетті',
            'max_length': 'Аты-жөн 24 таңбадан аспауы қажет',
        })
    email = serializers.CharField(
        label='Email', max_length=64, trim_whitespace=True, error_messages={
            'blank': 'Email міндетті',
            'required': 'Email міндетті',
            'max_length': 'Email 64 таңбадан аспауы қажет',
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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        avatar = data.get('avatar')
        
        if avatar:
            request = self.context.get('request')
            file_url = request.build_absolute_uri(avatar)
            data['avatar'] = file_url

        return data

    class Meta:
        model = User
        fields = '__all__'
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=User.objects.all(),
                fields=['email'],
                message='Email тіркелген'
            )
        ]


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(
        label='Email', max_length=64, trim_whitespace=True, error_messages={
            'blank': 'Email міндетті',
            'required': 'Email міндетті',
            'max_length': 'Email 64 таңбадан аспауы қажет',
        })
    password = serializers.CharField(label='Құпия сөз', max_length=254, trim_whitespace=True, write_only=True, error_messages={
        'blank': 'Құпия сөз міндетті',
        'required': 'Құпия сөз міндетті',
        'max_length': 'Құпия сөз 254 таңбадан аспауы қажет',
    })

    def is_correct(self):
        """校验数据正确性, 返回 User模型对象"""
        email, password = self.initial_data['email'], self.initial_data['password']
        user = User.objects.filter(email=email)

        if user.exists():
            user = user.first()
            if not check_password(password, user.password):
                raise CustomException(message='Құпиясөз қате')
            return user

        return User.objects.create(email=email, password=password)
