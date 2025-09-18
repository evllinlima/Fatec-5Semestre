from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
blood_transfusion_service_center = fetch_ucirepo(id=176) 
  
# data (as pandas dataframes) 
X = blood_transfusion_service_center.data.features 
y = blood_transfusion_service_center.data.targets 
  
# metadata 
print(blood_transfusion_service_center.metadata) 
  
# variable information 
print(blood_transfusion_service_center.variables) 

