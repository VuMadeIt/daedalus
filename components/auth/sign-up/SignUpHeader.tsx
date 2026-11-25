type Props = {};

const SignUpHeader = ({}: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-[32px] leading-10 font-medium tracking-[-0.01em] text-textPrimary">
        Create your account
      </h1>
      <p className="text-textMuted text-sm md:text-base">
        Then apply to Hack Canada.
      </p>
    </div>
  );
};
export default SignUpHeader;
