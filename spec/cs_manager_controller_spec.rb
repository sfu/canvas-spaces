require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe ManagerController, type: :controller do
  before :once do
    # create user with auth token
    @admin_user = user_with_pseudonym(:username => 'nobody3@example.com', :account => Account.site_admin)
    Account.site_admin.account_users.create!(user: @admin_user)

    @user1 = user(name: "user1")
    @user1.save

    @user2 = user(name: "user2")
    @user2.save

    @access_token = @admin_user.access_tokens.create!(:purpose => "test").full_token

    @category = group_category(context: Account.site_admin, name: "groupset1")
    @category.role = "student_organized"
    @category.save
    # create some test groups
    @group1 = group({context: Account.site_admin, name: 'group1'})
    @group2 = group({context: Account.site_admin, name: 'group2'})
    @category.groups = [@group1, @group2]
  end

  it "list groups" do
    # Get the list of groups internally and see it matches what is returned from the api.
    gc = GroupCategory.find_by_name("groupset1")
    groups1 = gc.groups.where("workflow_state != 'deleted'")
    group_names_1 = groups1.collect { |x| x.name }
    group_names_1.sort { |w1,w2| w1.casecmp(w2) }
    count1 = groups1.count

    request.env['HTTP_AUTHORIZATION'] = "Bearer #{@access_token}"
    get 'list_groups'
    h1 = JSON.parse(response.body)
    size = h1["size"].to_i
    groups2 = h1["groups"]
    group_names_2 = groups2.collect { |x| x["name"] }
    group_names_2.sort { |w1,w2| w1.casecmp(w2) }

    expect(size).to eq(count1)
    diff = group_names_1 - group_names_2
    puts diff
    expect(diff.empty?).to eq(true)
  end

  #TODO: one case where admin is creating a group vs non-admin creating the group

  it "admin creates a group" do
    name = (0...8).map { (65 + rand(26)).chr }.join

    request.env['HTTP_AUTHORIZATION'] = "Bearer #{@access_token}"
    post 'create_group', { name: name, leader_id: @user1.id, join_type: "free_to_join", desc: "created by rspec" }

    #Check internally.
    gc = GroupCategory.find_by_name("groupset1")
    group = gc.groups.where("workflow_state != 'deleted' and name='#{name}'").last

    expect(group.name).to eq(name)
    expect(group.leader_id).to eq( @user1.id )
    expect(group.join_level).to eq("parent_context_auto_join")
    expect(group.description).to eq("created by rspec")
  end

  it "non-admin creates a group" do
  end

  it "delete a group" do
    gc = GroupCategory.find_by_name("groupset1")
    groups = gc.groups.where("workflow_state != 'deleted'")
    group_id = groups.first.id
    count1 = groups.count

    request.env['HTTP_AUTHORIZATION'] = "Bearer #{@access_token}"
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

    request.env['HTTP_AUTHORIZATION'] = "Bearer #{@access_token}"
    post 'add_user', { group_id: group_id, user_id: user_id  }

    expect(group.users.count).to eq(count+1)
    expect(group.membership_for_user(user_id).nil?).to eq(false)
  end

  it "remove a user" do
    gc = GroupCategory.find_by_name("groupset1")

    # add some users to the group
    @group1.add_user(@user1)
    @group1.add_user(@user2)
    @group1.save
    count = @group1.users.count

    request.env['HTTP_AUTHORIZATION'] = "Bearer #{@access_token}"
    delete 'remove_user', { group_id: @group1.id, user_id: @user1.id }

    expect(@group1.users.count).to eq(count-1)
    expect(@group1.membership_for_user(@user1.id).nil?).to eq(true)
  end
end
