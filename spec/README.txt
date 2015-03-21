To run these specs:
1. Copy cs_manager_controller.spec file over to the canvas spec/controllers directory.
2. Create an authtoken.txt file in the same dir as the .spec file containing the auth token ("Bearer ...").
3. Edit spec_helper.rb:
  - comment out "truncate_all_tables"
  - set config.use_transactional_fixtures = false
4. Setup a test db. Add entry to database.yml file in config. 
  You can copy the development db to the test db with 
  the following command (change patchin to your userid):
  create database canvas_test with template canvas_development owner patchin;
5. Run the specs from the spec/controllers directory:
  rspec cs_manager_controller.rb
