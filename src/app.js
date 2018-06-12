import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound, Login, Register, RegisterCep, CitizenSchedule,
  ChooseRole, ScheduleAgreement, ScheduleChoose, ScheduleCitizen, ScheduleFinish,
  DependantList, DependantEdit, DependantShow, DependantCreate, CitizenEdit,
  SectorList, SectorEdit, SectorShow, SectorCreate, ServicePlaceEdit,
  ServicePlaceCreate, ServicePlaceShow, ServicePlaceList, ServiceTypeEdit,
  ServiceTypeCreate, ServiceTypeShow, ServiceTypeList, ResourceTypeList, ResourceTypeShow,
  ResourceTypeCreate, ResourceTypeEdit, ResourceList, ResourceShow, ResourceEdit, ResourceCreate,
  ResourceShiftList, ResourceShiftShow, ResourceShiftCreate, ResourceShiftEdit,
  ResourceBookingList, ResourceBookingShow, ResourceBookingCreate, ResourceBookingEdit, ProfessionalIndex,
  ProfessionalList, ProfessionalEdit, ProfessionalShow, ProfessionalCreate,
  ProfessionalSearch, ProfessionalSchedule, ProfessionalUserList,
  ProfessionalUserEdit, ProfessionalUserCreate, ProfessionalUserShow,
  ProfessionalUserDependantEdit, ProfessionalUserDependantCreate,
  ProfessionalUserDependantShow, ShiftShow, ShiftEdit, ShiftCreate,
  ShiftList, OccupationCreate,OccupationList,OccupationEdit,OccupationShow, MyReport, Reports,
  citizenReport, schedulesReport, shiftsReport, professionalsReport,
  servicesReport, shiftTypeReport, ServiceEdit, ServiceList, CityHallList, CityHallEdit, CityHallCreate
} from './containers';

import { configure } from './redux-auth';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerActions } from 'react-router-redux';
import thunk from 'redux-thunk';
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { fromJS, Immutable } from 'immutable';

