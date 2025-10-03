//Entidades de la API

//Esta entidad antes se denominaba Base
interface Entity {
  id: string;
  createdAt: string;
  deletedAt: string | null;
}

export class CustomError {
  error: boolean;
  message: string;
  codigo?: number;

  constructor(error: boolean, message: string, codigo?: number) {
    this.error = error;
    this.message = message;
    this.codigo = codigo;
  }
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface Address extends Entity {
  street: string;
  num: number;
  floor: number;
  zipCode: number;
  observation: string;
  isPublic: boolean;
  latitude: number;
  longitude: number;
  locality: Locality;
}

export interface Locality extends Entity {
  name: string;
  department: Department;
}

export interface Department extends Entity {
  name: string;
  province: Province;
}

export interface Country extends Entity {
  name: string;
}

export interface Province extends Entity {
  name: string;
  country: Country;
}

export interface User extends Entity {
  name: string | null;
  lastName: string | null;
  documentType: DocumentTypes | string | null;
  dni: string | null;
  gender: Gender | string | null;
  birth: string | null;
  phone?: string | null;
  role: Role | null;
  username?: string | null;
  email: string | null;
  password: string | null;
  googleBool: boolean | null;
  urlImg: string | null;
  addresses: Address[] | null;
  socialWorkEnrollment?: Partial<SocialWorkEnrollment> | null;
  passwordChangedAt: Date;
}

//Esta entidad antes se denominaba MemberSocialWork
export interface SocialWorkEnrollment extends Entity {
  memberNum?: string | null;
  plan?: string;
  socialWork?: Partial<SocialWork>;
}

export interface SocialWork extends Entity {
  name?: string | null;
  phone?: string | null;
  website?: string | null;
}

//Esta entidad antes se denomiba Specialist
export interface Practitioner extends User {
  license: string | null;
  rating: number;
  homeService: boolean | null;
  professionalDegree: ProfessionalDegree;
  practitionerRole: PractitionerRole[];
  acceptedSocialWorks: boolean | null;
  practitionerAppointments: PractitionerAppointment[];
  favorite: PatientPractitionerFavorite[];
  location: Location;
  practitionerSocialWorks: PractitionerSocialWork[];
  appointmentSlots?: AppointmenSlot[];
}

export type PractitionerCreate = Omit<
  Practitioner,
  "id" | "createdAt" | "deletedAt" | "practitionerRole"
> & {
  practitionerRole: Pick<PractitionerRole, "id">[];
};

export interface PractitionerSocialWork extends Entity {
  practitionerId: string;
  socialWorkId: string;
  price: number;
  practitioner: Practitioner;
  socialWork: SocialWork;
}

//Esta entidad anteriormente se denominaba Favorite
export interface PatientPractitionerFavorite extends Entity {
  enabled: boolean;
  patient: Patient;
  practitioner: Practitioner;
}

export interface PractitionerSocialWork extends Entity {
  practitionerId: string;
  socialWorkId: string;
  price: number;
  socialWork: SocialWork;
}

export interface Secretary extends Entity {
  email: string;
  name: string;
  lastName: string;
  role: string;
  urlImg: string;
  dni: string;
  phone: string;
}

export interface CreateSecretary {
  email: string;
  name: string;
  lastName: string;
  password: string;
  googleBool: boolean;
  gender: string;
  birth: string;
  urlImg: string;
  documentType: DocumentTypes;
  dni:string;
  phone:string;
}

export interface GetSecretary {
  secretaries:Secretary[];
  total:number;
  page:number;
  limit:number;
}


export interface Appointment extends Entity {
  date: string;
  hour: string;
  observation?: string | null;
  status: TurnStatus;
  practitionerId: string;
  practitioner: Practitioner;
  patientAppointment?: Partial<PatientAppointment> | null;
  patient: Partial<Patient>;
  patientId?: string;
  typeAppointment:TypeAppointment;
  scheduleId: string;
  slotId: string;
  socialWork: SocialWork
}

export interface TypeAppointment {
  name: string,
  color: string //Colores en hexadecimal
}



export type AppointmentCreate = Omit<
  Appointment,
  "id" | "createdAt" | "deletedAt" | "practitioners"
> & {
  practitionerIds: Pick<Practitioner, "id">[];
};

// Esta entidad anteriormente se denominaba AttentionHourPatient
export interface PatientAppointment extends Entity {
  openingHour: string | null;
  closeHour: string | null;
  day: Day;
  appointment: Appointment;
}

export interface Patient extends User {
  relatedPerson: RelatedPerson | null;
  email_tutor: string | null;
  phone_tutor: string | null;
  favorites: PatientPractitionerFavorite[];
  appointments: Appointment[];
  headPatientId?: string;
  familyMembers?: Patient[];
  familyGroup?:{
    id:string;
    familyGroupName:string;
    isActive:string;
  }
}

export interface RelatedPerson extends Entity {
  relation: string;
}

export interface PractitionerRole extends Entity {
  name: string;
  canPrescribe: boolean | null;
  categories: Category[];
}

//Esta entidad antes se denominaba Tag
export interface Category extends Entity {
  name: string | null;
}

export interface ProfessionalDegree extends Entity {
  formacion: string;
  profession: {
    id: string;
    createdAt: string;
    name: string;
  };
  professionGeneral: {
    id: string;
    createdAt: string;
    name: string;
  };
  canPrescribe: boolean;
}

//Esta entidad antes de denominaba SpecialistAttentionHour
export interface PractitionerAppointment extends Entity {
  openingHour: string;
  closeHour: string;
  day: Day;
  durationAppointment: number;
  locationId: string;
  turnId: string | null;
  unavailable?: boolean;
}

//Entidades GET
export interface AddressGet {
  data: Address[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface PractitionerSocialWorkGet {
  data: PractitionerSocialWork[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface CountryGet {
  data: Country[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface ProfessionalDegreeGet {
  data: ProfessionalDegree[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface ProvinceGet {
  data: Province[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface RelatedPersonGet {
  data: RelatedPerson[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface SocialWorkGet {
  socialWorks: SocialWork[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface PractitionerGet {
  data: Practitioner[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    previousPage: number | null;
  }
}
export interface PractitionerRoleGet {
  data: PractitionerRole[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface DepartmentGet {
  data: Department[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface CategoryGet {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface LocationGet {
  data: Location[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface LocalityGet {
  data: Locality[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface DepartmentGet {
  data: Department[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface LocationGet {
  data: Location[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface NotificationGet {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}
export interface PatientGet {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
}
export interface PatientPractitionerFavoriteGet {
  data: PatientPractitionerFavorite[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface AppointmentGet {
  turns: Appointment[];
  total: number;
  page: number;
  limit: number;
  previousPage: number | null;
}

export interface AppointmentStats {
  completedStats: Stat;
  canceledStats: Stat;
  rescheduledStats: Stat;
  period: Period;
}

interface Stat {
  count: number;
  percentage: number;
}

interface Period {
  start: string;
  end: string;
}
export interface SocialWorkStats {
  socialWorkStats: SocialWorkStat[];
  period: {
    start: string;
    end: string;
  }
}

export interface SocialWorkStat {
  name: string;
  count: number;
}

export interface TopPatientStat {
  name: string;
  lastName: string;
  count: number;
}

export interface AppointmentCompleted {
  total: number;
  period: Period;
  appointments: Appointment[]
}

export interface AppointentTypeStats {
  typeStats: TypeStat[];
  period: Period
}

export interface TypeStat {
  name: string;
  count: number;
  color: string;
}

export interface TokenWithId {
  id: string,
  token: string
}

export interface TokenWithEntity {
  entity: any,
  token: string
}

interface Slot {
  time: string;
  slotId: string;
  scheduleId: string;
};

interface Dayy {
  date: string;
  available: Slot[];
  booked: string[];
};



export interface ScheduleDays { 
  days: Dayy[];
};

export interface AppointmentSlotFiltered{
  data: AppointmenSlot[];
}

interface AppointmenSlot{
  id: string;
  deletedAt: string | null;
  createdAt: string; // Tipo string para la fecha ISO
  schedules: ScheduleAS[];
  day: string;
  unavailable: boolean;
  practitioner?: PractitionerAS;
}

interface ScheduleAS{
  id: string;
  createdAt: string; // Tipo string para la fecha ISO
  openingHour: string;
  closeHour: string;
}

interface PractitionerAS{
  id: string;
  name: string;
  lastName: string;
  license: string;
  durationAppointment: number;
}

export interface HorariosId{
  scheduleId: string;
  slotId: string;
}

//ENUMS
export enum TurnStatus {
  pending = "pending",
  under_review = "under_review",
  approved = "approved",
  cancelled = "cancelled",
  no_show = "no_show",
  absent = "absent",
  completed = "completed",
}

export enum Role {
  admin = "admin",
  patient = "patient",
  practitioner = "practicioner",
  organization = "organization",
  secretary = "secretary",
  practitioner_secretary = "practitioner_secretary",
}

export enum Media {
  email = "email",
  whatsapp = "whatsapp",
}

export enum DocumentTypes {
  passport = "passport",
  dni = "dni",
}

export enum Day {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
  rather_not_say = "rather_not_say",
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
  appointmentSlotId?: string;
  scheduleId?: string;
}

export interface AppointmentSlot {
  id: string;
  createdAt: string;
  schedules: {
    id: string;
    createdAt: string;
    openingHour: string;
    closeHour: string;
  }[];
  day: string;
  unavailable?: boolean;
}




export interface Schedule {
  id: string;
  createdAt: string;
  openingHour: string;
  closeHour: string;
}

export interface Turno {
  scheduleId: string;
  slotId: string;
  horario: string;
}

export interface AvailableItem {
  time: string;
  scheduleId: string;
  slotId: string;
}

export interface ScheduleBasic {
  openingHour: string;
  closeHour: string;
}

export interface AppointmentSlotBasic {
  day: string;
  schedules: ScheduleBasic[];
}

export interface PatientRegistrationStatus {
  status: "NOT_REGISTERED" | "REGISTERED_NO_PASSWORD" | "HAS_PASSWORD" | "COMPLETE";
  hasPassword: boolean;
  isActivated: boolean;
  isComplete: boolean;
  patientId: string;
  email: string;
  patient: Patient;
}

export interface PatientCredentialsUpdate {
  documentType: DocumentTypes;
  dni: string;
  email?: string;
  password?: string;
  sendVerificationEmail?: boolean;
}


