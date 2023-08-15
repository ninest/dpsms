import { HostForm } from "@/app/(main)/new-host/host-form";
import { Title } from "@/components/typography/title";

export default async function NewHostPage() {
  return (
    <>
      <Title level={1}>New host listing</Title>
      <HostForm />
    </>
  );
}
