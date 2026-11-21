type Props = {
  heading: string;
  description: string;
  status: ApplicationStatus | "coming_soon";
};

const ApplicationStatusHeader = ({ heading, status, description }: Props) => {
  return (
    <div
      className="mt-4 mb-6 w-fit text-textPrimary"
    >
      <h1 className="pb-2 text-2xl font-semibold md:text-3xl">{heading}</h1>
      <p className="text-textMuted max-md:text-sm">{description}</p>
    </div>
  );
};

export default ApplicationStatusHeader;
