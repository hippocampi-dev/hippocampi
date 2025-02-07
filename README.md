# HippoCampi Documentation

## API Documentation

### Overview
This API provides endpoints for managing resources through RESTful HTTP methods. All database types are defined in /src/server/db/type.ts.

### Endpoints

#### GET Routes
These endpoints retrieve existing data from the system.

| Endpoint | Description | Response Type |
| --- | --- | --- |
| `/api/db/patient/get` | Retrieve patient profile information | PatientsInterface |
| `/api/db/patient/health-info/get` | Retrieve all health information | PatientHealthInformationInterface |
| `/api/db/patient/health-info/allergies/get` | Retrieve patient allergies | PatientAllergiesInterface[] |
| `/api/db/patient/health-info/cognitive-symptoms/get` | Retrieve patient cognitive symptoms | PatientCognitiveSymptomsInterface[] |
| `/api/db/patient/health-info/diagnoses/get` | Retrieve patient diagnoses | PatientDiagnosesInterface[] |
| `/api/db/patient/health-info/emergency-contacts/get` | Retrieve patient emergency contacts | PatientEmergencyContactsInterface[] |
| `/api/db/patient/health-info/medications/get` | Retrieve patient medications | PatientMedicationsInterface[] |
| `/api/db/doctor/get` | Retrieve doctor profile information | DoctorsInterface |
| `/api/db/doctor/credentials/get` | Retrieve doctor credentials | DoctorCredentialsInterface |
| `/api/db/management/user-role/get` | Retrieve user role (patient or doctor) | UserRolesInterface |
| `/api/db/management/user-role/has` | Check if user had role | Boolean |
| `/api/db/management/patient-doctor-management/get` | Retrieve patient-doctor pair | PatientDoctorManagementInterface[] |
| `/api/db/management/scheduled-meetings/get` | Retrieve scheduled meetings | ScheduledMeetingsInterface[] |

#### POST Routes
These endpoints create new entries in the system.

| Endpoint | Description | Request Body | Response Type |
| --- | --- | --- | --- |
| `/api/db/patient/add` | Add new patient profile information | PatientsInterface | PatientsInterface |
| `/api/db/patient/set` | Update patient profile information | UserIdInterface, PatientsInterface | PatientsInterface |
| `/api/db/patient/health-info/allergies/add` | Add new patient allergies | PatientAllergiesInterface | PatientAllergiesInterface |
| `/api/db/patient/health-info/allergies/set` | Update patient allergies | UserIdInterface, PatientAllergiesInterface | PatientAllergiesInterface |
| `/api/db/patient/health-info/cognitive-symptoms/get` | Retrieve patient cognitive symptoms | PatientCognitiveSymptomsInterface[] |
| `/api/db/patient/health-info/diagnoses/get` | Retrieve patient diagnoses | PatientDiagnosesInterface[] |
| `/api/db/patient/health-info/emergency-contacts/get` | Retrieve patient emergency contacts | PatientEmergencyContactsInterface[] |
| `/api/db/patient/health-info/medications/get` | Retrieve patient medications | PatientMedicationsInterface[] |

### Database Types
All database-related types are located in 
:

```typescript
// Example types structure
interface Resource {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ResourceInput {
  name: string;
  // Other required fields for creation
}

interface ResourceUpdate {
  name?: string;
  // Optional fields for updates
}
```

### Usage Examples

#### Getting Resources
```bash
GET /api/resources
```

Response:
```json
[
  {
    "id": "123",
    "name": "Example Resource",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Creating Resources
```bash
POST /api/resources
Content-Type: application/json

{
  "name": "New Resource"
}
```

Response:
```json
{
  "id": "456",
  "name": "New Resource",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Error Handling
The API returns standard HTTP status codes:

* 200 OK - Successful request
* 400 Bad Request - Invalid request format
* 404 Not Found - Resource not found
* 500 Internal Server Error - Server error

Error responses include detailed information:
```json
{
  "status": 400,
  "message": "Validation failed",
  "details": ["Name is required"]
}
```