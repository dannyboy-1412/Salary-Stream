import sanityClient from '@sanity/client'


const client = sanityClient({
    projectId: "b7taanxp",
    dataset: 'production',
    apiVersion: '2021-10-21', 
    //token: 'sanity-auth-token',
    useCdn: true, 
  })

export default client