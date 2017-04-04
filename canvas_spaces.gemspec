$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "canvas_spaces/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "canvas_spaces"
  s.version     = CanvasSpaces::VERSION
  s.authors     = ["Patrick Chin"]
  s.email       = ["patchin@sfu.ca"]
  s.description = "Canvas Spaces manager plugin for canvas-lms"
  s.summary = "Canvas Spaces manager plugin for canvas-lms"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", ">= 3.2", "< 5.1"

  s.add_development_dependency "sqlite3"
end
