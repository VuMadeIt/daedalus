type Props = {};

const SignInHeader = ({}: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-3xl text-textPrimary md:text-4xl">
        Welcome back
      </h1>
      <p className="text-sm text-textMuted md:text-base">
        Sign in to continue to Hack Canada.
      </p>
    </div>
  );
};

export default SignInHeader;
