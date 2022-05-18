from typing import Any, Union, Dict

from django.core.handlers.wsgi import WSGIRequest
from django.core import serializers

from json import loads as json_loads


def get_data(request: WSGIRequest) -> Dict[str, Any]:
    '''get data from request body (raw)'''

    body = request.body

    try:
        body = body.decode('utf-8')
        if body == '':
            body = '{}'
    except:
        body = '{}'

    try:
        data = json_loads(body)
    except:
        data = {}

    return data


def get_params(request: WSGIRequest):
    '''get data from request query param'''

    def numberic_param(param_name):
        '''数字类型的校验'''
        param = request.GET.get(param_name)
        try:
            param = int(param)
            if param <= 0:
                param = None
        except Exception:
            param = None

        return param

    # limit 参数
    limit_param = numberic_param('limit')

    # offset 参数
    offset_param = numberic_param('offset')

    # filter 参数
    '''
    GET https://<hostname>:1280/api/v3/<endpoint>?
    filter={"property":"<property>","operation":"<operation>","value":"<value>"}
    # 多个filter项
    filter=[{"property":"<property>","operation":"<operation>","value":"<value>"},{...},{...}]
    '''
    filter_param = request.GET.get('filter')
    if filter_param:
        try:
            filter_param = json_loads(filter_param)
            filter_param_type = type(filter_param)

            # filter参数只能是 dict 或者 array 类型的 json-string
            if filter_param_type != dict and filter_param_type != list:
                filter_param = None

            should_contain_keys = ['property', 'operation', 'value']
            for required_key in should_contain_keys:
                if filter_param_type == dict:
                    if not filter_param.get(required_key):
                        raise Exception('filter参数格式不正确')
                else:
                    for filter_obj in filter_param:
                        if not filter_obj.get(required_key):
                            raise Exception('filter参数格式不正确')

            if filter_param_type == dict:
                if filter_param['property'].strip() == '':
                    raise Exception('filter参数含有不支持的property')
            else:
                for filter_obj in filter_param:
                    if filter_obj['property'].strip() == '':
                        raise Exception('filter参数含有不支持的property')

            allowed_operations = [
                '__gte',  # 大于等于
                '__gt',  # 大于
                '__lt',  # 小于
                '__lte',  # 小于等于
                '__in',  # 存在于一个list范围内
                '__startswith',  # 以…开头
                '__istartswith',  # 以…开头忽略大小写
                '__endswith',  # 以…结尾
                '__iendswith',  # 以…结尾，忽略大小写
                '__range',  # 在…范围内
                '__year',  # 日期字段的年份
                '__month',  # 日期字段的月份
                '__day',  # 日期字段的日
                '__isnull',  # =True/False
                '__overlap',  # 集合至少有一个元素重合
                '__contains',  # 集合包含
                '__regex',  # 匹配正则表达式
            ]
            if filter_param_type == dict:
                if filter_param['operation'] not in allowed_operations:
                    raise Exception('filter参数含有不支持的operation')
            else:
                for filter_obj in filter_param:
                    if filter_obj['operation'] not in allowed_operations:
                        raise Exception('filter参数含有不支持的operation')

        except Exception:
            filter_param = None
    # 排除 filter=''
    else:
        filter_param = None

    # 序列化 filter 参数
    if filter_param:
        serialized_filter = {}
        if filter_param_type == dict:
            serialized_filter[filter_param['property'] +
                              filter_param['operation']] = filter_param['value']
        else:
            for filter_obj in filter_param:
                serialized_filter[filter_obj['property'] +
                                  filter_obj['operation']] = filter_obj['value']
    else:
        serialized_filter = None

    # sort 参数
    '''
    GET https://<hostname>:1280/api/v3/<endpoint>?
    sort={"property":"<property>","direction":"<operation>"}
    # 多个sort项
    sort=[{"property":"<property>","direction":"<operation>"}, {...}, {...}]
    '''
    sort_param = request.GET.get('sort')
    if sort_param:
        try:
            sort_param = json_loads(sort_param)
            sort_param_type = type(sort_param)

            # sort参数只能是 dict 或者 array 类型的 json-string
            if sort_param_type != dict and sort_param_type != list:
                sort_param = None

            should_contain_keys = ['property', 'direction']
            for required_key in should_contain_keys:
                if sort_param_type == dict:
                    if not sort_param.get(required_key):
                        raise Exception('sort参数格式不正确')
                else:
                    for sort_obj in sort_param:
                        if not sort_obj.get(required_key):
                            raise Exception('sort参数格式不正确')

            if sort_param_type == dict:
                if sort_param['property'].strip() == '':
                    raise Exception('sort参数含有不支持的property')
            else:
                for sort_obj in sort_param:
                    if sort_obj['property'].strip() == '':
                        raise Exception('sort参数含有不支持的property')

            allowed_direction = ['ascending', 'descending']
            if sort_param_type == dict:
                if sort_param['direction'] not in allowed_direction:
                    raise Exception('sort参数含有不支持的direction')
            else:
                for sort_obj in sort_param:
                    if sort_obj['direction'] not in allowed_direction:
                        raise Exception('sort参数含有不支持的direction')

        except Exception:
            sort_param = None
    # 排除 sort=''
    else:
        sort_param = None

    # 序列化 sort 参数
    if sort_param:
        serialized_sort = []
        if sort_param_type == dict:
            direction = '-' if sort_param['direction'] == 'descending' else ''
            serialized_sort.append(direction+sort_param['property'])
        else:
            for sort_obj in sort_param:
                direction = '-' if sort_obj['direction'] == 'descending' else ''
                serialized_sort.append(direction+sort_obj['property'])
    else:
        serialized_sort = None

    params = {
        'limit': limit_param,
        'offset': offset_param,
        'filter': filter_param,
        'serialized_filter': serialized_filter,
        'sort': sort_param,
        'serialized_sort': serialized_sort,

        'params': request.GET,
    }

    return params


