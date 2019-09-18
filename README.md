# CanvasSpaces

REST API for managing Canvas Spaces (student organized groups)

## Routes Summary:

#### [Show login page.](#show-login-page)
  GET /canvas_spaces/login
#### [List all the groups.](#list-all-groups)
  GET /api/v1/canvas_spaces/groups
#### [List all groups for a user](#list-all-groups-for-user)
#### [Create a group.](#create-group)
  POST /api/v1/canvas_spaces/groups
#### [Delete a group.](#delete-group)
  DELETE /api/v1/canvas_spaces/groups/:group_id
#### [Get group info.](#get-group-info)
  GET /api/v1/canvas_spaces/groups/:group_id
#### [Modify group info](#modify-group)
  PUT /api/v1/canvas_spaces/groups/:group_id
#### [List users in group.](#list-users)
  GET /api/v1/canvas_spaces/groups/:group_id/users
#### [Add user to group.](#add-user)
  POST /api/v1/canvas_spaces/groups/:group_id/users
#### [Remove user from group.](#remove-user)
  DELETE /api/v1/canvas_spaces/groups/:group_id/users/:user_id
#### [Set leader of a group.](#set-leader)
  PUT /api/v1/canvas_spaces/groups/:group_id/leader
#### [Validate group name.](#validate-group-name)
  GET /api/v1/canvas_spaces/validate/name/:name
#### [Validate SFU Username is a valid Canvas user.](#validate-sfu-user)
  GET /api/v1/canvas_spaces/validate/user/:username
#### [Validate SFU Maillist name.](#validate-maillist)
  GET /api/v1/canvas_spaces/validate/maillist/:maillist
#### [Test: get all users in the system.](#get-all-users)
  GET /api/v1/canvas_spaces/test/users

## Routes:

### <a name="show-login-page"></a>Show a login page and also let the user authenticate. Test page. To be removed in the future.

  `GET /canvas_spaces/login`

Params:

  None

Returns:

  HTML

### <a name="list-all-groups"></a>List all the groups.

  `GET /api/v1/canvas_spaces/groups`

Params:

  None

Returns:

    [
        {
          "created_at":"2015-02-25T23:11:52Z",
          "description":"Updated description.",
          "id":40,
          "leader_id":3,
          "name":"newgroup3",
          "member_count":4,
          "join_type":"invite_only"
        },
        {
          "created_at":"2015-02-26T01:36:27Z",
          "description":"This is the sound.",
          "id":41,
          "leader_id":11,
          "member_count":"newgroup4",
          "size":1,
          "join_type":"request"
        },
        {
          "created_at":"2015-03-11T17:31:59Z",
          "description":"Pump up the volume.",
          "id":57,
          "leader_id":null,
          "member_count":"newgroup11",
          "size":0,
          "join_type":"free_to_join"}
    ]

Notes:
  * when called by a non-admin user, this endpoint only returns public groups (`join_level: 'parent_context_auto_join'`)

### <a name="list-all-groups-for-user"></a>List all groups for a user.

    GET /api/v1/canvas_spaces/users/:user_id/groups

Params:

  None

Returns:

    [
      {
        "id" : 6,
        "created_at" : "2015-04-30T23:46:23Z",
        "leader_id" : null,
        "member_count" : 4,
        "join_type" : "invite_only",
        "description" : "Testing the form",
        "name" : "Test Group 3"
      },
      {
        "id" : 1,
        "created_at" : "2015-04-23T18:35:25Z",
        "leader_id" : null,
        "member_count" : 2,
        "join_type" : "free_to_join",
        "description" : null,
        "name" : "Test"
      }
    ]

Notes:

  * a non-admin user can only retreive their own groups
  * an admin user can retreive groups for any user

### <a name="create-group"></a>Create a group.

    POST /api/v1/canvas_spaces/groups

Form Params or JSON:

    name (string, required, unique) - Name of the group.
    description (string, required) - Description of the group.
    members (array, optional) - Initial members of the group.
    maillists (array, optional) - Maillists to sync with the group.
    leader_id (int) - Canvas id of the leader of the group.
    join_type (string) - Determines how users can join group. Value is: 'free_to_join', 'request' or 'invite_only'.

Returns:

```
  {
    "created_at":"2015-03-13T23:48:36Z",
    "description":"pizza party group",
    "id":67,
    "leader_id":3,
    "name":"vancity7",
    "size":1,
    "join_type":"free_to_join"
  }
```

Notes:

- Any leader chosen for the group automatically becomes a member of the group.

### <a name="delete-group"></a>Delete a group.

    DELETE /api/v1/canvas_spaces/groups/:group_id

Url Params:

    :group_id (int) - Canvas id of the group to be deleted.

