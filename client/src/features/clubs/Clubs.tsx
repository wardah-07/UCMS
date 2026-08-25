import { useGetClubs } from "./queries";
import ClubList from "./ClubList";

const Clubs = () => {
  const { data: clubs, isError, error, isLoading } = useGetClubs();

  return (
    <ClubList
      clubs={clubs}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyMessage="No clubs yet."
    />
  );
};

export default Clubs;
