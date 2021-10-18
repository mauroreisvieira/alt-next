import { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Guard } from '@/components'

const PRESERVED = import.meta.globEager('/src/pages/(_app|404).tsx')
const ROUTES = import.meta.globEager('/src/pages/**/[a-z[]*.tsx')

const preserved: Partial<Record<'_app' | '404', Component>> = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/pages\/|\.tsx$/g, '')
  return { ...preserved, [key]: PRESERVED[file].default as Component }
}, {})

const routes = Object.keys(ROUTES).map((route) => {
  const path = route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')

  return {
    path,
    component: ROUTES[route].default as Component,
    scope: ROUTES[route]?.meta?.scope as 'private' | 'public',
  }
})

export const Routes = (): JSX.Element => {
  const App = preserved?.['_app'] || Fragment
  const NotFound = preserved?.['404'] || Fragment

  return (
    <App>
      <Switch>
        {routes.map(({ path, component: Component = Fragment, scope }) => (
          <Route key={path} path={path} exact={true}>
            <Guard scope={scope}>
              <Component />
            </Guard>
          </Route>
        ))}
        <Route path="*" component={NotFound} />
      </Switch>
    </App>
  )
}
