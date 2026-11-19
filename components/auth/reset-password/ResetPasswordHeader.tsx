type Props = {};

const ResetPasswordHeader = ({}: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-4xl text-textPrimary md:text-5xl">
        Reset Password
      </h1>
      <p className="text-textMuted text-sm md:text-base">
        Please enter your new password.
      </p>
    </div>
  );
};

export default ResetPasswordHeader;
