$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "canvas_spaces/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "canvas_spaces"
  s.version     = CanvasSpaces::VERSION
  s.authors     = ["TODO: Your name"]
  s.email       = ["TODO: Your email"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of CanvasSpaces."
  s.description = "TODO: Description of CanvasSpaces."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.21"
  # s.add_dependency "jquery-rails"

  s.add_development_dependency "sqlite3"
end
