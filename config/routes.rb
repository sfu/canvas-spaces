Rails.application.routes.draw do
  # authenticate using this route
  get '/canvasspaces/login', to: 'Manager#login'
  
  # canvas looks for '/api/v' to determine if this is an api request.
  # we could override the bool method for determining if the route is an api call or not.
  get '/api/v1/canvasspaces/groups', to: 'Manager#list_groups'
  post '/api/v1/canvasspaces/groups', to: 'Manager#create_group'
  get '/api/v1/canvasspaces/groups/:group_id', to: 'Manager#group_info'
  put '/api/v1/canvasspaces/groups/:group_id', to: 'Manager#modify_group'
  get '/api/v1/canvasspaces/groups/:group_id/users', to: 'Manager#list_users'
  post '/api/v1/canvasspaces/groups/:group_id/users', to: 'Manager#add_user'
  delete '/api/v1/canvasspaces/groups/:group_id/users/:user_id', to: 'Manager#remove_user'  #, :constraints => { :user => /[^\/]+/ }
  put '/api/v1/canvasspaces/groups/:group_id/leader', to: 'Manager#set_leader'
  # test, test
  get '/api/v1/canvasspaces/test/users', to: 'Manager#test_get_user_list' 
  post '/api/v1/canvasspaces/test', to: 'Manager#test'
  get '/api/v1/canvasspaces/test', to: 'Manager#get_test'
end
