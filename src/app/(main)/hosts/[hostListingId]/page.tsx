import { Title } from "@/components/typography/title";
import { hostsService } from "@/services/hosts-service";

interface Props {
  params: {
    hostListingId: string;
  };
}

export default async function HostListingPage({ params }: Props) {
  const hostListings = await hostsService.getHostListing(params.hostListingId);

  return (
    <>
      <Title level={1}>{hostListings.host.user[0].address}</Title>
    </>
  );
}
