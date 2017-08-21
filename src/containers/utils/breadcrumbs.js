/*
"pageone": [ 
                { "name": "Home", "link": "/" }, 
                { "name": "Page One", "link": "/pageone" } 
           ]
*/

const breadcrumbs_hash = 
{ 

}

export const getBreadcrumbs = (bc_key) =>
{
  if(breadcrumbs_hash[bc_key] != null)
    return breadcrumbs_hash[bc_key]
  else
    return (
      [ {"name": "", "link": "" } ]
    )
}
