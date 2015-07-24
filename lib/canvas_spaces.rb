require "canvas_spaces/engine"

module CanvasSpaces
  def self.config
    Canvas::Plugin.find('canvas_spaces').settings || {}
  end

  def self.GroupCategory
    GroupCategory.find_by_name(self.config['groupset_name'])
  end

  def self.RequestTokens
    config = YAML.load_file("#{Rails.root}/config/sfu.yml")
    {
      :maillist => config['maillist_ckid_token'],
      :rest => config['sfu_rest_token']
    }
  end
end
