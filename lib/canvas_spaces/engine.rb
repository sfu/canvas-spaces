module CanvasSpaces
  class Engine < ::Rails::Engine
    initializer "canvas_spaces.canvas_plugin" do
      Canvas::Plugin.register :canvas_spaces, nil, {
        :name => 'Canvas Spaces',
        :description => '',
        :version => CanvasSpaces::VERSION,
        :settings_partial => 'canvas_spaces/plugin_settings',
        :hide_from_users => true,
        :settings => {
          :groupset_name => 'Canvas Spaces',
          :public_spaces_enabled => false,
          :maillist_store_url => nil,
          :maillist_store_token => nil
        }
      }
    end
  end
end
