const breadcrumbs_hash =  { 
                              "pageone": [ 
                                            { "name": "Home", "link": "/" }, 
                                            { "name": "Page One", "link": "/pageone" } 
                                         ],
                              "pagetwo": [ 
                                            { "name": "Home", "link": "/" }, 
                                            { "name": "Page Two", "link": "/pagetwo" } 
                                         ]
                            }
export const breadcrumbs_func = (bc_key) =>
                            {
                              if(breadcrumbs_hash[bc_key] != null)
                                return breadcrumbs_hash[bc_key]
                              else
                                return (
                                  [ {"name": "", "link": "" } ]
                                )
                            }
