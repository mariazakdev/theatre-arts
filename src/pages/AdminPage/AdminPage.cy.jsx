import React from 'react'
import AdminPage from './AdminPage'

describe('<AdminPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AdminPage />)
  })
})