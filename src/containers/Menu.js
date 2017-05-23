var options = {}

user_name = "Exemplo Nome"
user_permission = "adm_c3sl"

if (user_permission == "adm_c3sl") {
  options = [ 
              { 'name': "Agendamentos", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Agendamentos", 'link': "/schedules" },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users" } 
                      ]
              },
              { 'name': "Atendimentos", 'rolldown': false, 'link' "/schedules/service" },
              { 'name': "Escalas", 'rolldown': false, 'link' "/shifts" },
              { 'name': "Gráficos", 'rolldown': false, 'link' "/charts" },
              { 'name': "Sistema", 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Tipos de Atendimento", 'link': "/schedules" },
                        { 'name': "Cadastro de Cidadãos", 'link': "/professionals/users" },
                        { 'name': "Prefeituras", 'link': "/city_halls" },
                        { 'name': "Setores", 'link': "/sectors" },
                        { 'name': "Cargos", 'link': "/occupations" },
                        { 'name': "Profissionais", 'link': "/professionals" },
                        { 'name': "Relatórios", 'link': "/reports" },
                        { 'name': "Solicitações", 'link': "/solicitations" } 
                      ]
              },
              { 'name': user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Administrador C3SL", 'link': "/choose_role" },
                        { 'name': "Mudar Permissão", 'link': "/choose_role" },
                        { 'name': "Editar", 'link': "/citizens/edit" },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf" },
                        { 'name': "Sair", 'link': "/citizens/sign_out" } 
                      ]
              }
            ];
}
else if (user_permission == "adm_prefeitura") {

}
else if (user_permission == "adm_local") {

}
else if (user_permission == "atendente_local) {

}
else {
  options = [
              { 'name': "Efetuar Agendamento", 'rolldown': false, 'link' "/citizens/schedules/agreement" },
              { 'name': "Histórico", 'rolldown': false, 'link' "/citizens/schedules/history" },
              { 'name': "user_name, 
                'rolldown': true, 
                'fields': 
                      [ 
                        { 'name': "Cidadão", 'link': "/choose_role" },
                        { 'name': "Editar", 'link': "/citizens/edit" },
                        { 'name': "Dependentes", 'link': "/dependants" },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/my_report/report.pdf" },
                        { 'name': "Imprimir Cadastro", 'link': "/citizens/sign_out" }
                      ]
              }
            ];
}
