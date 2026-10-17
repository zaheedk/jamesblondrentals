export const PASSWORD_RECOVERY_DESTINATION = '/member-dashboard?tab=profile';

// Keep the recovery session: updating the password does not require another sign-in.
export async function completePasswordRecovery(
  password: string,
  updatePassword: (password: string) => Promise<{ error: { message: string } | null }>,
  verifyUser: () => Promise<boolean>,
  openAccount: (destination: string) => void,
) {
  const { error } = await updatePassword(password);
  if (error) throw new Error(error.message);
  if (!await verifyUser()) {
    throw new Error('Your password was saved, but your session could not be verified. Please sign in to continue.');
  }
  openAccount(PASSWORD_RECOVERY_DESTINATION);
}