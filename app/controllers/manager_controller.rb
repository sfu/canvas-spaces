ACCT_NAME = 'Site Admin'
GROUP_CAT_NAME = 'groupset1'

class ManagerController < ApplicationController
  before_filter :require_user

  def login
    # the method by which to authenticate and get a token that will allow
    # us to call the REST api
  end

  def logout
    # destroy the session
  end

  # List all groups in the special group set that belongs to the
  # special account.
  # TODO: Only expose fields needed by client.
  def list_groups
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)

    if @current_user.account.site_admin?
      groups = group_cat.groups
               .where("groups.workflow_state != 'deleted'")
               .eager_load(:users)
    else
      # find all groups owned by the student
      groups = group_cat.groups
               .where("groups.workflow_state != 'deleted' and leader_id = ?", @current_user.id)
               .eager_load(:users)
    end

    # After looking at all the options of restricting json output and taking
    # into consideration that I include user-count in the result,
    # this code seemed the clearest.
    response = []
    groups.each do |g|
      response << { id: g.id,
                    name: g.name,
                    leader_id: g.leader_id,
                    created_at: g.created_at,
                    description: g.description,
                    size: g.users.count }
    end

    render json: { count: groups.count,
                   groups: response },
           status: :ok
  end

  # Create a group.
  # If called by a non-admin user then the user will be made leader of the group. 
  # Any specified leader is ignored.
  # If called by an admin a leader may be specified.
  # leader is canvas id
  def create_group
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)
    acct = Account.find_by_name(ACCT_NAME)

    name_param = params[:name]
    leader_id_param = params[:leader_id]
    join_type_param = params[:join_type] # either 'free_to_join' or 'invite_only'
    desc_param = params[:desc]

    if name_param.nil? || name_param.blank?
      render json: { error: 'No name specified.' }, status: :bad_request
      return
    end

    if join_type_param.nil? || join_type_param.blank?
      render json: { error: 'No join_type specified.' }, status: :bad_request
      return
    end

    if @current_user.account.site_admin?
      if leader_id_param && !leader_id_param.blank?
        leader = User.find_by_id(leader_id_param)
        if leader.nil?
          render json: { error: "Can't find user specified for leader." }, status: :bad_request
          return
        end
      else
        leader = nil
      end
    else
      # if a non-admin is creating the group then
      # the leader is that user and that id is used to determine who "owns"
      # the group and can make changes to it
      leader = @current_user
    end

    if join_type_param == 'free_to_join'
      join_type = 'parental_context_auto_join'
    elsif join_type_param == 'invite_only'
      join_type = 'invitation_only'
    else
      render json: { error: 'Invalid join_type value. Valid: free_to_join or invite_only.' }, status: :bad_request
      return
    end

    group = acct.groups.create( name: name_param,
                                group_category: group_cat,
                                leader: leader,
                                join_level: join_type,
                                description: desc_param )
    render json: group, status: :ok
  end

  # Return info on a group.
  # Anyone can access this information.
  def group_info
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)

    group_id_param = params[:group_id]

    if group_id_param.nil? || group_id_param.blank?
      render json: { error: 'group_id not specified.' }, status: :bad_request
      return
    end

    group = group_cat
            .groups
            .where('groups.id = ?', group_id_param)
            .eager_load(:users)
            .first
    if group.nil?
      render json: { error: 'No such group found.' }, status: :not_found
    else
      render json: { id: group.id,
                     name: group.name,
                     description: group.description,
                     leader_id: group.leader_id,
                     created_at: group.created_at,
                     size: group.users.count
                   },
             status: :ok
    end
  end

  # Change group property like description, join type.
  def modify_group
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)

    group_id_param = params[:group_id]
    desc_param = params[:desc]
    join_type_param = params[:join_type]

    if group_id_param.nil? || group_id_param.blank?
      render json: { error: 'group_id not specified.' }, status: :bad_request
      return
    end

    group = group_cat.groups.where('groups.id = ?', group_id_param).first
    if group.nil?
      render json: { error: 'No such group found.' }, status: :not_found
    else
      if @current_user.account.site_admin? || group.leader_id == @current_user.id
        
        group.description = desc_param if desc_param && !desc_param.blank?

        if join_type_param && !join_type_param.blank?
          if join_type_param == 'free_to_join'
            group.join_level = 'parental_context_auto_join'
          elsif join_type_param == 'invite_only'
            group.join_level = 'invitation_only'
          else
            render json: { error: 'Invalid join_type value. Valid: free_to_join or invite_only.' }, status: :bad_request
            return
          end
        end
        group.save
        render json: { message: 'Successfully modified group.' }, status: :ok
      else
        render json: { error: "Can't modify group. Not owner." }, status: :forbidden
      end
    end
  end

  def list_users
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)

    group_id_param = params[:group_id]

    if group_id_param.nil? || group_id_param.blank?
      render json: { error: 'group_id not specified.' }, status: :bad_request
      return
    end

    group = group_cat.groups.find_by_id(group_id_param)
    if group.nil?
      render json: { error: 'No such group found.' }, status: :bad_request
    else
      if @current_user.account.site_admin? || group.leader_id == @current_user.id
        render json: { users: group.users.select('users.id, users.name') }, status: :ok
      else
        # doesn't have access to the group
        render json: { error: "Can't list users. Not owner." }, status: :forbidden
      end
    end
  end

  # Add user to a group.
  # The site admin can add any user to a group.
  # The leader of the group may add any user. TODO: Should this be allowed?
  # What if the user doesn't want to be a member of the group?
  # A user may add himself/herself to a group.
  # user = email address/id of student
  def add_user
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME) # TODO: refactor this since it's used everywhere

    group_id_param = params[:group_id]
    user_id_param = params[:user_id] # sfu id

    if group_id_param.nil? || group_id_param.blank?
      render json: { error: 'group_id not specified.' }, status: :bad_request
      return
    end

    if user_id_param.nil? || user_id_param.blank?
      render json: { error: 'user_id not specified.' }, status: :bad_request
      return
    end

    user = User.find_by_id(user_id_param)
    if user.nil?
      render json: { error: "Can't find user #{user_id_param}." }, status: :bad_request
      return
    end

    group = group_cat.groups.find_by_id(group_id_param)
    if group.nil?
      render json: { error: 'No such group found.' }, status: :bad_request
    else
      if @current_user.account.site_admin? ||
         group.leader_id == @current_user.id ||
         @current_user.id == user.id

        group.add_user user
        render json: { message: 'Successfully added user.' }, status: :ok
      else
        # doesn't have access to the group
        render json: { error: "Can't add user. Not owner or not adding self." }, status: :forbidden
      end
    end
  end

  # Remove user from a group.
  # The site admin can remove any user from a group.
  # The leader of the group may remove any user.
  # A user may remove himself/herself to a group.
  # user_id = canvas id of user to remove
  def remove_user
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME) # TODO: refactor this since it's used everywhere

    group_id_param = params[:group_id]
    user_id_param = params[:user_id] # sfu id

    if group_id_param.nil? || group_id_param.blank?
      render json: { error: 'group_id not specified.' }, status: :bad_request
      return
    end

    if user_id_param.nil? || user_id_param.blank?
      render json: { error: 'user_id not specified.' }, status: :bad_request
      return
    end

    user = User.find_by_id(user_id_param)
    if user.nil?
      render json: { error: "Remove failed. Can't find user #{user_param}." }, status: :bad_request
      return
    end

    group = group_cat.groups.find_by_id(group_id_param)
    if group.nil?
      render json: { error: 'No such group found.' }, status: :bad_request
    else
      if @current_user.account.site_admin? || group.leader_id == @current_user.id || @current_user.id == user.id
        membership = group.group_memberships.where(user_id: user).first
        membership.workflow_state = 'deleted'
        membership.save
        render json: { message: 'Successfully removed user.' }, status: :ok
      else
        # doesn't have access to the group
        render json: { error: "Can't remove user. Not owner or not adding self." }, status: :forbidden
      end
    end
  end

  # Change leadership of the group.
  # Admin may set anyone as leader of the group.
  # Leader of the group may set anyone as leader of the group.
  # I don't check to see if the new leader is a member of the group.
  def set_leader
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME) # TODO: refactor this since it's used everywhere

    group_id_param = params[:group_id]
    leader_id_param = params[:leader_id]

    if leader_id_param.nil? || leader_id_param.blank?
      render json: { error: 'No leader_id supplied.' }, status: :bad_request
      return
    end

    # lookup canvas id by sfu-id
    leader = User.find_by_id(leader_id_param)
    if leader.nil?
      render json: { error: "Leader change failed. Can't find user #{leader_id_param}." }, status: :bad_request
      return
    end

    group = group_cat.groups.find_by_id(group_id_param)
    if group.nil?
      render json: { error: 'No such group found.' }, status: :bad_request
    else
      if @current_user.account.site_admin? || group.leader_id == @current_user.id
        # TODO: should new leader also be a member of the group?
        group.leader_id = leader.id
        group.save
        render json: { message: 'Successfully changed leader.' }, status: :ok
      else
        # doesn't have access to the group
        render json: { error: "Can't change leader. Not owner." }, status: :forbidden
      end
    end
  end

  # Test method.
  def test_get_user_list
    ActiveRecord::Base.include_root_in_json = false
    render json: User.all.map { |user| user.as_json(only: [:id, :name]) }
  end

  def test
    render json: { message: 'Hello' }
  end

  def get_test
    render json: { message: 'Hello' }
  end  
end
