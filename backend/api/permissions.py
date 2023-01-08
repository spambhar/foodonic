from rest_framework import permissions

from .choices import ADMIN, NGO, DONOR


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return perform_check(request, ADMIN)


class IsNgo(permissions.BasePermission):
    def has_permission(self, request, view):
        return perform_check(request, NGO)


class IsDonor(permissions.BasePermission):
    def has_permission(self, request, view):
        return perform_check(request, DONOR)


def perform_check(request, role):
    if not request.user.is_authenticated:
        return False
    return request.user.role == role
