from .models import FoodRequest

def delete_old_requests():
    print('RUNNING TASK')
    obj=FoodRequest.objects.raw(f"select * from api_foodrequest where julianday('now') - julianday(date_time)>180 and status='pickedup'")
    for i in obj:
        print(1)
        i.delete()
