Rails.application.routes.draw do

  # Render the entry point for the UI
  get '/canvasspaces', to: 'Manager#index'

  # Authenticate in the browser using this route.
  # Will take you to the CAS login page if you don't have the right auth cookies.
  get '/canvasspaces/login', to: 'Manager#login'

  # Canvas looks for '/api/v' to determine if this is an api request.
  # We could override the bool method for determining if the route is an api call or not.
  get '/api/v1/canvasspaces/groups', to: 'Manager#list_groups'
  post '/api/v1/canvasspaces/groups', to: 'Manager#create_group'


  get '/api/v1/canvasspaces/groups/:group_id', to: 'Manager#group_info', constraints: { group_id: /\d+/ }
  put '/api/v1/canvasspaces/groups/:group_id', to: 'Manager#modify_group', constraints: { group_id: /\d+/ }
  delete '/api/v1/canvasspaces/groups/:group_id', to: 'Manager#delete_group', constraints: { group_id: /\d+/ }

  # Using constraints solves the problem with missing :group_id.
  # /api/v1/canvasspaces/groups/:group_id/users becomes /api/v1/canvasspaces/groups//users
  # which matches route for group_info when not using constraints.
  get '/api/v1/canvasspaces/groups/:group_id/users', to: 'Manager#list_users', constraints: { group_id: /\d+/ }

  post '/api/v1/canvasspaces/groups/:group_id/users', to: 'Manager#add_user', constraints: { group_id: /\d+/ }
  delete '/api/v1/canvasspaces/groups/:group_id/users/:user_id', to: 'Manager#remove_user', constraints: { group_id: /\d+/, user_id: /\d+/ }

  put '/api/v1/canvasspaces/groups/:group_id/leader', to: 'Manager#set_leader', constraints: { group_id: /\d+/ }

  # Validation routes for Create New Space form
  get '/api/v1/canvasspaces/validate/name/:group_name', to: 'Manager#validate_group_name'
  get '/api/v1/canvasspaces/validate/user/:username', to: 'Manager#validate_sfu_user'
  if Rails.env.development?
    # test, test
    get '/api/v1/canvasspaces/test/users', to: 'Manager#test_get_user_list'
  end
end
