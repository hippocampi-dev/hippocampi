# HippoCampi

## API Documentation

### Overview
This API provides endpoints for managing resources through RESTful HTTP methods. All database types are defined in /src/server/db/type.ts.

### Endpoints

#### GET Routes
These endpoints retrieve existing data from the system.

| Endpoint | Description | Response Type |
| --- | --- | --- |
| `/api/db/patient/get` | Retrieve patient profile | PatientsInterface |
| `/api/db/patient/health-info/get` | Retrieve all health information | PatientHealthInformationInterface |
| `/api/db/patient/health-info/allergies/get` | Retrieve patient allergies | PatientAllergiesInterface[] |
| `/api/db/patient/health-info/cognitive-symptoms/get` | Retrieve patient cognitive symptoms | PatientCognitiveSymptomsInterface[] |
| `/api/db/patient/health-info/diagnoses/get` | Retrieve patient diagnoses | PatientDiagnosesInterface[] |
| `/api/db/patient/health-info/emergency-contacts/get` | Retrieve patient emergency contacts | PatientEmergencyContactsInterface[] |
| `/api/db/patient/health-info/medications/get` | Retrieve patient medications | PatientMedicationsInterface[] |
| `/api/db/patient/health-info/treatments/get` | Retrieve patient treatments | PatientTreatmentsInterface[] |
| `/api/db/doctor/get` | Retrieve doctor profile information | DoctorsInterface |
| `/api/db/doctor/credentials/get` | Retrieve doctor credentials | DoctorCredentialsInterface |
| `/api/db/management/user-role/get` | Retrieve user role (patient or doctor) | UserRolesInterface |
| `/api/db/management/user-role/has` | Check if user has role | Boolean |
| `/api/db/management/patient-doctor-management/get` | Retrieve patient-doctor pair | PatientDoctorManagementInterface[] |
| `/api/db/management/scheduled-meetings/get` | Retrieve scheduled meetings | ScheduledMeetingsInterface[] |

#### POST Routes
These endpoints create new or update existing entries in the system.

| Endpoint | Description | Request Body | Response Type |
| --- | --- | --- | --- |
| `/api/db/patient/add` | Add new patient | PatientsInterface | PatientsInterface |
| `/api/db/patient/set` | Update patient | PatientsInterface | PatientsInterface |
| `/api/db/patient/health-info/allergies/add` | Add new patient allergies | PatientAllergiesInterface | PatientAllergiesInterface |
| `/api/db/patient/health-info/allergies/set` | Update patient allergies | PatientAllergiesInterface | PatientAllergiesInterface |
| `/api/db/patient/health-info/cognitive-symptoms/add` | Add new patient cognitive symptom | PatientCognitiveSymptomsInterface | PatientCognitiveSymptomsInterface |
| `/api/db/patient/health-info/cognitive-symptoms/set` | Update patient cognitive symptom | PatientCognitiveSymptomsInterface | PatientCognitiveSymptomsInterface |
| `/api/db/patient/health-info/diagnoses/add` | Add new patient diagnosis | PatientDiagnosesInterface | PatientDiagnosesInterface |
| `/api/db/patient/health-info/diagnoses/set` | Update patient cognitive symptoms | PatientDiagnosesInterface | PatientDiagnosesInterface |PatientCognitiveSymptomsInterface | PatientCognitiveSymptomsInterface |
| `/api/db/patient/health-info/emergency-contacts/add` | Add new patient emergency contact | PatientEmergencyContactsInterface | PatientEmergencyContactsInterface |
| `/api/db/patient/health-info/emergency-contacts/set` | Update patient emergency contact | PatientEmergencyContactsInterface | PatientEmergencyContactsInterface |
| `/api/db/patient/health-info/medications/add` | Add new patient medication | PatientMedicationsInterface | PatientMedicationsInterface |
| `/api/db/patient/health-info/medications/set` | Update patient medication | PatientMedicationsInterface | PatientMedicationsInterface |
| `/api/db/patient/health-info/treatments/add` | Add new patient treatment | PatientTreatmentsInterface | PatientTreatmentsInterface |
| `/api/db/patient/health-info/treatments/set` | Update patient treatment | PatientTreatmentsInterface | PatientTreatmentsInterface |serIdInterface, PatientMedicationsInterface | PatientMedicationsInterface |
| `/api/db/patient/health-info/caregivers/add` | Add new patient caregiver | PatientCaregiversInterface | PatientCaregiversInterface |
| `/api/db/patient/health-info/caregivers/set` | Update patient caregiver | PatientCaregiversInterface | PatientCaregiversInterface |
| `/api/db/doctor/add` | Add new doctor profile | DoctorsInterface | DoctorsInterface |
| `/api/db/doctor/set` | Update doctor profile | DoctorsInterface | DoctorsInterface |
| `/api/db/doctor/credentials/add` | Add new doctor credential | DoctorCredentialsInterface | DoctorCredentialsInterface |
| `/api/db/doctor/credentials/set` | Update doctor credential | DoctorCredentialsInterface | DoctorCredentialsInterface |
| `/api/db/management/user-role/add` | Add user role | UserRolesInterface | UserRolesInterface |
| `/api/db/management/scheduled-meetings/add` | Add scheduled meeting | ScheduledMeetingsInterface | ScheduledMeetingsInterface |
| `/api/db/management/scheduled-meetings/cancel` | Cancel scheduled meeting | ScheduledMeetingsIdInterface | ScheduledMeetingsInterface |
| `/api/db/management/patient-doctor-management/add` | Add patient-doctor pair | PatientDoctorManagementInterface | PatientDoctorManagementInterface |

### Database Types
All database-related types are located in in src/server/db/type.ts

```typescript
// Example types structure
type PatientsInterface = {
  email: string;
  patientId: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: "male" | "female" | "non_binary" | "other" | "prefer_not_to_say";
  primary_language: string;
  ... 7 more ...;
  middle_initial?: string | ... 1 more ... | undefined;
}
```

### Usage Examples

#### Getting Patient Information
```bash
GET /api/patient/get
```

Response:
```json
[
  {
    "patientId": "(very long string of numbers and letter)",
    "first_name": "Jane",
    "last_name": "Doe",
    "middle_initial": "J",
    "date_of_birth": "01-01-2000",
    "gender": "female",
    "primary_language": "English",
    "phone_number": "1234567890",
    "email": "janedoe123@gmail.com",
    "street_address": "1234 Main Street",
    "city": "Los Angeles",
    "state": "California",
    "zip_code": "12345",
  }
]
```