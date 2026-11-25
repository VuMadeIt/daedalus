type Props = {};

const SignInHeader = ({}: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-[32px] leading-10 font-medium tracking-[-0.01em] text-textPrimary">
        Welcome back
      </h1>
      <p className="text-sm text-textMuted md:text-base">
        Sign in to continue to Hack Canada.
      </p>
    </div>
  );
};

export default SignInHeader;
