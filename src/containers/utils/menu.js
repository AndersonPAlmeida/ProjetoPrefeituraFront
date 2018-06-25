export const getOptions = (user_permission,user_name) =>
{
  if (user_permission == 'adm_c3sl') {
    return (
      [
        { 'name': user_name,
          'rolldown': true,
          'sign_out': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Administrador C3SL', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Sistema',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Locais de Atendimento', 'link': '/service_places', 'separator': true },
                  { 'name': 'Prefeituras', 'link': '/city_hall', 'separator': false },
                  { 'name': 'Setores', 'link': '/sectors', 'separator': false },
                  { 'name': 'Cargos', 'link': '/occupations', 'separator': false },
                  { 'name': 'Profissionais', 'link': '/professionals', 'separator': false },
                  { 'name': 'Cidadãos', 'link': '/professionals/users', 'separator': true },
                  { 'name': 'Relatórios', 'link': '/reports', 'separator': false },
                  { 'name': 'Solicitações', 'link': '/solicitations', 'separator': false }
                ]
        },
        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': true },
                { 'name': 'Tipo de recurso', 'link': '/resource_types', 'separator': false },
                { 'name': 'Listar recursos', 'link': '/resources', 'separator': false },
                { 'name': 'Escala de recursos', 'link': '/resource_shifts', 'separator': false }
              ]
        },
        { 'name': 'Serviços',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Agendar', 'link': '/schedules', 'separator': true },
                  { 'name': 'Tipos de Atendimento', 'link': '/service_types', 'separator': false },
                  { 'name': 'Atendimentos','link': '/schedules/service','separator': false},
                  { 'name': 'Escalas de serviços', 'link': '/shifts', 'separator': false },
                ]
        }
      ]
    );
  }
  else if (user_permission == 'adm_prefeitura') {
    return(
      [
        { 'name': user_name,
          'rolldown': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Administrador Prefeitura', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Sistema',
          'rolldown': true,
          'fields':
                [
                    { 'name': 'Locais de Atendimento', 'link': '/service_places', 'separator': true },
                    { 'name': 'Prefeituras', 'link': '/city_hall/edit', 'separator': false },
                    { 'name': 'Setores', 'link': '/sectors', 'separator': false },
                    { 'name': 'Cargos', 'link': '/occupations', 'separator': false },
                    { 'name': 'Profissionais', 'link': '/professionals', 'separator': false },
                    { 'name': 'Cidadãos', 'link': '/professionals/users', 'separator': true },
                    { 'name': 'Relatórios', 'link': '/reports', 'separator': false },

                ]
        },

        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': true },
                { 'name': 'Tipo de recurso', 'link': '/resource_types', 'separator': false },
                { 'name': 'Listar recursos', 'link': '/resources', 'separator': false },
                { 'name': 'Escala de recursos', 'link': '/resource_shifts', 'separator': false }
              ]
        },
        { 'name': 'Serviços',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Agendar', 'link': '/schedules', 'separator': true },
                  { 'name': 'Tipos de Atendimento', 'link': '/service_types', 'separator': false },
                  { 'name': 'Atendimentos','link': '/schedules/service','separator': false},
                  { 'name': 'Escalas de serviços', 'link': '/shifts', 'separator': false },
                ]
        }
      ]
    );
  }
  else if (user_permission == 'adm_local') {
    return (
      [
        { 'name': user_name,
          'rolldown': true,
          'sign_out': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Administrador Local', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Sistema',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Profissionais', 'link': '/professionals', 'separator': true },
                  { 'name': 'Cidadãos', 'link': '/professionals/users', 'separator': false },
                  { 'name': 'Relatórios', 'link': '/reports', 'separator': false }
                ]
        },
        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': true },
                { 'name': 'Listar recursos', 'link': '/resources', 'separator': false },
                { 'name': 'Escala de recursos', 'link': '/resource_shifts', 'separator': false }
              ]
        },
        { 'name': 'Serviços',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Agendar', 'link': '/schedules', 'separator': true },
                  { 'name': 'Atendimentos','link': '/schedules/service','separator': false},
                  { 'name': 'Escalas de serviços', 'link': '/shifts', 'separator': false },
                ]
        }
      ]
    );
  }
  else if (user_permission == 'atendente_local') {
    return (
      [
        { 'name': user_name,
          'rolldown': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Atendente Local', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Sistema',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Cidadãos', 'link': '/professionals/users', 'separator': false },
                ]
        },
        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': false }
              ]
        },
        { 'name': 'Serviços',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Agendar', 'link': '/schedules', 'separator': true },
                  { 'name': 'Atendimentos','link': '/schedules/service','separator': false},
                  { 'name': 'Escalas de serviços', 'link': '/shifts', 'separator': false },
                ]
        }
      ]
    );
  }
  else if (user_permission == 'responsavel_atendimento') {
    return (
      [
        { 'name': user_name,
          'rolldown': true,
          'sign_out': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Responsável Atendimento', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': false }
              ]
        },
        { 'name': 'Serviços',
          'rolldown': true,
          'fields':
                [
                  { 'name': 'Atendimentos','link': '/schedules/service','separator': false},
                  { 'name': 'Escalas de serviços', 'link': '/shifts', 'separator': false },
                ]
        }
      ]
    );
  }
  else {
    return (
      [

        { 'name': user_name,
          'rolldown': true,
          'sign_out': true,
          'img': true,
          'fields':
                [
                  { 'name': 'Cidadão', 'link': '/choose_role', 'separator': true },
                  { 'name': 'Mudar Permissão', 'link': '/choose_role', 'separator': false },
                  { 'name': 'Editar', 'link': '/citizens/edit', 'separator': false },
                  { 'name': 'Dependentes', 'link': '/dependants', 'separator': false },
                  { 'name': 'Imprimir Cadastro', 'link': '/citizens/my_report/report.pdf', 'separator': true },
                ]
        },
        { 'name': 'Histórico', 'rolldown': false, 'link': '/citizens/schedules/history' },
        { 'name': 'Recursos',
          'rolldown': true,
          'fields':
              [
                { 'name': 'Agendar', 'link': '/resource_bookings', 'separator': false }
              ]
        },
        { 'name': 'Efetuar Agendamento', 'rolldown': false, 'link': '/citizens/schedules/agreement' }
      ]
    );
  }
};
