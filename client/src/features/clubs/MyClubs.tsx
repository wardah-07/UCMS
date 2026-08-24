import { useGetMyClubs } from "./queries";
import ClubList from "./ClubList";

const MyClubs = () => {
  const { data: clubs, isError, error, isLoading } = useGetMyClubs();

  return (
    <ClubList
      clubs={clubs}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyMessage="You don't manage any clubs yet."
    />
  );
};

export default MyClubs;
