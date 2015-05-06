Rails.application.routes.draw do

  # Render the entry point for the UI
  get '/canvasspaces', to: 'manager#index'

  # Canvas looks for '/api/v' to determine if this is an api request.
  # We could override the bool method for determining if the route is an api call or not.
  get '/api/v1/canvasspaces/groups', to: 'manager#list_groups'
  post '/api/v1/canvasspaces/groups', to: 'manager#create_group'

  get '/api/v1/canvasspaces/groups/:group_id', to: 'manager#group_info', constraints: { group_id: /\d+/ }
  put '/api/v1/canvasspaces/groups/:group_id', to: 'manager#modify_group', constraints: { group_id: /\d+/ }
  delete '/api/v1/canvasspaces/groups/:group_id', to: 'manager#delete_group', constraints: { group_id: /\d+/ }

  get '/api/v1/canvasspaces/users/:user_id/groups', to: 'manager#list_groups_for_user', constraints: { group_id: /\d+/ }, as: :api_v1_canvasspaces_user_groups

  # Using constraints solves the problem with missing :group_id.
  # /api/v1/canvasspaces/groups/:group_id/users becomes /api/v1/canvasspaces/groups//users
  # which matches route for group_info when not using constraints.
  get '/api/v1/canvasspaces/groups/:group_id/users', to: 'manager#list_users', constraints: { group_id: /\d+/ }

  post '/api/v1/canvasspaces/groups/:group_id/users', to: 'manager#add_user', constraints: { group_id: /\d+/ }
  delete '/api/v1/canvasspaces/groups/:group_id/users/:user_id', to: 'manager#remove_user', constraints: { group_id: /\d+/, user_id: /\d+/ }

  put '/api/v1/canvasspaces/groups/:group_id/leader', to: 'manager#set_leader', constraints: { group_id: /\d+/ }

  # Validation routes for Create New Space form
  get '/api/v1/canvasspaces/validate/name/:group_name', to: 'manager#validate_group_name'
  get '/api/v1/canvasspaces/validate/user/:username', to: 'manager#validate_sfu_user'
  get '/api/v1/canvasspaces/validate/maillist/:maillist', to: 'manager#validate_maillist'

  if Rails.env.development?
    # test, test
    get '/api/v1/canvasspaces/test/users', to: 'manager#test_get_user_list'
  end

  # catch-all for react-router to work right
  match '*all', to: 'manager#index', via: [:get]
end
