from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
daily_demand_forecasting_orders = fetch_ucirepo(id=409) 
  
# data (as pandas dataframes) 
X = daily_demand_forecasting_orders.data.features 
y = daily_demand_forecasting_orders.data.targets 
  
# metadata 
print(daily_demand_forecasting_orders.metadata) 
  
# variable information 
print(daily_demand_forecasting_orders.variables) 


