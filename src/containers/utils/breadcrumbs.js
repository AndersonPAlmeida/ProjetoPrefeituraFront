const breadcrumbs_hash = 
{ 
  "example_path": [ 
                { "name": "example", "link": "/" }, 
                { "name": "example2", "link": "/citizens/schedules/history" } 
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
