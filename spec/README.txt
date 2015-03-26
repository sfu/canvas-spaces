To run these specs:
1. Copy cs_manager_controller.spec file over to the canvas spec/controllers directory.
2. Setup a test db. Add entry to database.yml file in config. 
  You can copy the development db to the test db with 
  the following command (change patchin to your userid):
  create database canvas_test with template canvas_development owner patchin;
3. Run the specs from the spec/controllers directory:
  rspec cs_manager_controller.rb
