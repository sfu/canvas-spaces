require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe ManagerController, type: :controller do

  it "list groups" do
    # Get the list of groups internally and see it matches what is returned from the api.
    gc = GroupCategory.find_by_name("groupset1")
    groups1 = gc.groups.where("workflow_state != 'deleted'")
    group_names_1 = groups1.collect { |x| x.name }
    group_names_1.sort { |w1,w2| w1.casecmp(w2) }
    count1 = groups1.count

    request.env['HTTP_AUTHORIZATION'] = "Bearer 11GCPvBR0rKdTc1it9tGngozWvaQEt4ohapWGdX6pXODz0WRgafzRZZhqlWhW7i0" 
    get 'list_groups'
    h = JSON.parse(response.body)
    size = h["size"].to_i
    groups2 = h["groups"]
    group_names_2 = groups2.collect { |x| x["name"] }
    group_names_2.sort { |w1,w2| w1.casecmp(w2) }

    expect(size).to eq(count1)
    diff = group_names_1 - group_names_2
    puts diff
    expect(diff.empty?).to eq(true)
  end

  it "create a group" do
    request.env['HTTP_AUTHORIZATION'] = "Bearer 11GCPvBR0rKdTc1it9tGngozWvaQEt4ohapWGdX6pXODz0WRgafzRZZhqlWhW7i0" 
    post 'create_group', { name: "New group 1", leader_id: 4, join_type: "free_to_join", desc: "created by rspec" }

    #Check internally.
    gc = GroupCategory.find_by_name("groupset1")
    group = gc.groups.where("workflow_state != 'deleted' and name='New group 1'").first

    expect(group.name).to eq('New group 1')
    expect(group.leader_id).to eq(4)
    expect(group.join_level).to eq("parent_context_auto_join")
    expect(group.description).to eq("created by rspec")
  end

  it "delete a group" do
    gc = GroupCategory.find_by_name("groupset1")
    groups = gc.groups.where("workflow_state != 'deleted'")
    group_id = groups.first.id
    count1 = groups.count

    request.env['HTTP_AUTHORIZATION'] = "Bearer 11GCPvBR0rKdTc1it9tGngozWvaQEt4ohapWGdX6pXODz0WRgafzRZZhqlWhW7i0" 
    post 'delete_group', { group_id: group_id }

    expect(groups.count).to eq(count1 - 1) 
  end

  it "add a user" do
    gc = GroupCategory.find_by_name("groupset1")
    group = gc.groups.where("workflow_state != 'deleted'").first
    group_id = group.id 
    count = group.users.count

    user = User.find_by_name("user1")
    user_id = user.id

    request.env['HTTP_AUTHORIZATION'] = "Bearer 11GCPvBR0rKdTc1it9tGngozWvaQEt4ohapWGdX6pXODz0WRgafzRZZhqlWhW7i0" 
    post 'add_user', { group_id: group_id, user_id: user_id  }

    expect(group.users.count).to eq(count+1)
    expect(group.membership_for_user(user_id).nil?).to eq(false)
  end

  it "remove a user" do
    gc = GroupCategory.find_by_name("groupset1")
    # find groups with more than one user
    groups = gc.groups.where("workflow_state != 'deleted'").select { |x| x.users.count > 1 }
    group = groups.first
    group_id = group.id 
    count = group.users.count

    # select only non-leaders from the group
    non_leaders = group.users.select {|x| x.id != group.leader_id}
    user = non_leaders.first

    request.env['HTTP_AUTHORIZATION'] = "Bearer 11GCPvBR0rKdTc1it9tGngozWvaQEt4ohapWGdX6pXODz0WRgafzRZZhqlWhW7i0" 
    delete 'remove_user', { group_id: group_id, user_id: user.id }

    expect(group.users.count).to eq(count-1)
    expect(group.membership_for_user(user.id).nil?).to eq(true)
  end
end
