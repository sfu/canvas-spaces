#CanvasSpaces

REST API for managing Canvas Spaces (student organized groups)

##Routes:

###Show a test page and also let the user authenticate. To be removed in the future.


	GET /canvasspaces/login

Params:

	None
	
Returns:

	HTML

###List all the groups.

	GET /api/v1/canvasspaces/groups

Params: 
	
	None
	
Returns:

	{
	 "count":3,
	 "groups":[{"id":40,
	 			  "name":"newgroup3",
	 			  "leader_id":12,
	 			  "created_at":"2015-02-25T23:11:52Z",
	 			  "description":"STP.",
	 			  "size":4},
	 	        {"id":41,
	 	         "name":"newgroup4",
	 	         "leader_id":11,
	 	         "created_at":"2015-02-26T01:36:27Z",
	 	         "description":"This is the sound.","size":1},
	 	        {"id":42,
	 	        "name":"newgroup5",
	 	        "leader_id":11,
	 	        "created_at":"2015-02-27T00:36:07Z",
	 	        "description":"This is the sound.",
	 	        "size":2}
	 	       ]
	 }

###Create a group.

	POST /api/v1/canvasspaces/groups

Form Params:
   
    name (string) - Name of the group.
    leader_id (int) - Canvas id of the leader of the group.
    join_type (string) - Determines how users can join group. Value is either 'free_to_join' or 'invite_only'.
    desc (string) - Description of the group.

Returns:

	{
		"created_at":"2015-03-13T23:38:32Z",
		"description":"pizza party group",
		"id":64,
		"leader_id":4,
		"name":"vancity5"
	}
	

###Get group info.

	GET /api/v1/canvasspaces/groups/:group_id

Url Params:

    :group_id (int) - Canvas id of the group.

Returns (Note: all successful operations return HTTP status 200 OK):

    {
    "id":40,
    "name":
    "newgroup3",
    "description":"STP.",
    "leader_id":12,
    "created_at":"2015-02-25T23:11:52Z",
    "size":4
    }

###Modify group info (description or join type (invite_only or free_to_join) )

	PUT /api/v1/canvasspaces/groups/:group_id

Url Params:
  
    :group_id (int) - Canvas id of the group.
  
Form Params:
  
    desc (string) - New description of the group.
    join_type (string) - Determines how users can join group. Value is either 'free_to_join' or 'invite_only'.

Returns:
    
    {"message":"Successfully modified group."}

###List users in group.

	GET /api/v1/canvasspaces/groups/:group_id/users

Url Params:

    :group_id (int) - Canvas id of the group.

Returns:

	{"users":[{"id":12,"name":"user1"},
				{"id":3,"name":"patchin+canvas@gmail.com"},
				{"id":2,"name":"Patrick Chin"},
				{"id":10,"name":"user1"}]
	}

###Add user to group.

	POST /api/v1/canvasspaces/groups/:group_id/users

Url Params:

    :group_id (int) - Canvas id of the group.

Form Params:

    user_id (int) - Canvas id of user to add.

Returns:

	{"message":"Successfully added user."}

###Remove user from group.

	DELETE /api/v1/canvasspaces/groups/:group_id/users/:user_id

Url Params:

	:user_id (int) - Canvas id of user to remove from the group.
	
Form Params:

	foo (string) - "bar" (this is needed for now because Rails can't handle empty bodies for DELETEs)

Returns:

	{"message":"Successfully removed user."}

###Set leader of a group.

	PUT /api/v1/canvasspaces/groups/:group_id/leader

Url Params:

	:group_id (int) - Canvas id of the group.
	
Form Params:

	leader_id (int) - Canvas id of the new leader.

Returns:

	{"message":"Successfully changed leader."}

###Test: get all users in the system (dev env only)

	GET /api/v1/canvasspaces/test/users

Params:

	None

Returns:

	[{"id":3,"name":"patchin+canvas@gmail.com"},
	 {"id":5,"name":"patchin+canvastwo@gmail.com"},
	 {"id":4,"name":"patchin+canvas2@gmail.com"}]

##Errors

The REST call will return with a non-200 OK status code. And the body will contain a JSON message with more information like the following:

	{ "error":"Something bad happened." }

##Installation:

1. Download the source to a directory
2. Edit the Gemfile of the Canvas rails application, add the following entry:

  ```
  gem 'canvas_spaces', path: "<absolute path to canvas_spaces dir>/canvas_spaces"
  ```
3. In the Canvas Web UI create a groupset under the Site Admin account.
4. In the rails console set the groupset property to allow students to join multiple groups in one groupset:

  ```
  gs = GroupSet.find_by_name('<name of groupset>')
  gs.role = "student_organized"
  gs.save
  ```

5. Add a config file named canvas_spaces.yml to the host rails config directory. The config file looks like the following:

  ```
  development:
    acct_name: 'Site Admin'
    group_cat_name: 'groupset1'
  ```
  There is an example config file in the canvas\_spaces directory called canvas\_spaces.yml.example.

6. Set groupset to hold created groups
7. Set account name that groupset lives under

##Configuration:

##Authentication Notes:

- Authorization is done either through developer token transmitted in the Authorization header ('Bearer <token>') or cookies set by logging into Canvas through the browser (_csrf_token, _normandy_session).
