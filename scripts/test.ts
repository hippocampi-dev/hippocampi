import { addDoctorCredentialLinksOnboarding } from "~/app/_actions/onboarding/actions";
import { createTestCredentials } from "~/app/_actions/onboarding/test-data";

const id = 'test-account-id';
const credentials = createTestCredentials();
await addDoctorCredentialLinksOnboarding(id, credentials);