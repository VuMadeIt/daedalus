type Props = {};

const SignUpHeader = ({}: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-3xl text-textPrimary md:text-4xl">
        Create your account
      </h1>
      <p className="text-textMuted text-sm md:text-base">
        Then apply to Hack Canada.
      </p>
    </div>
  );
};
export default SignUpHeader;
