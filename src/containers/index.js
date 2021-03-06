/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

export App from './application/App';
export Home from './application/Home';
export NotFound from './application/NotFound';
export CitizenSchedule from './citizen/CitizenSchedule';
export CitizenEdit from './citizen/CitizenEdit';
export Login from './account/Login';
export Register from './account/Register';
export RegisterCep from './account/RegisterCep';
export ChooseRole from './application/ChooseRole';
export PasswordRetrieval from './account/PasswordRetrieval';
export PasswordChange from './account/PasswordChange';
export InvalidToken from './account/InvalidToken';
export Manual from './agendador/Manual'
export ScheduleAgreement from './schedule/ScheduleAgreement';
export ScheduleChoose from './schedule/ScheduleChoose';
export ScheduleCitizen from './schedule/ScheduleCitizen';
export ScheduleFinish from './schedule/ScheduleFinish';

export DependantList from './dependant/DependantList';
export DependantEdit from './dependant/DependantEdit';
export DependantShow from './dependant/DependantShow';
export DependantCreate from './dependant/DependantCreate';

export SectorList from './sector/SectorList';
export SectorEdit from './sector/SectorEdit';
export SectorShow from './sector/SectorShow';
export SectorCreate from './sector/SectorCreate';

export OccupationList from './occupation/OccupationList';
export OccupationEdit from './occupation/OccupationEdit';
export OccupationCreate from './occupation/OccupationCreate';
export OccupationShow from './occupation/OccupationShow';

export ServicePlaceList from './service_place/ServicePlaceList';
export ServicePlaceEdit from './service_place/ServicePlaceEdit';
export ServicePlaceShow from './service_place/ServicePlaceShow';
export ServicePlaceCreate from './service_place/ServicePlaceCreate';

export ServiceTypeList from './service_type/ServiceTypeList';
export ServiceTypeEdit from './service_type/ServiceTypeEdit';
export ServiceTypeShow from './service_type/ServiceTypeShow';
export ServiceTypeCreate from './service_type/ServiceTypeCreate';

export MyReport from './reports/myReport'
export Reports from './reports/Reports'
export citizenReport from './reports/reportTypes/citizenReport'
export schedulesReport from './reports/reportTypes/schedulesReport'
export shiftsReport from './reports/reportTypes/shiftsReport'
export professionalsReport from './reports/reportTypes/professionalsReport'
export servicesReport from './reports/reportTypes/servicesReport'
export shiftTypeReport from './reports/reportTypes/shiftTypeReport'

export ResourceTypeList from './resource_type/ResourceTypeList';
export ResourceTypeShow from './resource_type/ResourceTypeShow';
export ResourceTypeCreate from './resource_type/ResourceTypeCreate'
export ResourceTypeEdit from './resource_type/ResourceTypeEdit'

export ResourceList from './resource/ResourceList';
export ResourceShow from './resource/ResourceShow';
export ResourceEdit from './resource/ResourceEdit';
export ResourceCreate from './resource/ResourceCreate';

export ResourceShiftList from './resource_shift/ResourceShiftList';
export ResourceShiftShow from './resource_shift/ResourceShiftShow';
export ResourceShiftEdit from './resource_shift/ResourceShiftEdit';
export ResourceShiftCreate from './resource_shift/ResourceShiftCreate';

export ResourceBookingList from './resource_booking/ResourceBookingList';
export ResourceBookingShow from './resource_booking/ResourceBookingShow';
export ResourceBookingEdit from './resource_booking/ResourceBookingEdit';
export ResourceBookingCreate from './resource_booking/ResourceBookingCreate';
export ProfessionalIndex from './professional/ProfessionalIndex';
export ProfessionalList from './professional/ProfessionalList';
export ProfessionalEdit from './professional/ProfessionalEdit';
export ProfessionalShow from './professional/ProfessionalShow';
export ProfessionalCreate from './professional/ProfessionalCreate';

export ProfessionalSearch from './professional/ProfessionalSearch';
export ProfessionalSchedule from './professional/ProfessionalSchedule';

export ProfessionalUserList from './professional/user/ProfessionalUserList';
export ProfessionalUserEdit from './professional/user/ProfessionalUserEdit';
export ProfessionalUserShow from './professional/user/ProfessionalUserShow';
export ProfessionalUserCreate from './professional/user/ProfessionalUserCreate';
export ProfessionalUserUpload from './professional/user/ProfessionalUserUpload';
export ProfessionalUploadinstruction from './professional/user/ProfessionalUploadInstruction';

export ProfessionalUserDependantEdit from './professional/user/ProfessionalUserDependantEdit';
export ProfessionalUserDependantShow from './professional/user/ProfessionalUserDependantShow';
export ProfessionalUserDependantCreate from './professional/user/ProfessionalUserDependantCreate';

export ShiftList from './shift/ShiftList';
export ShiftEdit from './shift/ShiftEdit';
export ShiftShow from './shift/ShiftShow';
export ShiftCreate from './shift/ShiftCreate';

export ServiceList from './schedule/service/ServiceList';
export ServiceEdit from './schedule/service/ServiceEdit';

export CityHallList from './city_hall/CityHallList';
export CityHallEdit from './city_hall/CityHallEdit';
export CityHallCreate from './city_hall/CityHallCreate';

export CitizenEditPassword from './account/CitizenEditPassword';
