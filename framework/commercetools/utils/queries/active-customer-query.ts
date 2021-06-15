// do it ok. here get data from active customer using query
export const activeCustomerQuery = /* GraphQL */ `
  query activeCustomer {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
    }
  }
`
