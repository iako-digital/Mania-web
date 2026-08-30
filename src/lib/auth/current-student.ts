import { auth } from "@/auth";
import { DEMO_STUDENT_EMAIL, DEMO_STUDENT_ID, DEMO_STUDENT_NAME } from "@/lib/courses/demo-student";

export interface CurrentStudent {
  id: string;
  name: string;
  email: string;
}

// Returns the signed-in student when a real Auth.js session exists,
// otherwise falls back to the hard-coded demo student — same
// graceful-degrade pattern as this app's other optional integrations, so
// everything keeps working exactly as before Google credentials exist.
//
// Uses the session email as the student id (matches this app's loose
// string-id model everywhere else). This means a student who changes their
// Google account email loses continuity with prior enrollments/orders —
// acceptable for now, a real migration concern once a database's stable
// User.id (see prisma/schema.prisma) becomes the source of truth.
export async function getCurrentStudent(): Promise<CurrentStudent> {
  const session = await auth();
  const email = session?.user?.email;
  if (email) {
    return {
      id: email,
      name: session.user?.name || email,
      email,
    };
  }
  return { id: DEMO_STUDENT_ID, name: DEMO_STUDENT_NAME, email: DEMO_STUDENT_EMAIL };
}
