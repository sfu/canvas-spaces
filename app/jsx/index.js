import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import MySpaces from './pages/MySpaces'
import CreateSpace from './pages/CreateSpace'
import NotFound from './pages/NotFound'

const App = () => (
  <Router basename="/canvas_spaces">
    <div>
      <Switch>
        <Route exact path="/" component={MySpaces} />
        <Route path="/create" component={CreateSpace} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

export default App
