module CanvasSpaces
  class Engine < ::Rails::Engine
    initializer "canvas_spaces.canvas_plugin" do
      Rails.configuration.to_prepare do
        ApplicationController.class_eval do
          def add_canvas_spaces_to_jsenv
            is_enabled = PluginSetting.find_by_name(:canvas_spaces).disabled.! rescue false
            js_env(:CANVAS_SPACES_ENABLED => is_enabled)
          end
          before_filter :add_canvas_spaces_to_jsenv
        end
      end

      Canvas::Plugin.register :canvas_spaces, nil, {
        :name => 'Canvas Spaces',
        :description => '',
        :version => CanvasSpaces::VERSION,
        :settings_partial => 'canvas_spaces/plugin_settings',
        :hide_from_users => true,
        :settings => {
          :groupset_name => 'Canvas Spaces',
          :public_spaces_enabled => false
        }
      }
    end
  end
end
