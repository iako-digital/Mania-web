// The learning interface and progress API act on behalf of this single
// hard-coded student until real student accounts/auth exist. Swap this for
// the authenticated student's id once that lands — every call site already
// takes the id as a parameter, so nothing else needs to change.
export const DEMO_STUDENT_ID = "demo-student";
export const DEMO_STUDENT_NAME = "დემო მოსწავლე";
export const DEMO_STUDENT_EMAIL = "demo.student@example.com";