export function initialize({ apiUrl, cookies, isServer, currentLocation, userAgent, stateData } = {}) {
  const reducer = require('./reducers');
  /* Start history with requested url */
  let memoryHistory = isServer ? createHistory(currentLocation) : browserHistory;
  const middleware = [
    routerMiddleware(memoryHistory),
    thunk,
  ];
  let store;
  let finalCreateStore;
  /* Create store and enhanced history (memoryHistory) */
  if (process.env.NODE_ENV === 'development' && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('./containers/application/DevTools');
    store = createStore(reducer,
      fromJS(stateData),
      compose(
        applyMiddleware(...middleware),
        global.devToolsExtension ? global.devToolsExtension() : DevTools.instrument(),
        persistState(global.location.href.match(/[?&]debug_session=([^&]+)\b/))
      )
    );

  }
  else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
    store = finalCreateStore(reducer,fromJS(stateData));
  }
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }
  let history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState (state) {
      return (state.get('routing').toJS());
    }
  });
  const UserIsAuthenticated = UserAuthWrapper({
    authSelector: (state)  => { return (state.get('auth').getIn(['user','isSignedIn']) ? { 'authentication' : true } : null ) },
    redirectAction: routerActions.replace,
    failureRedirectPath: '/',
    wrapperDisplayName: 'UserIsAuthenticated'
  })
  const UserIsNotAuthenticated = UserAuthWrapper({
    authSelector: (state)  => { return (!(state.get('auth').getIn(['user','isSignedIn'])) ? { 'authentication' : true } : null ) },
    redirectAction: routerActions.replace,
    failureRedirectPath: '/citizens/schedules/history?home=true',
    wrapperDisplayName: 'UserIsNotAuthenticated'
  })
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  const routes = (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={UserIsNotAuthenticated(Login)} />
        <Route path="signup" component={UserIsNotAuthenticated(RegisterCep)} />
        <Route path="signup2" component={UserIsNotAuthenticated(Register)} />
        <Route path="choose_role" component={UserIsAuthenticated(ChooseRole)} />

        <Route path="citizens/schedules/history" component={UserIsAuthenticated(CitizenSchedule)} />
        <Route path="citizens/edit" component={UserIsAuthenticated(CitizenEdit)} />
        <Route path="citizens/my_report" component={UserIsAuthenticated(MyReport)} />
        <Route path="citizens/schedules/agreement" component={UserIsAuthenticated(ScheduleAgreement)} />
        <Route path="citizens/schedules/choose" component={UserIsAuthenticated(ScheduleChoose)} />
        <Route path="citizens/:citizen_id/schedules/schedule" component={UserIsAuthenticated(ScheduleCitizen)} />
        <Route path="citizens/:citizen_id/schedules/:schedule_id/finish" component={UserIsAuthenticated(ScheduleFinish)} />

        <Route path="dependants" component={UserIsAuthenticated(DependantList)} />
        <Route path="dependants/:dependant_id/edit" component={UserIsAuthenticated(DependantEdit)} />
        <Route path="dependants/new" component={UserIsAuthenticated(DependantCreate)} />
        <Route path="dependants/:dependant_id" component={UserIsAuthenticated(DependantShow)} />

        <Route path="sectors" component={UserIsAuthenticated(SectorList)} />
        <Route path="sectors/:sector_id/edit" component={UserIsAuthenticated(SectorEdit)} />
        <Route path="sectors/new" component={UserIsAuthenticated(SectorCreate)} />
        <Route path="sectors/:sector_id" component={UserIsAuthenticated(SectorShow)} />

        <Route path="occupations" component={UserIsAuthenticated(OccupationList)}/>
        <Route path="occupations/:occupation_id/edit" component={UserIsAuthenticated(OccupationEdit)} />
        <Route path="occupations/new" component={UserIsAuthenticated(OccupationCreate)} />
        <Route path="occupations/:occupation_id" component={UserIsAuthenticated(OccupationShow)} />

        <Route path="service_places" component={UserIsAuthenticated(ServicePlaceList)} />
        <Route path="service_places/:service_place_id/edit" component={UserIsAuthenticated(ServicePlaceEdit)} />
        <Route path="service_places/new" component={UserIsAuthenticated(ServicePlaceCreate)} />
        <Route path="service_places/:service_place_id" component={UserIsAuthenticated(ServicePlaceShow)} />

        <Route path="service_types" component={UserIsAuthenticated(ServiceTypeList)} />
        <Route path="service_types/:service_type_id/edit" component={UserIsAuthenticated(ServiceTypeEdit)} />
        <Route path="service_types/new" component={UserIsAuthenticated(ServiceTypeCreate)} />
        <Route path="service_types/:service_type_id" component={UserIsAuthenticated(ServiceTypeShow)} />

        <Route path="reports" component={UserIsAuthenticated(Reports)}/>
        <Route path="reports/citizen_report" component={UserIsAuthenticated(citizenReport)} />
        <Route path="reports/schedules_report" component={UserIsAuthenticated(schedulesReport)} />
        <Route path="reports/shifts_report" component={UserIsAuthenticated(shiftsReport)} />
        <Route path="reports/professionals_report" component={UserIsAuthenticated(professionalsReport)} />
        <Route path="reports/services_report" component={UserIsAuthenticated(servicesReport)} />
        <Route path="reports/shift_type_report" component={UserIsAuthenticated(shiftTypeReport)}/>

        <Route path="resource_types" component={UserIsAuthenticated(ResourceTypeList)} />
        <Route path="resource_types/:resource_type_id/edit" component={UserIsAuthenticated(ResourceTypeEdit)} />
        <Route path="resource_types/new" component={UserIsAuthenticated(ResourceTypeCreate)} />
        <Route path="resource_types/:resource_type_id" component={UserIsAuthenticated(ResourceTypeShow)} />

        <Route path="resources" component={UserIsAuthenticated(ResourceList)} />
        <Route path="resources/:resource_id/edit" component={UserIsAuthenticated(ResourceEdit)} />
        <Route path="resources/new" component={UserIsAuthenticated(ResourceCreate)} />
        <Route path="resources/:resource_id" component={UserIsAuthenticated(ResourceShow)} />

        <Route path="resource_shifts" component={UserIsAuthenticated(ResourceShiftList)} />
        <Route path="resource_shifts/:resource_shift_id/edit" component={UserIsAuthenticated(ResourceShiftEdit)} />
        <Route path="resource_shifts/new" component={UserIsAuthenticated(ResourceShiftCreate)} />
        <Route path="resource_shifts/:resource_shift_id" component={UserIsAuthenticated(ResourceShiftShow)} />

        <Route path="resource_bookings" component={UserIsAuthenticated(ResourceBookingList)} />
        <Route path="resource_bookings/:resource_booking_id/edit" component={UserIsAuthenticated(ResourceBookingEdit)} />
        <Route path="resource_bookings/new" component={UserIsAuthenticated(ResourceBookingCreate)} />
        <Route path="resource_bookings/:resource_booking_id" component={UserIsAuthenticated(ResourceBookingShow)} />

        <Route path="schedules/service/:schedule_id/edit" component={UserIsAuthenticated(ServiceEdit)} />
        <Route path="schedules/service" component={UserIsAuthenticated(ServiceList)} />


        <Route path="schedules" component={UserIsAuthenticated(ProfessionalSchedule)} />

        <Route path="professionals/users/:citizen_id/dependants/new" component={UserIsAuthenticated(ProfessionalUserDependantCreate)} />
        <Route path="professionals/users/:citizen_id/dependants/:dependant_id/edit" component={UserIsAuthenticated(ProfessionalUserDependantEdit)} />
        <Route path="professionals/users/:citizen_id/dependants/:dependant_id" component={UserIsAuthenticated(ProfessionalUserDependantShow)} />
        <Route path="professionals/users" component={UserIsAuthenticated(ProfessionalUserList)} />
        <Route path="professionals/users/new" component={UserIsAuthenticated(ProfessionalUserCreate)} />
        <Route path="professionals/users/:citizen_id/edit" component={UserIsAuthenticated(ProfessionalUserEdit)} />
        <Route path="professionals/users/:citizen_id" component={UserIsAuthenticated(ProfessionalUserShow)} />

        <Route path="professionals/shifts" component={UserIsAuthenticated(ProfessionalIndex)} />
        <Route path="professionals" component={UserIsAuthenticated(ProfessionalList)} />
        <Route path="professionals/new" component={UserIsAuthenticated(ProfessionalCreate)} />
        <Route path="professionals/search" component={UserIsAuthenticated(ProfessionalSearch)} />
        <Route path="professionals/:professional_id" component={UserIsAuthenticated(ProfessionalShow)} />
        <Route path="professionals/:professional_id/edit" component={UserIsAuthenticated(ProfessionalEdit)} />

        <Route path="shifts" component={UserIsAuthenticated(ShiftList)} />
        <Route path="shifts/:shift_id/edit" component={UserIsAuthenticated(ShiftEdit)} />
        <Route path="shifts/new" component={UserIsAuthenticated(ShiftCreate)} />
        <Route path="shifts/:shift_id" component={UserIsAuthenticated(ShiftShow)} />

        <Route path="city_hall" component={UserIsAuthenticated(CityHallList)} />
        <Route path="city_hall/edit" component={UserIsAuthenticated(CityHallEdit)} />
        <Route path="city_hall/new" component={UserIsAuthenticated(CityHallCreate)} />

        <Route path="*" component={NotFound} status={404} />
      </Route>
    </Router>
  );
  return store.dispatch(configure([ { default: { apiUrl } } ],
    { cookies, isServer, currentLocation})).then(({ redirectPath, blank } = {}) => {
    if (userAgent) {
      global.navigator = { userAgent };
    }
    return ({
      blank,
      store,
      redirectPath,
      routes,
      history,
      provider: (
        <Provider store={store} key="provider" children={routes} />
      )
    });
  });
}
