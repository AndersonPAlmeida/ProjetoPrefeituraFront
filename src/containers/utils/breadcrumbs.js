const breadcrumbs_hash = 
{ 
  "pageone": [ 
                { "name": "Home", "link": "/" }, 
                { "name": "Page One", "link": "/pageone" } 
             ]
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
