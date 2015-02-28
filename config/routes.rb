Rails.application.routes.draw do
  get '/canvasspaces', to: 'Manager#hello'
  # canvas looks for '/api/v' to determine if this is an api request.
  post '/api/v1/canvasspaces', to: 'Manager#create_group'
end
