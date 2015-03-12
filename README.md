#CanvasSpaces

REST API for managing Canvas Spaces (student organized groups)

##Routes:

Show a test page and also let the user authenticate. To be removed in the future.

```
GET '/canvasspaces/login'
```

List all the groups.

```
GET '/api/v1/canvasspaces/groups'
```

Create a group.

```
POST '/api/v1/canvasspaces/groups'
```

Get group info.

```
GET '/api/v1/canvasspaces/groups/:group_id'
```

Modify group info (description or join type (invite_only or free_to_join) )

```
PUT '/api/v1/canvasspaces/groups/:group_id'
```

List users in group.

```
GET '/api/v1/canvasspaces/groups/:group_id/users'
```

Add user to group.

```
POST '/api/v1/canvasspaces/groups/:group_id/users'
```

Remove user from group.

```
DELETE '/api/v1/canvasspaces/groups/:group_id/users/:user_id'
```

Set leader of a group.

```
PUT '/api/v1/canvasspaces/groups/:group_id/leader'
```

Test: get all users in the system (dev env only)

```
GET '/api/v1/canvasspaces/test/users'
```

##Installation instructions:

1. Download the source to a directory
2. Edit the Gemfile of the Canvas rails application, add the following entry:

  gem 'canvas_spaces', path: "<absolute path to canvas_spaces dir>/canvas_spaces"

3. In the Canvas Web UI create a groupset under the Site Admin account.
4. In the rails console set the groupset property to allow students to join multiple groups in one groupset:

```
gs = GroupSet.find_by_name('<name of groupset>')
gs.role = "student_organized"
gs.save
```

5. Add the config file to the host rails config directory. The config file looks like the following:

```
development:
  acct_name: 'Site Admin'
  group_cat_name: 'groupset1'
```

6. Set groupset to hold created groups
7. Set account name that groupset lives under

##Configuration Notes:

##Authentication Notes:
