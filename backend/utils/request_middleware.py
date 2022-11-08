from typing import Callable

from django.core.handlers.wsgi import WSGIRequest
from django.views.generic import View

from utils.auth import get_jwt, check_jwt
from utils.data import get_data, get_params
from utils.error import UnauthorizedError

from user.serializer import user_serializer


class API_View(View):
    def __init__(self, **kwargs):
        super(**kwargs)

       # 指定模型对象
        # 类型: 模型对象
        self.model_cls

        # 指定查询集
        # 类型: 模型对象 查询集
        # self.query_set

    def get_params(self, request: WSGIRequest):
        '''获取 params 数据'''
        params = get_params(request)

        return params

    def get_data(self, request: WSGIRequest):
        '''获取 body 数据'''
        data = get_data(request)

        return data

    def get_user(self, request: WSGIRequest):
        '''获取用户'''
        is_valid, result = check_jwt(request)

        # token 异常
        if not is_valid:
            raise UnauthorizedError(result)

        user_obj = {
            # 序列化属性
            'attr': user_serializer(request, result),
            # 模型对象
            'model': result
        }

        return user_obj

    def get_base_query_set(self, request: WSGIRequest, serializer: Callable):
        '''
        获取基于 query params 更新后的查询集
        返回: (序列化后的查询集, 查询集)
        '''
        params = get_params(request)

        limit = params['limit']
        # offset = params['offset']
        serialized_filter = params['serialized_filter']
        serialized_sort = params['serialized_sort']
        
        query_set = self.model_cls.objects.all()

        if serialized_filter:
            query_set = query_set.filter(**serialized_filter)
        if serialized_sort:
            query_set = query_set.order_by(*serialized_sort)
        if limit:
            query_set = query_set[:limit]

        data = serializer(request, query_set), query_set

        return data
