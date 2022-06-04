// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    {
      title:'Employee',
      name:'employee',
      type:'document',
      fields: [
        {
          title:'Name',
          name:'name',
          type:'string',
        },
        {
          title:'Wallet Address',
          name:'walletAddress',
          type:'string',
        },
        {
          title:'Position',
          name:'position',
          type:'string',
        },
        {
          title:'Salary',
          name:'salary',
          type:'number',
        }

      ]
    }
  ]),
})
