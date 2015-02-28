class ManagerController < ApplicationController
  def hello
    debugger
    render :json => "Hello World"
  end

  def create_group
    debugger
    render :json => "Done"
  end

  def xcreate_group
    debugger
    name_param = params[:group_name]
    leader_id_param = params[:leader_id]
    join_level_param = params[:join_level].to_i
    desc_param = params[:desc]

    join_level = if join_level_param == 2 then "parental_context_auto_join" else "invitation_only" end
    leader = User.find(leader_id_param)
    group_cat = GroupCategory.find_by_name(GROUP_CAT_NAME)
    acct = Account.find_by_name(ACCT_NAME)
    group = acct.groups.create( name: name_param, group_category: group_cat, leader: leader, join_level: join_level, description: desc_param)
    render :json => group
  end
end
