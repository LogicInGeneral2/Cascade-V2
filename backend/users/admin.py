from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Classes
from django.utils.translation import gettext_lazy as _


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Personal info"),
            {"fields": ("first_name", "last_name", "email", "avatar")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Additional info"), {"fields": ("status",)}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "status",
                    "avatar",
                ),
            },
        ),
    )
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "status",
        "avatar",
    )
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)


admin.site.register(CustomUser, CustomUserAdmin)


class ClassesAdmin(admin.ModelAdmin):
    list_display = (
        "subject",
        "avatar",
        "code",
        "start_date",
        "teacher",
    )
    fieldsets = (
        (None, {"fields": ("subject", "avatar", "code", "teacher", "students")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("subject", "avatar", "code", "teacher", "students"),
            },
        ),
    )
    search_fields = ("subject", "avatar", "code", "start_date", "teacher__username")
    ordering = ("subject", "avatar", "code", "start_date", "teacher__username")
    filter_horizontal = ("students",)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "students":
            kwargs["queryset"] = CustomUser.objects.filter(status="Student")
        return super().formfield_for_manytomany(db_field, request, **kwargs)


admin.site.register(Classes, ClassesAdmin)