Returns:

   {"message":"Group is destroyed."}

### <a name="get-group-info"></a>Get group info.

    GET /api/v1/canvas_spaces/groups/:group_id

Url Params:

    :group_id (int) - Canvas id of the group.

Returns (Note: all successful operations return HTTP status 200 OK):

    {
    "id":40,
      "name":"newgroup3",
    "description":"STP.",
    "leader_id":12,
      "created_at":"2015-02-25T23:11:52Z",
      "size":4
    }

### <a name="modify-group"></a>Modify group info (description or join type (invite\_only, request, free\_to_join) )

    PUT /api/v1/canvas_spaces/groups/:group_id

Url Params:

    :group_id (int) - Canvas id of the group.

Form Params:
    name (string) - New name for group
    description (string) - New description of the group
    join_level (string)
    leader_id (int) - New leader for group

Returns:

    the modified group object

### <a name="list-users"></a>List users in group.

    GET /api/v1/canvas_spaces/groups/:group_id/users

Url Params:

    :group_id (int) - Canvas id of the group.

Returns:


    {
      "size": 4,
      "users":[
        {"id":12,"name":"user1"},
        {"id":3,"name":"patchin+canvas@gmail.com"},
        {"id":2,"name":"Patrick Chin"},
        "id":10,"name":"user1"}
      ]
    }

### <a name="add-user"></a>Add user to group.

  POST /api/v1/canvas_spaces/groups/:group_id/users

Url Params:

    :group_id (int) - Canvas id of the group.

Form Params:

    user_id (int) - Canvas id of user to add.

Returns:

    {"message":"Successfully added user."}

### <a name="remove-user"></a>Remove user from group.

    DELETE /api/v1/canvas_spaces/groups/:group_id/users/:user_id

Url Params:

    :group_id (int) - Canvas id of group
    :user_id (int) - Canvas id of user to remove from the group.

Returns:

    {"message":"Successfully removed user."}

Notes:

- If the user is the leader of the group he/she cannot be removed from the group until another leader has been chosen.

### <a name="set-leader"></a>Set leader of a group.

    PUT /api/v1/canvas_spaces/groups/:group_id/leader

Url Params:

    :group_id (int) - Canvas id of the group.

Form Params:

    leader_id (int) - Canvas id of the new leader.

Returns:

    {"message":"Successfully changed leader."}

Notes:

- If leader is not a member of the group then he/she is added to the group.

### a name="validate-group-name"></a>Check that a group name is valid (e.g. unique)

    GET /api/v1/canvas_spaces/validate/name/:name

Url Params:

    name (string) - a propsed group name

Returns:

  Valid group name: `{ "valid_group_name": true }`

  Invalid group name: `{ "valid_group_name": false, "message": "Some error message that describes the problem" }`

### a name="validate-sfu-user"></a>Validate that a given SFU computing ID or alias is a valid Canvas user

    GET /api/v1/canvas_spaces/validate/user/:username

Url Params:

    :username (string) - SFU Computing ID or Alias to verify

Returns:

    { "valid_user": boolean }

### a name="validate-maillist"></a>Validate that a given SFU maillist name is a valid maillist

    GET /api/v1/canvas_spaces/validate/maillist/:maillist

Url Params:

    :maillist (string) - SFU Maillist name to validate

Returns:

    { "valid_maillist": boolean }

### a name="get-all-users"></a>Test: get all users in the system (dev environment only)

    GET /api/v1/canvas_spaces/test/users

Params:

  None

Returns:

```
  [{"id":3,"name":"patchin+canvas@gmail.com"},
   {"id":5,"name":"patchin+canvastwo@gmail.com"},
   {"id":4,"name":"patchin+canvas2@gmail.com"}]
```
# Errors:

The REST call will return with a non-200 OK status code. And the body will contain a JSON message with more information like the following:

    { "error":"Something bad happened." }

# Installation:

1. Download the source to a directory
2. Edit the Gemfile of the Canvas rails application, add the following entry:

  ```
  gem 'canvas_spaces', path: "<absolute path to canvas_spaces dir>"
  ```
3. In the Canvas Web UI create a groupset under the Site Admin account.
4. In the rails console set the role property to allow students to join multiple groups in one GroupCategory:

  ```
  gs = GroupCategory.find_by_name('<name of groupset>')
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
  - acct\_name is the account name that the groupset lives under
  - group\_cat_name is the name of the GroupSet that contains the created groups

Notes:

- No change is needed to the Canvas config/routes.rb file.

# Authentication Notes:

- Authorization is done either through developer token transmitted in the Authorization header ('Bearer <token>') or cookies set by logging into Canvas through the browser (_csrf_token, _normandy_session).
