# Final Backend Refactoring Guide: Business Settings (Separate & Partial Updates)

This guide provides the complete and final code for refactoring your Django backend to support **separate and partial updates** for the business settings feature.

## 1. `models.py`

Your models in `business/models.py` will remain the same.

## 2. `serializers.py`

Update your `business/serializers.py` file. We will have a serializer for the profile and another for the hours. The `BusinessProfileSerializer` will fetch hours but won't be responsible for updating them.

**File:** `business/serializers.py`

```python
from rest_framework import serializers
from .models import BusinessProfile, BusinessHours

class BusinessHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHours
        fields = ['id', 'day', 'open_time', 'close_time', 'is_closed']
        read_only_fields = ['id']

class BusinessProfileSerializer(serializers.ModelSerializer):
    hours = BusinessHoursSerializer(many=True, read_only=True) # Hours are read-only here

    class Meta:
        model = BusinessProfile
        fields = ['id', 'name', 'email', 'phone', 'website', 'description', 'hours']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        # This allows partial updates
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
```

## 3. `views.py`

Update your `business/views.py` file. We will have a view for the profile and a separate `ViewSet` for the hours to handle creating and updating them.

**File:** `business/views.py`

```python
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from .models import BusinessProfile, BusinessHours
from .serializers import BusinessProfileSerializer, BusinessHoursSerializer
from rest_framework.permissions import IsAuthenticated

class BusinessProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = BusinessProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options'] # Allow PATCH for partial updates

    def get_object(self):
        return BusinessProfile.objects.get(user=self.request.user)

class BusinessHoursViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BusinessHoursSerializer

    def get_queryset(self):
        return BusinessHours.objects.filter(business__user=self.request.user)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        business_profile = BusinessProfile.objects.get(user=request.user)
        # Allow creating/updating multiple hours at once
        hours_data = request.data
        
        for hour_data in hours_data:
            day = hour_data.get('day')
            BusinessHours.objects.update_or_create(
                business=business_profile,
                day=day,
                defaults=hour_data
            )
        
        return Response({"status": "Business hours updated"}, status=status.HTTP_200_OK)
```

## 4. `urls.py`

Your `business/urls.py` will remain the same.

This backend structure provides separate endpoints for managing the business profile and business hours, and allows for partial updates of the business profile. I will now proceed to update the frontend to match this new structure.