def verify_data(data: Any, required: bool = True, data_type: Any = str,
                min_length: int = None, max_length: int = None,
                min: int = None, max: int = None, regex=None, error_messages: Dict[str, str] = {}):

    no_need_verify = data is None and not required

    if no_need_verify:
        return True, None

    if required and data is None:
        return False, error_messages.get('required', 'міндетті өріс')

    if data_type and not isinstance(data, data_type):
        return False, error_messages.get('data_type', 'дұрыс емес тип')

    if data_type == str:
        if min_length and len(data) < min_length:
            return False, error_messages.get('min_length', 'минималды ұзындығынан аз')

        if max_length and len(data) > max_length:
            return False, error_messages.get('max_length', 'максималды ұзындығынан артық')

        from re import match as re_match
        if regex and re_match(regex, data) is None:
            return False, error_messages.get('regex', 'ережеге сәйкес емес')

    if data_type == int:
        if min and data < min:
            return False, error_messages.get('min', 'минималды мәннен аз')
        if max and data > max:
            return False, error_messages.get('max', 'максималды мәннен артық')

    return True, None


def serialized_data(request: WSGIRequest, data: Any, options: Dict[str, any] = {
    'is_multiple': True,
    'include_fields': '__all__',
    'exclude_fields': [],
    'hypermedia_fields': []
}) -> Union[dict, list]:

    data = serializers.serialize(
        'json', data if options.get('is_multiple', True) else [data])
    data = json_loads(data)

    def customize_serialized_fileds(serialized_data: list) -> Union[dict, list]:
        result = [dict({'id': data.get('pk')}, **data.get('fields'))
                  for data in serialized_data]

        # 处理 includes_fields 选项
        include_fields = options.get('include_fields', '__all__')
        if include_fields != '__all__':
            temp = []
            for data in result:
                new_data = {}
                for field in include_fields:
                    new_data[field] = data.get(field)
                temp.append(new_data)

            result = temp

        # 处理 exclude_fields 选项
        exclude_fields = options.get('exclude_fields', [])
        if exclude_fields != []:
            for data in result:
                for field in exclude_fields:
                    if data.get(field) != None:
                        data.pop(field)

        # 处理 hypermedia_fields 选项
        hypermedia_fields = options.get('hypermedia_fields', [])
        if hypermedia_fields != []:
            for data in result:
                for hypermedia_field in hypermedia_fields:
                    field = data.get(hypermedia_field)
                    if field != None and field != '':
                        data[hypermedia_field] = get_media_url(request, field)
                    else:
                        data[hypermedia_field] = None

        # 处理 is_multiple 选项
        if options.get('is_multiple', True):
            return result
        return result[0]

    return customize_serialized_fileds(data)


def get_media_url(request: WSGIRequest, resource_url: str) -> str:
    '''get the full path of the media resource'''
    from django.conf import settings

    server_protocol = request.META.get('SERVER_PROTOCOL')[
        :request.META.get('SERVER_PROTOCOL').find('/')
    ].lower()
    host = request.META.get('HTTP_HOST')

    return server_protocol + '://' + host + settings.MEDIA_URL + str(resource_url)
