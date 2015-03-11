= CanvasSpaces

REST API for managing Canvas Spaces (student organized groups)

Routes:

  Show a test page and also lets the user authenticate. To be removed in the future.
  
  get '/canvasspaces/login'

  List all the groups.
  
  get '/api/v1/canvasspaces/groups'
  
  Create a group.

  post '/api/v1/canvasspaces/groups'

  Get group info.

  get '/api/v1/canvasspaces/groups/:group_id'
  
  Modify group info (description or join type (invite_only or free_to_join) )

  put '/api/v1/canvasspaces/groups/:group_id'
  
  List users in group.

  get '/api/v1/canvasspaces/groups/:group_id/users'

  Add user to group.

  post '/api/v1/canvasspaces/groups/:group_id/users'
  
  Remove user from group.

  delete '/api/v1/canvasspaces/groups/:group_id/users/:user_id'
  
  Set leader of a group.

  put '/api/v1/canvasspaces/groups/:group_id/leader'
  
  Test: get all users in the system (dev env only)

  get '/api/v1/canvasspaces/test/users'


Installation instructions:

- download gem source to a directory
- edit Gemfile of Canvas rails application, add the following entry:

gem 'canvas_spaces', path: "/<path to canvas_spaces dir>/canvas_spaces"

- in the Canvas Web UI create groupset under Site Admin account
- set groupset property in the rails console to allow students to join multiple groups in one groupset

gs.role = "student_organized"
gs.save

- add config file to host rails config directory
	- set groupset to hold created groups
	- set account name that groupset lives under

Configuration Notes:

Authentication Notes:
