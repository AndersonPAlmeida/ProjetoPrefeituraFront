var options = {}
var user_name = "Exemplo Nome"
var user_permission = "adm_c3sl"
if (user_permission == "adm_c3sl") {
  options = [ 
              { 'name': "Agendamentos", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Agendamentos", 'link': "/schedules", 'separator': false },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users", 'separator': false } 
                      ]
              },
              { 'name': "Atendimentos", 'rolldown': false, 'link': "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link': "/shifts" },
              { 'name': "Sistema", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Tipos de Atendimento", 'link': "/service_types", 'separator': false },
                        { 'name': "Locais de Atendimento", 'link': "/service_places", 'separator': true },
                        { 'name': "Prefeituras", 'link': "/city_halls", 'separator': false },
                        { 'name': "Setores", 'link': "/sectors", 'separator': false },
                        { 'name': "Cargos", 'link': "/occupations", 'separator': false },
                        { 'name': "Profissionais", 'link': "/professionals", 'separator': true },
                        { 'name': "Relatórios", 'link': "/reports", 'separator': false },
                        { 'name': "Solicitações", 'link': "/solicitations", 'separator': false } 
                      ]
              },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Administrador C3SL", 'link': "/choose_role", 'separator': true },
                        { 'name': "Mudar Permissão", 'link': "/choose_role", 'separator': false },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false } 
                      ]
              }
            ];
}
else if (user_permission == "adm_prefeitura") {
  options = [ 
              { 'name': "Agendamentos", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Agendamentos", 'link': "/schedules", 'separator': false },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users", 'separator': false } 
                      ]
              },
              { 'name': "Atendimentos", 'rolldown': false, 'link': "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link': "/shifts" },
              { 'name': "Sistema", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Tipos de Atendimento", 'link': "/service_types", 'separator': false },
                        { 'name': "Locais de Atendimento", 'link': "/service_places", 'separator': true },
                        { 'name': "Prefeituras", 'link': "/city_halls", 'separator': false },
                        { 'name': "Setores", 'link': "/sectors", 'separator': false },
                        { 'name': "Cargos", 'link': "/occupations", 'separator': false },
                        { 'name': "Profissionais", 'link': "/professionals", 'separator': true },
                        { 'name': "Relatórios", 'link': "/reports", 'separator': false }
                      ]
              },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Administrador Prefeitura", 'link': "/choose_role", 'separator': true },
                        { 'name': "Mudar Permissão", 'link': "/choose_role", 'separator': false },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false } 
                      ]
              }
            ];
}
else if (user_permission == "adm_local") {
  options = [ 
              { 'name': "Agendamentos", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Agendamentos", 'link': "/schedules", 'separator': false },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users", 'separator': false } 
                      ]
              },
              { 'name': "Atendimentos", 'rolldown': false, 'link': "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link': "/shifts" },
              { 'name': "Sistema", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Profissionais", 'link': "/professionals", 'separator': true },
                        { 'name': "Relatórios", 'link': "/reports", 'separator': false }
                      ]
              },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Administrador Local", 'link': "/choose_role", 'separator': true },
                        { 'name': "Mudar Permissão", 'link': "/choose_role", 'separator': false },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false } 
                      ]
              }
            ];
}
else if (user_permission == "atendente_local") {
  options = [ 
              { 'name': "Agendamentos", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Agendamentos", 'link': "/schedules", 'separator': false },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users", 'separator': false } 
                      ]
              },
              { 'name': "Atendimentos", 'rolldown': false, 'link': "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link': "/shifts" },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Atendente Local", 'link': "/choose_role", 'separator': true },
                        { 'name': "Mudar Permissão", 'link': "/choose_role", 'separator': false },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false } 
                      ]
              }
            ];
}
else if (user_permission == "responsavel_atendimento") {
  options = [ 
              { 'name': "Atendimentos", 'rolldown': false, 'link': "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link': "/shifts" },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Responsável Atendimento", 'link': "/choose_role", 'separator': true },
                        { 'name': "Mudar Permissão", 'link': "/choose_role", 'separator': false },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false } 
                      ]
              }
            ];
}
else {
  options = [
              { 'name': "Efetuar Agendamento", 'rolldown': false, 'link': "/citizens/schedules/agreement" },
              { 'name': "Histórico", 'rolldown': false, 'link': "/citizens/schedules/history" },
              { 'name': "user_name", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Cidadão", 'link': "/choose_role", 'separator': true },
                        { 'name': "Editar", 'link': "/citizens/edit", 'separator': false },
                        { 'name': "Dependentes", 'link': "/dependants", 'separator': false },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf", 'separator': true },
                        { 'name': "Sair", 'link': "/citizens/sign_out", 'separator': false }
                      ]
              }
            ];
}
