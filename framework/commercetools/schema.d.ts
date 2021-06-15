export type ActiveCustomerQueryVariables = Exact<{ [key: string]: never }>

export type ActiveCustomerQuery = { __typename?: 'Query' } & {
  activeCustomer?: Maybe<
    { __typename?: 'Customer' } & Pick<
      Customer,
      'id' | 'firstName' | 'lastName' | 'emailAddress'
    >
  >
}
