from rest_framework.pagination import PageNumberPagination


class ItemPagination(PageNumberPagination):
    page_size = 6

