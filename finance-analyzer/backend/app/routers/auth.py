from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.db import IntegrityError

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    print(f"DEBUG: Registering user: {username}, email: {email}")
    if not username or not password:
        print("DEBUG: Missing username or password")
        return Response(
            {'detail': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response(
            {'detail': 'User created successfully', 'username': user.username},
            status=status.HTTP_201_CREATED
        )
    except IntegrityError:
        print(f"DEBUG: Username {username} already exists")
        return Response(
            {'detail': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
